// Runs in GitHub Actions (Node 20+). Writes data/github.js, which the page loads as a plain <script>.
// Nothing here ever reaches the browser except the sanitized fields below.
import { readFile, writeFile, appendFile } from "node:fs/promises";

const root = new URL("..", import.meta.url);
const cfg = JSON.parse(await readFile(new URL("content/repo-config.json", root), "utf8"));
const PAT = process.env.GH_PAT || "";
const FALLBACK = process.env.GITHUB_TOKEN || "";
const token = PAT || FALLBACK;

const headers = {
  Accept: "application/vnd.github+json",
  "X-GitHub-Api-Version": "2022-11-28",
  "User-Agent": "alex-portfolio-build"
};
if (token) headers.Authorization = `Bearer ${token}`;

async function gh(url, init = {}) {
  const res = await fetch(url, { ...init, headers: { ...headers, ...(init.headers || {}) } });
  if (!res.ok) throw new Error(`${res.status} ${res.statusText} on ${url}\n${await res.text()}`);
  return res.json();
}

async function listRepos() {
  // Important: /users/{name}/repos only ever returns PUBLIC repos, even with a token.
  // Private repos come from /user/repos, which lists what the PAT's owner can see.
  const base = PAT
    ? "https://api.github.com/user/repos?affiliation=owner&visibility=all"
    : `https://api.github.com/users/${cfg.username}/repos?type=owner`;
  const all = [];
  for (let page = 1; ; page++) {
    const batch = await gh(`${base}&per_page=100&sort=updated&page=${page}`);
    all.push(...batch);
    if (batch.length < 100) break;
  }
  return all.filter((r) => r.owner?.login?.toLowerCase() === cfg.username.toLowerCase());
}

function sanitize(r) {
  const o = cfg.overrides?.[r.name] || {};
  const isPrivate = !!r.private;
  // Whitelist of fields. No clone URLs, no homepage for private repos, no topics, no contents.
  return {
    name: r.name,
    title: o.title || r.name,
    description: o.description ?? r.description ?? "",
    language: o.language ?? r.language ?? null,
    stars: isPrivate ? 0 : r.stargazers_count,
    updated_at: r.pushed_at || r.updated_at,
    private: isPrivate,
    url: isPrivate ? null : r.html_url,
    homepage: isPrivate ? null : r.homepage || null
  };
}

async function contributions() {
  if (!token) return null;
  const query = `query($login:String!){ user(login:$login){ contributionsCollection{ contributionCalendar{
    totalContributions weeks{ contributionDays{ date contributionCount contributionLevel } } } } } }`;
  const levels = { NONE: 0, FIRST_QUARTILE: 1, SECOND_QUARTILE: 2, THIRD_QUARTILE: 3, FOURTH_QUARTILE: 4 };
  try {
    const res = await gh("https://api.github.com/graphql", {
      method: "POST",
      body: JSON.stringify({ query, variables: { login: cfg.username } })
    });
    if (res.errors) throw new Error(JSON.stringify(res.errors));
    const cal = res.data.user.contributionsCollection.contributionCalendar;
    return {
      total: cal.totalContributions,
      weeks: cal.weeks.map((w) => w.contributionDays.map((d) => [d.date, d.contributionCount, levels[d.contributionLevel] ?? 0]))
    };
  } catch (e) {
    console.warn("Contributions unavailable, heatmap will be hidden:\n" + e.message);
    return null;
  }
}

const raw = await listRepos();
const allow = new Set(cfg.private_allowlist || []);
const hide = new Set(cfg.hide || []);
const forks = new Set(cfg.include_forks || []);

const repos = raw
  .filter((r) => !hide.has(r.name))
  .filter((r) => !r.fork || forks.has(r.name))
  .filter((r) => !r.private || allow.has(r.name))
  .map(sanitize)
  .sort((a, b) => b.updated_at.localeCompare(a.updated_at));

const missing = [...allow].filter((n) => !raw.some((r) => r.name === n));
if (missing.length) console.warn(`Allowlisted but not found (check the PAT's repo access): ${missing.join(", ")}`);

const data = {
  generated_at: new Date().toISOString(),
  username: cfg.username,
  min_contributions: cfg.contributions_min_to_show ?? 0,
  repos,
  contributions: await contributions()
};

await writeFile(new URL("data/github.js", root), `window.GITHUB_DATA = ${JSON.stringify(data, null, 2)};\n`);

// Review table in the Actions run summary: exactly what went public.
const rows = repos.map((r) => `| ${r.private ? "🔒 private" : "public"} | ${r.title} | ${r.description.replace(/\|/g, "/")} |`);
const summary = [
  `### Published ${repos.length} repos (${repos.filter((r) => r.private).length} private)`,
  "| Visibility | Title | Description |", "|---|---|---|", ...rows,
  "",
  `Contributions: ${data.contributions ? data.contributions.total : "unavailable"} (section shows at ${data.min_contributions}+)`
].join("\n");
console.log(summary);
if (process.env.GITHUB_STEP_SUMMARY) await appendFile(process.env.GITHUB_STEP_SUMMARY, summary + "\n");

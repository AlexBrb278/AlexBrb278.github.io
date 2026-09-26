(() => {
  const P = window.PROFILE;
  const G = window.GITHUB_DATA || { repos: [], contributions: null, min_contributions: 0 };
  const $ = (id) => document.getElementById(id);
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

  const ICONS = {
    linkedin: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9.75h4v11H3v-11zm6.5 0h3.8v1.5h.06c.53-1 1.83-2.06 3.77-2.06 4.03 0 4.77 2.6 4.77 6v5.56h-4v-4.93c0-1.18-.02-2.7-1.64-2.7-1.65 0-1.9 1.28-1.9 2.6v5.03h-4v-11z"/></svg>',
    github: '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12 .5a11.5 11.5 0 0 0-3.64 22.41c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.37-3.88-1.37-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.17 1.18a11 11 0 0 1 5.77 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.58.23 2.75.11 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.26 5.67.41.36.78 1.06.78 2.14v3.17c0 .31.21.67.8.56A11.5 11.5 0 0 0 12 .5z"/></svg>',
    mail: '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M3 5.5h18v13H3z M3.5 6l8.5 7 8.5-7"/></svg>',
    doc: '<svg viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M6 2.5h8l4 4v15H6z M14 2.5v4h4 M9 12h6 M9 16h6"/></svg>',
    lock: '<svg viewBox="0 0 24 24" width="11" height="11"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" d="M5 11h14v10H5z M8 11V7.5a4 4 0 0 1 8 0V11"/></svg>',
    ext: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" d="M9 5h10v10 M19 5L6 18"/></svg>',
    star: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M12 2.8l2.8 5.8 6.4.9-4.6 4.5 1.1 6.3L12 17.3l-5.7 3 1.1-6.3-4.6-4.5 6.4-.9z"/></svg>',
    check: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
    sun: '<svg viewBox="0 0 24 24" width="18" height="18"><g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/></g></svg>',
    moon: '<svg viewBox="0 0 24 24" width="18" height="18"><path fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>',
    play: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="currentColor" d="M7 4.5v15l12-7.5z"/></svg>',
    zoom: '<svg viewBox="0 0 24 24" width="12" height="12"><path fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" d="M14 4h6v6M10 20H4v-6M20 4l-7 7M4 20l7-7"/></svg>'
  };
  document.querySelectorAll("[data-icon]").forEach((el) => (el.innerHTML = ICONS[el.dataset.icon] || ""));

  /* Theme */
  const themeBtn = $("theme-toggle");
  const isDark = () => {
    const t = document.documentElement.dataset.theme;
    return t ? t === "dark" : !matchMedia("(prefers-color-scheme: light)").matches;
  };
  const paintThemeBtn = () => { themeBtn.innerHTML = isDark() ? ICONS.sun : ICONS.moon; themeBtn.setAttribute("aria-label", isDark() ? "Switch to light theme" : "Switch to dark theme"); };
  themeBtn.addEventListener("click", () => {
    const next = isDark() ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem("theme", next); } catch (e) {}
    paintThemeBtn();
  });
  paintThemeBtn();

  /* Hero */
  $("hero-name").textContent = P.name;
  $("hero-roles").innerHTML = P.roles.map(esc).join('<span class="sep" aria-hidden="true">•</span>');
  $("hero-intro").textContent = P.intro;
  $("hero-status").href = P.status.href;
  $("hero-status").lastElementChild.textContent = P.status.label;
  const mailto = `mailto:${P.email}`;
  ["hero-email", "foot-email"].forEach((id) => ($(id).href = mailto));
  ["nav-cv", "career-cv"].forEach((id) => { $(id).href = P.cv; $(id).target = "_blank"; $(id).rel = "noopener"; });
  const socialHTML = (withText) => P.socials.map((s) => `<li><a href="${esc(s.href)}" ${s.href.startsWith("http") ? 'target="_blank" rel="noopener"' : ""} aria-label="${esc(s.label)}">${ICONS[s.icon] || ""}${withText ? esc(s.label) : ""}</a></li>`).join("");
  $("hero-socials").innerHTML = socialHTML(true);
  $("foot-socials").innerHTML = socialHTML(false);
  $("foot-roles").innerHTML = P.roles.map(esc).join(' <span style="color:var(--faint)">•</span> ');

  /* Career board: each job or degree is an LED on a PCB */
  const nodes = P.career;
  const n = nodes.length;
  const board = $("trace-board");
  const scroller = $("trace-scroll");
  const B = PCB.render(nodes);
  board.innerHTML = `${B.svg}<div class="pcb-clip" aria-hidden="true"><div class="led-glow" id="led-glow"></div></div><div class="led-leader" id="led-leader" aria-hidden="true"></div>`;
  const pos = B.leds.map((l) => ({ x: l.x / B.W, y: l.y / B.H }));
  const glow = $("led-glow");
  const leader = $("led-leader");
  const rotors = board.querySelectorAll("[data-rotor]");
  const segs = board.querySelectorAll("[data-seg]");

  nodes.forEach((c, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "led" + (c.next ? " next" : "");
    b.style.left = pos[i].x * 100 + "%";
    b.style.top = pos[i].y * 100 + "%";
    b.setAttribute("aria-label", `${c.org}, ${c.dates}${c.next ? " (planned)" : ""}`);
    b.addEventListener("click", () => setActive(i));
    board.appendChild(b);
    const l = document.createElement("div");
    l.className = "led-label";
    l.style.left = pos[i].x * 100 + "%";
    l.style.top = pos[i].y * 100 + "%";
    l.innerHTML = `<b>${esc(c.short)}</b>${esc(c.when)}`;
    board.appendChild(l);
  });
  const leds = board.querySelectorAll(".led");
  const labels = board.querySelectorAll(".led-label");
  const card = $("trace-card");
  const lastDone = nodes.findIndex((c) => c.next);
  const doneEnd = lastDone === -1 ? n : lastDone;
  let active = Math.max(0, doneEnd - 1);

  function placeCard() {
    const w = $("trace").clientWidth;
    const scrolls = board.offsetWidth > w + 1;
    card.style.marginLeft = scrolls ? "0px" : Math.min(Math.max(pos[active].x * w - 18, 0), w - card.offsetWidth) + "px";
  }
  function setActive(i, first) {
    active = i;
    const c = nodes[i];
    card.classList.toggle("is-next", !!c.next);
    card.innerHTML = `<p class="org">${esc(c.org)}</p><p class="role">${esc(c.role)}</p><p class="when">${esc(c.dates)}, ${esc(c.place)}</p><ul>${c.notes.map((t) => `<li>${esc(t)}</li>`).join("")}</ul>`;
    leds.forEach((v, k) => { v.classList.toggle("active", k === i); v.setAttribute("aria-pressed", k === i); });
    labels.forEach((v, k) => v.classList.toggle("active", k === i));
    segs.forEach((s) => s.classList.toggle("pcb-hot", +s.dataset.seg === i));
    glow.style.left = leader.style.left = pos[i].x * 100 + "%";
    glow.style.top = pos[i].y * 100 + "%";
    leader.style.height = `calc(${pos[i].y * 100}% - 2.9cqw)`;
    rotors.forEach((r) => (r.style.transform = `rotate(${i * 90}deg)`));
    placeCard();
    const br = board.getBoundingClientRect(), sr = scroller.getBoundingClientRect();
    if (br.width > sr.width + 1) scroller.scrollTo({ left: br.left - sr.left + scroller.scrollLeft + pos[i].x * br.width - sr.width / 2, behavior: first ? "instant" : "smooth" });
  }
  board.addEventListener("keydown", (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    if (!step) return;
    const at = [...leds].indexOf(document.activeElement);
    const j = Math.min(n - 1, Math.max(0, (at === -1 ? active : at) + step));
    if (j !== at) { e.preventDefault(); setActive(j); leds[j].focus(); }
  });
  setActive(active, true);
  addEventListener("resize", placeCard);

  /* Carousel: shared by the research gallery and the project slides */
  function carousel({ root, track, prev, next, dotsEl, name }) {
    const slides = [...track.children];
    dotsEl.innerHTML = slides.map((_, i) => `<button type="button" role="tab" aria-label="${esc(name(i))}"></button>`).join("");
    const dots = [...dotsEl.children];
    let cur = 0;
    function go(i) {
      cur = (i + slides.length) % slides.length;
      track.style.transform = `translateX(${-cur * 100}%)`;
      slides.forEach((s, k) => {
        s.setAttribute("aria-hidden", k !== cur);
        s.querySelectorAll("a, button").forEach((el) => (el.tabIndex = k === cur ? 0 : -1));
      });
      dots.forEach((d, k) => d.setAttribute("aria-selected", k === cur));
    }
    prev.addEventListener("click", () => go(cur - 1));
    next.addEventListener("click", () => go(cur + 1));
    dots.forEach((d, k) => d.addEventListener("click", () => go(k)));
    root.addEventListener("keydown", (e) => { if (e.key === "ArrowLeft") go(cur - 1); if (e.key === "ArrowRight") go(cur + 1); });
    let sx = null, swiped = false;
    track.addEventListener("pointerdown", (e) => { sx = e.clientX; swiped = false; });
    track.addEventListener("pointerup", (e) => { if (sx !== null && Math.abs(e.clientX - sx) > 40) { go(cur + (e.clientX < sx ? 1 : -1)); swiped = true; } sx = null; });
    // A swipe that starts on a photo must not also open it.
    track.addEventListener("click", (e) => { if (swiped) { e.preventDefault(); e.stopPropagation(); swiped = false; } }, true);
    go(0);
  }

  /* Media: photos and clips all open in one lightbox */
  const LB = [];
  const mediaItem = (m) => {
    const id = LB.push(m) - 1;
    const st = `--r:${+(m.ratio || 16 / 9).toFixed(4)}${m.position ? `;--pos:${esc(m.position)}` : ""}`;
    const name = esc(m.alt || "");
    return m.type === "video"
      ? `<button type="button" class="mi mi-video" style="${st}" data-lb="${id}" aria-label="Play clip: ${name}"><img class="mi-still" src="${esc(m.poster)}" alt="" loading="lazy" decoding="async" draggable="false"><video class="mi-vid" muted loop playsinline preload="none" tabindex="-1" aria-hidden="true" src="${esc(m.src)}"></video><span class="mi-tag">${ICONS.play}Clip</span></button>`
      : `<button type="button" class="mi" style="${st}" data-lb="${id}" aria-label="Enlarge photo: ${name}"><img class="mi-still" src="${esc(m.src)}" alt="${name}" loading="lazy" decoding="async" draggable="false"><span class="mi-tag mi-zoom" aria-hidden="true">${ICONS.zoom}</span></button>`;
  };
  // Items sit side by side at the same height, whatever their aspect ratios.
  const mediaRow = (items, cls = "") => {
    const sum = items.reduce((a, m) => a + (m.ratio || 16 / 9), 0);
    return `<div class="mrow ${cls}" style="--sum:${+sum.toFixed(4)};--n:${items.length}">${items.map(mediaItem).join("")}</div>`;
  };
  const thumb = (im, title) => {
    if (!im) return "";
    const id = LB.push({ type: "image", ...im }) - 1;
    return `<button type="button" class="thumb" data-lb="${id}" aria-label="View: ${esc(title)}"><img src="${esc(im.src)}" alt="" loading="lazy" decoding="async"><span class="thumb-ico" aria-hidden="true">${ICONS.zoom}</span></button>`;
  };
  const lb = $("lightbox");
  const lbMedia = $("lb-media");
  function openLB(id) {
    const m = LB[id];
    const cover = m.lightbox === "cover";
    lbMedia.className = "lb-media" + (cover ? " cover" : "");
    lbMedia.style.cssText = cover ? `--r:${m.ratio};--pos:${m.position || "50% 50%"}` : "";
    lbMedia.innerHTML = m.type === "video"
      ? `<video class="lb-el" src="${esc(m.src)}" controls autoplay loop playsinline${m.poster ? ` poster="${esc(m.poster)}"` : ""}></video>`
      : `<img class="lb-el" src="${esc(m.src)}" alt="${esc(m.alt || "")}">`;
    $("lb-cap").textContent = m.caption || m.alt || "";
    $("lb-open").hidden = m.type === "video";
    $("lb-open").href = m.src;
    lb.showModal();
  }
  document.addEventListener("click", (e) => { const b = e.target.closest("[data-lb]"); if (b) openLB(+b.dataset.lb); });
  lb.addEventListener("click", (e) => { if (!e.target.closest(".lb-fig") || e.target.closest("[data-lb-close]")) lb.close(); });
  lb.addEventListener("close", () => { if (!lb.open) lbMedia.innerHTML = ""; });

  /* Research */
  const R = P.research;
  $("research-title").textContent = R.title;
  $("research-meta").textContent = R.meta;
  $("research-summary").textContent = R.summary;
  const gTrack = $("gal-track");
  gTrack.innerHTML = R.gallery.map((sl, i) => `
    <div class="gal-slide${sl.fill ? " fill" : ""}" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${R.gallery.length}">
      <span class="gal-bg" style="background-image:url('${esc(sl.items[0].poster || sl.items[0].src)}')" aria-hidden="true"></span>
      ${mediaRow(sl.items, sl.fill ? "fill" : "")}
      <p class="gal-cap">${esc(sl.caption)}</p>
    </div>`).join("");
  carousel({ root: $("gallery"), track: gTrack, prev: $("gal-prev"), next: $("gal-next"), dotsEl: $("gal-dots"), name: (i) => R.gallery[i].caption });
  $("timeline-note").textContent = R.timelineNote;
  const pct = (t) => (t / R.span) * 100;
  let ticks = "";
  for (let s = 0; s <= R.span; s++) ticks += `<span style="left:${pct(s)}%">${s} s</span>`;
  let rows = `<div class="ed-play">${ICONS.play}</div><div class="ed-ruler">${ticks}</div>`;
  R.tracks.forEach((t) => {
    rows += `<div class="ed-label">${esc(t.node)}</div><div class="ed-lane">${t.blocks.map((b) =>
      `<div class="blk ${b.tone}${b.measured ? "" : " unmeasured"}" style="left:${pct(b.from)}%;width:${pct(b.to - b.from)}%" title="${esc(b.label)}">${esc(b.label)}</div>`).join("")}</div>`;
  });
  $("editor").innerHTML = `<div class="ed-grid" id="ed-grid">${rows}</div>`;
  $("editor").setAttribute("aria-label", "Pipeline timeline: " + R.tracks.map((t) => `${t.node}: ${t.blocks.map((b) => b.label).join(", ")}`).join("; "));
  // Labels that don't fit inside a short block sit just to its right.
  const fitLabels = () => {
    grid.querySelectorAll(".blk-out").forEach((e) => e.remove());
    grid.querySelectorAll(".blk").forEach((b) => {
      b.dataset.label ??= b.textContent;
      b.textContent = b.dataset.label;
      const lane = b.parentElement;
      const room = lane.clientWidth - (b.offsetLeft + b.offsetWidth);
      if (b.scrollWidth > b.clientWidth + 1 && room > b.scrollWidth + 8) {
        b.textContent = "";
        const o = document.createElement("span");
        o.className = "blk-out";
        o.textContent = b.dataset.label;
        o.style.left = `calc(${b.style.left} + ${b.style.width})`;
        b.parentElement.appendChild(o);
      }
    });
  };
  // Playhead runs once and stops where the validated work stops.
  const grid = $("ed-grid");
  requestAnimationFrame(() => fitLabels());
  document.fonts?.ready.then(fitLabels);
  addEventListener("resize", fitLabels);
  const head = document.createElement("div");
  head.className = "playhead";
  grid.appendChild(head);
  const pending = R.tracks.flatMap((t) => t.blocks).find((b) => b.tone === "pending");
  const stopAt = pending ? pending.from : R.span;
  const laneLeft = () => grid.querySelector(".ed-lane").offsetLeft;
  const laneW = () => grid.querySelector(".ed-lane").offsetWidth;
  const setHead = (t) => (head.style.left = laneLeft() + (laneW() * t) / R.span + "px");
  setHead(0);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduce || !("IntersectionObserver" in window)) setHead(stopAt);
  else {
    const io = new IntersectionObserver((es) => { if (es.some((e) => e.isIntersecting)) { setHead(stopAt); io.disconnect(); } }, { threshold: 0.6 });
    io.observe(grid);
  }
  addEventListener("resize", () => { head.style.transition = "none"; setHead(stopAt); });
  $("research-status").innerHTML = R.status.map((s) =>
    `<li class="${s.done ? "done" : "todo"}"><span class="mark" aria-hidden="true">${s.done ? ICONS.check : ""}</span><span><span class="visually-hidden">${s.done ? "Done: " : "Not yet: "}</span>${esc(s.text)}</span></li>`).join("");

  /* Skills */
  $("skills-list").innerHTML = P.skills.map((s) => `<li>${esc(s)}</li>`).join("");

  /* Projects: a clip or photo replaces the flow diagram when there is one */
  const track = $("car-track");
  track.innerHTML = P.projects.map((p, i) => {
    const has = !!(p.media && p.media.length);
    return `
    <div class="slide" role="group" aria-roledescription="slide" aria-label="${i + 1} of ${P.projects.length}: ${esc(p.title)}">
      <div class="panel">
        <div class="panel-top${has ? " has-media" : ""}">
          ${has ? mediaRow(p.media) : `<ol class="flow" aria-label="Signal chain">${p.flow.map((f) => `<li><span class="node">${esc(f)}</span></li>`).join("")}</ol>`}
          <div class="panel-over">
            <h3>${esc(p.title)}</h3>
            <p>${esc(p.blurb)}</p>
            <div class="panel-links">${p.links.map((l) => `<a href="${esc(l.href)}" target="_blank" rel="noopener">${ICONS.github.replace("<svg", '<svg width="13" height="13"')}${esc(l.label)}</a>`).join("")}${p.note ? `<span class="note">${esc(p.note)}</span>` : ""}</div>
          </div>
        </div>
        <div class="panel-strip"><p>Tech stack</p><ul>${p.stack.map((s) => `<li>${esc(s)}</li>`).join("")}</ul></div>
      </div>
    </div>`;
  }).join("");
  carousel({ root: $("carousel"), track, prev: $("car-prev"), next: $("car-next"), dotsEl: $("car-dots"), name: (i) => P.projects[i].title });

  /* Repo cards: one component, two data sources */
  const LANG = { Python: "#3572A5", "C++": "#f34b7d", C: "#8a8f99", JavaScript: "#f1e05a", TypeScript: "#3178c6", MATLAB: "#e16737", "Jupyter Notebook": "#DA5B0B", Svelte: "#ff3e00", HTML: "#e34c26", Shell: "#89e051" };
  const ago = (iso) => {
    const d = (Date.now() - new Date(iso)) / 864e5;
    if (d < 1) return "today";
    if (d < 30) return `${Math.round(d)} days ago`;
    if (d < 365) { const m = Math.round(d / 30); return `${m} month${m > 1 ? "s" : ""} ago`; }
    const y = Math.round(d / 365); return `${y} year${y > 1 ? "s" : ""} ago`;
  };
  function repoCard(r) {
    const tag = r.url ? "a" : "div";
    const attrs = r.url ? `href="${esc(r.url)}" target="_blank" rel="noopener"` : `aria-label="${esc(r.title)}, private repository"`;
    return `<${tag} class="repo" ${attrs}>
      <h3>${esc(r.title)}${r.url ? ICONS.ext : ""}</h3>
      <p>${esc(r.description || "No description yet.")}</p>
      <div class="repo-foot">
        ${r.language ? `<span><i class="lang-dot" style="background:${LANG[r.language] || "var(--violet)"}"></i>${esc(r.language)}</span>` : ""}
        ${r.stars ? `<span>${ICONS.star} ${r.stars}</span>` : ""}
        <span>Updated ${ago(r.updated_at)}</span>
        ${r.private ? `<span class="badge-private" title="Code is private. Ask me for a walkthrough.">${ICONS.lock}Private</span>` : ""}
      </div></${tag}>`;
  }
  const reposEl = $("repos");
  reposEl.innerHTML = G.repos.length ? G.repos.map(repoCard).join("") : `<p class="repos-empty">Repositories sync from GitHub on the next deploy.</p>`;
  $("repos-toggle").addEventListener("click", (e) => {
    const open = reposEl.hidden;
    reposEl.hidden = !open;
    e.currentTarget.setAttribute("aria-expanded", open);
    e.currentTarget.textContent = open ? "Hide repositories" : "Show all repositories";
  });

  /* Heatmap: only shown when there is enough to be worth showing */
  const C = G.contributions;
  if (C && C.total >= (G.min_contributions || 0)) {
    $("github").hidden = false;
    const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let html = "", lastM = -1, lastAt = -9;
    C.weeks.forEach((w, wi) => {
      const m = new Date(w[0][0] + "T00:00:00").getMonth();
      // Label a month at its first week, if there's room before the next label.
      const showM = m !== lastM && wi - lastAt >= 3 && wi < C.weeks.length - 2;
      if (m !== lastM) lastM = m;
      html += `<i class="m">${showM ? MONTHS[m] : ""}</i>`;
      if (showM) lastAt = wi;
      const first = new Date(w[0][0] + "T00:00:00").getDay();
      for (let k = 0; k < first; k++) html += `<i style="visibility:hidden"></i>`;
      w.forEach(([d, c, l]) => (html += `<i class="l${l}" title="${c} on ${d}"></i>`));
      for (let k = first + w.length; k < 7; k++) html += `<i style="visibility:hidden"></i>`;
    });
    $("heat").innerHTML = html;
    $("heat-total").innerHTML = `${C.total} contributions in the last year on <a href="https://github.com/${esc(G.username)}" target="_blank" rel="noopener">GitHub</a>`;
  }

  /* Awards and certifications */
  $("awards").innerHTML = P.awards.map((a) => `<li${a.image ? ' class="has-thumb"' : ""}><span class="badge" aria-hidden="true">${a.title.startsWith("1st") ? "1st" : "★"}</span><div><h3>${esc(a.title)}</h3><p class="by">${esc(a.by)}<span class="bar">|</span>${esc(a.date)}</p><p class="detail">${esc(a.detail)}</p></div>${thumb(a.image, a.title)}</li>`)
    .join("");
  const SHOW = 4;
  $("certs").innerHTML = P.certifications.map((c, i) => `<li class="${i >= SHOW ? "extra" : ""}${c.image ? " has-thumb" : ""}" ${i >= SHOW ? "hidden" : ""}><span class="badge" aria-hidden="true">${c.by.startsWith("Cisco") ? "CC" : c.by === "Siemens" ? "SE" : ICONS.doc.replace("<svg", '<svg width="14" height="14"')}</span><div><h3>${esc(c.title)}</h3><p class="by">${c.by ? esc(c.by) + '<span class="bar">|</span>' : ""}${esc(c.date)}</p></div>${thumb(c.image, c.title)}</li>`).join("");
  const more = $("certs-more");
  const extra = P.certifications.length - SHOW;
  if (extra > 0) {
    more.textContent = `+ ${extra} more`;
    more.addEventListener("click", () => {
      const open = more.getAttribute("aria-expanded") !== "true";
      document.querySelectorAll("#certs .extra").forEach((li) => (li.hidden = !open));
      more.setAttribute("aria-expanded", open);
      more.textContent = open ? "Show fewer" : `+ ${extra} more`;
    });
  } else more.parentElement.remove();

  /* Clips play only while they are on screen */
  const clips = document.querySelectorAll(".mi-vid");
  if (!reduce && "IntersectionObserver" in window && clips.length) {
    const vio = new IntersectionObserver((entries) => entries.forEach((en) => {
      const v = en.target;
      if (en.isIntersecting) v.play().then(() => v.parentElement.classList.add("is-playing")).catch(() => {});
      else v.pause();
    }), { threshold: 0.4 });
    clips.forEach((v) => vio.observe(v));
  }

  /* Sync line */
  if (G.generated_at) {
    const d = new Date(G.generated_at);
    $("sync").textContent = `Repositories synced from GitHub on ${d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}.`;
  }
})();

/* Diagrams for project slides that have no photo. Each style draws the project's `flow` steps in a
   different way so the slides don't all look alike. Choose one with `diagram: { style }` in content/profile.js. */
window.DIAGRAMS = (() => {
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const n1 = (v) => Math.round(v * 10) / 10;
  const steps = (p) => `<ol class="visually-hidden" aria-label="Signal chain">${p.flow.map((f) => `<li>${esc(f)}</li>`).join("")}</ol>`;

  /* chain: boxes joined by lines. The default. */
  const chain = (p) => `<ol class="flow" aria-label="Signal chain">${p.flow.map((f) => `<li><span class="node">${esc(f)}</span></li>`).join("")}</ol>`;

  /* link: two systems joined by a radio link */
  const ICON = {
    laptop: '<svg viewBox="0 0 24 24" width="16" height="16"><rect x="4.5" y="5.5" width="15" height="10" rx="1.6" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M2.5 19h19" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>',
    drone: '<svg viewBox="0 0 24 24" width="18" height="18"><g fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"><circle cx="12" cy="12" r="2.4"/><path d="M10.2 10.2 6.6 6.6M13.8 10.2 17.4 6.6M10.2 13.8 6.6 17.4M13.8 13.8 17.4 17.4"/><circle cx="5" cy="5" r="2.6"/><circle cx="19" cy="5" r="2.6"/><circle cx="5" cy="19" r="2.6"/><circle cx="19" cy="19" r="2.6"/></g></svg>'
  };
  // Two antennas with radio waves and a dashed link; drawn along one axis, then laid out sideways or upright.
  function radio(len, vertical) {
    const at = (s, c) => (vertical ? [c, s] : [s, c]);
    const path = (pts) => "M" + pts.map(([s, c]) => at(s, c).map(n1).join(" ")).join("L");
    const c0 = 14, a = 8, b = len - 8, inset = vertical ? 22 : 26;
    const waves = [8, 13, 18].map((r, k) => {
      const arc = (s0, dir) => {
        const pts = [];
        for (let i = 0; i <= 8; i++) { const th = ((-52 + (104 * i) / 8) * Math.PI) / 180; pts.push([s0 + dir * r * Math.cos(th), c0 + r * Math.sin(th)]); }
        return `<path class="dg-arc" style="opacity:${[1, 0.68, 0.42][k]}" d="${path(pts)}"/>`;
      };
      return arc(a, 1) + arc(b, -1);
    }).join("");
    // upright, the poles would point sideways, so only the tips are drawn
    const mast = (s0) => { const [x, y] = at(s0, c0); return (vertical ? "" : `<path class="dg-mast" d="${path([[s0, c0 + 3], [s0, c0 + 24]])}"/>`) + `<circle class="dg-tip" cx="${x}" cy="${y}" r="3"/>`; };
    const [w, h] = vertical ? [40, len] : [len, 40];
    return `<svg class="dg-wave ${vertical ? "dg-v" : "dg-h"}" viewBox="0 0 ${w} ${h}" aria-hidden="true"><path class="dg-dash" d="${path([[a + inset, c0], [b - inset, c0]])}"/>${waves}${mast(a)}${mast(b)}</svg>`;
  }
  const link = (p) => {
    const d = p.diagram, F = p.flow;
    if (!d.groups || d.groups.length !== 2 || F[d.link] === undefined) return chain(p);
    const group = (g, last) => `<div class="dg-group"><p class="dg-title">${ICON[g.icon] || ""}${esc(g.name)}</p>${g.nodes.map((i, k) => `${k ? '<i class="dg-down"></i>' : ""}<span class="node${last && k === g.nodes.length - 1 ? " last" : ""}">${esc(F[i])}</span>`).join("")}</div>`;
    return `<div class="dg dg-link" aria-hidden="true">${group(d.groups[0])}<div class="dg-radio">${radio(112, false)}${radio(84, true)}<span class="dg-pill">${esc(F[d.link])}</span></div>${group(d.groups[1], true)}</div>${steps(p)}`;
  };

  /* signal: a clean waveform picks up noise, goes through a model and comes out as a label */
  const rng = (seed) => () => { seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
  const signal = (p) => {
    const F = p.flow;
    if (F.length !== 5) return chain(p);
    const rand = rng(11), pts = [];
    for (let i = 0; i <= 150; i++) {
      const t = i / 150, calm = t > 0.93 ? (1 - t) / 0.07 : 1;
      const y = 75 + Math.sin(t * Math.PI * 9) * (12 + 6 * t) + (rand() - 0.5) * 2 * Math.pow(Math.max(0, t - 0.3), 1.05) * 30 * calm;
      pts.push(`${n1(14 + 280 * t)} ${n1(y)}`);
    }
    const layers = [48, 62, 76, 90].map((y, k) => `<rect class="sg-layer${k === 1 || k === 2 ? " on" : ""}" x="317" y="${y}" width="56" height="8" rx="4"/>`).join("");
    const svg = `<svg class="sg-svg" viewBox="0 0 480 150" aria-hidden="true">
<defs><linearGradient id="sg-grad" gradientUnits="userSpaceOnUse" x1="14" y1="0" x2="294" y2="0"><stop offset="0" stop-color="#8f6bff"/><stop offset=".32" stop-color="#8f6bff"/><stop offset=".62" stop-color="#f5873a"/></linearGradient></defs>
<path class="sg-base" d="M14 75H294"/><path class="sg-wave" d="M${pts.join("L")}"/><path class="sg-in" d="M294 75H306"/>
<rect class="sg-blk" x="306" y="36" width="78" height="78" rx="11"/>${layers}
<path class="sg-clean" d="M384 75H416M416 75V52H426M416 75V100H426"/>
<rect class="sg-chip" x="426" y="41" width="46" height="22" rx="11"/><text class="sg-chip-t" x="449" y="56" text-anchor="middle">intent</text>
<rect class="sg-chip oos" x="426" y="89" width="46" height="22" rx="11"/><text class="sg-chip-t oos" x="449" y="104" text-anchor="middle">OOS</text>
</svg>`;
    // steps sit above and below the wave, each at the part of the signal it acts on
    const at = [[10.4, "t"], [27, "b"], [47.5, "t"], [71.8, "b"], [93, "t"]];
    const row = (side) => at.map(([x, s], i) => (s === side ? `<span class="sg-lab${i === 4 ? " last" : ""}" style="left:${x}%"${i === 4 ? ' data-end=""' : ""}>${esc(F[i])}</span>` : "")).join("");
    return `<div class="dg dg-signal" aria-hidden="true"><div class="sg-row t">${row("t")}</div>${svg}<div class="sg-row b">${row("b")}</div></div>${steps(p)}`;
  };

  /* map: an annotated street map, numbered to match the steps */
  const map = (p) => {
    const F = p.flow;
    if (F.length !== 5) return chain(p);
    const [dx, dy] = [-8, 6];
    const blocks = [
      [16, 10, 34, 24], [58, 14, 40, 20], [126, 10, 46, 26], [180, 12, 26, 22], [212, 10, 28, 26], [264, 12, 32, 24], [304, 10, 66, 26], [398, 16, 30, 20], [436, 22, 28, 14],
      [16, 54, 36, 30], [60, 56, 40, 26], [126, 52, 50, 32], [186, 56, 54, 24], [264, 52, 44, 34], [316, 56, 58, 26], [398, 52, 32, 32], [438, 58, 26, 24],
      [16, 104, 44, 24], [68, 106, 30, 20], [126, 102, 60, 26], [194, 106, 44, 20], [264, 104, 50, 24], [322, 102, 50, 26], [398, 104, 66, 24]
    ];
    const shadow = ([x, y, w, h]) => `<path class="mp-shd" d="M${x} ${y}L${x + dx} ${y + dy}V${y + h + dy}H${x + w + dx}L${x + w} ${y + h}H${x}Z"/>`;
    const rays = Array.from({ length: 8 }, (_, i) => { const a = (i * Math.PI) / 4; return `<path class="mp-ray" d="M${n1(456 + 12 * Math.cos(a))} ${n1(15 + 12 * Math.sin(a))}L${n1(456 + 16.5 * Math.cos(a))} ${n1(15 + 16.5 * Math.sin(a))}"/>`; }).join("");
    const nodes = [[112, 44], [252, 44], [386, 44], [112, 94], [252, 94], [386, 94]];
    const svg = `<svg class="mp-svg" viewBox="0 0 480 140" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
<defs><clipPath id="mp-clip"><rect width="480" height="140" rx="12"/></clipPath></defs>
<g clip-path="url(#mp-clip)"><rect class="mp-tile" width="480" height="140"/>
<path class="mp-street" d="M0 44H480M0 94H480M112 0V140M252 0V140M386 0V140"/>
${blocks.map(shadow).join("")}${blocks.map(([x, y, w, h]) => `<rect class="mp-bld" x="${x}" y="${y}" width="${w}" height="${h}" rx="2"/>`).join("")}
<path class="mp-edge" d="M112 44H386M112 94H386M112 44V94M252 44V94M386 44V94"/>
<path class="mp-route-c" d="M14 94H112V44H252V94H386"/><path class="mp-route" d="M14 94H112V44H252V94H386"/>
${nodes.map(([x, y]) => `<circle class="mp-node" cx="${x}" cy="${y}" r="4"/>`).join("")}
<circle class="mp-start" cx="20" cy="94" r="5"/>
<path class="mp-pin" d="M386 94C380 86 377 83 377 78A9 9 0 1 1 395 78C395 83 392 86 386 94Z"/>
<circle class="mp-glow" cx="456" cy="15" r="20"/><circle class="mp-sun" cx="456" cy="15" r="8.5"/>${rays}
<path class="mp-beam" d="M443 29L430 39M430 39L436.5 38.2M430 39L431 32.5"/></g></svg>`;
    const badge = [[16.7, 49.3], [89.6, 22], [62.1, 29], [52.5, 80], [80.4, 55.7]];
    const pins = badge.map(([x, y], i) => `<span class="mp-n" style="left:${x}%;top:${y}%">${i + 1}</span>`).join("");
    const key = F.map((f, i) => `<li${i === 4 ? ' class="last"' : ""}><b>${i + 1}</b>${esc(f)}</li>`).join("");
    return `<div class="dg dg-map" aria-hidden="true"><div class="mp-canvas">${svg}${pins}</div><ol class="mp-key">${key}</ol></div>${steps(p)}`;
  };

  const styles = { chain, link, signal, map };
  const render = (p) => (styles[p.diagram && p.diagram.style] || chain)(p);
  return { render };
})();

/* Career board, drawn as inline SVG. 1 unit = 0.1 mm, board = 1000 x 430.
   Only the LED chain comes from the career data; everything else is decoration. */
window.PCB = (() => {
  const W = 1000, H = 430;
  const n1 = (v) => Math.round(v * 10) / 10;
  const D = (pts) => "M" + pts.map((p) => `${n1(p[0])} ${n1(p[1])}`).join("L");
  const rect = (cx, cy, w, h, cls, rx = 0) => `<rect class="${cls}" x="${n1(cx - w / 2)}" y="${n1(cy - h / 2)}" width="${n1(w)}" height="${n1(h)}"${rx ? ` rx="${rx}"` : ""}/>`;
  const circle = (cx, cy, r, cls) => `<circle class="${cls}" cx="${n1(cx)}" cy="${n1(cy)}" r="${n1(r)}"/>`;
  const line = (pts, cls, w) => `<path class="${cls}" d="${D(pts)}"${w ? ` stroke-width="${w}"` : ""}/>`;
  const text = (x, y, s, size = 10, cls = "pcb-t", anchor = "middle", rot = 0) =>
    `<text class="${cls}" x="${n1(x)}" y="${n1(y)}" font-size="${size}" text-anchor="${anchor}"${rot ? ` transform="rotate(${rot} ${n1(x)} ${n1(y)})"` : ""}>${s}</text>`;

  /* ---------- footprints: local coordinates, origin at the part centre ---------- */
  const part = () => ({ halo: "", cu: "", body: "", silk: "" });
  const smd = (p, x, y, w, h, gnd) => {
    p.cu += rect(x, y, w, h, "pcb-gold", 1.5);
    if (!gnd) p.halo += rect(x, y, w + 12, h + 12, "pcb-hf", 6);
  };
  const tht = (p, x, y, r = 9, hole = 4.5, o = {}) => {
    if (!o.gnd) p.halo += circle(x, y, r + 6, "pcb-hf");
    p.cu += (o.sq ? rect(x, y, r * 2, r * 2, "pcb-gold", 2) : circle(x, y, r, "pcb-gold")) + circle(x, y, hole, "pcb-hole");
  };

  const passive = (kind, o = {}) => {
    const p = part();
    smd(p, -11, 0, 10, 14, o.gnd1); smd(p, 11, 0, 10, 14, o.gnd2);
    p.body = rect(0, 0, 20, 12.5, kind === "c" ? "pcb-capb" : "pcb-resb", 1.5) + rect(0, -3.6, 17, 2.4, "pcb-sheen", 1);
    return p;
  };
  const diode = () => {
    const p = part();
    smd(p, -19, 0, 11, 13); smd(p, 19, 0, 11, 13);
    p.body = rect(0, 0, 30, 16, "pcb-icb", 2) + rect(-10, 0, 4.5, 16, "pcb-band");
    return p;
  };
  const sot23 = () => {
    const p = part();
    smd(p, -9.5, 11, 9, 10); smd(p, 9.5, 11, 9, 10); smd(p, 0, -11, 9, 10);
    p.body = rect(0, 0, 29, 13, "pcb-icb", 2) + circle(-9, 3.6, 1.6, "pcb-dimple");
    return p;
  };
  const soic = (pins, label) => {
    const p = part(), pitch = 12.7, span = (pins - 1) * pitch;
    for (let k = 0; k < pins; k++) { const x = -span / 2 + k * pitch; smd(p, x, -27, 6.5, 15); smd(p, x, 27, 6.5, 15); }
    p.body = rect(0, 0, span + 10.5, 39, "pcb-icb", 3) + circle(-span / 2 - 1, -11, 3, "pcb-dimple") + (label ? text(4, 3.5, label, 9.5, "pcb-ict") : "");
    return p;
  };
  const electro = (r, label) => {
    const p = part(), cx = -r * 0.66, cy = Math.sqrt(r * r - cx * cx);
    tht(p, -25, 0, 11, 5.5, { gnd: true }); tht(p, 25, 0, 11, 5.5, { sq: true });
    p.body = circle(0, 0, r, "pcb-can") + circle(0, 0, r - 6, "pcb-cantop") +
      `<path class="pcb-canband" d="M${n1(cx)} ${n1(-cy)}A${r} ${r} 0 0 0 ${n1(cx)} ${n1(cy)}Z"/>` +
      line([[-12, 0], [14, 0]], "pcb-vent") + line([[1, -13], [1, 13]], "pcb-vent") +
      [-22, 0, 22].map((y) => line([[cx - 9, y], [cx - 3, y]], "pcb-canmark")).join("") +
      text(14, -30, label, 8.5, "pcb-cant", "middle", -10);
    p.silk = circle(0, 0, r + 4, "pcb-sk") + text(r + 13, 5, "+", 14, "pcb-t");
    return p;
  };
  const header = (cols, rows, o = {}) => {
    const p = part(), s = 25.4, cx = ((cols - 1) * s) / 2, cy = ((rows - 1) * s) / 2, w = cols * s, h = rows * s;
    p.halo = rect(cx, cy, w + 12, h + 12, "pcb-hf", 8);
    p.body = rect(cx, cy, w, h, "pcb-plastic", 2);
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const x = c * s, y = r * s;
      p.body += rect(x, y, 9.5, 9.5, "pcb-pin", 1.2) + rect(x - 1, y - 1, 5, 5, "pcb-pinhi", 1);
    }
    p.silk = `<path class="pcb-sk" d="M${n1(-s / 2 - 6)} ${n1(-s / 2 + 2)}l0 ${n1(-8)}"/>` + (o.noMark ? "" : `<path class="pcb-skf" d="M${n1(-s / 2 - 4)} ${n1(-s / 2 - 12)}l10 0l-5 -9z"/>`);
    return p;
  };
  const terminal = (pins) => {
    const p = part(), pitch = 50.8, w = pins * pitch + 2, d = 72, cx = ((pins - 1) * pitch) / 2;
    for (let i = 0; i < pins; i++) tht(p, i * pitch, 0, 15, 7.5, i === 1 ? { gnd: true } : {});
    p.halo += rect(cx, 0, w + 12, d + 12, "pcb-hf", 8);
    p.body = rect(cx, 0, w, d, "pcb-blue", 5) + rect(cx, -d / 2 + 5, w - 8, 5, "pcb-bluehi", 2) + rect(cx, d / 2 - 11, w - 8, 14, "pcb-bluedk", 3);
    for (let i = 0; i < pins; i++) {
      const x = i * pitch;
      p.body += circle(x, -6, 18, "pcb-screwring") + circle(x, -6, 15, "pcb-screw") +
        line([[x - 10, -6], [x + 10, -6]], "pcb-slot", 3.4) + line([[x, -16], [x, 4]], "pcb-slot", 3.4) +
        rect(x, d / 2 - 11, 30, 10, "pcb-hole", 2);
    }
    return p;
  };
  const relay = () => {
    const p = part();
    for (const [x, y] of [[-70, -48], [-70, 48], [-4, -52], [44, -52], [70, 48]]) tht(p, x, y, 8.5, 4.2);
    p.halo += rect(0, 0, 202, 167, "pcb-hf", 10);
    p.body = rect(0, 0, 190, 155, "pcb-blue", 6) + rect(0, 0, 178, 143, "pcb-bluehi", 4) + rect(0, 0, 172, 137, "pcb-blue", 3) +
      text(0, -22, "SRD-05VDC-SL-C", 13, "pcb-relayt") + text(0, 0, "SONGLE", 9.5, "pcb-relayt2") +
      text(0, 22, "10A 250VAC 10A 30VDC", 8.5, "pcb-relayt2") + text(0, 40, "5VDC", 10, "pcb-relayt2");
    return p;
  };
  const a4988 = () => {
    const p = part(), W2 = 152, H2 = 203;
    for (let k = 0; k < 8; k++) { const y = -88.9 + 25.4 * k; tht(p, -64, y, 8.5, 4.2, k === 1 || k === 7 ? { gnd: true } : {}); tht(p, 64, y, 8.5, 4.2, k === 1 || k === 7 ? { gnd: true } : {}); }
    p.halo += rect(0, 0, W2 + 12, H2 + 12, "pcb-hf", 8);
    p.body = rect(0, 0, W2, H2, "pcb-red", 6) + rect(0, 0, W2 - 6, H2 - 6, "pcb-redhi", 4);
    // pin stubs along both long edges
    for (let k = 0; k < 8; k++) { const y = -88.9 + 25.4 * k; p.body += rect(-64, y, 9, 9, "pcb-pin", 1) + rect(64, y, 9, 9, "pcb-pin", 1); }
    // heat sink
    p.body += rect(0, 22, 64, 64, "pcb-alu", 3);
    for (let i = -2; i <= 2; i++) p.body += line([[-27, 22 + i * 11], [27, 22 + i * 11]], "pcb-fin", 2.4);
    // trim pot
    p.body += rect(-22, -66, 40, 40, "pcb-potbody", 4) + circle(-22, -66, 14, "pcb-potscrew") + line([[-31, -60], [-13, -72]], "pcb-slot", 3.2);
    // SMD parts on the module
    p.body += rect(30, -74, 18, 9, "pcb-resb", 1.5) + rect(30, -58, 18, 9, "pcb-capb", 1.5) + rect(-40, 68, 16, 9, "pcb-capb", 1.5) + rect(40, 70, 16, 9, "pcb-resb", 1.5) + rect(0, 82, 16, 9, "pcb-capb", 1.5);
    p.body += text(0, 100, "A4988", 12, "pcb-modt");
    p.silk = "";
    return p;
  };
  const nema17 = (s) => {
    const p = part(), h = s / 2;
    p.halo = rect(0, 0, s + 12, s + 12, "pcb-hf", 10);
    p.body = rect(0, 0, s, s, "pcb-motor", 9) + rect(0, 0, s - 8, s - 8, "pcb-motorhi", 6);
    for (const sx of [-1, 1]) for (const sy of [-1, 1]) p.body += circle(sx * (h - 13), sy * (h - 13), 6.5, "pcb-motorhole");
    p.body += circle(0, 0, h - 19, "pcb-boss") + circle(0, 0, h - 27, "pcb-bossin");
    p.rotor = circle(0, 0, 16, "pcb-rotor") + [0, 60, 120, 180, 240, 300].map((a) => `<rect class="pcb-rotorslot" x="-2.4" y="-15" width="4.8" height="9" transform="rotate(${a})"/>`).join("") + circle(0, 0, 4.5, "pcb-motorhole") + rect(0, 21.5, 5, 5, "pcb-rotornotch");
    return p;
  };

  /* ---------- assembly ---------- */
  function render(nodes) {
    const L = { halo: [], bot: [], top: [], cu: [], body: [], silk: [], over: [] };
    const G = (x, y, rot, s) => `<g transform="translate(${n1(x)} ${n1(y)})${rot ? ` rotate(${rot})` : ""}">${s}</g>`;
    const put = (p, x, y, rot = 0) => {
      L.halo.push(G(x, y, rot, p.halo)); L.cu.push(G(x, y, rot, p.cu));
      L.body.push(G(x, y, rot, p.body + (p.rotor ? `<g class="pcb-rotorg" data-rotor="1">${p.rotor}</g>` : ""))); L.silk.push(G(x, y, rot, p.silk));
    };
    const trace = (pts, o = {}) => {
      const w = o.w || 5, d = D(pts);
      if (o.layer === "bot") { L.bot.push(`<path class="pcb-cub" d="${d}" stroke-width="${w}"/>`); return; }
      L.halo.push(`<path class="pcb-halo" d="${d}" stroke-width="${w + 14}"/>`);
      L.top.push(`<path${o.seg !== undefined ? ` data-seg="${o.seg}"` : ""} class="${o.cls || "pcb-cu"}" d="${d}" stroke-width="${w}"/>`);
      if (o.seg !== undefined) L.top.push(`<path data-seg="${o.seg}" class="pcb-flow" d="${d}"/>`);
      if (!o.cls) L.top.push(`<path class="pcb-cuhi" d="${D(pts.map(([x, y]) => [x - 0.5, y - 0.5]))}" stroke-width="${n1(w * 0.26)}"/>`);
    };
    const via = (x, y) => { L.halo.push(circle(x, y, 14, "pcb-hf")); L.cu.push(circle(x, y, 8, "pcb-gold") + circle(x, y, 3.2, "pcb-hole")); };
    const ref = (x, y, s, o = {}) => L.silk.push(text(x, y, s, o.size || 10, o.cls || "pcb-t", o.anchor || "middle", o.rot || 0));
    const mount = (x, y) => { L.cu.push(circle(x, y, 24, "pcb-gold") + circle(x, y, 13, "pcb-hole")); L.silk.push(circle(x, y, 29, "pcb-sk")); };
    const tp = (x, y, s) => { L.halo.push(circle(x, y, 14, "pcb-hf")); L.cu.push(circle(x, y, 8, "pcb-gold")); if (s) ref(x, y - 14, s, { size: 8 }); };

    /* LED chain */
    const n = nodes.length, X0 = 330, X1 = 850, Y0 = 315, Y1 = 126;
    const leds = nodes.map((_, i) => { const t = n === 1 ? 0 : i / (n - 1); return { x: n1(X0 + (X1 - X0) * t), y: n1(Y0 + (Y1 - Y0) * t) }; });
    const PAD = 38, chamfer = (a, b) => {
      const dx = b[0] - a[0], dy = Math.abs(b[1] - a[1]), run = Math.max(0, (dx - dy) / 2), sy = Math.sign(b[1] - a[1]) || 1;
      return [a, [a[0] + run, a[1]], [a[0] + run + Math.min(dx, dy), a[1] + sy * Math.min(dx, dy)], b];
    };
    const air = [];

    /* power in */
    put(terminal(2), 40, 388); ref(128, 372, "J1  12V IN", { size: 9.5, anchor: "start" });
    trace([[40, 388], [40, 72], [202, 72]], { w: 11 });                       // motor supply trunk
    trace([[40, 340], [89, 340]], { w: 6 });                                  // to the LED string
    put(passive("r"), 100, 340); ref(100, 326, "R1", { size: 9 });
    /* bulk capacitor */
    put(electro(46, "1000uF"), 110, 262); ref(170, 298, "C1", { size: 9.5 }); trace([[40, 262], [85, 262]], { w: 8 });
    /* decoupling next to the driver */
    for (const [x, name] of [[150, "C2"], [176, "C3"]]) { put(passive("c", { gnd1: true }), x, 45, 90); ref(x, 27, name, { size: 8.5 }); trace([[x, 56], [x, 72]], { w: 5 }); }

    /* driver + motor */
    put(nema17(96), 100, 154); ref(100, 100, "M1  NEMA17", { size: 9 });
    put(a4988(), 266, 161); ref(266, 49, "U1", { size: 10 });
    [122.9, 148.3, 173.7, 199.1].forEach((y) => {
      const pd = part(); tht(pd, 0, 0, 8, 4); put(pd, 160, y);
      trace([[160, y], [202, y]], { w: 5 });
    });
    ref(160, 108, "COILS", { size: 7.5 });
    /* RESET-SLEEP strap and the three control lines to the Pi header */
    trace([[330, 173.7], [350, 173.7], [350, 199.1], [330, 199.1]], { w: 4 });
    trace([[330, 72.1], [388, 72.1], [418, 102.1], [477.4, 102.1], [477.4, 61.4]], { w: 4.5 });
    trace([[330, 224.5], [360, 224.5], [468, 116.5], [502.8, 116.5], [502.8, 61.4]], { w: 4.5 });
    trace([[330, 250], [380, 250], [500, 130], [528.2, 130], [528.2, 61.4]], { w: 4.5 });
    ref(346, 66, "EN", { size: 8 }); ref(346, 219, "STEP", { size: 8 }); ref(350, 244, "DIR", { size: 8 });

    /* Pi header, with decoupling and pull-downs underneath */
    put(header(20, 2), 452, 36); ref(745, 92, "J2  RPi 5", { size: 9, anchor: "start" });
    [[600, "c", "C4"], [624, "c", "C5"], [648, "r", "R2"], [672, "r", "R3"]].forEach(([x, k, name]) => {
      put(passive(k, { gnd2: true }), x, 108, 90); ref(x, 89, name, { size: 8 });
      trace([[x, 97], [x, 86]], { w: 4 }); via(x, 132); trace([[x, 119], [x, 132]], { w: 4 });
    });

    /* electromagnet driver + relay */
    put(relay(), 840, 342); ref(905, 254, "K1", { size: 10 });
    put(terminal(2), 535, 388); ref(535, 348, "J5  EM 24V", { size: 9.5, anchor: "start" });
    put(sot23(), 700, 380); ref(724, 384, "Q1", { size: 9 });
    put(diode(), 700, 338, 90); ref(722, 336, "D6", { size: 9 });
    put(passive("r"), 650, 391); ref(650, 409, "R7", { size: 9 });
    trace([[661, 391], [690.5, 391]], { w: 4.5 });
    trace([[700, 369], [700, 357]], { w: 5 });
    trace([[700, 319], [700, 294], [770, 294]], { w: 5 });
    trace([[700, 363], [722, 363], [722, 384], [770, 384]], { w: 5 });
    trace([[709.5, 391], [709.5, 404]], { w: 4.5 }); via(709.5, 409);

    /* limit switch header */
    put(header(1, 4), 950, 108); ref(974, 150, "LIM", { size: 8, rot: 90 });
    [[108, "R4"], [133.4, "R5"], [158.8, "R6"]].forEach(([y, name]) => { put(passive("r"), 915, y); ref(915, y - 11, name, { size: 8 }); trace([[926, y], [950, y]], { w: 4 }); });
    trace([[934.6, 61.4], [934.6, 84], [950, 96]], { layer: "bot", w: 4 }); via(934.6, 84);
    trace([[883.8, 61.4], [883.8, 92], [905, 100]], { layer: "bot", w: 4 }); via(883.8, 92);

    /* title block, mounting holes, test points */
    L.silk.push(text(140, 395, "ALEX BARBU", 18, "pcb-title", "start"), text(141, 410, "CAREER  ·  REV 2027", 9, "pcb-t", "start"));
    mount(34, 34); mount(966, 34); mount(966, 396);
    tp(440, 402, "TP1"); tp(470, 402, "TP2");

    /* LEDs and the chain that joins them */
    const start = [leds[0].x - PAD, leds[0].y];
    trace([[111, 340], [240, 340], [265, 315], [start[0], start[1]]], { w: 7, cls: "pcb-chain", seg: 0 });
    const ledPart = (x, y, i, off) => {
      const p = part();
      tht(p, -PAD, 0, 10, 5); tht(p, PAD, 0, 10, 5, { sq: true });
      p.silk = circle(0, 0, 31, off ? "pcb-sk pcb-skdash" : "pcb-sk") + line([[27.5, -12], [27.5, 12]], "pcb-sk", 2);
      put(p, x, y);
      ref(x - PAD, y - 20, "+", { size: 11 }); ref(x, y - 40, `D${i + 1}`, { size: 10 });
    };
    nodes.forEach((c, i) => ledPart(leds[i].x, leds[i].y, i, !!c.next));
    for (let i = 1; i < n; i++) {
      const a = [leds[i - 1].x + PAD, leds[i - 1].y], b = [leds[i].x - PAD, leds[i].y];
      if (nodes[i].next) air.push([a, b]); else trace(chamfer(a, b), { w: 7, cls: "pcb-chain", seg: i });
    }
    if (nodes[n - 1].next) { const l = leds[n - 1]; air.push([[l.x + PAD, l.y], [l.x + PAD + 46, l.y + 26]]); via(l.x + PAD + 46, l.y + 26); }
    const airSvg = air.map((s) => `<path data-seg="${n - 1}" class="pcb-air" d="${D(s)}"/>`).join("");

    const svg = `<svg class="pcb" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid meet" aria-hidden="true" focusable="false">
<defs>
<pattern id="pcb-hatch" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><path class="pcb-hatchl" d="M0 4.5H9M4.5 0V9"/></pattern>
<linearGradient id="pcb-gloss" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".11"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".24"/></linearGradient>
</defs>
<rect class="pcb-mask" x="0" y="0" width="${W}" height="${H}" rx="18"/>
<rect fill="url(#pcb-hatch)" x="12" y="12" width="${W - 24}" height="${H - 24}" rx="10"/>
<g>${L.halo.join("")}</g><g>${L.bot.join("")}</g><g>${L.top.join("")}</g><g>${L.cu.join("")}</g>
<g>${L.body.join("")}</g><g>${L.silk.join("")}</g>${airSvg}
<rect class="pcb-edge" x="1" y="1" width="${W - 2}" height="${H - 2}" rx="17"/>
<rect fill="url(#pcb-gloss)" x="0" y="0" width="${W}" height="${H}" rx="18" pointer-events="none"/>
</svg>`;
    return { svg, leds, W, H };
  }

  return { render, W, H };
})();

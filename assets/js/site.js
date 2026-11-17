/* Scroll-driven figures for d-bruna.github.io.
   Each chapter registers {hd, cap, draw(p)} where p in [0,1] is progress through its step.
   Real data: Fig 2 (IPO sample), Fig 4 (DML coverage, read from Fig. 1 of the paper), Fig 6 (qcml results).
   Figs 0, 1, 3, 5 and 7 are schematic and say so in their captions. */
(function () {
  "use strict";
  var NS = "http://www.w3.org/2000/svg";
  var C = { amber: "#f5a623", paper: "#e9e6df", grey: "#77726a", dim: "#3a3a3a", up: "#46b872", down: "#e0524f", blue: "#4f7fd9", grid: "#1c1c1c", axis: "#333" };
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  function el(p, t, a) { var e = document.createElementNS(NS, t); for (var k in a) e.setAttribute(k, a[k]); p.appendChild(e); return e; }
  function tx(p, x, y, s, cls, anchor) { var e = el(p, "text", { x: x, y: y, "text-anchor": anchor || "start" }); if (cls) e.setAttribute("class", cls); e.textContent = s; return e; }
  function clamp(v, a, b) { a = a === undefined ? 0 : a; b = b === undefined ? 1 : b; return Math.max(a, Math.min(b, v)); }
  function seg(p, a, b) { return clamp((p - a) / (b - a)); }
  function ease(t) { return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
  var seed = 1;
  function rnd() { seed = (seed * 16807) % 2147483647; return seed / 2147483647; }
  function gauss() { var u = 0; for (var i = 0; i < 6; i++) u += rnd(); return u - 3; }
  function path(pts) { return "M" + pts.map(function (q) { return q[0].toFixed(1) + " " + q[1].toFixed(1); }).join(" L"); }
  function drawable(e) { var L = e.getTotalLength(); e.style.strokeDasharray = L; e.style.strokeDashoffset = L; e._L = L; return e; }
  function reveal(e, f) { e.style.strokeDashoffset = e._L * (1 - f); }
  function show(e, o) { e.style.opacity = o; }
  function hline(g, y, label, x0, x1) { el(g, "line", { x1: x0 || 70, x2: x1 || 720, y1: y, y2: y, stroke: C.grid }); if (label) tx(g, (x0 || 70) - 10, y + 4, label, null, "end"); }

  var sv = document.getElementById("sv");
  if (!sv) return;
  var chapters = [];
  function chapter(def) { def.g = el(sv, "g", { "class": "ch" }); def.build(def.g); chapters.push(def); return def; }

  /* 0 · regression (schematic) */
  chapter({
    hd: "<b>FIG 0</b> estimate, then doubt it",
    cap: "<b>Fig. 0.</b> Points arrive, a line is fitted, then the band shows how far the line could move. Schematic.",
    build: function (g) {
      seed = 5; hline(g, 120, "high"); hline(g, 300, ""); hline(g, 460, "low");
      el(g, "line", { x1: 70, x2: 720, y1: 480, y2: 480, stroke: C.axis }); tx(g, 395, 505, "x", null, "middle");
      this.dots = []; for (var i = 0; i < 90; i++) { var x = rnd(), y = .25 + .5 * x + gauss() * .09; this.dots.push(el(g, "circle", { cx: 90 + x * 610, cy: 470 - y * 400, r: 3.2, fill: C.paper, opacity: 0 })); }
      this.band = el(g, "path", { d: "M90 390 L700 178 L700 142 L90 354 Z", fill: C.amber, opacity: 0 });
      this.line = drawable(el(g, "line", { x1: 90, x2: 700, y1: 370, y2: 160, stroke: C.amber, "stroke-width": 2.5 }));
      this.lb = tx(g, 560, 118, "slope ± 1.96 se", "lbl"); show(this.lb, 0);
    },
    draw: function (p) {
      var n = this.dots.length; this.dots.forEach(function (d, i) { d.setAttribute("opacity", p * 1.7 > i / n ? .85 : 0); });
      reveal(this.line, seg(p, .45, .7)); this.band.setAttribute("opacity", .16 * seg(p, .7, .9)); show(this.lb, seg(p, .75, .95));
    }
  });

  /* 1 · market making (schematic) */
  chapter({
    hd: "<b>FIG 1</b> two-sided quotes",
    cap: "<b>Fig. 1.</b> Bid and ask track a moving fair value; squares are fills. Schematic, not competition data.",
    build: function (g) {
      seed = 21; hline(g, 150); hline(g, 300); hline(g, 450); el(g, "line", { x1: 70, x2: 720, y1: 480, y2: 480, stroke: C.axis }); tx(g, 395, 505, "time", null, "middle");
      var N = 120, fair = [], m = 300; for (var i = 0; i < N; i++) { m += gauss() * 14; m += (300 - m) * .03; fair.push([80 + i * 5.2, m]); }
      this.N = N;
      this.bid = drawable(el(g, "path", { d: path(fair.map(function (q) { return [q[0], q[1] + 24]; })), stroke: C.up, fill: "none", "stroke-width": 1.3 }));
      this.ask = drawable(el(g, "path", { d: path(fair.map(function (q) { return [q[0], q[1] - 24]; })), stroke: C.down, fill: "none", "stroke-width": 1.3 }));
      this.fv = drawable(el(g, "path", { d: path(fair), stroke: C.paper, fill: "none", "stroke-width": 1, opacity: .6 }));
      this.fills = []; for (var j = 6; j < N; j += 4) { var s = rnd() < .5, q = fair[j]; this.fills.push([j, el(g, "rect", { x: q[0] - 3, y: (s ? q[1] + 24 : q[1] - 24) - 3, width: 6, height: 6, fill: s ? C.up : C.down, opacity: 0 })]); }
      this.ctr = tx(g, 720, 90, "", "big", "end"); tx(g, 720, 110, "fills, illustrative", null, "end");
      el(g, "rect", { x: 80, y: 527, width: 8, height: 8, fill: C.up }); tx(g, 94, 535, "bid");
      el(g, "rect", { x: 130, y: 527, width: 8, height: 8, fill: C.down }); tx(g, 144, 535, "ask");
      el(g, "line", { x1: 182, x2: 200, y1: 531, y2: 531, stroke: C.paper }); tx(g, 206, 535, "fair value");
    },
    draw: function (p) {
      var q = seg(p, .05, .9), N = this.N, n = 0; [this.bid, this.ask, this.fv].forEach(function (e) { reveal(e, q); });
      this.fills.forEach(function (f) { var on = f[0] / N < q; f[1].setAttribute("opacity", on ? 1 : 0); if (on) n++; });
      this.ctr.textContent = n + " fills";
    }
  });

  /* 2 · IPO day one vs year one (real data, loaded from assets/data/ipo.json) */
  var ipo = chapter({
    hd: "<b>FIG 2</b> 881 IPOs · excess return vs S&amp;P 500",
    cap: "<b>Fig. 2.</b> Each dot is one IPO from our sample: day-one excess return (x) against one-year excess return (y). Axes clipped at −30…120% and −100…300%.",
    build: function (g) {
      var X = this.X = function (v) { return 90 + (clamp(v, -30, 120) + 30) / 150 * 620; };
      var Y = this.Y = function (v) { return 470 - (clamp(v, -100, 300) + 100) / 400 * 400; };
      [-100, 0, 100, 200, 300].forEach(function (v) { hline(g, Y(v), (v > 0 ? "+" : "") + v + "%", 90, 710); });
      el(g, "line", { x1: X(0), x2: X(0), y1: 60, y2: 480, stroke: C.axis, "stroke-dasharray": "3 3" });
      el(g, "line", { x1: 90, x2: 710, y1: Y(0), y2: Y(0), stroke: "#555" });
      [-30, 0, 30, 60, 90, 120].forEach(function (v) { tx(g, X(v), 500, (v > 0 ? "+" : "") + v + "%", null, "middle"); });
      tx(g, 710, 522, "day-one excess return →", null, "end");
      this.yl = tx(g, 96, 56, "one-year excess return ↑"); show(this.yl, 0);
      this.dotG = el(g, "g", {});
      el(g, "rect", { x: 470, y: 66, width: 250, height: 116, fill: "#0a0a0a", stroke: "#232323" });
      this.s1 = tx(g, 710, 90, "", "big", "end"); this.s1b = tx(g, 710, 110, "beat the S&P 500 on day one", null, "end");
      this.s2 = tx(g, 710, 150, "", "big", "end"); this.s2b = tx(g, 710, 170, "still ahead after one year", null, "end");
      show(this.s2, 0); show(this.s2b, 0);
      this.dots = [];
    },
    load: function (pairs) {
      var self = this; this.pairs = pairs;
      pairs.forEach(function (q) { self.dots.push(el(self.dotG, "circle", { cx: self.X(q[0]), cy: self.Y(-100), r: 2.6, opacity: 0, fill: q[0] > 0 ? C.amber : C.grey })); });
      this.d1 = pairs.filter(function (q) { return q[0] > 0; }).length / pairs.length;
      this.y1 = pairs.filter(function (q) { return q[1] > 0; }).length / pairs.length;
      if (this.last !== undefined) this.draw(this.last);
    },
    draw: function (p) {
      this.last = p; if (!this.pairs) return;
      var a = seg(p, .02, .35), b = ease(seg(p, .42, .8)), self = this, n = this.pairs.length;
      this.dots.forEach(function (d, i) {
        var q = self.pairs[i]; d.setAttribute("opacity", i / n < a ? .75 : 0);
        d.setAttribute("cy", self.Y(-100) + (self.Y(q[1]) - self.Y(-100)) * b + (b === 0 ? -6 - (i % 7) * 2 : 0));
        d.setAttribute("fill", b > .5 ? (q[1] > 0 ? C.up : C.down) : (q[0] > 0 ? C.amber : C.grey));
      });
      this.s1.textContent = Math.round(this.d1 * 100 * a) + "%";
      show(this.s2, seg(p, .7, .85)); show(this.s2b, seg(p, .7, .85)); show(this.yl, seg(p, .45, .6));
      this.s2.textContent = Math.round(this.y1 * 100) + "%";
    }
  });

  /* 3 · volatility (schematic) */
  chapter({
    hd: "<b>FIG 3</b> volatility forecast",
    cap: "<b>Fig. 3.</b> Realised volatility (grey) and a hybrid forecast (amber) through a stress period. Schematic; the method is as in the project.",
    build: function (g) {
      seed = 9; hline(g, 140, "40%"); hline(g, 300, "20%"); hline(g, 460, "0%");
      el(g, "line", { x1: 70, x2: 720, y1: 480, y2: 480, stroke: C.axis }); tx(g, 80, 500, "t − 250"); tx(g, 715, 500, "t", null, "end");
      var N = 160, v = .18, real = [], fc = [];
      for (var i = 0; i < N; i++) { var sh = (i > 70 && i < 85) ? .022 : 0; v = Math.max(.06, v + .92 * (.18 - v) * .1 + gauss() * .018 + sh); real.push([75 + i * 4, 460 - v * 800]); }
      for (var j = 0; j < N; j++) { var w = real.slice(Math.max(0, j - 6), j + 1), y = w.reduce(function (s, q) { return s + q[1]; }, 0) / w.length; fc.push([real[j][0], y + gauss() * 2]); }
      this.reg = el(g, "rect", { x: 75 + 70 * 4, y: 60, width: 60, height: 420, fill: "#1a1408", opacity: 0 }); g.insertBefore(this.reg, g.firstChild);
      this.rl = tx(g, 75 + 70 * 4 + 4, 78, "stress regime", "lbl"); show(this.rl, 0);
      this.r = drawable(el(g, "path", { d: path(real), stroke: C.grey, fill: "none", "stroke-width": 1.4 }));
      this.f = drawable(el(g, "path", { d: path(fc), stroke: C.amber, fill: "none", "stroke-width": 2 }));
      el(g, "line", { x1: 80, x2: 98, y1: 531, y2: 531, stroke: C.grey, "stroke-width": 2 }); tx(g, 104, 535, "realised");
      el(g, "line", { x1: 180, x2: 198, y1: 531, y2: 531, stroke: C.amber, "stroke-width": 2 }); tx(g, 204, 535, "LSTM + GARCH + HAR-RV + VIX", "lbl");
    },
    draw: function (p) { reveal(this.r, seg(p, 0, .55)); reveal(this.f, seg(p, .4, .95)); this.reg.setAttribute("opacity", seg(p, .25, .4)); show(this.rl, seg(p, .25, .4)); }
  });

  /* 4 · DML coverage (real: values read from Fig. 1 of the paper, p = 200, dense, rho = 0) */
  chapter({
    hd: "<b>FIG 4</b> DML coverage under dense signals",
    cap: "<b>Fig. 4.</b> Empirical coverage of 95% intervals against signal strength τ, as n grows from 300 to 1,000. Values from Fig. 1 of the paper (p = 200, dense, ρ = 0).",
    build: function (g) {
      this.T = ["5", "2", "1", "0.5", "0.2", "0.1", "0.05", "0.01"];
      this.D = {
        300: { L: [7, 3, 2, 3, 27, 65, 87, 93], R: [7, 6, 11, 17, 50, 74, 88, 93] },
        500: { L: [78, 67, 45, 27, 24, 56, 86, 95], R: [73, 45, 41, 44, 56, 83, 89, 95] },
        1000: { L: [89, 92, 88, 79, 49, 35, 66, 92], R: [87, 85, 78, 66, 60, 69, 85, 92] }
      };
      var X = this.X = function (i) { return 100 + i * 87; }, Y = this.Y = function (v) { return 470 - v * 3.8; };
      [0, 25, 50, 75, 100].forEach(function (v) { hline(g, Y(v), v + "%", 80, 720); });
      el(g, "line", { x1: 80, x2: 720, y1: Y(95), y2: Y(95), stroke: C.paper, "stroke-dasharray": "4 4", opacity: .7 });
      tx(g, 720, Y(95) - 8, "nominal 95%", "w", "end");
      var self = this; this.T.forEach(function (t, i) { tx(g, X(i), 500, t, null, "middle"); });
      tx(g, 720, 522, "signal strength τ (weaker →)", null, "end");
      el(g, "line", { x1: X(5), x2: X(5), y1: 80, y2: 470, stroke: C.amber, opacity: .25 });
      this.gap = el(g, "path", { fill: C.amber, opacity: .1 });
      this.lr = el(g, "path", { stroke: C.up, fill: "none", "stroke-width": 2.5 });
      this.ll = el(g, "path", { stroke: C.down, fill: "none", "stroke-width": 2.5 });
      this.pr = []; this.pl = [];
      for (var i = 0; i < 8; i++) { this.pr.push(el(g, "circle", { r: 3.5, fill: C.up })); this.pl.push(el(g, "circle", { r: 3.5, fill: C.down })); }
      this.nl = tx(g, 100, 78, "", "big"); tx(g, 100, 98, "observations per simulated dataset");
      this.vr = tx(g, 0, 0, "", null); this.vr.style.fill = C.up;
      this.vl = tx(g, 0, 0, "", null); this.vl.style.fill = C.down;
      this.gl = tx(g, 0, 0, "", "lbl", "end");
      el(g, "line", { x1: 330, x2: 348, y1: 541, y2: 541, stroke: C.up, "stroke-width": 2.5 }); tx(g, 354, 545, "DML-Ridge");
      el(g, "line", { x1: 450, x2: 468, y1: 541, y2: 541, stroke: C.down, "stroke-width": 2.5 }); tx(g, 474, 545, "DML-Lasso");
    },
    draw: function (p) {
      var keys = [300, 500, 1000], s = clamp(seg(p, .08, .85) * 2, 0, 2), k = Math.min(1, Math.floor(s)), f = ease(s - k);
      var A = this.D[keys[k]], B = this.D[keys[k + 1]], self = this;
      function mix(a, b) { return a.map(function (v, i) { return v + (b[i] - v) * f; }); }
      var R = mix(A.R, B.R), L = mix(A.L, B.L);
      var pr = R.map(function (v, i) { return [self.X(i), self.Y(v)]; }), pl = L.map(function (v, i) { return [self.X(i), self.Y(v)]; });
      this.lr.setAttribute("d", path(pr)); this.ll.setAttribute("d", path(pl));
      this.gap.setAttribute("d", path(pr) + " L" + pl.slice().reverse().map(function (q) { return q.join(" "); }).join(" L") + " Z");
      pr.forEach(function (q, i) { self.pr[i].setAttribute("cx", q[0]); self.pr[i].setAttribute("cy", q[1]); });
      pl.forEach(function (q, i) { self.pl[i].setAttribute("cx", q[0]); self.pl[i].setAttribute("cy", q[1]); });
      var n = Math.round(keys[k] + (keys[k + 1] - keys[k]) * f);
      this.nl.textContent = "n = " + n.toLocaleString("en");
      var x = this.X(5) + 10;
      this.vr.setAttribute("x", x); this.vr.setAttribute("y", this.Y(R[5]) - 8); this.vr.textContent = "ridge " + Math.round(R[5]) + "%";
      this.vl.setAttribute("x", x); this.vl.setAttribute("y", this.Y(L[5]) + 16); this.vl.textContent = "lasso " + Math.round(L[5]) + "%";
      this.gl.setAttribute("x", this.X(5) - 10); this.gl.setAttribute("y", (this.Y(R[5]) + this.Y(L[5])) / 2 + 4);
      this.gl.textContent = "gap " + Math.round(R[5] - L[5]) + " pts";
    }
  });

  /* 5 · ASML Monte Carlo (schematic) */
  chapter({
    hd: "<b>FIG 5</b> simulated programme ROI",
    cap: "<b>Fig. 5.</b> Each draw is one possible future for demand, productivity and learning. Schematic distribution; the real model is ASML-internal.",
    build: function (g) {
      seed = 33; var B = this.B = 36, x0 = 80, w = 17; this.zero = 12;
      el(g, "line", { x1: 70, x2: 720, y1: 470, y2: 470, stroke: C.axis });
      tx(g, x0, 492, "loss"); tx(g, x0 + 12 * w, 492, "ROI = 0", null, "middle"); tx(g, x0 + B * w, 492, "gain", null, "end");
      this.draws = []; for (var i = 0; i < 4000; i++) this.draws.push(.55 + gauss() * .65 + (rnd() < .12 ? gauss() * .9 : 0));
      this.bars = []; for (var j = 0; j < B; j++) this.bars.push(el(g, "rect", { x: x0 + j * w, y: 470, width: w - 2, height: 0, fill: j < 12 ? C.dim : C.amber }));
      el(g, "line", { x1: x0 + 12 * w - 1, x2: x0 + 12 * w - 1, y1: 80, y2: 470, stroke: C.paper, "stroke-dasharray": "3 3" });
      this.n = tx(g, 720, 96, "", "big", "end"); this.pr = tx(g, 720, 118, "", null, "end");
    },
    draw: function (p) {
      var B = this.B, k = Math.floor(seg(p, .05, .9) * this.draws.length), c = new Array(B).fill(0), pos = 0;
      for (var i = 0; i < k; i++) { var b = clamp(Math.floor((this.draws[i] + 1.5) / 4.5 * B), 0, B - 1); c[b]++; if (b >= this.zero) pos++; }
      var mx = Math.max.apply(null, [60].concat(c));
      this.bars.forEach(function (r, j) { var h = c[j] / mx * 360; r.setAttribute("y", 470 - h); r.setAttribute("height", h); });
      this.n.textContent = "n = " + k.toLocaleString("en"); this.pr.textContent = k ? "share of draws with ROI > 0: " + (pos / k).toFixed(2) : "";
    }
  });

  /* 6 · qcml benchmark (real: docs/results.md) */
  chapter({
    hd: "<b>FIG 6</b> one interface, one honest benchmark",
    cap: "<b>Fig. 6.</b> Test accuracy on make_moons (200 samples, 80/20 split, seed 42), and the quantum-kernel cache. From qcml/docs/results.md.",
    build: function (g) {
      var st = ["data", "BaseModel", "MLflow", "Ray", "FastAPI", "bench"], self = this;
      this.boxes = st.map(function (s, i) { var gg = el(g, "g", { opacity: 0 }); el(gg, "rect", { x: 40 + i * 114, y: 50, width: 96, height: 40, fill: "none", stroke: i === 1 ? C.amber : "#444" }); tx(gg, 88 + i * 114, 75, s, i === 1 ? "lbl" : "w", "middle"); if (i < 5) el(gg, "line", { x1: 136 + i * 114, x2: 154 + i * 114, y1: 70, y2: 70, stroke: "#444" }); return gg; });
      var M = [["SVM, RBF kernel", .975, 0], ["random forest", .95, 0], ["MLP, PyTorch", .92, 0], ["logistic regression", .90, 0], ["quantum kernel SVM", .80, 1], ["VQC, 2 qubits", .725, 1]];
      var X = this.X = function (v) { return 230 + (v - .5) / .5 * 470; };
      [.5, .6, .7, .8, .9, 1].forEach(function (v) { el(g, "line", { x1: X(v), x2: X(v), y1: 120, y2: 410, stroke: C.grid }); tx(g, X(v), 428, v.toFixed(1), null, "middle"); });
      tx(g, 700, 446, "test accuracy", null, "end");
      this.rows = M.map(function (m, i) {
        var y = 140 + i * 45; tx(g, 215, y + 15, m[0], m[2] ? "lbl" : "w", "end");
        var r = el(g, "rect", { x: X(.5), y: y, width: 0, height: 22, fill: m[2] ? C.amber : C.paper, opacity: m[2] ? 1 : .85 });
        var v = tx(g, X(.5), y + 15, "", null); return [r, v, m[1]];
      });
      this.cache = el(g, "g", { opacity: 0 });
      tx(this.cache, 40, 490, "quantum-kernel cache", "w");
      this.cold = el(this.cache, "rect", { x: 230, y: 478, width: 470, height: 14, fill: C.dim });
      tx(this.cache, 236, 490, "cold 3.43 s", "w");
      this.warm = el(this.cache, "rect", { x: 230, y: 500, width: 0, height: 14, fill: C.up });
      this.wl = tx(this.cache, 240, 512, "warm 0.024 s · 141× faster");
      this.wl.style.fill = C.up;
    },
    draw: function (p) {
      var self = this;
      this.boxes.forEach(function (b, i) { b.setAttribute("opacity", seg(p, .02 + i * .04, .06 + i * .04)); });
      this.rows.forEach(function (r, i) { var f = ease(seg(p, .25 + i * .07, .4 + i * .07)), w = (self.X(r[2]) - self.X(.5)) * f; r[0].setAttribute("width", w); r[1].setAttribute("x", self.X(.5) + w + 6); r[1].textContent = f > 0 ? (r[2] * f + .5 * (1 - f)).toFixed(3) : ""; });
      var c = seg(p, .78, .95); this.cache.setAttribute("opacity", c); this.warm.setAttribute("width", Math.max(2, 470 * 0.024 / 3.43) * c);
    }
  });

  /* 7 · freight network RM (schematic) */
  chapter({
    hd: "<b>FIG 7</b> accept, or hold capacity",
    cap: "<b>Fig. 7.</b> Requests arrive on legs of a multimodal network; each is accepted only if its revenue beats the opportunity cost of the capacity it uses. Schematic of ongoing research.",
    build: function (g) {
      seed = 3;
      var N = this.N = { Rotterdam: [150, 160], Antwerp: [118, 290], Hamburg: [440, 80], Duisburg: [330, 225], Basel: [390, 420], Milan: [560, 500], Prague: [650, 200] };
      var E = this.E = [["Rotterdam", "Duisburg", "barge"], ["Antwerp", "Duisburg", "rail"], ["Rotterdam", "Hamburg", "truck"], ["Duisburg", "Basel", "barge"], ["Basel", "Milan", "rail"], ["Hamburg", "Prague", "rail"], ["Duisburg", "Prague", "truck"], ["Antwerp", "Basel", "truck"]];
      var col = { barge: C.blue, rail: C.paper, truck: C.grey }, self = this; this.legs = {};
      E.forEach(function (e) {
        var a = N[e[0]], b = N[e[1]];
        el(g, "line", { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: col[e[2]], "stroke-width": e[2] === "barge" ? 3 : 2, "stroke-dasharray": e[2] === "truck" ? "5 5" : "none", opacity: .7 });
        var mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2;
        el(g, "rect", { x: mx - 18, y: my - 4, width: 36, height: 8, fill: "#000", stroke: "#333" });
        self.legs[e[0] + e[1]] = el(g, "rect", { x: mx - 17, y: my - 3, width: 0, height: 6, fill: C.amber });
      });
      Object.keys(N).forEach(function (k) { var q = N[k]; el(g, "rect", { x: q[0] - 5, y: q[1] - 5, width: 10, height: 10, fill: "#000", stroke: C.paper, "stroke-width": 1.5 }); tx(g, q[0] + 10, q[1] - 9, k, "w"); });
      this.reqs = []; for (var i = 0; i < 18; i++) this.reqs.push({ e: E[Math.floor(rnd() * E.length)], acc: rnd() < .6, dot: el(g, "circle", { r: 6, opacity: 0 }) });
      [["barge", C.blue, "none"], ["rail", C.paper, "none"], ["truck", C.grey, "5 5"]].forEach(function (l, i) { el(g, "line", { x1: 40 + i * 90, x2: 62 + i * 90, y1: 541, y2: 541, stroke: l[1], "stroke-width": 2, "stroke-dasharray": l[2] }); tx(g, 68 + i * 90, 545, l[0]); });
      this.ctr = tx(g, 720, 545, "", null, "end");
    },
    draw: function (p) {
      var k = seg(p, .05, .95) * this.reqs.length, a = 0, r = 0, used = {}, N = this.N, self = this;
      this.reqs.forEach(function (q, i) {
        var s = N[q.e[0]], t = N[q.e[1]], on = i < k, loc = clamp(k - i);
        q.dot.setAttribute("cx", s[0] + (t[0] - s[0]) * loc); q.dot.setAttribute("cy", s[1] + (t[1] - s[1]) * loc);
        q.dot.setAttribute("fill", loc < 1 ? C.amber : (q.acc ? C.up : C.down)); q.dot.setAttribute("opacity", on ? (loc < 1 ? 1 : .85) : 0);
        if (on && loc >= 1) { if (q.acc) { a++; used[q.e[0] + q.e[1]] = (used[q.e[0] + q.e[1]] || 0) + 1; } else r++; }
      });
      Object.keys(this.legs).forEach(function (key) { self.legs[key].setAttribute("width", Math.min(34, (used[key] || 0) * 12)); });
      this.ctr.textContent = "accepted " + a + " · held back " + r;
    }
  });

  /* ---------- scroll engine ---------- */
  var steps = Array.prototype.slice.call(document.querySelectorAll(".step"));
  var rail = document.getElementById("rail"), hd = document.getElementById("fighd"), cap = document.getElementById("cap");
  var stsec = document.getElementById("stsec"), stbar = document.getElementById("stbar"), stpct = document.getElementById("stpct");
  var railBtns = steps.map(function (s, i) {
    var b = document.createElement("button"); b.type = "button"; b.innerHTML = "<span>[" + i + "]</span>" + s.dataset.t;
    b.addEventListener("click", function () { s.scrollIntoView({ behavior: reduce ? "auto" : "smooth" }); });
    rail.appendChild(b); return b;
  });
  var cur = -1;
  function setCh(i) {
    if (i === cur) return; cur = i;
    chapters.forEach(function (c, j) { c.g.classList.toggle("on", j === i); });
    hd.innerHTML = chapters[i].hd; cap.innerHTML = chapters[i].cap;
    railBtns.forEach(function (b, j) { b.classList.toggle("on", j === i); b.classList.toggle("done", j < i); if (j === i) b.setAttribute("aria-current", "step"); else b.removeAttribute("aria-current"); });
  }
  var ticking = false;
  function update() {
    ticking = false;
    var vh = window.innerHeight, act = 0, inStory = steps[0].getBoundingClientRect().top < vh * .6;
    steps.forEach(function (s, i) { if (s.getBoundingClientRect().top < vh * .55) act = i; });
    setCh(act);
    var r = steps[act].getBoundingClientRect(), p = reduce ? 1 : clamp((vh * .75 - r.top) / (r.height * .8));
    chapters[act].draw(p);
    var h = document.documentElement, pct = Math.round(clamp(h.scrollTop / Math.max(1, h.scrollHeight - vh)) * 100);
    stbar.style.width = pct + "%"; stpct.textContent = pct + "%";
    var past = document.getElementById("work").getBoundingClientRect().top < vh * .5;
    stsec.textContent = past ? "dgb · work" : inStory ? "dgb · " + act + ":" + steps[act].dataset.t : "dgb · top";
  }
  function req() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", req, { passive: true });
  window.addEventListener("resize", req);

  fetch("assets/data/ipo.json").then(function (r) { return r.json(); }).then(function (d) { ipo.load(d); }).catch(function () { ipo.cap = "<b>Fig. 2.</b> Data did not load."; });

  /* ---------- hero terminal ---------- */
  var term = document.getElementById("term");
  var lines = [["whoami", "Daniel García Bruña · Delft, NL"], ["cat focus.txt", "quantitative research · ML research engineering"], ["./status --now", "research assistant @ TU Delft · data science intern @ Fugro"]];
  function wait(ms) { return new Promise(function (r) { setTimeout(r, reduce ? 0 : ms); }); }
  (async function () {
    for (var i = 0; i < lines.length; i++) {
      var d = document.createElement("div"), cmd = document.createElement("span"); d.innerHTML = '<span class="p">$</span> '; d.appendChild(cmd); term.appendChild(d);
      for (var j = 0; j < lines[i][0].length; j++) { cmd.textContent += lines[i][0][j]; await wait(30); }
      await wait(160); var o = document.createElement("span"); o.className = "o"; o.textContent = lines[i][1]; term.appendChild(o); await wait(220);
    }
  })();

  /* ---------- dithered portrait (Floyd–Steinberg, amber on black) ---------- */
  (function () {
    var c = document.getElementById("dither"); if (!c) return; var x = c.getContext("2d"), im = new Image();
    im.onload = function () {
      var W = c.width, H = c.height; x.drawImage(im, 0, 0, W, H);
      var d = x.getImageData(0, 0, W, H), px = d.data, L = new Float32Array(W * H), i, X, y;
      for (i = 0; i < W * H; i++) { L[i] = Math.pow((px[i * 4] * .3 + px[i * 4 + 1] * .59 + px[i * 4 + 2] * .11) / 255, .85) * 1.12 - .04; }
      for (y = 0; y < H; y++) for (X = 0; X < W; X++) { i = y * W + X; var o = L[i], n = o > .5 ? 1 : 0, e = o - n; L[i] = n; if (X + 1 < W) L[i + 1] += e * 7 / 16; if (y + 1 < H) { if (X) L[i + W - 1] += e * 3 / 16; L[i + W] += e * 5 / 16; if (X + 1 < W) L[i + W + 1] += e / 16; } }
      for (i = 0; i < W * H; i++) { var on = L[i] > .5; px[i * 4] = on ? 245 : 10; px[i * 4 + 1] = on ? 166 : 10; px[i * 4 + 2] = on ? 35 : 10; px[i * 4 + 3] = 255; }
      x.putImageData(d, 0, 0);
    };
    im.src = "assets/img/daniel.jpg";
  })();

  update();
})();

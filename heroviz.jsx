/* heroviz.jsx — original animated 3D point-network for the hero.
   A rotating sphere of nodes connected by proximity edges, with depth shading
   and gentle pointer parallax. Reads the live --accent color. Respects the
   motion tweak and prefers-reduced-motion. No external dependencies. */
function HeroViz({ motion = true }) {
  const ref = React.useRef(null);

  React.useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const animate = motion && !reduce;

    // ---- build a Fibonacci sphere of points -------------------------------
    const N = 170;
    const pts = [];
    const golden = Math.PI * (3 - Math.sqrt(5));
    for (let i = 0; i < N; i++) {
      const y = 1 - (i / (N - 1)) * 2;
      const r = Math.sqrt(Math.max(0, 1 - y * y));
      const th = golden * i;
      pts.push([Math.cos(th) * r, y, Math.sin(th) * r]);
    }
    // ---- precompute proximity edges (fixed on the sphere) -----------------
    const edges = [];
    const TH = 0.34;
    for (let i = 0; i < N; i++) {
      for (let j = i + 1; j < N; j++) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const dz = pts[i][2] - pts[j][2];
        if (dx * dx + dy * dy + dz * dz < TH * TH) edges.push([i, j]);
      }
    }

    let W = 0, H = 0, DPR = 1;
    const resize = () => {
      DPR = Math.min(2, window.devicePixelRatio || 1);
      const rect = canvas.getBoundingClientRect();
      W = rect.width; H = rect.height;
      canvas.width = Math.max(1, Math.round(W * DPR));
      canvas.height = Math.max(1, Math.round(H * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    // ---- pointer parallax --------------------------------------------------
    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      tmx = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      tmy = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
      tmx = Math.max(-1.4, Math.min(1.4, tmx));
      tmy = Math.max(-1.4, Math.min(1.4, tmy));
    };
    window.addEventListener("pointermove", onMove);

    const accent = () => getComputedStyle(probe).color || "rgb(150,140,255)";
    // probe resolves --accent to a concrete rgb/oklch value canvas can parse
    // (reading the custom property directly yields an unparseable calc()).
    const probe = document.createElement("span");
    probe.style.cssText = "position:absolute;left:-9999px;width:0;height:0;color:var(--accent)";
    (canvas.parentNode || document.body).appendChild(probe);

    let t = 0.2, raf = 0;
    const proj = new Array(N);

    const draw = () => {
      const R = Math.min(W, H) * 0.4;
      const cx = W / 2, cy = H / 2;
      const fov = 3.2;
      mx += (tmx - mx) * 0.06;
      my += (tmy - my) * 0.06;
      const ay = t * 0.22 + mx * 0.55;
      const ax = 0.42 + my * 0.45;
      const cay = Math.cos(ay), say = Math.sin(ay);
      const cax = Math.cos(ax), sax = Math.sin(ax);

      for (let i = 0; i < N; i++) {
        const x = pts[i][0], y = pts[i][1], z = pts[i][2];
        const x1 = x * cay - z * say;
        const z1 = x * say + z * cay;
        const y2 = y * cax - z1 * sax;
        const z2 = y * sax + z1 * cax;
        const s = fov / (fov + z2);
        proj[i] = [cx + x1 * R * s, cy + y2 * R * s, z2, s];
      }

      ctx.clearRect(0, 0, W, H);
      const col = accent();

      // edges (back-to-front feel via depth alpha)
      ctx.strokeStyle = col;
      ctx.lineWidth = 1;
      for (let k = 0; k < edges.length; k++) {
        const a = proj[edges[k][0]], b = proj[edges[k][1]];
        const depth = (a[2] + b[2]) / 2;          // -1 (front) .. 1 (back)
        const alpha = 0.06 + 0.16 * (1 - (depth + 1) / 2);
        ctx.globalAlpha = alpha;
        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
      }

      // nodes
      ctx.fillStyle = col;
      for (let i = 0; i < N; i++) {
        const p = proj[i];
        const front = 1 - (p[2] + 1) / 2;          // 0 back .. 1 front
        ctx.globalAlpha = 0.28 + front * 0.72;
        const rad = (0.7 + front * 2.3) * p[3];
        ctx.beginPath();
        ctx.arc(p[0], p[1], rad, 0, Math.PI * 2);
        ctx.fill();
      }
      // a couple of brighter "lead" nodes with a soft halo
      for (let i = 0; i < 3; i++) {
        const p = proj[i * 53 % N];
        const front = 1 - (p[2] + 1) / 2;
        ctx.globalAlpha = 0.18 + front * 0.3;
        ctx.beginPath();
        ctx.arc(p[0], p[1], (3 + front * 5) * p[3], 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      t += 0.006;
      draw();
      raf = requestAnimationFrame(loop);
    };

    if (animate) {
      raf = requestAnimationFrame(loop);
    } else {
      // static, balanced frame
      mx = 0; my = -0.15; draw();
    }

    const onVis = () => {
      if (document.hidden) { cancelAnimationFrame(raf); raf = 0; }
      else if (animate && !raf) { raf = requestAnimationFrame(loop); }
    };
    document.addEventListener("visibilitychange", onVis);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      probe.remove();
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [motion]);

  return <canvas ref={ref} className="hero-viz-canvas" aria-hidden="true"></canvas>;
}

Object.assign(window, { HeroViz });

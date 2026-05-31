/* interactions.jsx — 3D depth layer for the portfolio.
   Adds pointer-driven tilt to [data-tilt] elements, an ambient pointer/scroll
   parallax (exposed as --px / --py / --sy CSS vars on <html>), and respects
   the motion tweak + prefers-reduced-motion. No external dependencies. */

function clearDepth() {
  document.querySelectorAll("[data-tilt]").forEach((el) => {
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
    el.style.removeProperty("--mx");
    el.style.removeProperty("--my");
  });
  const r = document.documentElement;
  r.style.setProperty("--px", "0");
  r.style.setProperty("--py", "0");
}

function useDepthScene(enabled) {
  React.useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const fine = window.matchMedia("(pointer: fine)").matches;
    if (!enabled || reduce) {
      clearDepth();
      return;
    }

    // ---- per-element tilt --------------------------------------------------
    const tilts = Array.from(document.querySelectorAll("[data-tilt]"));
    const bound = [];
    if (fine) {
      tilts.forEach((el) => {
        const max = parseFloat(el.dataset.tilt) || 7;
        const onMove = (e) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5;
          const py = (e.clientY - r.top) / r.height - 0.5;
          el.style.setProperty("--rx", (-py * max).toFixed(2) + "deg");
          el.style.setProperty("--ry", (px * max).toFixed(2) + "deg");
          el.style.setProperty("--mx", (px * 100 + 50).toFixed(1) + "%");
          el.style.setProperty("--my", (py * 100 + 50).toFixed(1) + "%");
        };
        const onLeave = () => {
          el.style.setProperty("--rx", "0deg");
          el.style.setProperty("--ry", "0deg");
        };
        el.addEventListener("pointermove", onMove);
        el.addEventListener("pointerleave", onLeave);
        bound.push([el, onMove, onLeave]);
      });
    }

    // ---- ambient pointer parallax (depth orbs, hero frame) ----------------
    const r = document.documentElement;
    let tpx = 0, tpy = 0, px = 0, py = 0, raf = 0;
    const onGlobal = (e) => {
      tpx = e.clientX / window.innerWidth - 0.5;
      tpy = e.clientY / window.innerHeight - 0.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    const tick = () => {
      px += (tpx - px) * 0.08;
      py += (tpy - py) * 0.08;
      r.style.setProperty("--px", px.toFixed(4));
      r.style.setProperty("--py", py.toFixed(4));
      if (Math.abs(tpx - px) > 0.001 || Math.abs(tpy - py) > 0.001) {
        raf = requestAnimationFrame(tick);
      } else {
        raf = 0;
      }
    };
    if (fine) window.addEventListener("pointermove", onGlobal, { passive: true });

    // ---- scroll parallax depth --------------------------------------------
    let sraf = 0;
    const onScroll = () => {
      if (sraf) return;
      sraf = requestAnimationFrame(() => {
        r.style.setProperty("--sy", String(window.scrollY));
        sraf = 0;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      bound.forEach(([el, m, l]) => {
        el.removeEventListener("pointermove", m);
        el.removeEventListener("pointerleave", l);
      });
      window.removeEventListener("pointermove", onGlobal);
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
      cancelAnimationFrame(sraf);
      clearDepth();
    };
  }, [enabled]);
}

Object.assign(window, { useDepthScene });

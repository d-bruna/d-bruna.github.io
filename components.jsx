/* components.jsx — all sections + case study overlay. Exported to window. */
const { useState, useEffect, useRef, useCallback } = React;

/* ---- Icons -------------------------------------------------------------- */
const Icon = {
  arrow: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M7 17 17 7M17 7H9M17 7v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  down: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
  ),
  close: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  ),
  sun: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><circle cx="12" cy="12" r="4.2" stroke="currentColor" strokeWidth="1.6"/><path d="M12 2.5v2.5M12 19v2.5M21.5 12H19M5 12H2.5M18.4 5.6l-1.8 1.8M7.4 16.6l-1.8 1.8M18.4 18.4l-1.8-1.8M7.4 7.4 5.6 5.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  ),
  moon: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><path d="M20 14.5A8 8 0 0 1 9.5 4a8 8 0 1 0 10.5 10.5Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/></svg>
  ),
  github: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M12 2C6.48 2 2 6.58 2 12.25c0 4.53 2.87 8.37 6.84 9.73.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.62.07-.62 1 .07 1.53 1.06 1.53 1.06.89 1.56 2.34 1.11 2.91.85.09-.66.35-1.11.63-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0 1 12 6.84c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.35 4.8-4.58 5.05.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .27.18.59.69.49A10.02 10.02 0 0 0 22 12.25C22 6.58 17.52 2 12 2Z"/></svg>
  ),
  linkedin: (p) => (
    <svg viewBox="0 0 24 24" fill="currentColor" {...p}><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5ZM3 9h4v12H3V9Zm6 0h3.8v1.64h.05c.53-.95 1.83-1.95 3.76-1.95C20.6 8.69 22 10.34 22 13.6V21h-4v-6.5c0-1.55-.03-3.54-2.16-3.54-2.16 0-2.49 1.69-2.49 3.43V21H9V9Z"/></svg>
  ),
  mail: (p) => (
    <svg viewBox="0 0 24 24" fill="none" {...p}><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6"/><path d="m4 7 8 5.5L20 7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></svg>
  ),
};

/* ---- Scroll reveal ------------------------------------------------------ */
function useReveal() {
  useEffect(() => {
    // Anything already within the viewport reveals immediately (no scroll needed).
    const revealInView = () => {
      document.querySelectorAll(".reveal:not(.in)").forEach((e) => {
        const r = e.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.96 && r.bottom > 0) e.classList.add("in");
      });
    };
    if (!("IntersectionObserver" in window)) {
      document.querySelectorAll(".reveal").forEach((e) => e.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
      }),
      { threshold: 0, rootMargin: "0px 0px -6% 0px" }
    );
    document.querySelectorAll(".reveal:not(.in)").forEach((e) => io.observe(e));
    // belt-and-suspenders: reveal in-view items across the first paints + font load
    requestAnimationFrame(revealInView);
    requestAnimationFrame(() => requestAnimationFrame(revealInView));
    const t1 = setTimeout(revealInView, 120);
    const t2 = setTimeout(revealInView, 500);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(revealInView);
    window.addEventListener("load", revealInView);
    return () => { io.disconnect(); clearTimeout(t1); clearTimeout(t2); window.removeEventListener("load", revealInView); };
  }, []);
}
/* helper: staggered reveal style */
const rv = (i = 0) => ({ "--reveal-delay": `${i * 80}ms` });

/* ---- Placeholder -------------------------------------------------------- */
function Placeholder({ label, sub = "placeholder", className = "", style }) {
  return (
    <div className={`ph ${className}`} style={style}>
      <div className="ph-label"><b>{sub}</b>{label}</div>
    </div>
  );
}

/* ---- Nav ---------------------------------------------------------------- */
const SECTIONS = [
  { id: "work", label: "Work", num: "01" },
  { id: "about", label: "About", num: "02" },
  { id: "cv", label: "CV", num: "03" },
  { id: "contact", label: "Contact", num: "04" },
];

function Nav({ data, theme, onToggleTheme }) {
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("");
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    const ids = ["hero", ...SECTIONS.map((s) => s.id)];
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); }),
      { rootMargin: "-45% 0px -50% 0px" }
    );
    ids.forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);
  return (
    <nav className="nav" data-scrolled={scrolled}>
      <a href="#hero" className="brand">
        <span className="dot" />
        <b>{data.monogram}</b>
        <span>/ {data.name.split(" ").slice(-2).join(" ")}</span>
      </a>
      <div className="nav-links">
        {SECTIONS.map((s) => (
          <a key={s.id} href={`#${s.id}`} className="nav-link" data-active={active === s.id}>
            <span className="num">{s.num}</span>{s.label}
          </a>
        ))}
        <button className="theme-toggle persist" onClick={onToggleTheme} aria-label="Toggle theme">
          {theme === "dark" ? <Icon.sun /> : <Icon.moon />}
        </button>
      </div>
    </nav>
  );
}

/* ---- Hero --------------------------------------------------------------- */
function fmt(s, accentClass) {
  // replaces {{word}} with an accent span
  const parts = String(s).split(/(\{\{[^}]+\}\})/g);
  return parts.map((p, i) => {
    const m = p.match(/^\{\{(.+)\}\}$/);
    return m ? <span key={i} className={accentClass}>{m[1]}</span> : <React.Fragment key={i}>{p}</React.Fragment>;
  });
}

function Hero({ data, motion = true }) {
  const h = data.hero;
  return (
    <header className="hero wrap" id="hero">
      <div className="hero-text">
        <div className="hero-eyebrow eyebrow reveal" style={rv(0)}>{h.eyebrow}</div>
        <h1>
          <span className="reveal" style={{ ...rv(1), display: "block" }}>{fmt(h.line1, "accent-word")}</span>
          <span className="reveal" style={{ ...rv(2), display: "block" }}>{fmt(h.line2, "accent-word")}</span>
        </h1>
        <p className="hero-statement reveal" style={rv(3)} dangerouslySetInnerHTML={{ __html: h.statement }} />
        <div className="hero-meta reveal" style={rv(4)}>
          {h.meta.map((m, i) => (
            <dl key={i}><dt>{m.dt}</dt><dd>{m.dd}</dd></dl>
          ))}
        </div>
        <div className="hero-actions reveal" style={rv(5)}>
          <a href="#work" className="btn btn-primary">View work <Icon.down className="arr" style={{ width: 15, height: 15 }} /></a>
          <a href={`mailto:${h.email}`} className="btn btn-ghost">{h.email}</a>
        </div>
      </div>
      <div className="hero-portrait-wrap frame reveal" style={rv(3)} data-tilt="6">
        <HeroViz motion={motion} />
        <span className="hero-viz-cap">fig.01 · high-dimensional manifold</span>
      </div>
      <div className="hero-orb a" aria-hidden="true"></div>
      <div className="hero-orb b" aria-hidden="true"></div>
      <div className="hero-orb c" aria-hidden="true"></div>
      <div className="scroll-hint"><span className="line" />Scroll</div>
    </header>
  );
}

/* ---- Capabilities / "What I do" ---------------------------------------- */
function Capabilities({ data }) {
  return (
    <section className="section wrap" id="what">
      <div className="sec-head reveal">
        <span className="sec-index">00</span>
        <h2 className="sec-title">What I do</h2>
      </div>
      <div className="cap-grid">
        {data.capabilities.map((c, i) => (
          <article className="cap reveal" style={rv(i)} key={c.k} data-tilt="7">
            <div className="cap-k">{c.k}</div>
            <h3 className="cap-title">{c.title}</h3>
            <div className="cap-tag">{c.tag}</div>
            <p className="cap-body">{c.body}</p>
            <div className="cap-tools">
              {c.tools.map((t) => <span key={t} className="tag">{t}</span>)}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

/* ---- Work --------------------------------------------------------------- */
function Work({ data, onOpen }) {
  return (
    <section className="section wrap" id="work">
      <div className="sec-head reveal">
        <span className="sec-index">01</span>
        <h2 className="sec-title">Selected work</h2>
      </div>
      <div className="proj-list">
        {data.projects.map((p, i) => (
          <div key={p.id} className="proj reveal" style={rv(i)} onClick={() => onOpen(p)}
               role="button" tabIndex={0}
               onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onOpen(p); } }}>
            <div className="proj-idx">{String(i + 1).padStart(2, "0")}</div>
            <div className="proj-main">
              <h3 className="proj-title">{p.title}</h3>
              <p className="proj-sum">{p.summary}</p>
              <div className="proj-tags">
                {p.tags.map((t) => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
            <div className="proj-side">
              <span className="proj-year">{p.year}</span>
              <span className="proj-arrow"><Icon.arrow style={{ width: 18, height: 18 }} /></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---- About -------------------------------------------------------------- */
function About({ data }) {
  const a = data.about;
  return (
    <section className="section wrap" id="about">
      <div className="sec-head reveal">
        <span className="sec-index">02</span>
        <h2 className="sec-title">About</h2>
      </div>
      <div className="about-grid">
        <div className="about-body reveal">
          <p className="lead">{a.lead}</p>
          {a.body.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
        </div>
        <div className="reveal" style={rv(1)}>
          <div className="about-portrait frame" data-tilt="5">
            {a.portrait ? (
              <img className="about-portrait-img" src={a.portrait} alt={data.name} loading="lazy" />
            ) : (
              <image-slot id="about-portrait" className="about-portrait-slot" shape="rounded" radius="12"
                placeholder={a.portrait_ph}></image-slot>
            )}
          </div>
          <dl className="about-facts">
            {a.facts.map((f, i) => (
              <div className="fact" key={i}><dt>{f.dt}</dt><dd>{f.dd}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* ---- CV ----------------------------------------------------------------- */
function CV({ data }) {
  const c = data.cv;
  return (
    <section className="section wrap" id="cv">
      <div className="sec-head reveal">
        <span className="sec-index">03</span>
        <h2 className="sec-title">Curriculum vitae</h2>
      </div>
      <div className="cv-band reveal">
        <div>
          <h3>The full picture, on two pages.</h3>
          <p>{c.blurb}</p>
        </div>
        <a href={c.file} className="btn btn-primary" download>
          Download CV <Icon.down className="arr" style={{ width: 15, height: 15 }} />
        </a>
      </div>
      <div className="timeline">
        {c.timeline.map((t, i) => (
          <div className="tl-row reveal" style={rv(i)} key={i}>
            <div className="tl-when">{t.when}</div>
            <div className="tl-what"><h4>{t.h}</h4>{t.org && <div className="tl-org">{t.org}</div>}<p>{t.p}</p></div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---- Contact + footer --------------------------------------------------- */
function Contact({ data }) {
  const c = data.contact;
  return (
    <section className="section wrap contact" id="contact">
      <div className="eyebrow reveal">{c.pre}</div>
      <h2 className="reveal" style={rv(1)}>{c.headline}</h2>
      <div className="reveal" style={rv(2)}>
        <a className="contact-mail" href={`mailto:${c.email}`}>{c.email}</a>
      </div>
      <div className="socials reveal" style={rv(3)}>
        {c.socials.map((s) => {
          const I = Icon[s.icon];
          return (
            <a key={s.label} className="social" href={s.href} target="_blank" rel="noreferrer">
              {I && <I />}{s.label}
            </a>
          );
        })}
      </div>
    </section>
  );
}

function Footer({ data }) {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} {data.name}</span>
      <span>Built with restraint · {data.monogram}</span>
    </footer>
  );
}

/* ---- Case study overlay ------------------------------------------------- */
function CaseStudy({ project, onClose }) {
  const [open, setOpen] = useState(false);
  const closeRef = useRef(null);
  useEffect(() => {
    const r = setTimeout(() => setOpen(true), 20);
    document.body.style.overflow = "hidden";
    const onKey = (e) => { if (e.key === "Escape") handleClose(); };
    window.addEventListener("keydown", onKey);
    return () => { clearTimeout(r); window.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
    // eslint-disable-next-line
  }, []);
  const handleClose = useCallback(() => {
    setOpen(false);
    setTimeout(onClose, 480);
  }, [onClose]);
  if (!project) return null;
  return (
    <>
      <div className="cs-backdrop" data-open={open} onClick={handleClose} />
      <aside className="cs-panel" data-open={open} aria-modal="true" role="dialog">
        <div className="cs-inner">
          <button className="cs-close" ref={closeRef} onClick={handleClose} aria-label="Close"><Icon.close /></button>
          <div className="cs-eyebrow eyebrow">{project.kind}</div>
          <h2 className="cs-title">{project.title}</h2>
          <div className="cs-meta">
            <span><b>Year</b>{project.year}</span>
            <span><b>Stack</b>{project.stack}</span>
          </div>
          {project.hero_ph && <Placeholder className="cs-hero-ph" sub="screenshot" label={project.hero_ph} />}
          {project.blocks.map((b, i) => (
            <div className="cs-block" key={i}>
              <h4>{b.h}</h4>
              {b.p.map((para, j) => <p key={j} dangerouslySetInnerHTML={{ __html: para }} />)}
              {b.shots && (
                <div className="cs-shots">
                  {b.shots.map((s, k) => <Placeholder key={k} sub="screenshot" label={s} />)}
                </div>
              )}
            </div>
          ))}
          <div className="cs-links">
            {project.links.map((l) => (
              <a key={l.label} href={l.href} className="btn btn-ghost"
                 target={l.external ? "_blank" : undefined} rel={l.external ? "noreferrer" : undefined}>
                {l.label} {l.external && <Icon.arrow style={{ width: 14, height: 14 }} />}
              </a>
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}

Object.assign(window, {
  Icon, useReveal, Placeholder, Nav, Hero, Capabilities, Work, About, CV, Contact, Footer, CaseStudy,
});

/* app.jsx — assembles the page + Tweaks panel, drives theme/vibe/accent. */
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "vibe": "aurora",
  "theme": "dark",
  "accent": "indigo",
  "motion": true,
  "depth": true
}/*EDITMODE-END*/;

const ACCENTS = {
  indigo: { h: 275, c: 0.155 },
  green:  { h: 158, c: 0.130 },
  amber:  { h: 70,  c: 0.135 },
  none:   { h: 275, c: 0.0 },
};

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const [activeProject, setActiveProject] = React.useState(null);

  // Apply theme + vibe + accent to <html>; motion class to <body>.
  React.useEffect(() => {
    const r = document.documentElement;
    r.setAttribute("data-theme", t.theme);
    r.setAttribute("data-vibe", t.vibe);
    const a = ACCENTS[t.accent] || ACCENTS.indigo;
    r.style.setProperty("--acc-h", a.h);
    r.style.setProperty("--acc-c", a.c);
    document.body.classList.toggle("no-motion", !t.motion);
    document.body.classList.toggle("no-depth", !(t.motion && t.depth));
    r.style.setProperty("--reveal-y", t.motion ? "18px" : "0px");
  }, [t.theme, t.vibe, t.accent, t.motion, t.depth]);

  // reveal-on-scroll observer (handles first-paint in-view reveal internally)
  useReveal();
  // pointer-driven 3D tilt + parallax depth
  useDepthScene(t.motion && t.depth);

  const data = window.PORTFOLIO;
  const toggleTheme = () => setTweak("theme", t.theme === "dark" ? "light" : "dark");

  return (
    <>
      <Nav data={data} theme={t.theme} onToggleTheme={toggleTheme} />
      <main>
        <Hero data={data} motion={t.motion} />
        <Capabilities data={data} />
        <Work data={data} onOpen={setActiveProject} />
        <About data={data} />
        <CV data={data} />
        <Contact data={data} />
      </main>
      <Footer data={data} />

      {activeProject && (
        <CaseStudy project={activeProject} onClose={() => setActiveProject(null)} />
      )}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Direction" />
        <TweakRadio label="Vibe" value={t.vibe}
          options={[{ value: "aurora", label: "Aurora" }, { value: "editorial", label: "Editorial" }, { value: "signal", label: "Signal" }]}
          onChange={(v) => setTweak("vibe", v)} />
        <TweakRadio label="Theme" value={t.theme}
          options={[{ value: "light", label: "Light" }, { value: "dark", label: "Dark" }]}
          onChange={(v) => setTweak("theme", v)} />
        <TweakSection label="Accent" />
        <TweakRadio label="Color" value={t.accent}
          options={[
            { value: "indigo", label: "Indigo" },
            { value: "green", label: "Green" },
            { value: "amber", label: "Amber" },
            { value: "none", label: "None" },
          ]}
          onChange={(v) => setTweak("accent", v)} />
        <TweakSection label="Motion" />
        <TweakToggle label="Scroll & hover animation" value={t.motion}
          onChange={(v) => setTweak("motion", v)} />
        <TweakToggle label="3D depth & parallax" value={t.depth}
          onChange={(v) => setTweak("depth", v)} />
      </TweaksPanel>
    </>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);

/* Content for the portfolio. Real data from Daniel's CV.
   Edit freely. Project case studies use honest problem, approach, result framing. */
window.PORTFOLIO = {
  name: "Daniel García Bruña",
  monogram: "DGB",
  role: "Econometrics · Applied mathematics",

  hero: {
    eyebrow: "Econometrics & machine learning",
    line1: "Quantitative models,",
    line2: "built for {{research}}.",
    statement:
      "I'm an econometrician and applied mathematician building " +
      "<strong>quantitative models and machine-learning systems</strong> for real problems. I'm heading to " +
      "TU Delft for an MSc in <strong>applied mathematics and data science</strong>.",
    meta: [
      { dt: "Now", dd: "Quant Analyst Intern · ASML" },
      { dt: "Next", dd: "MSc Applied Math · TU Delft" },
      { dt: "Focus", dd: "Forecasting · ML research · Systems" },
    ],
    email: "garciabrunadaniel@gmail.com",
    portrait_ph: "Drop a photo or 3D render",
  },

  /* "What I do": three honest pillars */
  capabilities: [
    {
      k: "01",
      title: "Quantitative Modeling",
      tag: "Econometrics & operations research",
      body:
        "Stochastic decision models, forecasting pipelines, and optimization under uncertainty; currently building cost-benefit decision engines at ASML.",
      tools: ["Python", "R", "SQL"],
    },
    {
      k: "02",
      title: "Machine Learning",
      tag: "Causal ML & deep learning",
      body:
        "From Double Machine Learning for causal inference to hybrid neural models for forecasting, with a stubborn insistence on honest, significance-tested evaluation.",
      tools: ["PyTorch", "scikit-learn", "Double ML"],
    },
    {
      k: "03",
      title: "Research-oriented applied math",
      tag: "The next chapter",
      body:
        "Heading to TU Delft for a pre-master and MSc in Applied Mathematics. Focus on the mathematical foundations of machine learning, systems design, and research infrastructure.",
      tools: ["Analysis", "Probability", "PDEs"],
    },
  ],

  projects: [
    {
      id: "hybrid-quantum-ml",
      title: "Hybrid Quantum-Classical ML Platform",
      year: "2026",
      kind: "MLOps · Quantum ML",
      summary:
        "Production-grade MLOps platform for training, serving, and rigorously benchmarking classical and quantum ML models behind a unified interface.",
      tags: ["MLOps", "Quantum ML", "PyTorch", "Ray", "MLflow", "FastAPI"],
      stack: "Python · PennyLane · Qiskit · PyTorch · scikit-learn · MLflow · Ray · FastAPI · Docker · Streamlit · GitHub Actions",
      links: [{ label: "Repository", href: "https://github.com/d-bruna/hybrid-quantum-ml-platform", external: true }],
      blocks: [
        {
          h: "Problem",
          p: [
            "Quantum ML is heavily hyped but rarely benchmarked honestly against strong classical baselines, and most demos are notebooks, not systems. I wanted to build real ML infrastructure that could compare the two rigorously and run in production.",
          ],
        },
        {
          h: "What I built",
          p: [
            "An end-to-end platform with a unified BaseModel interface making classical and quantum models fully interchangeable. Everything is config-driven and reproducible with experiments tracked in MLflow. Distributed quantum-kernel computation with Ray handles the kernel matrix as an embarrassingly-parallel workload with caching and fault tolerance. An automated benchmarking core runs k-fold cross-validation with statistical significance testing and quantum-noise sweeps. Containerized FastAPI serves models with monitoring, and real quantum hardware execution on IBM Quantum runs with automatic simulator fallback. Hardened with a full test suite, type checking, and CI.",
          ],
        },
        {
          h: "What I learned",
          p: [
            "The deepest lesson was architectural. A single clean interface abstraction made every later layer (tracking, benchmarking, serving, even the hardware swap) generic. The device-agnostic design from day one meant adding real hardware required no model rewrites.",
          ],
        },
        {
          h: "Honest result",
          p: [
            "Rigorous, statistically-controlled benchmarking showed classical models still outperform quantum at this scale. That's the expected outcome, and exactly why building honest comparison infrastructure rather than a cherry-picked demo was the whole point.",
            "<span class='muted'>Architecture and benchmarking infrastructure first. Quantum advantage at this scale remains a research frontier.</span>",
          ],
        },
      ],
    },
    {
      id: "dml-orthogonality",
      title: "When Does Orthogonality Fail to Protect?",
      year: "2026",
      kind: "Research · Causal inference",
      summary:
        "A Double Machine Learning study showing that Neyman orthogonality is a finite insurance mechanism, not an unconditional guarantee; it also pins down exactly when Ridge beats Lasso as a nuisance estimator.",
      tags: ["Double ML", "Causal inference", "Python", "Monte Carlo"],
      stack: "Python · scikit-learn · LaTeX",
      links: [{ label: "Repository & paper", href: "https://github.com/d-bruna/orthogonality-dml", external: true }],
      blocks: [
        {
          h: "The question",
          p: [
            "Double Machine Learning leans on Neyman's orthogonality condition to shield causal estimates from first-stage ML error. We asked whether that protection actually holds, or quietly fails, in the dense, weak-signal regime that characterises most economic data.",
          ],
        },
        {
          h: "What we did",
          p: [
            "A 648-cell Monte Carlo study (≈63 hours of compute) plus FRED-MD and Barro-Lee semi-synthetic experiments, comparing Ridge and Lasso as nuisance estimators across signal strength, sparsity, dimensionality, sample size, and correlation.",
          ],
        },
        {
          h: "The finding",
          p: [
            "Under dense weak signals, Lasso-based DML confidence-interval coverage collapses to <strong>35%</strong> while Ridge holds at <strong>69%</strong>; more data actually <em>widens</em> the gap. The culprit: Lasso's thresholding discards genuine-but-weak coefficients, blowing past the orthogonality budget. We propose a one-line diagnostic, comparing out-of-fold R² from both learners, to flag the risk before trusting an estimate.",
            "<span class='muted'>Joint work with R. Gosselaar, J. Hu & E. Moyson · Seminar in Machine Learning, Erasmus School of Economics.</span>",
          ],
        },
      ],
    },
    {
      id: "ipo",
      title: "Predicting IPO Performance Across Horizons",
      year: "2025",
      kind: "Machine learning · Finance",
      summary:
        "Four ML classifiers on 881 IPOs (18 features) predicting whether a listing beats the S&P 500, and how the attributes that matter flip almost entirely between day one and year one.",
      tags: ["Python", "scikit-learn", "Gradient Boosting", "Random Forest", "SMOTE"],
      stack: "Python · scikit-learn · 10-fold CV",
      links: [{ label: "Repository", href: "https://github.com/d-bruna/ipo-performance-prediction", external: true }],
      blocks: [
        {
          h: "The question",
          p: [
            "Does the importance of pre-IPO attributes change across investment horizons when classifying whether an IPO under- or over-performs the S&P 500? We framed it as binary classification at two horizons, <strong>1-day</strong> and <strong>1-year</strong>, over 881 IPOs described by 18 features drawn from Bloomberg, IPOscoop, and Yahoo Finance.",
          ],
        },
        {
          h: "What we built",
          p: [
            "Four classifiers (Elastic-Net logistic regression, a decision tree, random forest, and gradient boosting) evaluated with 10-fold stratified cross-validation and nested grid-search tuning. SMOTE handled the ~75% class imbalance at the 1-day horizon; balanced class weights did the job at 1 year.",
          ],
        },
        {
          h: "The finding",
          p: [
            "Feature importance shifts dramatically across horizons. <strong>Gradient Boosting</strong> led day-one (70.3% accuracy) while <strong>Random Forest</strong> led year-one (65.4% accuracy, 0.691 ROC-AUC). One-day outcomes track offer mechanics and macro conditions; one-year outcomes emphasise institutional ownership, profitability, and sales growth.",
            "Offer Price falls from the #1 predictor at 1 day to #8 at 1 year, while Profit Margin climbs from #6 to #2. Institutional ownership is the <em>only</em> feature that stays important across both horizons.",
            "<span class='muted'>Joint work with C. Pearce, L. Stomps & J. Hu · Erasmus University Rotterdam.</span>",
          ],
        },
      ],
    },
    {
      id: "oj-forecasting",
      title: "Multi-Step Demand Forecasting",
      year: "2025",
      kind: "Forecasting · Econometrics",
      summary:
        "An end-to-end pipeline forecasting retail demand across many products and horizons, built to stay stable in sparse, correlated feature spaces.",
      tags: ["scikit-learn", "pandas", "Elastic net", "Time series"],
      stack: "Python · scikit-learn · pandas",
      links: [{ label: "Repository", href: "https://github.com/d-bruna/orange-juice-multistep-forecasting", external: true }],
      blocks: [
        {
          h: "The problem",
          p: [
            "Forecasting many correlated products across multiple horizons is where naive models overfit and quietly fall apart out-of-sample.",
          ],
        },
        {
          h: "What I built",
          p: [
            "A pipeline with automated ingestion and preprocessing, features from time-series decomposition, structured lag hierarchies, and calendar effects; regularized linear and elastic-net models kept overfitting in check.",
          ],
        },
        {
          h: "The honest result",
          p: [
            "Evaluated with rolling-origin cross-validation and error decomposition, prioritising forecast stability, coefficient sparsity, and robust out-of-sample generalisation over a flashy in-sample fit.",
          ],
        },
      ],
    },
    {
      id: "trading",
      title: "Algorithmic Trading Competitions",
      year: "2025",
      kind: "Competition · Strategy",
      summary:
        "Two competitive arenas: a top-three hackathon market-making strategy, and a 4th-in-NL finish (103rd of 5,000 globally) in the IMC Prosperity trading challenge.",
      tags: ["Market making", "Arbitrage", "Mean reversion"],
      stack: "Python · live strategy",
      links: [{ label: "LinkedIn", href: "https://www.linkedin.com/in/danielgarciabruna/", external: true }],
      blocks: [
        {
          h: "Optiver Hackathon · top three",
          p: [
            "Placed top-three at a university hackathon by developing a market-making strategy for a single product traded across two correlated markets.",
          ],
        },
        {
          h: "IMC Prosperity Challenge",
          p: [
            "Over a three-week simulated environment I built and tested strategies in market making, option mispricing, arbitrage, and mean reversion.",
            "<span class='muted'>Ranked 4th in the Netherlands and 103rd globally out of 5,000 participants before withdrawing for overlapping exams.</span>",
          ],
        },
      ],
    },
  ],

  about: {
    lead:
      "I started in econometrics, learning to ask whether a relationship is real before trusting it, and I'm following the mathematics until it turns into something deeper.",
    body: [
      "I'm finishing a BSc in Econometrics & Operations Research at Erasmus (with a CS minor) and a BSc in International Business Administration at RSM, and I'm about to start a pre-master and MSc in Applied Mathematics at TU Delft, aimed at the mathematics of data science and quantum technologies.",
      "<span class='muted'>Right now I'm a Quantitative Analyst Intern at ASML. I care about work that is reproducible, honestly evaluated, and clearly explained; a negative result you can trust beats a positive one you can't.</span>",
    ],
    portrait_ph: "Drop a portrait",
    portrait: "daniel.jpg",
    facts: [
      { dt: "From", dd: "Spain 🇪🇸 · based in NL" },
      { dt: "Now", dd: "Quant Analyst Intern, ASML" },
      { dt: "Next", dd: "Applied Math MSc, TU Delft" },
      { dt: "Tools", dd: "Python · R · Java · SQL" },
      { dt: "Languages", dd: "ES (native) · EN · DE" },
    ],
  },

  cv: {
    blurb:
      "Education, experience, and projects on one page: econometrics, applied math, and quantitative ML.",
    file: "Daniel-Garcia-Bruna-CV.pdf",
    timeline: [
      { when: "2026–2027", h: "Pre-Master, Applied Mathematics", org: "TU Delft", p: "Real analysis, PDEs, measure theory, probability; preparation for the MSc Applied Mathematics." },
      { when: "2026", h: "Quantitative Analyst Intern", org: "ASML", p: "Stochastic decision models and cost-benefit frameworks for workforce-training ROI under uncertainty; a modular Python decision engine." },
      { when: "2023–2026", h: "BSc Econometrics & Operations Research", org: "Erasmus University Rotterdam · Upper 2:1", p: "Optimization, stochastic processes, statistics, algorithms, data mining. Minor in Computer Science." },
      { when: "2022–2025", h: "BSc International Business Administration", org: "Rotterdam School of Management · First Class", p: "A business foundation alongside the quantitative track." },
    ],
  },

  contact: {
    pre: "Open to 2026/27 roles & collaborations",
    headline: "Let's talk.",
    email: "garciabrunadaniel@gmail.com",
    phone: "+34 618 153 131",
    socials: [
      { label: "GitHub", href: "https://github.com/d-bruna", icon: "github" },
      { label: "LinkedIn", href: "https://www.linkedin.com/in/danielgarciabruna/", icon: "linkedin" },
      { label: "Email", href: "mailto:garciabrunadaniel@gmail.com", icon: "mail" },
    ],
  },
};

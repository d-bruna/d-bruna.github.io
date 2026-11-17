# d-bruna.github.io

Personal site of Daniel García Bruña. Plain static HTML, CSS and JavaScript: no build step, no framework, no tracking.

## Layout
- `index.html`: all copy
- `assets/css/site.css`: styles (research-terminal direction; amber is the only accent)
- `assets/js/site.js`: scroll-driven figures and the hero terminal
- `assets/data/ipo.json`: day-one and one-year excess returns for the 881 IPOs (from `ipo-performance-prediction`)
- `assets/fonts/`: Archivo, JetBrains Mono, Source Serif 4 (SIL OFL, licences included)
- `Daniel-Garcia-Bruna-CV.pdf`

## Figures
Figures 2, 4 and 6 use real project results (IPO sample, DML coverage from the paper's Fig. 1, qcml benchmark). Figures 0, 1, 3, 5 and 7 are schematic and say so in their captions.

## Local preview
`python3 -m http.server` in this folder, then open http://localhost:8000 (the IPO figure loads its data with fetch, so opening the file directly will not show it).

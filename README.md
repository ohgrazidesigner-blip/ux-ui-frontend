# Front-End Portfolio — Graziele Costa

A curated front-end portfolio of three projects combining **UX/UI design decisions with implemented, responsive interfaces**.

**[Explore the live showcase](https://ohgrazidesigner-blip.github.io/ux-ui-frontend/)** · [Full UX/UI portfolio](https://portfolio-grazi.vercel.app/)

## Selected work

| Project | Scope | Front-end stack | Live demo | Source | Design reference |
| --- | --- | --- | --- | --- | --- |
| **Cultura Inglesa Salvador** | Professional UX/UI work (2018–2019); homepage rebuilt in 2026 | HTML, CSS, JavaScript, Leaflet | [Open demo](https://ohgrazidesigner-blip.github.io/ux-ui-frontend/cultura-inglesa/) | [Code](./cultura-inglesa/) | [Figma](https://www.figma.com/design/90d1dR1gDk44utANiUe5eR/Cultura-Inglesa-2026) |
| **Secret Açaí** | Sample sales, inventory and customer operations | React, Vite, CSS, localStorage | [Open demo](https://ohgrazidesigner-blip.github.io/ux-ui-frontend/secret-acai/) | [Code](./secret-acai/) | [Figma](https://www.figma.com/design/OmJYOxXm1vFodkfZBXwDd3?node-id=116-2) |
| **LedgerFlow** | Sample accounting operations, reconciliation and closing workflows | React, Vite, CSS | [Open demo](https://ohgrazidesigner-blip.github.io/ux-ui-frontend/ledgerflow/) | [Code](./ledgerflow/) | [Figma](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=379-266) |

Each project has its own detailed README. The homepage uses **six real screenshots of these front-end implementations**, captured at 1440 × 900 and 390 × 844 with Chromium, not mockups. Their capture provenance is stored in `showcase/assets/capture-provenance.json`.

## Design-to-code practice

- Respect the source design's visual language, content and information hierarchy.
- Test mobile, tablet and desktop layouts, keyboard navigation and accessible semantics.
- Distinguish working front-end interactions from illustrations, static Figma KPI values, and backend functionality that **has not** been implemented.

The Cultura Inglesa version is an **independent reconstruction**, not an official institutional website. The Secret Açaí and LedgerFlow systems are **portfolio demos** based on illustrative Figma data. They are not production commercial or accounting systems.

## Repository structure

```
showcase/           Recruiter-facing portfolio homepage
cultura-inglesa/    HTML/CSS/JavaScript educational website
secret-acai/        React/Vite sales and operations interface
ledgerflow/         React/Vite accounting operations interface
.github/workflows/  Build, browser-audit and GitHub Pages automation
```

## Local development

The showcase is plain HTML, CSS and JavaScript. It can be served from `showcase/` using any local HTTP server. Project demo links on the showcase expect the deployed GitHub Pages root; running the showcase from its folder won't run the other applications.

```bash
# From the repository root:
python3 -m http.server 8080 --directory showcase

# Separately, from each React project directory:
npm install
npm run dev
npm run build
```

GitHub Actions builds the two React applications, copies Cultura Inglesa, and deploys the three demos **alongside** the homepage. The asset-capture workflow regenerates screenshot files from the actual running apps in a separate review branch.

## Limits and credits

All example values and names used inside the Secret Açaí and LedgerFlow interfaces are illustrative portfolio design data. No real transaction, business intelligence feed, bank account, fiscal service or server-side document handling is connected. The landing page and READMEs document what each project actually implements.

Developed and designed by Graziele Costa.

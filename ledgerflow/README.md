# LedgerFlow — Accounting Operations Platform

**Product design study (2026) · Responsive React front-end implementation (2026)**

LedgerFlow explores the interface needs of a B2B accounting operations platform: visibility across companies, traceability of decisions and careful review of high-impact workflows. This repository implements selected Figma screens as a browsable, responsive **front-end demonstration**. It does **not** process real accounting or fiscal data.

**[Live demo](https://ohgrazidesigner-blip.github.io/ux-ui-frontend/ledgerflow/)** · **[Figma case study and evidence](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=379-266)** · [Desktop design](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=287-10) · [Mobile design](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=287-11)

[![Actual LedgerFlow React accounting dashboard captured in Chromium](../showcase/assets/ledgerflow-desktop.jpg)](https://ohgrazidesigner-blip.github.io/ux-ui-frontend/ledgerflow/)

*Real implementation capture, not a Figma mockup. [View mobile capture](../showcase/assets/ledgerflow-mobile.jpg).*

## Product problem and my contribution

The design study examines how accounting teams can find blockers, inspect the source of figures and review sensitive actions without losing context. The source Figma provides the interface and illustrative **July 2026** records. I implemented responsive navigation, reusable data displays, modal interactions and selected demonstration workflows in React, preserving the Portuguese-language design instead of replacing it with a generic dashboard.

The original design research refers to **eight participants in two rounds using static Figma stimuli**. Those activities should not be presented as production evidence, observed financial outcomes or results measured in this front-end. The front-end has **no** analytics service collecting such outcomes.

## Implemented sections

| Area | What can be explored |
| --- | --- |
| **Overview and companies** | Sample risk/status metrics, portfolio table, search/filter controls and company detail dialog |
| **Imports** | Illustrative batch progress (including a 288/300 sample), exception list, review and mapping views |
| **Reconciliation** | Example suggestions, confidence indicators, evidence review and CNPJ mismatch safeguards |
| **Fiscal and obligations** | Retention examples, review priorities, dependencies and blocked tasks |
| **Pending items** | Sample operational queue, search, filters and navigation |
| **Communications** | Illustrative conversation threads and locally simulated replies |
| **Automation** | Rule form, sample matching preview and guarded demonstration confirmation |
| **Reports** | DRE, balance views, composition, journal-entry detail and references to supporting documents |
| **Accounting closing** | Checklist, example missing evidence and explicit simulated close/reopen confirmation |
| **Settings and audit** | Example configuration tabs, permissions information and audit records |

Desktop and mobile do not share a single reduced table layout. The mobile implementation follows dedicated Figma designs for **M02 Overview, M03 Companies, M05 Imports, M08 Fiscal, M10 Reports, M14 Pending Items and M17 More**. The More menu exposes eight sections, and selected mobile summary cards open detailed module flows.

## What actually happens in the demo

- Module navigation, sample search/filter views, company details and selected local controls are interactive.
- A **locally selected file** is required before the support-document demonstration can proceed. The file is **not uploaded** or saved on a server.
- The accounting closing flow asks for confirmation before showing a **simulated** closed state. A re-opening request asks for a justification. These changes affect local React state only and **reset on refresh**.
- Reports use illustrative values and browser print controls. No genuine financial or fiscal report is generated from an accounting database.
- The interface includes dependencies and review cues, but there is **no real approval engine**, reconciliation service, transaction posting, audit persistence or external communication.

All company names, identifiers, balances, risks and deadlines are **sample design data**. The UI does not represent an operational accounting platform.

## Stack and code organization

| Area | Implementation |
| --- | --- |
| UI | React 19, React DOM, JavaScript and semantic HTML where implemented |
| Build | Vite 6 and React plugin, static assets |
| Styles | CSS, responsive layouts and dedicated mobile screens |
| State | React hooks and component-local demonstration state |
| Keyboard interaction | Accessible dialog management, Escape handlers, focus restoration and mobile navigation |
| QA | GitHub Actions, Playwright and axe-core checks |
| Hosting | Static GitHub Pages deployment under a relative subpath |

```text
ledgerflow/
├── index.html
├── package.json
├── vite.config.js
├── src/
│   ├── main.jsx
│   ├── App.jsx             Main shell, company list and detail dialog
│   ├── Modules.jsx         Accounting modules and sample workflows
│   ├── GuardedDialog.jsx   Keyboard-accessible demo confirmations
│   ├── MobileViews.jsx     Overview and More navigation
│   ├── MobileModules.jsx   Figma-derived mobile summary cards
│   ├── styles.css
│   ├── modules.css
│   ├── mobile.css
│   └── mobile-modules.css
└── README.md
```

## Design and implementation decisions

**Traceability over decorative numbers.** Report composition and journal views retain the source references drawn in Figma. These references are visual examples, not links to a real database.

**Keep desktop depth and mobile prioritization.** Desktop supports dense comparisons; mobile uses dedicated priorities, compact status cards and a More directory to keep the most relevant tasks readable.

**Require explicit review for risky actions.** Confirmations around support documents and closing are interaction models, not claims of accounting execution, authorization or actual audit history.

**Preserve the original sample scope.** Six example company records are present in the code, while the design references a larger sixteen-company portfolio. Displayed pagination or totals should **not** be interpreted as additional loaded data. The `Ctrl + T` hint shown in the design is not implemented as a browser shortcut because browsers reserve that combination for opening a tab.

## Accessibility and test coverage

The front-end uses semantic table headings, focus-contained dialogs and a focus-managed tablet navigation drawer. Mobile screens have their own layouts rather than relying on desktop table overflow.

The [LedgerFlow audit workflow](../.github/workflows/validate-ledgerflow.yml) builds **both** React projects and runs [Playwright browser validation](../.github/scripts/ledgerflow-browser.cjs) across 390, 768, 1024 and 1536 px, including navigation, sample document selection, close/reopen states and automated axe WCAG A/AA scans. The successful November 2026 run found no automated violations in the tested desktop modules and mobile screens. Manual assistive-technology checks remain necessary; this is **not** a WCAG certification.

## Run locally

From the repository root:

```bash
cd ledgerflow
npm install
npm run dev
```

Build and preview:

```bash
npm run build
npm run preview
```

Vite uses `base: "./"` so the generated assets resolve under the GitHub Pages project directory.

## Limitations

There is **no backend, authentication, cloud storage, real bank connection, accounting calculation, fiscal filing, permissions service or production audit trail**. “Switch company” opens the sample company list rather than changing a real tenant. Screen messages, document selection and closing controls are demonstrations within the browser.

---

**Scope:** UX/UI-to-code portfolio study featuring illustrative accounting data and non-production interactions.

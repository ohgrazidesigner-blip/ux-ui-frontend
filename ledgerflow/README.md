# LedgerFlow — Accounting Operations (Front-End)
Product Design Study (2026) | Front-End reconstruction (2026)

This folder starts a faithful, responsive front-end implementation of the LedgerFlow Figma study, independently designed for multi-company accounting workflows. The initial scope is deliberately limited to the dashboard and company portfolio. The interface uses the sample content, labels, layout and visual theme from the original product screens.

## References
- [Figma — recruiter overview](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=379-266)
- [Figma — desktop screens](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=287-10)
- [Figma — mobile screens](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=287-11)

## Implemented in this first commit
- Original LedgerFlow vector mark, Portuguese navigation and active-company sidebar
- Dashboard with original Jul/2026 KPI values, company rows, risk labels and alerts
- Responsive layout with mobile drawer and a horizontally scrollable operations table
- Working company search, "all/mine" scope filter and company detail panel
- Accessibility: semantic table, labels, descriptive button names, keyboard focus and Escape to dismiss panels

## Not implemented
Other sections shown in the sidebar remain clearly labeled preview-only destinations. Their complete UI flows, role permissions, authentication, backend, import/reconciliation pipelines, automations and financial calculations are not implemented. Design test screens were static; no production or real-world financial impact is claimed. All example data is illustrative and no real accounting data is processed.

## Stack and local development
React 19 + Vite 6 + CSS. From the ledgerflow folder:
1. npm install
2. npm run dev
3. npm run build to prepare a production build

The Vite base is relative ("./") to support hosting under a nested GitHub Pages path. This feature branch is not yet a published demo.

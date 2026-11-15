# LedgerFlow — Accounting Operations Platform

**Product Design Study (2026) | Responsive Front-End Reconstruction (2026)**

A React / Vite portfolio front-end based on the original LedgerFlow design. The goal is a faithful reproduction of the interface hierarchy, Portuguese labels, realistic workflow states, sample data, and risk-aware interactions documented in Figma.

[Explore the Figma case](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=379-266) · [Desktop design](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=287-10) · [Mobile design](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=287-11)

## Screens included

- Overview dashboard: Jul/2026 KPIs, company risks and portfolio.
- Companies: legal entities, CNPJs, regimes, risk and contextual details.
- Imports: upload affordance, processing state, partial completion (288/300), exception handling and DE-PARA correction scope.
- AI-assisted reconciliation: three suggestions, document comparison, confidence and mandatory CNPJ conflict review.
- Fiscal: filing priorities, retention counts and dependencies.
- Obligations: ISS, EFD-Reinf, DCTFWeb, balancete, DAS and their dependencies.
- Accounting reports: report center, DRE, account composition, journal-detail and traceability.
- Closing: six checks, missing documentary support, review and illustrative blocked-period state.
- Pendências: operational queue with criticality, ownership, due dates and impact.
- Communications: illustrated messages tied to a specific pending document, with local-only reply simulation.
- Automation: recurring rules, create form, preview, invalid-match safeguard and simulated review.
- Settings and audit trail: operational policies, roles and chronological decisions.

## Constraints and research integrity

This is **not** a real production accounting application. Figures, company identities, monetary values and statuses are illustrative **Figma design data**. No financial calculation, account lookup, bank reconciliation, login, document storage, e-mail, commercial operation or authorization is performed server-side. Interactive actions in the front-end use temporary React UI state only. They reset on page refresh.

The design study was evaluated with eight participants in two rounds using static Figma stimuli. Do not interpret those test outcomes as measured production performance. The real interface stays in Brazilian Portuguese.

## Run locally

\`\`\`bash
cd ledgerflow
npm install
npm run dev
npm run build
\`\`\`

Built with React 19, Vite 6, semantic HTML and CSS Grid/Flexbox. Relative Vite base supports deployment under a repository subdirectory.

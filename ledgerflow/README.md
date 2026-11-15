# LedgerFlow — Accounting Operations Platform

**Product Design Study (2026) | Responsive Front-End Reconstruction (2026)**

A portfolio demonstration developed with **React 19, Vite 6, HTML and CSS** from an original LedgerFlow UX/UI case. The design references Brazilian Portuguese content, sample accounting situations and risk-aware workflows. This is **not** a real accounting application.

**[Live front-end demo](https://ohgrazidesigner-blip.github.io/ux-ui-frontend/ledgerflow/)** · **[Figma case and evidence](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=379-266)** · [Desktop Figma](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=287-10) · [Mobile Figma](https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=287-11)

## Interface scope

- **Overview:** fixed illustrative Jul/2026 portfolio metrics, risks and company details.
- **Companies:** sample corporate records, CNPJs, risk labels and contextual detail.
- **Imports:** simulated batch processing, 288/300 partial completion, exception review and DE-PARA scope.
- **Reconciliation:** illustrative confidence suggestions and human review safeguards for CNPJ conflicts.
- **Fiscal and obligations:** statuses, filing priorities, dependencies and review workflows.
- **Accounting reports:** DRE, journal details, composition and tracing from balances to documents.
- **Closing:** six-step checklist, missing supporting document, guarded **simulated** closing/reopening states.
- **Pending items and communications:** operational tasks and local-only message replies.
- **Automation:** recurring-rule form, preview, mismatch safeguards and review simulation.
- **Settings and audit:** illustrative governance rules, permissions and decision logs.
- **Mobile:** separate original Figma **M02 Início** (risk and priority cards) and **M17 Mais** (eight-module directory); all key modules are reachable from mobile navigation.

## What works in this front-end

Navigating modules, opening available details, reviewing sample data, changing supported filters and local React UI state, checking automated-rule previews, selecting a *local demonstration file* for the support-document flow and confirming a simulated accounting close/reopen. The file input does **not** upload or store documents on a server. The close/reopen state resets on refresh.

Responsive layouts and keyboard accessibility are verified through Playwright and axe checks in CI. Automated rule checks are not a certification of complete WCAG compliance or screen-reader usability.

## Important limitations

- **All companies, identifiers, financial figures, indicators and statuses are illustrative Figma design data**, not current financial or operational results.
- **No backend, authorization, cloud storage, database, accounting calculation, bank reconciliation or actual fiscal submission** is connected.
- UI decisions and messages live only in temporary React state; no real closing, reopening, approval, document upload or external communication occurs.
- Only six example companies are represented in the module data, although the original Figma includes a 16-company portfolio. Pagination numbers shown in the reference are **not additional loaded business records**.
- The Figma sidebar shows `Ctrl + T` as a proposed accelerator, but browsers reserve this shortcut for new tabs; this demo does not intercept it.
- “Trocar empresa” navigates to the company list. It does not switch a real accounting tenant or permissions.
- The design research involved eight participants in two rounds using static Figma stimuli. **Do not** interpret these findings as production behavior or measured operational performance.

## Run locally

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

The Vite `base: "./"` setting supports hosting under the GitHub Pages repository subdirectory.

## Implementation decisions

The production-like interface remains **in Brazilian Portuguese** to match its design source, while this README documents the work in English for international reviewers. The desktop layout retains the original visual hierarchy and branding; small-screen navigation uses dedicated Figma mobile frames instead of assuming the desktop data table is the correct mobile home screen. Front-end actions intentionally stop short of inventing actual accounting results or unsupported integrations.

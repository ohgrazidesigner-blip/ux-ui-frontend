# Secret Açaí — Sales & Operations Platform

**Product design case (2026) | Front-End reconstruction (2026)**

A responsive, interactive React implementation of the Secret Açaí Figma project. This portfolio demo reproduces the principal operating screens and uses the same interface copy, sample names, statuses, sales values, product variants and visual language shown in the design.

**Links**
- [Live front-end demo](https://ohgrazidesigner-blip.github.io/ux-ui-frontend/secret-acai/)
- [Figma — case study](https://www.figma.com/design/OmJYOxXm1vFodkfZBXwDd3?node-id=116-2)
- [Figma — screens and flows](https://www.figma.com/design/OmJYOxXm1vFodkfZBXwDd3?node-id=0-1)
- [Behance — original design case](https://www.behance.net/gallery/254661851/Secret-Acai-Sales-Operations-Platform)

## Front-end scope

- **Dashboard:** KPI cards, illustrative sales chart, inactive-customer list, lead pipeline summary and low-stock list.
- **Sales:** client selection, product size/flavour, quantities, prices, discounts, delivery options and order summary; validation, confirmation, low-stock handling and simulated successful transactions.
- **Inventory:** all eight product variants, balances, pricing, status labels, filters, stock entries, corrections and local movement history.
- **Customers:** customer table, filters, last-order dates, inactivity ranking, client registration and reactivation review.
- **Prospecting:** three-column board (Contatado, Negociando, Convertido), sample lead cards, search, origin filter, lead registration and follow-up editing.
- **Reports:** period selector, example KPIs, revenue charts, comparative metrics and client summary; print-to-PDF through the browser.

Styles and content are modeled on the 2026 design reference. Smaller viewports use a drawer and stacked cards. Buttons, filters and supported demo forms are functional. Additional screens and backend integration remain out of scope for this version.

## Important demo limitation

**This is not the real Secret Açaí production platform.** The original Figma values (including revenues, order numbers, customer names and stock levels) are **illustrative design data**, not verified live business data. New entries, stock movements, leads and simulated sales persist only in the current browser's local storage. They do not reach a server and are not shared between devices.

Login, managerial approval, WhatsApp contact numbers, PDF generation on a server, historical analytics, access-control policies and Supabase/Postgres/RLS/RPC services described in the technical design **are not connected**. The application does not claim to process real payments or commercial transactions.

## Tech stack

- React + Vite
- CSS Grid, Flexbox and CSS custom properties
- Semantic HTML, labels, keyboard focus and mobile navigation
- Browser localStorage for simulated actions

## Running locally

```bash
npm install
npm run dev
```

Production build: `npm run build`.

## Implementation notes

This code is an independent front-end reproduction of the interface. It does not reuse any private source code or claim to be the company's official production system. The project uses the Figma design as its source of truth for visible strings, proportions and components. Some required browser controls differ modestly from the static prototype for keyboard and touch usability.

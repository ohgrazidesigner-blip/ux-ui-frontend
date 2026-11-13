# Secret Açaí — Sales & Operations Platform

**Product design case (2026) | Front-End Development (2026, in progress)**

This project is the front-end reconstruction of the Secret Açaí sales and operations platform, based on the original Figma design. It is being developed as a technical companion to the UX/UI case study rather than as a production system.

**Design references**
- [Figma — full case study](https://www.figma.com/design/OmJYOxXm1vFodkfZBXwDd3?node-id=116-2)
- [Figma — product screens](https://www.figma.com/design/OmJYOxXm1vFodkfZBXwDd3?node-id=0-1)
- [Behance — product case](https://www.behance.net/gallery/254661851/Secret-Acai-Sales-Operations-Platform)

## Current scope

The first implementation covers the **Dashboard** (`01 · Dashboard` in Figma) and a responsive navigation shell. The page follows the original color palette, typography, layout proportions, summary cards, sales chart, inactive clients, leads and low-stock lists.

The month/7-day filter and mobile navigation are interactive; list actions can expand local explanatory information. The sales action points to the Figma flow until that screen is implemented. Other modules are explicitly marked as not implemented.

The displayed figures are **mock data from the design**, not business results or live operational data. No API, database connection, authentication, payment, or transaction persistence is currently implemented.

## Stack

- React 19
- Vite 6
- CSS3 (Grid, Flexbox and CSS custom properties)
- Accessible semantic HTML and keyboard focus styles

## Run locally

```bash
npm install
npm run dev
```

Run `npm run build` to generate a static production bundle. This is a local front-end prototype and does not require a Supabase project or API keys.

## Design and implementation notes

The planned architecture in Figma includes React, Supabase Auth, Postgres/RLS and RPC functions. **Only the React presentation layer has been started here**. The backend documented in the implementation spec must not be mistaken for implemented functionality.

The responsive version uses a navigation drawer with a single-column layout, consistent with the mobile behavior documented in the design system. Chart values are illustrative. A full QA pass and screen-by-screen parity review will be needed before describing this as a complete implementation.

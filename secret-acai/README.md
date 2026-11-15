# Secret Açaí — sales and operations

**React front-end based on my 2026 Product Design study**

Secret Açaí started as a set of screens for a small sales and operations workflow. I built a React version so I could test how the design behaves with forms, dialogs and changes to sample records — not just as a static prototype.

[Try the demo](https://ohgrazidesigner-blip.github.io/ux-ui-frontend/secret-acai/) · [Figma case](https://www.figma.com/design/OmJYOxXm1vFodkfZBXwDd3?node-id=116-2) · [Front-end portfolio](https://portfolio-grazi.vercel.app/frontend/)

![Secret Açaí desktop dashboard](../showcase/assets/secret-acai-desktop.jpg)

[Mobile screenshot](../showcase/assets/secret-acai-mobile.jpg)

## Inside the demo

The dashboard opens into five areas: sales, stock, customers, prospecting and reports. You can register a sample sale, adjust stock, add a customer, create a lead and move through the corresponding dialogs.

I used React state with `localStorage` for the records that change. They persist on that browser only. The historic dashboard totals and monthly charts are **fixed figures from the design**: a new test sale can change the inventory table without recalculating those KPIs. I chose not to imply that this front-end is connected to live commercial reporting.

## Technical choices

- **React 19 and Vite 6** for the application
- Separate application shell (`src/App.jsx`) and operational screens (`src/Modules.jsx`)
- CSS layouts for desktop and mobile, including a compact drawer on narrow screens
- Local browser storage for example records and movement history
- Keyboard and dialog behaviour tested with Playwright and axe

The sales confirmation shows stock impact before changing the local record. The discount step represents a business rule in the interface; it does **not** request real managerial approval.

## Run locally

```bash
cd secret-acai
npm install
npm run dev
```

For a production build, use `npm run build`; `npm run preview` serves the compiled version.

The demo has **no backend, payments, account access or shared database**. Reports use illustrative values and browser printing, not a server PDF service. All customer and company records are examples.

The [browser test workflow](../.github/workflows/validate-secret-acai.yml) exercises the sample sale, persistence, navigation and accessibility rules. For the design process and additional states, see the Figma case.

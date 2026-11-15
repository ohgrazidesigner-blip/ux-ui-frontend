# Cultura Inglesa Salvador — from design to code

**UX/UI work in 2018–2019 · Independent homepage rebuild in 2026**

I worked with Cultura Inglesa Salvador's marketing team in 2018–2019. My work included navigation, landing pages and lead-capture journeys on the existing site. In 2026 I revisited the design and rebuilt the homepage with HTML, CSS and JavaScript. I wrote the front-end again rather than copying the old website's code.

[Live homepage](https://ohgrazidesigner-blip.github.io/ux-ui-frontend/cultura-inglesa/) · [Figma case](https://www.figma.com/design/90d1dR1gDk44utANiUe5eR/Cultura-Inglesa-2026) · [Front-end portfolio](https://portfolio-grazi.vercel.app/frontend/)

![Cultura Inglesa homepage, captured in the browser](../showcase/assets/cultura-inglesa-desktop.jpg)

[Mobile screenshot](../showcase/assets/cultura-inglesa-mobile.jpg)

## What I built

The rebuilt homepage covers the main course sections, exam information, a lead form, newsletter, and the unit map. The mobile menu is keyboard-accessible, the forms validate in the browser, and Leaflet adds draggable map tiles and unit markers.

I kept the three course groups shown in the **2026 homepage Figma** — Crianças, Jovens and Adultos. The segmented campaign landing pages (including narrower audiences) and the three-step form are documented separately in the case. They aren't additional deployed pages here.

## A note on the locations

The original mockup contained addresses that didn't match public listings, so I reviewed them in November 2026:

- **Pituba:** Rua Mato Grosso, 481, listed by Cambridge English and the institution.
- **Ondina:** Rua Professor Sabino Silva, 601, listed by Cambridge English and the institution.
- **Graça:** Rua Flórida. Cambridge lists number **208**, while another historical reference lists **280**. I haven't established which number applied to the 2018–2019 project, so the demo doesn't choose one.
- **Vilas do Atlântico:** I kept **Praia de Stela, S/N** exactly as it appears in the original project. Other public historical listings use Rua Praia de Suapé, so I can't independently confirm the original address. I'm keeping the design reference, not presenting it as verified directions.

References: [Cambridge English — find a centre](https://www.cambridgeenglish.org/br/exams-and-tests/linguaskill/information-about-the-exam/onde-encontrar/), [Cultura Inglesa — units](https://www.culturainglesa.com.br/) and [historical unit listing](https://novoportal.sinal.org.br/convenios/cultura-inglesa-ingles/).

**The map is an illustration, not a directions service.** Its marker coordinates are approximate. Historical phone numbers were removed from click-to-call actions; the contact buttons now lead to the demo form. This is not an official institutional website.

## Files and tools

- `index.html` — the homepage content and accessible form markup
- `css/styles.css` — responsive layouts and visual details
- `js/main.js` — menu, form feedback, map markers and contact interactions
- `js/map-config.js` — optional map tile configuration
- Leaflet and OpenStreetMap tiles for the interactive map

No JavaScript framework or backend is used.

## Run locally

```bash
python3 -m http.server 8080 --directory cultura-inglesa
```

Then open `http://localhost:8080`. An internet connection is needed for the map tiles.

## What is a demonstration

The forms don't send or save data; they show browser-side validation and confirmation states. The testimonials are fictional examples and are labelled as such. The unit addresses are references, not verified service information. The floating WhatsApp selector opens a unit's information card; it doesn't start a chat with the school.

I use the [Cultura Inglesa browser checks](../.github/workflows/validate-cultura-inglesa.yml) for navigation, form behaviour, responsive layout and automated accessibility rules. Passing axe checks isn't a substitute for manual screen-reader testing.

The Figma case explains the earlier UX work; this repository documents the code written in 2026.

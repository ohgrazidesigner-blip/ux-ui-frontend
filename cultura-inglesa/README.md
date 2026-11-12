# Cultura Inglesa Salvador — UX/UI & Front-End

**UX/UI Design (2018–2019) | Front-End Development (2026)**

[**Figma case study**](https://www.figma.com/design/90d1dR1gDk44utANiUe5eR/Cultura-Inglesa-2026)

## About

I worked at Cultura Inglesa in Salvador, Bahia, from 2018 to 2019 as part of the Marketing team. During that time, I worked on the website's user experience, course navigation, conversion flows and landing pages for different campaigns.

In 2026, I decided to revisit the project, this time from a front-end development perspective.

I used the original visual design as a reference and rebuilt the entire home page from scratch with HTML, CSS and JavaScript. I didn't reuse the original website's code.

I also made some technical improvements, including replacing the static location map with an interactive one using Leaflet.

## My UX/UI work (2018–2019)

My work at Cultura Inglesa Salvador included:

- Improving the main banner CTA, contact options and course-card navigation.
- Designing landing pages for corporate courses, exchange programs, e-books, short courses and extracurricular activities.
- Working on the Cambridge exam conversion flow to make it easier for visitors to find information and contact the sales team.
- Creating a campaign landing page with a three-step lead form.

The website already had its own visual identity, which I worked with when making these improvements.

The original UX/UI work is documented in my [Figma case study](https://www.figma.com/design/90d1dR1gDk44utANiUe5eR/Cultura-Inglesa-2026).

## Front-End Development (2026)

For this repository, I started with an empty project and wrote the HTML, CSS and JavaScript from scratch, following the original design.

I worked on the desktop and mobile layouts, navigation, course sections, contact forms and interactions.

The forms have client-side validation and confirmation messages. I also added keyboard focus styles to make navigation easier without a mouse.

### Units and WhatsApp selector

The site lists four units: Pituba, Ondina, Graça and Vilas do Atlântico. All four appear on the map, in the unit contact cards, in the lead form and in the footer.

The floating WhatsApp selector offers three options: Pituba, Graça and Ondina. Choosing one scrolls to its contact card instead of opening a chat. Vilas do Atlântico is listed in the units section but isn't included in the floating selector.

### Location map

The original design used a static image to show the school locations. I wanted to make that part of the page more useful, so I replaced it with a Leaflet map.

It now has custom markers for the units, visible location labels, zoom controls and map navigation.

I'm using OpenStreetMap tiles by default, with an option to switch to CARTO Positron using an API key.

The landing pages and three-step form from my 2018–2019 work are not included in this repository. They can be viewed in the Figma case study.

### Accessibility

- Skip link to the main content and semantic landmarks, with `lang="pt-BR"` set on the page.
- Visible keyboard focus styles (`:focus-visible`) on interactive elements.
- Mobile menu and WhatsApp selector with `aria-expanded`, `Esc` to close, keyboard focus handling and focus restoration when closed.
- Form errors announced through `aria-live` regions, with a required consent checkbox on the lead form.
- Confirmation messages shown in `<dialog>` elements labelled with `aria-labelledby`.
- Map exposed as a labelled `region`, with keyboard-focusable markers and visible location labels. Mouse-wheel zoom is off so the page can still be scrolled normally; zoom buttons are provided instead.
- Decorative images use empty `alt` text, and smooth scrolling respects `prefers-reduced-motion`.

These features are implemented in the code, but I haven't run a formal accessibility audit.

## Built with

- HTML5
- CSS3
- Vanilla JavaScript
- Leaflet 1.9.4

No frameworks or build tools.

## Running locally

Open the folder in VS Code and run `index.html` with Live Server.

There's nothing to install. Just keep the `css`, `js` and `assets` folders in the same directory as the HTML file.

The map needs an internet connection because Leaflet and the map tiles are loaded externally. If Leaflet doesn't load, the static map image is shown instead.

### CARTO Positron (optional)

The map works with OpenStreetMap tiles by default. To use CARTO Positron instead, get an [API key here](https://carto.com/basemaps/apikey/) and add it to `js/map-config.js` under `cartoApiKey`. If the CARTO tiles fail to load, the map falls back to OpenStreetMap.

A key used in front-end code is visible to anyone inspecting the browser's network requests or page source. Restrict it to your website domains in the CARTO dashboard and keep private credentials out of the repository.

## Project notes

This is my own front-end implementation of a project I previously worked on. It isn't the official Cultura Inglesa website.

The contact and newsletter forms are demos. They validate input and display confirmation messages but don't send or save any information.

The WhatsApp selector shows the contact details for the selected unit rather than opening an unverified number.

I used fictional testimonials and illustrated portraits to complete the interface. They aren't real student reviews.

Some information, including addresses, phone numbers and location coordinates, comes from historical project references. The institutional figures refer to Cultura Inglesa across Brazil, not just Salvador. Exam information is included for context and doesn't confirm accreditation at individual units.

Those details would need to be checked before using this version as a live website.

## Project files

```text
cultura-inglesa/
├── index.html
├── css/
│   └── styles.css
├── js/
│   ├── main.js
│   └── map-config.js
├── assets/
└── README.md
```

## Design

[Figma — Cultura Inglesa Salvador](https://www.figma.com/design/90d1dR1gDk44utANiUe5eR/Cultura-Inglesa-2026)
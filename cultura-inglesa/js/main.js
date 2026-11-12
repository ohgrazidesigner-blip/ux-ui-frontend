(function () {
  'use strict';

  const body = document.body;
  const mobileMenu = document.getElementById('menu-mobile');
  const menuButton = document.querySelector('.menu-toggle');
  const menuClose = document.querySelector('.menu-close');
  const waButton = document.querySelector('.wa-float');
  const waPicker = document.getElementById('wa-picker');
  const waClose = waPicker.querySelector('.wa-picker-close');
  const unitStatus = document.getElementById('unit-status');
  let menuReturnFocus = null;
  let waReturnFocus = null;

  function focusable(container) {
    return Array.from(container.querySelectorAll('a[href], button:not([disabled]), input:not([disabled]), select:not([disabled])'));
  }

  function openMobileMenu() {
    if (!mobileMenu.hidden) return;
    closeWhatsApp(false);
    menuReturnFocus = document.activeElement;
    mobileMenu.hidden = false;
    body.classList.add('menu-open');
    menuButton.setAttribute('aria-expanded', 'true');
    menuClose.focus();
  }

  function closeMobileMenu(restoreFocus = true) {
    if (mobileMenu.hidden) return;
    mobileMenu.hidden = true;
    body.classList.remove('menu-open');
    menuButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus && menuReturnFocus) menuReturnFocus.focus();
  }

  menuButton.addEventListener('click', openMobileMenu);
  menuClose.addEventListener('click', () => closeMobileMenu());
  mobileMenu.addEventListener('click', event => {
    if (event.target.closest('a[href]')) closeMobileMenu(false);
  });

  function openWhatsApp() {
    if (!mobileMenu.hidden) closeMobileMenu(false);
    const openDialog = document.querySelector('.state-dialog[open]');
    if (openDialog) openDialog.close();
    waReturnFocus = document.activeElement;
    waPicker.hidden = false;
    waButton.setAttribute('aria-expanded', 'true');
    waPicker.querySelector('[data-unit]').focus();
  }

  function closeWhatsApp(restoreFocus = true) {
    if (waPicker.hidden) return;
    waPicker.hidden = true;
    waButton.setAttribute('aria-expanded', 'false');
    if (restoreFocus) (waReturnFocus || waButton).focus();
  }

  waButton.addEventListener('click', () => waPicker.hidden ? openWhatsApp() : closeWhatsApp());
  waClose.addEventListener('click', () => closeWhatsApp());
  document.querySelectorAll('[data-open-wa]').forEach(button => {
    button.addEventListener('click', openWhatsApp);
  });

  function selectUnit(unit) {
    const card = document.getElementById('unidade-' + unit);
    if (!card) return;
    closeWhatsApp(false);
    document.querySelectorAll('.unidade.is-selected').forEach(el => el.classList.remove('is-selected'));
    card.classList.add('is-selected');
    card.scrollIntoView({ behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    card.focus({ preventScroll: true });
    unitStatus.hidden = false;
    unitStatus.textContent = 'Unidade ' + card.querySelector('h4').textContent + ' selecionada. Os telefones exibidos são referências do projeto; confirme os canais oficiais antes de entrar em contato pelo WhatsApp.';
  }

  waPicker.querySelectorAll('[data-unit]').forEach(button => {
    button.addEventListener('click', () => selectUnit(button.dataset.unit));
  });
  document.querySelectorAll('[data-unit-info]').forEach(link => {
    link.addEventListener('click', event => {
      event.preventDefault();
      selectUnit(link.dataset.unitInfo);
    });
  });

  document.addEventListener('pointerdown', event => {
    if (!waPicker.hidden && !waPicker.contains(event.target) && !waButton.contains(event.target)) closeWhatsApp(false);
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      if (!waPicker.hidden) { closeWhatsApp(); return; }
      if (!mobileMenu.hidden) { closeMobileMenu(); return; }
    }
    if (event.key !== 'Tab') return;
    const active = !mobileMenu.hidden ? mobileMenu : !waPicker.hidden ? waPicker : null;
    if (!active) return;
    const choices = focusable(active);
    if (!choices.length) return;
    const first = choices[0];
    const last = choices[choices.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  });

  window.matchMedia('(min-width: 768px)').addEventListener('change', event => {
    if (event.matches) closeMobileMenu(false);
  });

  function setFieldError(input, message) {
    const field = input.closest('.field');
    const feedback = document.getElementById(input.getAttribute('aria-describedby'));
    if (message) {
      input.setAttribute('aria-invalid', 'true');
      if (field) field.dataset.invalid = 'true';
    } else {
      input.removeAttribute('aria-invalid');
      if (field) delete field.dataset.invalid;
    }
    if (feedback) feedback.textContent = message;
  }

  function formatPhone(value) {
    const digits = value.replace(/\D/g, '').slice(0, 11);
    if (digits.length < 3) return digits ? '(' + digits : '';
    if (digits.length < 7) return '(' + digits.slice(0, 2) + ') ' + digits.slice(2);
    if (digits.length < 11) return '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 6) + '-' + digits.slice(6);
    return '(' + digits.slice(0, 2) + ') ' + digits.slice(2, 7) + '-' + digits.slice(7);
  }

  function validPhone(value) {
    const digits = value.replace(/\D/g, '');
    return /^\d{2}(?:9\d{8}|\d{8})$/.test(digits) && Number(digits.slice(0, 2)) >= 11;
  }

  function validEmail(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value.trim());
  }

  function showDialog(dialog) {
    if (typeof dialog.showModal === 'function') dialog.showModal();
    else dialog.setAttribute('open', '');
  }

  document.querySelectorAll('.state-dialog').forEach(dialog => {
    dialog.addEventListener('click', event => {
      if (event.target === dialog || event.target.closest('[data-close]')) dialog.close();
    });
  });

  const leadForm = document.getElementById('lead-form');
  const nameField = leadForm.elements.namedItem('nome');
  const phoneField = leadForm.elements.namedItem('whatsapp');
  const unitField = leadForm.elements.namedItem('unidade');
  const consentField = leadForm.elements.namedItem('autorizacao');
  const consentError = document.getElementById('err-consent');
  consentField.addEventListener('change', () => {
    if (consentField.checked) {
      consentField.removeAttribute('aria-invalid');
      consentError.textContent = '';
    }
  });

  phoneField.addEventListener('input', () => {
    phoneField.value = formatPhone(phoneField.value);
    if (validPhone(phoneField.value)) setFieldError(phoneField, '');
  });
  nameField.addEventListener('input', () => {
    if (nameField.value.trim().length > 1) setFieldError(nameField, '');
  });
  unitField.addEventListener('change', () => {
    if (unitField.value) setFieldError(unitField, '');
  });

  leadForm.addEventListener('submit', event => {
    event.preventDefault();
    let invalid = null;
    const check = (input, message) => {
      setFieldError(input, message);
      if (message && !invalid) invalid = input;
    };
    check(nameField, nameField.value.trim().length >= 2 ? '' : 'Informe seu nome completo');
    check(phoneField, validPhone(phoneField.value) ? '' : 'Digite um número válido com DDD');
    check(unitField, unitField.value ? '' : 'Escolha uma unidade');
    consentError.textContent = consentField.checked ? '' : 'Marque a autorização para continuar';
    if (!consentField.checked) {
      consentField.setAttribute('aria-invalid', 'true');
      if (!invalid) invalid = consentField;
    } else consentField.removeAttribute('aria-invalid');
    if (invalid) { invalid.focus(); return; }
    // Preview only: no personal data is transmitted or stored.
    leadForm.reset();
    showDialog(document.getElementById('dlg-lead'));
  });

  const newsletter = document.getElementById('news-form');
  const emailField = newsletter.elements.namedItem('email');
  emailField.addEventListener('input', () => {
    if (validEmail(emailField.value)) setFieldError(emailField, '');
  });
  newsletter.addEventListener('submit', event => {
    event.preventDefault();
    if (!validEmail(emailField.value)) {
      setFieldError(emailField, 'Digite um e-mail válido');
      emailField.focus();
      return;
    }
    setFieldError(emailField, '');
    newsletter.reset();
    showDialog(document.getElementById('dlg-news'));
  });

  const dictForm = document.getElementById('dict-form');
  const dictionaryBase = {
    cambridge: 'https://dictionary.cambridge.org/dictionary/english/',
    oxford: 'https://www.oxfordlearnersdictionaries.com/definition/english/',
    longman: 'https://www.ldoceonline.com/dictionary/'
  };
  dictForm.addEventListener('submit', event => {
    event.preventDefault();
    const input = document.getElementById('dict-word');
    const word = input.value.trim().toLowerCase().replace(/\s+/g, '-');
    if (!word) { input.focus(); return; }
    const choice = dictForm.querySelector('input[name="dict"]:checked').value;
    window.open(dictionaryBase[choice] + encodeURIComponent(word), '_blank', 'noopener,noreferrer');
  });

  // Map initialization stays separate from the rest of the page interactions.
// Edit addresses and coordinates here. The initial data was supplied for this portfolio mockup.
const LOCATIONS = [
  { id: 'graca', name: 'Graça', address: 'Rua Plínio de Azevedo, 260', lat: -12.9985, lng: -38.5230, direction: 'top' },
  { id: 'ondina', name: 'Ondina', address: 'Av. Oceânica, 5.949, 601', lat: -13.0085, lng: -38.5085, direction: 'bottom' },
  { id: 'pituba', name: 'Pituba', address: 'Rua Nossa Sra. da Glória, 481', lat: -13.0040, lng: -38.4630, direction: 'right' },
  { id: 'vilas', name: 'Vilas do Atlântico', address: 'Praia de Stela, S/N', lat: -12.8880, lng: -38.3030, direction: 'left' }
];

function initLocationsMap() {
  const container = document.getElementById('mapa-leaflet');
  const mapSection = container.closest('.mapa');
  const zoomIn = mapSection.querySelector('[data-zoom="in"]');
  const zoomOut = mapSection.querySelector('[data-zoom="out"]');
  const zoomReset = mapSection.querySelector('[data-zoom="reset"]');
  const fallback = mapSection.querySelector('.mapa-fallback');

  if (!window.L) {
    container.hidden = true;
    fallback.hidden = false;
    [zoomIn, zoomOut, zoomReset].forEach(button => { button.disabled = true; });
    return;
  }

  const map = L.map(container, {
    zoomControl: false,
    attributionControl: true,
    scrollWheelZoom: false, // Wheel scroll continues scrolling the page; use dedicated +/- controls.
    minZoom: 8,
    maxZoom: 18,
    preferCanvas: false
  });

  const cartoKey = String(window.CULTURA_MAP_CONFIG?.cartoApiKey || '').trim();
  const attribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution/" target="_blank" rel="noopener noreferrer">CARTO</a>';
  const standardAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap</a> contributors';
  const basemap = cartoKey
    ? L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/light_all/{z}/{x}/{y}.png?key=' + encodeURIComponent(cartoKey), {
        attribution, subdomains: 'abcd', maxNativeZoom: 20, maxZoom: 20
      })
    : L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: standardAttribution, maxNativeZoom: 19, maxZoom: 19
      });
  basemap.addTo(map);
  if (cartoKey) {
    let fallbackApplied = false;
    basemap.on('tileerror', () => {
      if (fallbackApplied) return;
      fallbackApplied = true;
      map.removeLayer(basemap);
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: standardAttribution, maxNativeZoom: 19, maxZoom: 19
      }).addTo(map);
    });
  }

  const pin = L.divIcon({
    className: 'unit-pin-icon',
    html: '<span class="unit-pin"><span aria-hidden="true">&gt;&gt;</span></span>',
    iconSize: [40, 40], iconAnchor: [20, 20], tooltipAnchor: [0, -1]
  });
  const escapeText = value => String(value).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  const markers = LOCATIONS.map(location => {
    const label = '<strong>' + escapeText(location.name) + '</strong>' +
      '<span>' + escapeText(location.address) + '</span>';
    const marker = L.marker([location.lat, location.lng], {
      icon: pin, keyboard: true, title: 'Cultura Inglesa — ' + location.name
    }).addTo(map).bindTooltip(label, {
      permanent: true,
      direction: location.direction,
      opacity: 1,
      offset: [0, 0],
      className: 'location-tooltip',
      interactive: false
    }).openTooltip();
    marker.on('click', () => {
      const card = document.getElementById('unidade-' + location.id);
      if (!card) return;
      document.querySelectorAll('.unidade.is-selected').forEach(node => node.classList.remove('is-selected'));
      card.classList.add('is-selected');
    });
    return marker;
  });

  const bounds = L.latLngBounds(LOCATIONS.map(item => [item.lat, item.lng]));
  const isSmall = () => window.matchMedia('(max-width: 767px)').matches;
  function fitLocations(animate = false) {
    // Insets leave breathing room for the always-visible location labels.
    const horizontal = isSmall() ? 78 : 180;
    const vertical = isSmall() ? 70 : 110;
    map.fitBounds(bounds, {
      paddingTopLeft: [horizontal, vertical],
      paddingBottomRight: [horizontal, vertical],
      maxZoom: 12,
      animate
    });
  }
  function updateZoomControls() {
    zoomIn.disabled = map.getZoom() >= map.getMaxZoom();
    zoomOut.disabled = map.getZoom() <= map.getMinZoom();
  }
  zoomIn.addEventListener('click', () => map.zoomIn());
  zoomOut.addEventListener('click', () => map.zoomOut());
  zoomReset.addEventListener('click', () => fitLocations(true));
  map.on('zoomend', updateZoomControls);
  map.on('load', updateZoomControls);

  fitLocations(false);
  updateZoomControls();
  let resizeFrame;
  window.addEventListener('resize', () => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => {
      map.invalidateSize({ pan: false });
      fitLocations(false);
    });
  });
}

  initLocationsMap();
})();

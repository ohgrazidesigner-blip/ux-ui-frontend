/* Cultura Inglesa — browser-level smoke tests.
 * Runs against the existing static HTML; no production build or backend.
 */
const { chromium } = require('playwright');
const AxeBuilder = require('@axe-core/playwright').default;
const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const output = path.join(process.cwd(), 'audit-artifacts');
  fs.mkdirSync(output, { recursive: true });
  const problems = [];
  const logs = [];
  const base = 'http://127.0.0.1:8765/';
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  page.on('pageerror', error => problems.push('Uncaught browser JS: ' + error.message));

  // Untrusted third-party map tiles, fonts and CDN are excluded from deterministic smoke tests.
  // This also exercises the site's explicit static-map fallback.
  await page.route('**/*', route => {
    const url = route.request().url();
    if (url.startsWith(base)) return route.continue();
    return route.abort();
  });

  try {
    for (const width of [390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(base, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => document.fonts.status === 'loaded', null, { timeout: 10000 });
      const values = await page.evaluate(() => ({
        actual: document.documentElement.scrollWidth,
        viewport: document.documentElement.clientWidth,
        heading: document.querySelector('h1')?.textContent.replace(/\s+/g, ' ').trim(),
        mainVisible: getComputedStyle(document.querySelector('main')).display !== 'none'
      }));
      assert(values.mainVisible && values.heading.includes('Faz toda a diferença'), 'Page content missing: ' + width);
      if (values.actual > values.viewport + 2) problems.push('Horizontal overflow at ' + width + 'px: ' + JSON.stringify(values));
      await page.screenshot({ path: path.join(output, 'home-' + width + '.png'), fullPage: true, animations: 'disabled' });
      logs.push('Viewport ' + width + 'px: ' + values.actual + '/' + values.viewport + 'px');
      if (width === 390 || width === 1440) {
        const sectionHeights = await page.evaluate(() => {
          const names = ['.site-header','.hero','.cursos','.prova','.lead','.teste','.novidades','.onde','.newsletter','.site-footer'];
          return names.map(name => [name, Math.round(document.querySelector(name).getBoundingClientRect().height)]);
        });
        logs.push('Section heights at ' + width + 'px: ' + JSON.stringify(sectionHeights));
      }
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto(base, { waitUntil: 'domcontentloaded' });
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('.menu-mobile').isVisible(), true, 'Mobile menu did not open');
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.menu-mobile').isVisible(), false, 'Mobile menu did not close with Escape');
    assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('.menu-toggle')), true, 'Menu focus not restored');

    await page.locator('.menu-toggle').click();
    await page.locator('.menu-mobile [data-open-wa]').click();
    assert.equal(await page.locator('#menu-mobile').isVisible(), false);
    assert.equal(await page.locator('#wa-picker').isVisible(), true);
    await page.locator('.wa-picker-close').click();
    assert.equal(await page.evaluate(() => document.activeElement === document.querySelector('.wa-float')), true, 'WhatsApp focus restored to hidden element');
    logs.push('Mobile navigation and WhatsApp selector keyboard focus: pass');

    await page.locator('.wa-float').click();
    await page.locator('#wa-picker [data-unit="graca"]').click();
    assert.equal(await page.locator('#unidade-graca').evaluate(el => el.classList.contains('is-selected')), true);
    assert.equal(await page.locator('#unit-status').isVisible(), true);
    logs.push('WhatsApp unit selector: pass');

    assert.equal(await page.locator('.mapa-fallback').isVisible(), true, 'Map fallback unavailable when Leaflet CDN fails');
    logs.push('Static-map contingency: pass');

    await page.locator('#lead-form button[type=submit]').click();
    assert.notEqual(await page.locator('#err-nome').textContent(), '', 'Empty lead form was accepted');
    await page.locator('#lead-form [name=nome]').fill('Ana Maria');
    await page.locator('#lead-form [name=whatsapp]').fill('71999998888');
    await page.locator('#lead-form [name=unidade]').selectOption('graca');
    await page.locator('#lead-form [name=autorizacao]').check();
    await page.locator('#lead-form button[type=submit]').click();
    assert.equal(await page.locator('#dlg-lead').isVisible(), true, 'Lead success preview not shown');
    assert((await page.locator('#dlg-lead').innerText()).includes('Nenhuma informação foi enviada'));
    await page.locator('#dlg-lead [data-close]').click();
    logs.push('Lead form client-side validation and demo disclosure: pass');

    await page.locator('#news-form button[type=submit]').click();
    assert.notEqual(await page.locator('#err-email').textContent(), '');
    await page.locator('#news-form [name=email]').fill('teste@example.com');
    await page.locator('#news-form button[type=submit]').click();
    assert.equal(await page.locator('#dlg-news').isVisible(), true);
    await page.locator('#dlg-news [data-close]').click();
    logs.push('Newsletter validation and demo disclosure: pass');

    const axe = await new AxeBuilder({ page })
      .withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa'])
      .analyze();
    fs.writeFileSync(path.join(output, 'axe-results.json'), JSON.stringify({
      violations: axe.violations, passes: axe.passes.map(p => p.id),
      incomplete: axe.incomplete.map(p => ({ id: p.id, nodes: p.nodes.length }))
    }, null, 2));
    const summary = axe.violations.map(v => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help }));
    logs.push('Axe WCAG A/AA automated findings: ' + JSON.stringify(summary));
    const severe = axe.violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
    if (severe.length) problems.push('Axe serious/critical violations: ' + severe.map(v => v.id + '(' + v.nodes.length + ')').join(', '));
  } finally {
    await browser.close();
  }

  console.log(logs.join('\n'));
  if (problems.length) {
    console.error('SMOKE TEST FAILURES:\n' + problems.join('\n'));
    process.exitCode = 1;
  } else console.log('CULTURA INGLESA BROWSER SMOKE TESTS: PASS');
})().catch(error => {
  console.error(error);
  process.exitCode = 1;
});

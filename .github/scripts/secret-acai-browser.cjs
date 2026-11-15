/* Automated browser audit for the existing Secret Açaí React/Vite front-end. */
const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const out = path.join(process.cwd(), "secret-audit-artifacts");
  fs.mkdirSync(out, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: "reduce" });
  const page = await context.newPage();
  const errors = [];
  const notes = [];
  page.on("pageerror", e => errors.push("JS runtime error: " + e.message));
  const base = "http://127.0.0.1:8766/";

  try {
    await page.goto(base, { waitUntil: "domcontentloaded" });
    await page.locator("h1").waitFor();
    for (const width of [390, 768, 1024, 1440]) {
      await page.setViewportSize({ width, height: 900 });
      await page.reload({ waitUntil: "domcontentloaded" });
      await page.locator("h1").waitFor();
      const dims = await page.evaluate(() => ({
        scroll: document.documentElement.scrollWidth,
        client: document.documentElement.clientWidth
      }));
      if (dims.scroll > dims.client + 2) errors.push("Horizontal overflow at " + width + " px: " + JSON.stringify(dims));
      await page.screenshot({ path: path.join(out, "dashboard-" + width + ".png"), fullPage: true, animations: "disabled" });
      notes.push("Dashboard viewport " + width + ": " + dims.scroll + "/" + dims.client);
      for (const moduleName of ["Vendas", "Estoque", "Clientes", "Prospecção", "Relatórios"]) {
        if (width <= 760) await page.locator(".mobile-menu-button").click();
        await page.locator(".sidebar").getByRole("button", { name: moduleName, exact: true }).click();
        const state = await page.evaluate(() => ({
          scroll: document.documentElement.scrollWidth,
          client: document.documentElement.clientWidth
        }));
        if (state.scroll > state.client + 2) errors.push(moduleName + " horizontal overflow at " + width + " px: " + JSON.stringify(state));
        if (width === 390 || width === 1440) {
          const slug = moduleName.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
          await page.screenshot({ path: path.join(out, slug + "-" + width + ".png"), fullPage: true, animations: "disabled" });
        }
      }
      notes.push("Five additional modules checked for overflow at " + width + " px");
    }

    await page.setViewportSize({ width: 390, height: 844 });
    await page.reload({ waitUntil: "domcontentloaded" });
    assert.equal(await page.locator(".sidebar").evaluate(el => getComputedStyle(el).visibility), "hidden");
    const menuTrigger = page.locator(".mobile-menu-button");
    await menuTrigger.click();
    assert.equal(await page.locator("#main-menu").getAttribute("role"), "dialog");
    assert.equal(await menuTrigger.getAttribute("aria-expanded"), "true");
    await page.waitForFunction(() => document.activeElement === document.querySelector("#main-menu .nav-item"));
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.locator(".nav-item").last().evaluate(el => document.activeElement === el), true);
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => document.activeElement === document.querySelector(".mobile-menu-button"));
    assert.equal(await page.locator(".sidebar").evaluate(el => getComputedStyle(el).visibility), "hidden");
    notes.push("Mobile drawer focus trap, ARIA and Escape: pass");

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.getByRole("button", { name: /Registrar venda/ }).click();
    assert((await page.locator("h1").innerText()).includes("Registrar venda"));
    await page.screenshot({ path: path.join(out, "vendas-1440.png"), fullPage: true, animations: "disabled" });

    const clientButton = page.getByRole("button", { name: /Cadastrar cliente/ }).first();
    await clientButton.click();
    assert.equal(await page.getByRole("dialog").isVisible(), true);
    assert.equal(await page.getByRole("dialog").evaluate(el => document.activeElement === el), true);
    await page.getByRole("dialog").locator(".m-modal-actions button").last().focus();
    await page.keyboard.press("Tab");
    assert.equal(await page.getByRole("dialog").locator(".m-close").evaluate(el => document.activeElement === el), true);
    await page.keyboard.press("Escape");
    await page.waitForFunction(() => !document.querySelector('[role="dialog"]'));
    assert.equal(await clientButton.evaluate(el => document.activeElement === el), true);
    notes.push("Client modal keyboard trap, Escape and focus restoration: pass");

    await clientButton.click();
    await page.getByRole("dialog").locator('input[name="name"]').fill("Cliente Teste de Auditoria");
    await page.getByRole("dialog").locator('input[name="phone"]').fill("71999999999");
    await page.getByRole("dialog").getByRole("button", { name: "Salvar cliente" }).click();
    assert.equal(await page.locator('select[aria-label="Buscar cliente por nome"]').inputValue(), "Cliente Teste de Auditoria");
    notes.push("Local demo client registration: pass");

    await page.locator('input[aria-label="Valor final por caixa"]').fill("100");
    await page.getByRole("button", { name: "Confirmar venda" }).click();
    assert((await page.getByRole("dialog").innerText()).includes("ultrapassa o limite"));
    await page.getByRole("dialog").getByRole("button", { name: "Voltar e editar" }).click();
    await page.locator('input[aria-label="Valor final por caixa"]').fill("110");
    await page.getByRole("button", { name: "Confirmar venda" }).click();
    await page.getByRole("dialog").getByRole("button", { name: "Confirmar venda" }).click();
    assert((await page.getByRole("dialog").innerText()).includes("Pedido #1568"));
    await page.getByRole("dialog").getByRole("button", { name: "Ir para dashboard" }).click();
    assert.equal((await page.locator("h1").innerText()).trim(), "Dashboard");
    await page.locator(".sidebar").getByRole("button", { name: "Estoque" }).click();
    const firstStockRow = page.locator(".m-table-panel tbody tr").filter({ hasText: "10L" }).filter({ hasText: "Tradicional" });
    assert((await firstStockRow.innerText()).includes("28 caixas"), "Sale did not reduce 10L Tradicional stock from 32 to 28");
    await page.reload({ waitUntil: "domcontentloaded" });
    await page.locator(".sidebar").getByRole("button", { name: "Estoque" }).click();
    assert((await page.locator(".m-table-panel tbody tr").filter({ hasText: "10L" }).filter({ hasText: "Tradicional" }).innerText()).includes("28 caixas"), "Stock did not persist");
    notes.push("Sale discount approval, successful order, stock deduction and local persistence: pass");

    for (const item of ["Dashboard", "Vendas", "Estoque", "Clientes", "Prospecção", "Relatórios"]) {
      await page.locator(".sidebar").getByRole("button", { name: item, exact: true }).click();
      assert.equal((await page.locator("h1").innerText()).trim(), item === "Vendas" ? "Registrar venda" : item);
      if (item !== "Dashboard" && item !== "Vendas" && item !== "Estoque") {
        await page.screenshot({ path: path.join(out, item.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") + "-1440.png"), fullPage: true, animations: "disabled" });
      }
    }
    notes.push("All six modules navigate: pass");

    const axeReports = [];
    for (const item of ["Dashboard", "Vendas", "Estoque", "Clientes", "Prospecção", "Relatórios"]) {
      await page.locator(".sidebar").getByRole("button", { name: item, exact: true }).click();
      const result = await new AxeBuilder({ page }).withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"]).analyze();
      axeReports.push({ module: item, violations: result.violations.map(v => ({
        id: v.id, impact: v.impact, nodes: v.nodes.map(n => ({target:n.target, html:n.html.slice(0,260), failureSummary:n.failureSummary}))
      })), incomplete: result.incomplete.map(v => ({id:v.id, count:v.nodes.length})) });
    }
    fs.writeFileSync(path.join(out, "axe-module-results.json"), JSON.stringify(axeReports, null, 2));
    notes.push("Axe findings: " + JSON.stringify(axeReports.map(r => ({module:r.module, issues:r.violations.map(v => ({id:v.id, impact:v.impact, count:v.nodes.length}))}))));
    const severe = axeReports.flatMap(r => r.violations.filter(v => ["critical","serious"].includes(v.impact)).map(v => r.module + ":" + v.id));
    if (severe.length) errors.push("Axe serious/critical WCAG findings: " + severe.join(", "));
  } finally {
    await browser.close();
  }
  console.log(notes.join("\n"));
  if (errors.length) { console.error("FAILURES:\n" + errors.join("\n")); process.exitCode = 1; }
  else console.log("SECRET ACAI AUDIT SMOKE TESTS: PASS");
})().catch(e => { console.error(e); process.exitCode = 1; });

const { chromium } = require("playwright");
const fs = require("node:fs");
const path = require("node:path");

const samples = [
  { slug: "cultura-inglesa", url: "http://127.0.0.1:8765/", label: "Cultura Inglesa Salvador" },
  { slug: "secret-acai", url: "http://127.0.0.1:8766/", label: "Secret Açaí" },
  { slug: "ledgerflow", url: "http://127.0.0.1:8767/", label: "LedgerFlow" }
];
const sizes = [
  { id: "desktop", width: 1440, height: 900 },
  { id: "mobile", width: 390, height: 844 }
];
async function capture() {
  const dest = path.join(process.cwd(), "showcase", "assets");
  fs.mkdirSync(dest, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  const report = [];
  try {
    for (const sample of samples) {
      for (const size of sizes) {
        const context = await browser.newContext({
          viewport: { width: size.width, height: size.height },
          deviceScaleFactor: 1,
          locale: "pt-BR",
          colorScheme: "light",
          reducedMotion: "reduce"
        });
        const page = await context.newPage();
        const pageErrors = [];
        page.on("pageerror", error => pageErrors.push(error.message));
        const response = await page.goto(sample.url, { waitUntil: "domcontentloaded", timeout: 30000 });
        if (!response || !response.ok()) throw new Error("Screenshot source failed: " + sample.url);
        await page.locator("body").waitFor();
        if (sample.slug === "ledgerflow") await page.locator("h1:visible").first().waitFor();
        if (sample.slug === "secret-acai") await page.locator("h1").first().waitFor();
        await page.evaluate(async () => {
          await document.fonts.ready;
          window.scrollTo(0, 0);
        });
        await page.waitForTimeout(sample.slug === "cultura-inglesa" ? 1800 : 700);
        const fileName = sample.slug + "-" + size.id + ".jpg";
        const target = path.join(dest, fileName);
        await page.screenshot({ path: target, type: "jpeg", quality: 82, fullPage: false, animations: "disabled" });
        const stat = fs.statSync(target);
        const header = fs.readFileSync(target).subarray(0, 2);
        if (stat.size < 12000 || header[0] !== 0xff || header[1] !== 0xd8) {
          throw new Error("Invalid screenshot: " + fileName + " (" + stat.size + " bytes)");
        }
        const bodyPreview = (await page.locator("body").innerText()).trim().slice(0, 90);
        report.push({ label: sample.label, viewport: size.id, width: size.width, height: size.height, file: fileName, bytes: stat.size, preview: bodyPreview, pageErrors });
        console.log("Captured real front-end: " + fileName + " (" + stat.size + " bytes)");
        await context.close();
      }
    }
  } finally {
    await browser.close();
  }
  fs.writeFileSync(path.join(dest, "capture-provenance.json"), JSON.stringify({
    type: "Real Playwright screenshots from source applications served locally",
    method: "Chromium, light theme, viewport only, no simulated mockups",
    sourceCommit: process.env.GITHUB_SHA || "local",
    capturedScreens: report
  }, null, 2) + "\n");
  if (report.length !== 6) throw new Error("Expected 6 capture images, got " + report.length);
  console.log("All 6 original project screenshots generated.");
}
capture().catch(err => { console.error(err); process.exitCode = 1; });

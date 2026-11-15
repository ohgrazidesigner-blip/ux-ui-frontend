const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

(async () => {
  const out = path.join(process.cwd(), "showcase-review-artifacts");
  fs.mkdirSync(out, {recursive:true});
  const root = path.join(process.cwd(),"showcase");
  const names = ["cultura-inglesa","secret-acai","ledgerflow"];
  for (const name of names) {
    for (const size of ["desktop","mobile"]) {
      const filename = path.join(root,"assets",name+"-"+size+".jpg");
      assert(fs.existsSync(filename), "Missing real screenshot: "+filename);
      assert(fs.statSync(filename).size > 12000, "Screenshot unexpectedly small: "+filename);
    }
  }
  const browser = await chromium.launch({headless:true});
  const context = await browser.newContext({ viewport:{width:1440,height:900}, reducedMotion:"reduce" });
  const page = await context.newPage();
  const failures = [];
  page.on("pageerror",error=>failures.push(error.message));
  try {
    for (const width of [390,768,1440]) {
      await page.setViewportSize({width,height:900});
      await page.goto("http://127.0.0.1:8770/",{waitUntil:"domcontentloaded"});
      await page.locator("#hero-heading").waitFor();
      assert.equal(await page.locator(".project").count(),3);
      const dims = await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
      if(dims.scroll>dims.client+2)failures.push("Horizontal overflow at "+width+": "+JSON.stringify(dims));
      for (const name of names) {
        const preview = page.locator("#"+name);
        const img = preview.locator(".preview-frame img");
        await img.evaluate(el=>el.complete?null:new Promise((resolve,reject)=>{el.addEventListener("load",resolve,{once:true});el.addEventListener("error",reject,{once:true});}));
        assert.equal(await img.evaluate(el=>el.naturalWidth),1440,"desktop screenshot should be real 1440px Chromium capture for "+name);
        await preview.locator('button[data-view="mobile"]').click();
        await page.waitForFunction(selector=>document.querySelector(selector)?.naturalWidth===390,"#"+name+" .preview-frame img");
        assert.equal(await preview.locator('button[data-view="mobile"]').getAttribute("aria-pressed"),"true");
        assert.equal(await img.evaluate(el=>el.naturalHeight),844);
        await preview.locator('button[data-view="desktop"]').click();
        await page.waitForFunction(selector=>document.querySelector(selector)?.naturalWidth===1440,"#"+name+" .preview-frame img");
      }
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.screenshot({path:path.join(out,"showcase-"+width+".png"),fullPage:true,animations:"disabled"});
      const axe=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
      fs.writeFileSync(path.join(out,"axe-"+width+".json"),JSON.stringify({violations:axe.violations,incomplete:axe.incomplete},null,2));
      const serious=axe.violations.filter(x=>x.impact==="serious"||x.impact==="critical");
      if(serious.length)failures.push("WCAG Axe "+width+": "+serious.map(x=>x.id+" "+x.nodes.length).join(", "));
      console.log("Showcase viewport "+width+": "+dims.client+"px, validated 6 screenshots, axe violations "+axe.violations.length);
    }
    const info=await page.locator(".project-links a").evaluateAll(links=>links.map(el=>({href:el.getAttribute("href"),text:el.textContent?.trim(),rel:el.getAttribute("rel"),target:el.getAttribute("target")})));
    assert.equal(info.length,9);
    for(const link of info){
      assert(link.href&&link.href.trim().length>1);
      if(link.target==="_blank"&&!link.rel?.includes("noopener"))failures.push("Unsafe target on project link "+link.href);
    }
  } finally { await browser.close(); }
  if(failures.length){ console.error("SHOWCASE FAILURES:",failures); process.exitCode=1; }
  else console.log("SHOWCASE REGRESSION AND A11Y AUDIT: PASS");
})().catch(error=>{console.error(error);process.exitCode=1;});

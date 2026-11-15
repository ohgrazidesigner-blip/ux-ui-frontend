const { chromium } = require("playwright");
const AxeBuilder = require("@axe-core/playwright").default;
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");

(async () => {
  const root=path.join(process.cwd(),"ledger-audit-artifacts");
  fs.mkdirSync(root,{recursive:true});
  const browser=await chromium.launch({headless:true});
  const context=await browser.newContext({viewport:{width:1536,height:1024},reducedMotion:"reduce"});
  const page=await context.newPage();
  const notes=[],issues=[];
  page.on("pageerror",e=>issues.push("JS runtime: "+e.message));
  const base="http://127.0.0.1:8767/";

  async function openSection(name) {
    if ((await page.viewportSize()).width <=650) {
      await page.locator(".mobile-bottom-nav").getByRole("button",{name:"Mais"}).click();
      await page.locator(".ledger-mobile-more").getByRole("button",{name:new RegExp("^"+name)}).click();
    } else if ((await page.viewportSize()).width <=900) {
      await page.locator(".menu-toggle").click();
      await page.locator(".sidebar .nav-item").getByText(name,{exact:true}).click();
    } else {
      await page.locator(".sidebar .nav-item").getByText(name,{exact:true}).click();
    }
  }
  try {
    for(const width of [390,768,1024,1536]){
      await page.setViewportSize({width,height:900});
      await page.goto(base,{waitUntil:"domcontentloaded"});
      await page.locator("h1:visible").first().waitFor();
      const items=width===390?["Visão Geral","Empresas","Importações","Conciliação","Fiscal","Relatórios","Automação","Comunicações","Configurações"]:["Visão Geral","Empresas","Importações","Conciliação","Fiscal","Relatórios","Obrigações","Pendências","Comunicações","Automação","Configurações"];
      for(const name of items) {
        if(name!=="Visão Geral")await openSection(name);
        const value=await page.evaluate(()=>({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth}));
        if(value.scroll>value.client+2) {
          const offenders=await page.evaluate(() => [...document.querySelectorAll("*")].map(el=>({tag:el.tagName.toLowerCase(),className:typeof el.className==="string"?el.className:"",right:Math.round(el.getBoundingClientRect().right),width:Math.round(el.getBoundingClientRect().width)})).filter(el=>el.right>document.documentElement.clientWidth+2).sort((a,b)=>b.right-a.right).slice(0,12));
          issues.push("Horizontal overflow "+name+" at "+width+"px: "+JSON.stringify(value)+"; candidates: "+JSON.stringify(offenders));
        }
        if(width===390||width===1536) {
          const slug=({"Visão Geral":"home","Empresas":"empresas","Importações":"importacoes","Conciliação":"conciliacao","Fiscal":"fiscal","Relatórios":"relatorios","Obrigações":"obrigacoes","Pendências":"pendencias","Comunicações":"comunicacoes","Automação":"automacao","Configurações":"configuracoes"})[name];
          await page.screenshot({path:path.join(root,slug+"-"+width+".png"),fullPage:true,animations:"disabled"});
        }
      }
      notes.push("Responsive modules verified at "+width+" px.");
    }

    await page.setViewportSize({width:390,height:844});
    await page.goto(base,{waitUntil:"domcontentloaded"});
    assert.equal(await page.locator(".ledger-mobile-overview").isVisible(),true);
    assert.equal(await page.getByRole("heading",{name:"Prioridades"}).isVisible(),true);
    await page.locator(".mobile-bottom-nav").getByRole("button",{name:"Mais"}).click();
    assert.equal(await page.locator(".ledger-mobile-more").getByRole("button").count(),8);
    await page.locator(".ledger-mobile-more").getByRole("button",{name:/Importações/}).click();
    assert.equal(await page.getByRole("heading",{name:"Importações",exact:true}).first().isVisible(),true);
    notes.push("Figma M02/M17 original mobile overview and eight-destination Mais navigation: pass");
    await page.locator(".mobile-bottom-nav").getByRole("button",{name:"Mais"}).click();
    await page.locator(".ledger-mobile-more").getByRole("button",{name:/Relatórios/}).click();
    assert.equal(await page.locator(".lfm-report").count(),4);
    await page.locator(".lfm-report").getByRole("button",{name:"Abrir DRE"}).click();
    assert.equal(await page.getByRole("heading",{name:"Demonstração do Resultado"}).isVisible(),true);
    notes.push("Mobile Figma report cards open the detailed DRE flow: pass");

    await page.setViewportSize({width:768,height:900});
    await page.goto(base,{waitUntil:"domcontentloaded"});
    const menu=page.locator(".menu-toggle");
    await menu.click();
    assert.equal(await menu.getAttribute("aria-expanded"),"true");
    await page.waitForFunction(()=>document.activeElement===document.querySelector(".sidebar .nav-item"),null,{timeout:5500});
    await page.keyboard.press("Shift+Tab");
    assert.equal(await page.locator(".switch-company").evaluate(el=>document.activeElement===el),true);
    await page.keyboard.press("Escape");
    await page.waitForFunction(()=>document.activeElement===document.querySelector(".menu-toggle"));
    await page.waitForFunction(()=>getComputedStyle(document.querySelector(".sidebar")).visibility==="hidden");
    notes.push("Tablet drawer focus, Escape and non-focusable closed sidebar: pass");

    await page.setViewportSize({width:1536,height:1024});
    await page.goto(base,{waitUntil:"domcontentloaded"});
    const open=page.locator(".company-table tbody").getByRole("button",{name:/Abrir detalhes de/}).first();
    await open.click();
    await page.waitForFunction(()=>document.activeElement===document.querySelector(".detail-dialog"));
    assert.equal(await page.getByRole("dialog").isVisible(),true);
    await page.keyboard.press("Escape");
    await page.waitForFunction(()=>!document.querySelector(".detail-dialog"));
    assert.equal(await open.evaluate(el=>document.activeElement===el),true);
    notes.push("Company drawer focus trap / return: pass");

    await openSection("Relatórios");
    await page.getByRole("button",{name:"Abrir fechamento"}).click();
    assert.equal(await page.getByRole("button",{name:"Fechar e bloquear",exact:true}).isDisabled(),true);
    await page.getByRole("button",{name:"Resolver pendência"}).click();
    assert.equal(await page.getByRole("button",{name:"Vincular documento (simulação)"}).isDisabled(),true);
    await page.locator(".lf-dialog input[type=file]").setInputFiles({name:"documento-teste.pdf",mimeType:"application/pdf",buffer:Buffer.from("%PDF-1.4\nLedgerFlow demo\n")});
    assert.equal(await page.getByRole("button",{name:"Vincular documento (simulação)"}).isEnabled(),true);
    await page.getByRole("button",{name:"Vincular documento (simulação)"}).click();
    await page.getByRole("button",{name:"Fechar e bloquear",exact:true}).click();
    assert.equal(await page.getByRole("dialog",{name:"Confirmar fechamento de Jul/2026"}).isVisible(),true);
    await page.getByRole("button",{name:"Confirmar bloqueio (simulação)"}).click();
    assert.equal(await page.getByText("Período bloqueado").first().isVisible(),true);
    await page.getByRole("button",{name:"Solicitar reabertura (demo)"}).click();
    assert.equal(await page.getByRole("button",{name:"Solicitar reabertura (simulação)"}).isDisabled(),true);
    await page.getByRole("dialog").getByRole("textbox",{name:"Justificativa"}).fill("Revisão documental da competência simulada");
    await page.getByRole("button",{name:"Solicitar reabertura (simulação)"}).click();
    assert.equal(await page.getByRole("button",{name:"Fechar e bloquear",exact:true}).isEnabled(),true);
    notes.push("Safe simulated document, closing and reopening flow: pass");

    const scans=[];
    for(const name of ["Visão Geral","Empresas","Importações","Conciliação","Fiscal","Relatórios","Obrigações","Pendências","Comunicações","Automação","Configurações"]) {
      await page.locator(".sidebar .nav-item").getByText(name,{exact:true}).click();
      const a=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
      scans.push({module:name,violations:a.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html.slice(0,250),summary:n.failureSummary}))})),incomplete:a.incomplete.map(v=>({id:v.id,count:v.nodes.length}))});
    }
    // Mobile routes have their own Figma compositions: scan visible 390px views too.
    await page.setViewportSize({width:390,height:844});
    await page.goto(base,{waitUntil:"domcontentloaded"});
    for (const name of ["Visão Geral","Empresas","Importações","Fiscal","Relatórios","Pendências","Mais"]) {
      if(name==="Pendências")await page.locator(".mobile-bottom-nav").getByRole("button",{name:"Pendências"}).click();
      else if(name==="Mais")await page.locator(".mobile-bottom-nav").getByRole("button",{name:"Mais"}).click();
      else if(name!=="Visão Geral"){
        await page.locator(".mobile-bottom-nav").getByRole("button",{name:"Mais"}).click();
        await page.locator(".ledger-mobile-more").getByRole("button",{name:new RegExp("^"+name)}).click();
      }
      const check=await new AxeBuilder({page}).withTags(["wcag2a","wcag2aa","wcag21a","wcag21aa"]).analyze();
      scans.push({module:"Mobile "+name,violations:check.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,html:n.html.slice(0,250),summary:n.failureSummary}))})),incomplete:check.incomplete.map(v=>({id:v.id,count:v.nodes.length}))});
    }
    fs.writeFileSync(path.join(root,"axe-results.json"),JSON.stringify(scans,null,2));
    notes.push("Axe results "+JSON.stringify(scans.map(x=>({module:x.module,issues:x.violations.map(z=>({rule:z.id,impact:z.impact,count:z.nodes.length}))}))));
    const serious=scans.flatMap(x=>x.violations.filter(v=>["serious","critical"].includes(v.impact)).map(v=>x.module+":"+v.id+"("+v.nodes.length+")"));
    if(serious.length)issues.push("Axe serious/critical: "+serious.join(", "));
  } finally {
    await browser.close();
  }
  console.log(notes.join("\n"));
  if(issues.length) {
    console.error("LEDGERFLOW AUDIT FAILURES:\n"+issues.join("\n"));
    process.exitCode=1;
  } else console.log("LEDGERFLOW BROWSER AUDIT: PASS");
})().catch(e=>{console.error(e);process.exitCode=1;});

import { useEffect, useMemo, useRef, useState } from "react";
import brandMark from "./assets/ledgerflow-mark.svg";
import "./styles.css";
import Modules from "./Modules.jsx";
import { MobileOverview, MobileMore } from "./MobileViews.jsx";
import MobileModule from "./MobileModules.jsx";

const FIGMA_URL = "https://www.figma.com/design/79LeQIZXXjuWcoDleD5Pf2?node-id=287-10";
const navItems = [
  "Visão Geral", "Empresas", "Conciliação", "Importações", "Fiscal",
  "Relatórios", "Obrigações", "Pendências", "Comunicações",
  "Automação", "Configurações"
];
const metrics = [
  { value: "16", label: "Total", tone: "neutral" },
  { value: "2", label: "Fechadas", tone: "success" },
  { value: "6", label: "Em andamento", tone: "info" },
  { value: "4", label: "Aguardando cliente", tone: "warning" },
  { value: "4", label: "Com bloqueios", tone: "danger" },
  { value: "3", label: "Risco alto", tone: "danger" },
];
const companies = [
  { name: "Alfa Comércio Ltda.", status: "Em andamento", blockers: 1, due: "15/08", owner: "Juliana", risk: "Médio" },
  { name: "Beta Serviços Ltda.", status: "Aguardando cliente", blockers: 2, due: "15/08", owner: "Juliana", risk: "Médio" },
  { name: "Delta Logística Ltda.", status: "Com bloqueios", blockers: 2, due: "14/08", owner: "Juliana", risk: "Alto" },
  { name: "Horizonte Tecnologia Ltda.", status: "Com bloqueios", blockers: 3, due: "13/08", owner: "Fernanda", risk: "Alto" },
  { name: "Nova Gestão Ltda.", status: "Em andamento", blockers: 0, due: "16/08", owner: "Juliana", risk: "Baixo" },
  { name: "Prisma Consultoria Ltda.", status: "Aguardando cliente", blockers: 1, due: "16/08", owner: "Rafael", risk: "Médio" },
];

function Logo() {
  return <span className="brand"><img src={brandMark} alt="" width="24" height="21" /><span>LedgerFlow</span></span>;
}
function Pill({ risk }) {
  return <span className={"risk risk-" + risk.toLowerCase()}>{risk}</span>;
}
function CompanyTable({ rows, onOpen }) {
  return (
    <div className="table-scroll">
      <table className="company-table">
        <thead>
          <tr><th>Empresa</th><th>Situação</th><th>Bloqueios</th><th>Prazo</th><th>Responsável</th><th>Risco</th><th><span className="sr-only">Ações</span></th></tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.name} className={row.name.startsWith("Delta") ? "row-warning" : row.name.startsWith("Horizonte") ? "row-danger" : ""}>
              <td className="company-name">{row.name}</td>
              <td><span className={"status status-" + (row.status === "Em andamento" ? "progress" : row.status === "Com bloqueios" ? "blocked" : "waiting")}>{row.status}</span></td>
              <td>{row.blockers}</td><td>{row.due}</td><td>{row.owner}</td>
              <td><Pill risk={row.risk} /></td>
              <td><button className="link-button" onClick={() => onOpen(row)} aria-label={"Abrir detalhes de " + row.name}>Abrir</button></td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="empty-results" role="status">Nenhuma empresa encontrada com esses filtros.</p>}
    </div>
  );
}
function DetailDrawer({ company, onClose }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  useEffect(() => {
    const previous = document.activeElement;
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.focus({ preventScroll: true });
    const keyDown = event => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onCloseRef.current();
      }
      if (event.key !== "Tab" || !dialogRef.current) return;
      const focusable = [...dialogRef.current.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'
      )].filter(el => el.getClientRects().length > 0);
      if (!focusable.length) { event.preventDefault(); dialogRef.current.focus(); return; }
      const first = focusable[0], last = focusable[focusable.length-1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === dialogRef.current)) {
        event.preventDefault(); last.focus();
      } else if (!event.shiftKey && (document.activeElement === last || document.activeElement === dialogRef.current)) {
        event.preventDefault(); first.focus();
      }
    };
    document.addEventListener("keydown", keyDown, true);
    return () => {
      document.removeEventListener("keydown", keyDown, true);
      document.body.style.overflow = oldOverflow;
      if (previous instanceof HTMLElement && previous.isConnected) previous.focus({ preventScroll:true });
    };
  }, []);
  return (
    <div className="modal-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onCloseRef.current();}}>
      <section ref={dialogRef} tabIndex={-1} className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
        <header><div><p className="module-eyebrow">DETALHES · CARTEIRA</p><h2 id="detail-title">{company.name}</h2></div><button type="button" className="close-dialog" onClick={()=>onCloseRef.current()} aria-label="Fechar detalhes">×</button></header>
        <dl className="detail-list">
          <div><dt>Situação</dt><dd>{company.status}</dd></div>
          <div><dt>Bloqueios</dt><dd>{company.blockers}</dd></div>
          <div><dt>Prazo</dt><dd>{company.due}</dd></div>
          <div><dt>Responsável</dt><dd>{company.owner}</dd></div>
          <div><dt>Risco</dt><dd><Pill risk={company.risk}/></dd></div>
        </dl>
        <p className="detail-note">Dados ilustrativos do protótipo Figma. Nenhuma ação contábil real é executada.</p>
        <button type="button" className="primary-button" onClick={()=>onCloseRef.current()}>Concluir consulta</button>
      </section>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState("Visão Geral");
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuPreviouslyOpen = useRef(false);
  const [mobileExpanded,setMobileExpanded] = useState(false);
  const [mobileInitialView,setMobileInitialView] = useState(null);
  const mobileSpecial = ["Empresas","Importações","Fiscal","Pendências","Relatórios"].includes(page);
  const visibleCompanies = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    return companies.filter((company) =>
      (scope === "all" || company.owner === "Juliana") &&
      (term === "" || [company.name, company.status, company.owner, company.risk].some(v => v.toLocaleLowerCase("pt-BR").includes(term)))
    );
  }, [query, scope]);
  useEffect(() => {
    if (!menuOpen) {
      if (menuPreviouslyOpen.current) {
        const opener = document.querySelector(".menu-toggle");
        if (opener && getComputedStyle(opener).display !== "none") opener.focus({ preventScroll:true });
      }
      menuPreviouslyOpen.current = false;
      return;
    }
    menuPreviouslyOpen.current = true;
    const sidebar = document.getElementById("ledger-main-menu");
    const before = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    // CSS transitions the drawer into view; focus after it is visible.
    const focusTimer = window.setTimeout(() => sidebar?.querySelector(".nav-item")?.focus({ preventScroll:true }), 230);
    const onKey = event => {
      if (event.key === "Escape") { event.preventDefault(); setMenuOpen(false); return; }
      if (event.key !== "Tab" || !sidebar) return;
      const elements = Array.from(sidebar.querySelectorAll("button:not([disabled])"));
      if (!elements.length) return;
      const first=elements[0],last=elements[elements.length-1];
      if (event.shiftKey && document.activeElement===first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement===last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener("keydown", onKey);
    return () => { window.clearTimeout(focusTimer); document.removeEventListener("keydown", onKey); document.body.style.overflow=before; };
  }, [menuOpen]);
  const navigate = (item) => {
    setPage(item);
    setQuery("");
    setMobileExpanded(false);
    setMobileInitialView(null);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="app">
      {menuOpen && <button className="sidebar-scrim" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
      <aside id="ledger-main-menu" className={"sidebar" + (menuOpen ? " sidebar-open" : "")} aria-label="Menu principal" role={menuOpen ? "dialog" : undefined} aria-modal={menuOpen ? "true" : undefined}>
        <div className="sidebar-brand"><Logo /></div>
        <nav className="navigation" aria-label="Navegação LedgerFlow">
          {navItems.map((item) => (
            <button key={item} className={"nav-item" + (page === item ? " nav-active" : "")} onClick={() => navigate(item)} aria-current={page === item ? "page" : undefined}>{item}</button>
          ))}
        </nav>
        <div className="sidebar-context">
          <p className="context-label">EMPRESA ATIVA</p>
          <strong>Alfa Comércio Ltda.</strong>
          <span>Filial Salvador · 0002-70</span>
          <span className="period-chip">Jul/2026</span>
          <button className="switch-company" onClick={() => navigate("Empresas")}>Trocar empresa</button>
          <small>Ctrl + T</small>
        </div>
        <div className="sidebar-user"><strong>Juliana Costa</strong><span>Analista contábil</span></div>
      </aside>
      <div className="main-shell">
        <header className="topbar">
          <button type="button" className="menu-toggle" onClick={() => setMenuOpen(true)} aria-controls="ledger-main-menu" aria-expanded={menuOpen} aria-label="Abrir menu">☰</button>
          <span className="topbar-mobile-brand" aria-label="LedgerFlow"><img src={brandMark} alt="" width="24" height="21"/></span><span className="topbar-title">{page}</span>
          <div className="topbar-period"><span>Competência</span><span className="period-selector">Jul/2026</span></div>
          <div className="topbar-search"><label htmlFor="global-search" className="sr-only">Buscar empresa, CNPJ ou documento</label><input id="global-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar empresa, CNPJ ou documento..." /></div>
          <div className="topbar-profile"><span className="avatar" aria-hidden="true">JC</span><span><strong>Juliana Costa</strong><small>Analista contábil</small></span></div>
        </header>
        <main className="content" id="conteudo-principal">
          {page === "Visão Geral" ? (
            <>
              <MobileOverview onNavigate={navigate}/>
              <div className="ledger-desktop-overview">
              <div className="dashboard-head">
                <div><h1>Bom dia, Juliana</h1><p>Acompanhe o fechamento das empresas na competência Jul/2026.</p></div>
                <div className="my-tasks"><div><small>Minhas Pendências</small><strong>23</strong></div><button className="link-button" onClick={() => setScope(scope === "all" ? "mine" : "all")}>Exibir: {scope === "all" ? "Todas as empresas" : "Minhas empresas"}</button></div>
              </div>
              <section className="metrics" aria-label="Indicadores da carteira">{metrics.map((metric) => <article className={"metric metric-" + metric.tone} key={metric.label}><strong>{metric.value}</strong><span>{metric.label}</span></article>)}</section>
              <section className="table-panel" aria-labelledby="table-heading">
                <div className="table-intro"><h2 id="table-heading">Fechamento por empresa</h2><p>Priorize o que precisa de atenção na sua carteira e no time.</p></div>
                <CompanyTable rows={visibleCompanies} onOpen={setSelected} />
                <p className="table-footnote">Atenção: risco considera prazo, bloqueios e impacto no fechamento.</p>
              </section>
              </div>
            </>
          ) : page === "Mais" ? (
            <MobileMore onNavigate={navigate}/>
          ) : (
            <>
              {mobileSpecial&&<div className={"ledger-mobile-module-summary"+(mobileExpanded?" is-collapsed":"")}>
                <MobileModule page={page} onNavigate={navigate} onExpand={view=>{setMobileInitialView(view||null);setMobileExpanded(true);}}/>
              </div>}
              <div className={"ledger-full-module"+(mobileSpecial&&!mobileExpanded?" is-collapsed":"")}>
                <Modules key={page+":"+(mobileInitialView||"index")} page={page} onNavigate={navigate} search={query} initialView={mobileInitialView}/>
              </div>
            </>
          )}
        </main>
      </div>
      <nav className="mobile-bottom-nav" aria-label="Navegação móvel">{["Visão Geral","Pendências","Obrigações","Mais"].map(item=><button type="button" key={item} onClick={()=>navigate(item)} aria-current={(item==="Mais"?!["Visão Geral","Pendências","Obrigações"].includes(page):page===item)?"page":undefined} className={(item==="Mais"?!["Visão Geral","Pendências","Obrigações"].includes(page):page===item)?"mobile-active":""}>{item==="Visão Geral"?"Início":item}</button>)}</nav>
      {selected && <DetailDrawer company={selected} onClose={()=>setSelected(null)} />}
    </div>
  );
}

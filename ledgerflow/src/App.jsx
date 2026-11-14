import { useEffect, useMemo, useState } from "react";
import brandMark from "./assets/ledgerflow-mark.svg";
import "./styles.css";

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
export default function App() {
  const [page, setPage] = useState("Visão Geral");
  const [query, setQuery] = useState("");
  const [scope, setScope] = useState("all");
  const [selected, setSelected] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const visibleCompanies = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    return companies.filter((company) =>
      (scope === "all" || company.owner === "Juliana") &&
      (term === "" || [company.name, company.status, company.owner, company.risk].some(v => v.toLocaleLowerCase("pt-BR").includes(term)))
    );
  }, [query, scope]);
  useEffect(() => {
    const onEscape = (event) => {
      if (event.key === "Escape") { setSelected(null); setMenuOpen(false); }
    };
    document.addEventListener("keydown", onEscape);
    return () => document.removeEventListener("keydown", onEscape);
  }, []);
  const navigate = (item) => {
    setPage(item);
    setQuery("");
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  return (
    <div className="app">
      {menuOpen && <button className="sidebar-scrim" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}
      <aside className={"sidebar" + (menuOpen ? " sidebar-open" : "")} aria-label="Menu principal">
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
          <button className="menu-toggle" onClick={() => setMenuOpen(true)} aria-label="Abrir menu">☰</button>
          <span className="topbar-title">{page}</span>
          <div className="topbar-period"><span>Competência</span><span className="period-selector">Jul/2026</span></div>
          <div className="topbar-search"><label htmlFor="global-search" className="sr-only">Buscar empresa, CNPJ ou documento</label><input id="global-search" type="search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Buscar empresa, CNPJ ou documento..." /></div>
          <div className="topbar-profile"><span className="avatar" aria-hidden="true">JC</span><span><strong>Juliana Costa</strong><small>Analista contábil</small></span></div>
        </header>
        <main className="content" id="conteudo-principal">
          {page === "Visão Geral" ? (
            <>
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
            </>
          ) : page === "Empresas" ? (
            <section className="companies-view">
              <div className="section-header"><h1>Empresas</h1><p>Consulte as empresas exibidas na carteira do protótipo.</p></div>
              <section className="table-panel"><CompanyTable rows={visibleCompanies} onOpen={setSelected} /></section>
            </section>
          ) : (
            <section className="module-placeholder">
              <p className="module-eyebrow">LEDGERFLOW · DEMONSTRAÇÃO FRONT-END</p>
              <h1>{page}</h1>
              <p>Este fluxo está documentado no projeto original do Figma. Esta primeira versão do front-end implementa a Visão Geral e a consulta de empresas; os demais fluxos ainda não foram reproduzidos aqui.</p>
              <button className="primary-button" onClick={() => navigate("Visão Geral")}>Voltar à Visão Geral</button>
              <a className="figma-link" href={FIGMA_URL} target="_blank" rel="noreferrer">Consultar telas no Figma</a>
            </section>
          )}
        </main>
      </div>
      {selected && (
        <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setSelected(null); }}>
          <section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title">
            <header><div><p className="module-eyebrow">DETALHES · CARTEIRA</p><h2 id="detail-title">{selected.name}</h2></div><button className="close-dialog" onClick={() => setSelected(null)} aria-label="Fechar detalhes">×</button></header>
            <dl className="detail-list">
              <div><dt>Situação</dt><dd>{selected.status}</dd></div>
              <div><dt>Bloqueios</dt><dd>{selected.blockers}</dd></div>
              <div><dt>Prazo</dt><dd>{selected.due}</dd></div>
              <div><dt>Responsável</dt><dd>{selected.owner}</dd></div>
              <div><dt>Risco</dt><dd><Pill risk={selected.risk} /></dd></div>
            </dl>
            <p className="detail-note">Dados ilustrativos do protótipo Figma. Nenhuma ação contábil real é executada.</p>
            <button className="primary-button" onClick={() => setSelected(null)}>Concluir consulta</button>
          </section>
        </div>
      )}
    </div>
  );
}

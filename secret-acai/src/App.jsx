import { useEffect, useState } from "react";
import Modules from "./Modules.jsx";

const navigation = ["Dashboard", "Vendas", "Estoque", "Clientes", "Prospecção", "Relatórios"];

const metrics = [
  { label: "Estoque atual", value: "1.248", unit: "itens", detail: "8 variações abaixo do ideal", tone: "brand" },
  { label: "Vendas da semana", value: "156", unit: "pedidos", detail: "↑ 12% vs. semana anterior", tone: "success" },
  { label: "Receita do mês", value: "R$ 28.430", detail: "↑ 8% vs. mês anterior", tone: "brand" },
  { label: "Sem compra recente", value: "23", unit: "clientes", detail: "Priorizar reativação esta semana", tone: "warning" },
];

const sales = [48, 72, 93, 64, 80, 51, 99, 68, 100, 87, 100, 76];
const recentClients = [
  { name: "Açaí Point", days: 98 },
  { name: "Tropical Lanches", days: 87 },
  { name: "Sabor & Cia", days: 76 },
  { name: "Deck do Açaí", days: 72 },
  { name: "Rei do Açaí", days: 65 },
];
const lowStock = [
  { name: "10L · Morango", quantity: "4 un." },
  { name: "5L · Banana", quantity: "3 un." },
  { name: "10L · Cupuaçu", quantity: "6 un." },
  { name: "5L · Tradicional", quantity: "5 un." },
];

function Sidebar({ active, onNavigate, mobileOpen, onClose }) {
  return (
    <>
      {mobileOpen && <button className="drawer-backdrop" aria-label="Fechar menu" onClick={onClose} />}
      <aside className={`sidebar${mobileOpen ? " sidebar--open" : ""}`} id="main-menu" aria-label="Navegação principal">
        <div className="brand"><span className="brand-mark" aria-hidden="true" /> <span>Secret Açaí</span></div>
        <nav aria-label="Seções da plataforma">
          {navigation.map((item) => (
            <button key={item} type="button" className={`nav-item${active === item ? " nav-item--active" : ""}`}
              aria-current={active === item ? "page" : undefined} onClick={() => { onNavigate(item); onClose(); }}>
              <span className="nav-dot" aria-hidden="true" />{item}
            </button>
          ))}
        </nav>
      </aside>
    </>
  );
}

function SummaryCard({ metric }) {
  return (
    <article className={`summary-card summary-card--${metric.tone}`}>
      <h2>{metric.label}</h2>
      <p className="metric-value">{metric.value} {metric.unit && <span>{metric.unit}</span>}</p>
      <p className="metric-detail">{metric.detail}</p>
    </article>
  );
}

function SalesChart({ period }) {
  const values = period === 7 ? sales.slice(-7) : sales;
  return (
    <section className="panel chart-panel" aria-labelledby="sales-title">
      <div className="panel-header"><h2 id="sales-title">Vendas no período</h2><span>{period === 7 ? "Últimos 7 dias" : "Últimos 30 dias"}</span></div>
      <div className="chart-grid" role="img" aria-label={`Gráfico demonstrativo de receita diária, com ${values.length} barras referentes a agosto de 2026.`}>
        <div className="chart-guides" aria-hidden="true"><i /><i /><i /><i /></div>
        {values.map((height, index) => (
          <div className="bar-column" key={`${period}-${index}`} aria-hidden="true">
            <div className={`bar${(index + (period === 7 ? 5 : 0)) % 2 === 0 ? "" : " bar--dark"}`} style={{ height: `${height}%` }} />
            <span>{String(period === 7 ? index + 6 : index + 1).padStart(2, "0")}</span>
          </div>
        ))}
      </div>
      <p className="chart-caption">Receita diária · agosto</p>
    </section>
  );
}

function DetailPanel({ title, id, children, hasLink = true }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <section className="panel detail-panel" aria-labelledby={id}>
      <div className="panel-header">
        <h2 id={id}>{title}</h2>
        {hasLink && <button type="button" className="text-button" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
          {expanded ? "Mostrar menos" : "Ver todos"}
        </button>}
      </div>
      <div className="detail-panel-body">{children}</div>
      {expanded && <p className="panel-note">Estes são os registros demonstrativos disponíveis nesta versão do dashboard.</p>}
    </section>
  );
}

function Dashboard({ period, onPeriodChange, onSaleClick, onMenuClick }) {
  return (
    <main id="conteudo" className="main-content">
      <header className="topbar">
        <div className="title-block"><button type="button" className="mobile-menu-button" onClick={onMenuClick} aria-controls="main-menu" aria-label="Abrir menu de navegação">Menu</button><h1>Dashboard</h1><p>Visão geral da operação e relacionamento com clientes</p></div>
        <div className="topbar-actions">
          <label className="period-select"><span className="filter-dot" aria-hidden="true" /><span className="sr-only">Período do gráfico</span>
            <select value={period} onChange={(e) => onPeriodChange(Number(e.target.value))}><option value={30}>Ago 2026</option><option value={7}>7 dias</option></select>
          </label>
          <button type="button" className="primary-button" onClick={onSaleClick}>+ Registrar venda</button>
          <div className="profile" aria-label="Usuário de demonstração: Nuno"><span className="profile-avatar" aria-hidden="true" />Nuno</div>
        </div>
      </header>
      <div className="metrics-grid" aria-label="Indicadores da operação">{metrics.map((metric) => <SummaryCard key={metric.label} metric={metric} />)}</div>
      <div className="insights-grid">
        <SalesChart period={period} />
        <DetailPanel title="Clientes sem compra recente" id="inactive-clients">
          <ol className="clients-list">{recentClients.map(({ name, days }, index) => <li key={name}><span className="rank">{index + 1}</span><strong>{name}</strong><span className="days">{days} dias</span></li>)}</ol>
        </DetailPanel>
        <section className="panel leads-panel" aria-labelledby="leads-title">
          <div className="panel-header"><h2 id="leads-title">Leads em prospecção</h2></div>
          <div className="lead-stats">{[{ count: 18, label: "Contatado" }, { count: 9, label: "Negociando" }, { count: 6, label: "Convertido" }].map(({ count, label }) => <div className="lead-stat" key={label}><strong>{count}</strong><span>{label}</span></div>)}</div>
          <p>6 leads avançaram de etapa nos últimos 7 dias</p>
        </section>
        <DetailPanel title="Baixo estoque" id="low-stock"><ul className="stock-list">{lowStock.map(({ name, quantity }) => <li key={name}><strong>{name}</strong><span>{quantity}</span></li>)}</ul></DetailPanel>
      </div>
    </main>
  );
}

export default function App() {
  const [active, setActive] = useState("Dashboard");
  const [period, setPeriod] = useState(30);
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { const onKey = (event) => { if (event.key === "Escape") setMobileOpen(false); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);
  return (
    <div className="app-shell">
      <a href="#conteudo" className="skip-link">Pular para o conteúdo</a>
      <Sidebar active={active} onNavigate={setActive} mobileOpen={mobileOpen} onClose={() => setMobileOpen(false)} />
      {active === "Dashboard" ? (
        <Dashboard period={period} onPeriodChange={setPeriod} onSaleClick={() => setActive("Vendas")} onMenuClick={() => setMobileOpen(true)} />
      ) : (
        <Modules active={active} onMenuClick={() => setMobileOpen(true)} onNavigate={setActive} />
      )}
    </div>
  );
}
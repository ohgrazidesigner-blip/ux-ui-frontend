import "./mobile.css";

/**
 * Mobile views follow Figma LedgerFlow / 05 · PRODUCT | Mobile.
 * All values are illustrative Jul/2026 design examples, not live accounting data.
 */
const moreItems = [
  ["Empresas", "Carteira e contexto"],
  ["Importações", "Lotes e exceções"],
  ["Conciliação", "Sugestões e evidências"],
  ["Fiscal", "Retenções e obrigações"],
  ["Relatórios", "DRE, Balancete e Razão"],
  ["Automação", "Regras e monitoramento"],
  ["Comunicações", "Solicitações e respostas"],
  ["Configurações", "Políticas e permissões"]
];

function MobileContext() {
  return <div className="mobile-active-context">
    <strong>Alfa Comércio · Salvador</strong><span>Jul/2026</span>
  </div>;
}

export function MobileOverview({ onNavigate }) {
  const priorities = [
    { name:"Delta Logística", status:"Alto", description:"2 bloqueios · prazo 14/08", high:true },
    { name:"Alfa Comércio · Salvador", status:"Atenção", description:"DCTFWeb aguardando revisão" },
    { name:"Beta Serviços", status:"Atenção", description:"Extrato bancário pendente" }
  ];
  return <section className="ledger-mobile-overview" aria-labelledby="ledger-mobile-overview-title">
    <MobileContext />
    <h1 id="ledger-mobile-overview-title">Visão geral</h1>
    <p className="ledger-mobile-subtitle">O que precisa da sua atenção agora.</p>
    <div className="ledger-mobile-kpis" aria-label="Indicadores demonstrativos de julho de 2026">
      <article><strong className="ledger-mobile-danger">3</strong><span>Risco alto</span></article>
      <article><strong className="ledger-mobile-danger">4</strong><span>Bloqueios</span></article>
      <article><strong className="ledger-mobile-blue">6</strong><span>Em andamento</span></article>
    </div>
    <h2>Prioridades</h2>
    <div className="ledger-mobile-priorities">
      {priorities.map(item=><article key={item.name}>
        <div><strong>{item.name}</strong><span className={item.high?"ledger-mobile-risk high":"ledger-mobile-risk"}>● {item.status}</span></div>
        <p>{item.description}</p>
      </article>)}
    </div>
    <div className="ledger-mobile-quick" aria-label="Acesso rápido">
      {["Empresas","Importações","Conciliação"].map(name=>
        <button key={name} type="button" onClick={()=>onNavigate(name)}>{name}</button>)}
    </div>
  </section>;
}

export function MobileMore({ onNavigate }) {
  return <section className="ledger-mobile-more" aria-labelledby="ledger-mobile-more-title">
    <MobileContext />
    <h1 id="ledger-mobile-more-title">Mais</h1>
    <p className="ledger-mobile-subtitle">Acesse os demais módulos do LedgerFlow.</p>
    <div className="ledger-mobile-more-items">
      {moreItems.map(([name,subtitle])=>
        <button type="button" key={name} onClick={()=>onNavigate(name)}>
          <span><strong>{name}</strong><small>{subtitle}</small></span><span className="ledger-mobile-chevron" aria-hidden="true">›</span>
        </button>)}
    </div>
  </section>;
}

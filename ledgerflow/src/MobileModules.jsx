import { useState } from "react";
import { MobileContext } from "./MobileViews.jsx";
import "./mobile-modules.css";

/** Original sample screens from Figma: M03, M05, M08, M10 and M14. */
function Heading({ title, subtitle }) {
  return <><h1 className="lfm-title">{title}</h1><p className="lfm-subtitle">{subtitle}</p></>;
}
function Stat({ value, caption, tone }) {
  return <article className="lfm-stat"><strong className={"lfm-tone-"+tone}>{value}</strong><span>{caption}</span></article>;
}
function State({label,tone}) {
  return <span className={"lfm-status lfm-status-"+tone}>● {label}</span>;
}
function Companies({ onExpand }) {
  const [query,setQuery]=useState("");
  const records=[
    ["Alfa Comércio · Matriz","12.345.678/0001-99","Em andamento","info"],
    ["Alfa Comércio · Salvador","12.345.678/0002-70","Em andamento","info"],
    ["Delta Logística","34.567.890/0001-55","Com bloqueios","danger"],
    ["Horizonte Tecnologia","45.678.901/0001-66","Com bloqueios","danger"]
  ].filter(r=>r[0].toLowerCase().includes(query.toLowerCase())||r[1].includes(query));
  return <>
    <Heading title="Empresas" subtitle=""/>
    <label className="lfm-search"><span className="sr-only">Buscar empresa ou CNPJ</span><input type="search" placeholder="⌕   Buscar empresa ou CNPJ..." value={query} onChange={e=>setQuery(e.target.value)}/></label>
    <div className="lfm-stack">
      {records.map(([name,cnpj,label,tone])=><button className="lfm-company" key={cnpj} onClick={()=>onExpand()}>
        <span><strong>{name}</strong><small>{cnpj}</small></span><State label={label} tone={tone}/>
      </button>)}
      {!records.length&&<p role="status">Nenhuma empresa corresponde à busca.</p>}
    </div>
    <p className="lfm-disclosure">Quatro exemplos móveis do Figma. A carteira completa é demonstrativa.</p>
  </>;
}
function Imports({onExpand}) {
  return <>
    <Heading title="Importações" subtitle="Acompanhe o lote e revise apenas o que exige atenção."/>
    <div className="lfm-stats"><Stat value="288" caption="Sucesso" tone="success"/><Stat value="12" caption="Atenção" tone="warning"/><Stat value="0" caption="Falhas" tone="success"/></div>
    <article className="lfm-panel lfm-import-panel">
      <h2>Lote bancário · Jul/2026</h2><p>300 arquivos · processamento concluído</p>
      <div className="lfm-dual"><strong className="lfm-tone-success">288 disponíveis para conciliação</strong><strong className="lfm-tone-warning">12 requerem atenção</strong></div>
    </article>
    <div className="lfm-actions"><button className="lfm-primary" onClick={()=>onExpand("Resultado")}>Revisar exceções</button><button onClick={()=>onExpand("Histórico")}>Ver histórico</button></div>
    <h2 className="lfm-section-title">Histórico recente</h2>
    <div className="lfm-history"><div><strong>Banco XYZ</strong><span>288 / 300</span><small>Hoje · 08:42</small></div><div><strong>CEF · OFX</strong><span>156 / 156</span><small>Ontem · 18:33</small></div></div>
  </>;
}
function Fiscal({onNavigate}) {
  const items=[
    ["ISS Salvador","Hoje","Pronta para transmitir","success"],
    ["EFD-Reinf","Amanhã","Em revisão","info"],
    ["DCTFWeb","14/08","Bloqueada","danger"]
  ];
  return <>
    <Heading title="Fiscal" subtitle="Acompanhe o que exige revisão antes das transmissões."/>
    <div className="lfm-stats"><Stat value="2" caption="Vencem logo" tone="warning"/><Stat value="1" caption="Bloqueada" tone="danger"/><Stat value="3" caption="Notas com retenção" tone="info"/></div>
    <div className="lfm-stack">{items.map(([name,date,label,tone])=><button className="lfm-fiscal-row" key={name} onClick={()=>onNavigate("Obrigações")}><span><strong>{name}</strong><small>{date}</small></span><State label={label} tone={tone}/></button>)}</div>
    <div className="lfm-fiscal-banner"><strong>Dependência crítica</strong><p>EFD-Reinf precisa ser concluída antes de liberar a DCTFWeb para revisão.</p><button onClick={()=>onNavigate("Obrigações")}>Abrir obrigações</button></div>
  </>;
}
function Reports({onExpand}) {
  const items=[
    ["DRE","Resultado e composição das contas","Disponível","success","dre","Abrir DRE"],
    ["Balancete","Saldos por conta","Disponível","success","balancete","Abrir"],
    ["Razão","Lançamentos e contrapartidas","Explorar","info","composicao","Abrir"],
    ["Fechamento","Validações e pendências","Atenção","warning","fechamento","Abrir fechamento"]
  ];
  return <>
    <Heading title="Relatórios" subtitle="Consulte valores e siga até a evidência de origem."/>
    <div className="lfm-stack">{items.map(([name,desc,status,tone,target,label])=><article className="lfm-report" key={name}>
      <div><h2>{name}</h2><State tone={tone} label={status}/></div>
      <p>{desc}</p><button onClick={()=>onExpand(target)}>{label}</button>
    </article>)}</div>
    <div className="lfm-trace"><strong>Rastreabilidade</strong><p>DRE → composição → lançamento → documento de origem.</p></div>
  </>;
}
function Pending({onExpand,onNavigate}) {
  const items=[
    ["Delta Logística","Divergência bancária","Impede conciliação","Crítica","danger","Conciliação"],
    ["Alfa Comércio","AJ-0717-204 sem documento","Impede fechamento","Crítica","danger","Relatórios"],
    ["Alfa Comércio","3 notas com retenção","Bloqueia Reinf/DCTFWeb","Atenção","warning","Fiscal"],
    ["Beta Serviços","Extrato de julho ausente","Aguarda cliente","Atenção","warning","Comunicações"]
  ];
  return <>
    <Heading title="Pendências" subtitle="Sua fila priorizada por impacto e dependência."/>
    <div className="lfm-stats"><Stat value="23" caption="Minha fila" tone="neutral"/><Stat value="7" caption="Críticas" tone="danger"/><Stat value="8" caption="Cliente" tone="warning"/></div>
    <div className="lfm-stack">{items.map(([name,description,impact,status,tone,destination],i)=><article className="lfm-pending" key={name+i}>
      <div><small>{name}</small><State label={status} tone={tone}/></div>
      <strong>{description}</strong><p>{impact}</p>
      <button onClick={()=>destination==="Relatórios"?onExpand("fechamento"):onNavigate(destination)}>Abrir pendência</button>
    </article>)}</div>
  </>;
}

export default function MobileModule({page,onNavigate,onExpand}) {
  const view={
    "Empresas":<Companies onExpand={onExpand}/>,
    "Importações":<Imports onExpand={onExpand}/>,
    "Fiscal":<Fiscal onNavigate={onNavigate}/>,
    "Pendências":<Pending onExpand={onExpand} onNavigate={onNavigate}/>,
    "Relatórios":<Reports onExpand={onExpand}/>
  }[page];
  return <section className="lfm-screen"><MobileContext/>{view}</section>;
}

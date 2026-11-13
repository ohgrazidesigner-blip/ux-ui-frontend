import { useEffect, useRef, useState } from "react";
import "./modules.css";

const seedStock = [
  { id: "10L-Tradicional", size: "10L", flavor: "Tradicional", quantity: 32, price: 120 },
  { id: "10L-Morango", size: "10L", flavor: "Morango", quantity: 14, price: 120 },
  { id: "10L-Cupuaçu", size: "10L", flavor: "Cupuaçu", quantity: 8, price: 120 },
  { id: "10L-Banana", size: "10L", flavor: "Banana", quantity: 18, price: 120 },
  { id: "5L-Tradicional", size: "5L", flavor: "Tradicional", quantity: 21, price: 65 },
  { id: "5L-Morango", size: "5L", flavor: "Morango", quantity: 17, price: 65 },
  { id: "5L-Cupuaçu", size: "5L", flavor: "Cupuaçu", quantity: 13, price: 65 },
  { id: "5L-Banana", size: "5L", flavor: "Banana", quantity: 6, price: 65 },
];
const seedClients = [
  { name: "Açaí Point", delivery: "Uber", last: "20/08/26", days: 2, status: "Ativo", revenue: "R$ 2.150" },
  { name: "Tropical Lanches", delivery: "Retirada", last: "02/08/26", days: 20, status: "Atenção", revenue: "R$ 1.870" },
  { name: "Sabor & Cia", delivery: "Uber", last: "24/07/26", days: 28, status: "Atenção", revenue: "R$ 950" },
  { name: "Deck do Açaí", delivery: "Retirada", last: "15/07/26", days: 37, status: "Inativo", revenue: "R$ 1.320" },
  { name: "Rei do Açaí", delivery: "Uber", last: "10/06/26", days: 73, status: "Inativo", revenue: "R$ 2.600" },
  { name: "Açaí do Bairro", delivery: "Uber", last: "25/05/26", days: 87, status: "Inativo", revenue: "R$ 780" },
  { name: "Sabor Natural", delivery: "Retirada", last: "05/05/26", days: 107, status: "Inativo", revenue: "R$ 620" },
  { name: "Frutos do Açaí", delivery: "Uber", last: "15/04/26", days: 128, status: "Inativo", revenue: "R$ 1.040" },
];
const seedLeads = [
  { id: 1, name: "Açaí Point", person: "Camila Silva", note: "Interessada em compras semanais", source: "Google Maps", stage: "Contatado" },
  { id: 2, name: "Tropical Lanches", person: "Lucas Martins", note: "Busca opção sem adição de açúcar", source: "Instagram", stage: "Contatado" },
  { id: 3, name: "Sabor & Cia", person: "Juliana Costa", note: "Solicitou catálogo completo", source: "Indicação", stage: "Contatado" },
  { id: 4, name: "Deck do Açaí", person: "Rafael Souza", note: "Negociando preço por volume", source: "Instagram", stage: "Negociando" },
  { id: 5, name: "Rei do Açaí", person: "Fernanda Lima", note: "Aguardando proposta atualizada", source: "Google Maps", stage: "Negociando" },
  { id: 6, name: "Açaí Premium Shop", person: "Bruno Alves", note: "Quer desconto para pagamento à vista", source: "Indicação", stage: "Negociando" },
  { id: 7, name: "Granola House", person: "Mariana Freitas", note: "Primeiro pedido realizado", source: "Google Maps", stage: "Convertido" },
  { id: 8, name: "Bowls & Cia", person: "Thiago Melo", note: "Pedidos recorrentes semanais", source: "Instagram", stage: "Convertido" },
  { id: 9, name: "Pitaya Bowls", person: "Ana Ribeiro", note: "Fornecimento mensal fechado", source: "Indicação", stage: "Convertido" },
];
const seedMovements = [
  { when: "Hoje, 15:42", type: "Entrada", product: "10L Tradicional", quantity: "20 caixas", reason: "Produção" },
  { when: "Hoje, 11:10", type: "Saída", product: "5L Cupuaçu", quantity: "5 caixas", reason: "Venda #1567" },
  { when: "Ontem, 17:30", type: "Entrada", product: "5L Banana", quantity: "10 caixas", reason: "Produção" },
  { when: "Ontem, 09:15", type: "Saída", product: "10L Morango", quantity: "3 caixas", reason: "Venda #1562" },
];
const currency = (amount) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format(Number(amount) || 0);
const statusFor = (count) => count < 10 ? "Baixo" : count < 18 ? "Atenção" : "Saudável";
function useStored(key, initial) {
  const [value, setValue] = useState(() => {
    try { const saved = window.localStorage.getItem(key); return saved ? JSON.parse(saved) : initial; }
    catch { return initial; }
  });
  useEffect(() => { try { window.localStorage.setItem(key, JSON.stringify(value)); } catch { /* Browsers can block storage. */ } }, [key, value]);
  return [value, setValue];
}
function Status({ value }) {
  const kind = value === "Saudável" || value === "Ativo" || value === "Convertido" ? "ok" :
    value === "Atenção" || value === "Negociando" ? "warn" : "danger";
  return <span className={"m-status m-status--" + kind}>{value}</span>;
}
function Metric({ label, value, helper, tone = "brand" }) {
  return <article className={"summary-card summary-card--" + tone}><h2>{label}</h2><p className="metric-value">{value}</p><p className="metric-detail">{helper}</p></article>;
}
function Modal({ title, description, children, onClose }) {
  const container = useRef(null);
  useEffect(() => {
    container.current?.focus();
    const onKey = (event) => { if (event.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);
  return <div className="dialog-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose(); }}>
    <section ref={container} tabIndex={-1} className="dialog m-dialog" role="dialog" aria-modal="true" aria-labelledby="m-modal-title">
      <div className="m-dialog-head"><div><h2 id="m-modal-title">{title}</h2>{description && <p>{description}</p>}</div>
        <button className="m-close" type="button" onClick={onClose} aria-label="Fechar janela">×</button></div>
      {children}
    </section>
  </div>;
}
function Header({ title, subtitle, onMenuClick, children }) {
  return <header className="topbar m-topbar">
    <div className="title-block"><button type="button" className="mobile-menu-button" aria-controls="main-menu" onClick={onMenuClick}>Menu</button><h1>{title}</h1><p>{subtitle}</p></div>
    <div className="m-actions">{children}</div>
  </header>;
}
function Field({ label, children, required = false }) {
  return <label className="m-field"><span>{label}{required && " *"}</span>{children}</label>;
}
function Select({ value, onChange, choices, className = "" }) {
  return <select className={"m-control " + className} value={value} onChange={(e) => onChange(e.target.value)}>
    {choices.map((item) => typeof item === "string" ? <option key={item} value={item}>{item}</option> :
      <option key={item.value} value={item.value}>{item.label}</option>)}
  </select>;
}
function Table({ headings, children }) {
  return <div className="m-table-scroll"><table className="m-table"><thead><tr>{headings.map(h => <th scope="col" key={h}>{h}</th>)}</tr></thead><tbody>{children}</tbody></table></div>;
}
const flavors = ["Tradicional", "Morango", "Cupuaçu", "Banana"];
const srcOptions = ["Google Maps", "Instagram", "Indicação"];
const stages = ["Contatado", "Negociando", "Convertido"];

export default function Modules({ active, onMenuClick, onNavigate }) {
  const [stock, setStock] = useStored("secret-acai-stock-2026-v1", seedStock);
  const [clients, setClients] = useStored("secret-acai-clients-2026-v1", seedClients);
  const [leads, setLeads] = useStored("secret-acai-leads-2026-v1", seedLeads);
  const [movements, setMovements] = useStored("secret-acai-moves-2026-v1", seedMovements);
  const [orders, setOrders] = useStored("secret-acai-sales-2026-v1", []);
  const [modal, setModal] = useState("");
  const [query, setQuery] = useState("");
  const [sizeFilter, setSizeFilter] = useState("Todos");
  const [flavorFilter, setFlavorFilter] = useState("Todos");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [clientDeliveryFilter, setClientDeliveryFilter] = useState("Todas");
  const [originFilter, setOriginFilter] = useState("Todas");
  const [reportMode, setReportMode] = useState("Semanal");
  const [size, setSize] = useState("10L");
  const [flavor, setFlavor] = useState("Tradicional");
  const [quantity, setQuantity] = useState(4);
  const [finalPrice, setFinalPrice] = useState(110);
  const [delivery, setDelivery] = useState("Uber");
  const [uberCost, setUberCost] = useState(24.9);
  const [selectedClient, setSelectedClient] = useState("Açaí Point");
  const [formError, setFormError] = useState("");
  const [successId, setSuccessId] = useState(1568);
  const [activeLeadId, setActiveLeadId] = useState(null);
  const product = stock.find(p => p.size === size && p.flavor === flavor) || stock[0];
  const subtotal = quantity * Number(finalPrice);
  const discount = product ? Math.max(0, (1 - Number(finalPrice) / product.price) * 100) : 0;
  const changeScreen = (name) => { setQuery(""); setStatusFilter("Todos"); onNavigate(name); };
  const open = (name) => { setFormError(""); setModal(name); };
  const close = () => { setModal(""); setFormError(""); };
  const createdNow = () => new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" });
  const updateStock = (id, diff) => setStock(items => items.map(p => p.id === id ? { ...p, quantity: Math.max(0, p.quantity + diff) } : p));
  const newMovement = (type, p, qty, reason) => setMovements(items =>
    [{ when: createdNow(), type, product: p.size + " " + p.flavor, quantity: Math.abs(qty) + " caixas", reason }, ...items]);
  function requestSale() {
    if (!selectedClient || !Number.isInteger(Number(quantity)) || Number(quantity) <= 0) { setFormError("Selecione um cliente e informe uma quantidade válida."); return; }
    if (quantity > product.quantity) { setFormError("Estoque insuficiente: há " + product.quantity + " caixas disponíveis."); return; }
    if (Number(finalPrice) <= 0) { setFormError("Informe um valor final maior que zero."); return; }
    if (discount > 10) { open("approval"); return; }
    open("saleConfirm");
  }
  function confirmSale() {
    if (quantity > product.quantity) { setFormError("Estoque insuficiente. Verifique o saldo antes de confirmar."); return; }
    const orderNumber = 1568 + orders.length;
    updateStock(product.id, -quantity);
    newMovement("Saída", product, quantity, "Venda #" + orderNumber);
    setOrders(prev => [{ id: orderNumber, client: selectedClient, product: product.id, quantity, total: subtotal, delivery }, ...prev]);
    setSuccessId(orderNumber);
    open("saleSuccess");
  }
  const stockRows = stock.filter(p => (sizeFilter === "Todos" || p.size === sizeFilter) &&
    (flavorFilter === "Todos" || p.flavor === flavorFilter) &&
    (statusFilter === "Todos" || statusFor(p.quantity) === statusFilter));
  const clientRows = clients.filter(c => c.name.toLowerCase().includes(query.toLowerCase()) &&
    (clientDeliveryFilter === "Todas" || c.delivery === clientDeliveryFilter) &&
    (statusFilter === "Todos" || c.status === statusFilter));
  const leadRows = leads.filter(l => [l.name, l.person, l.note].some(x => x.toLowerCase().includes(query.toLowerCase())) &&
    (originFilter === "Todas" || l.source === originFilter));
  function handleClientForm(e) {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const name = String(data.get("name") || "").trim();
    if (!name) return;
    if (clients.some(c => c.name.toLowerCase() === name.toLowerCase())) { setFormError("Já existe um cliente com esse nome."); return; }
    setClients(prev => [{ name, delivery: String(data.get("delivery")), last: "—", days: 0, status: "Ativo", revenue: "R$ 0" }, ...prev]);
    setSelectedClient(name); close();
  }
  function handleStockForm(e) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const id = String(d.get("size")) + "-" + String(d.get("flavor"));
    const p = stock.find(item => item.id === id);
    const qty = Number(d.get("quantity"));
    if (!p || !Number.isInteger(qty) || qty < 0) { setFormError("Informe um número válido de caixas."); return; }
    if (modal === "stockAdjust" && !String(d.get("reason") || "").trim()) { setFormError("Informe o motivo do ajuste."); return; }
    const delta = modal === "stockAdjust" ? qty - p.quantity : qty;
    updateStock(id, delta);
    newMovement(delta >= 0 ? "Entrada" : "Saída", p, delta, modal === "stockAdjust" ? "Ajuste: " + d.get("reason") : "Produção");
    close();
  }
  function handleLeadForm(e) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    const name = String(d.get("name") || "").trim();
    if (!name) return;
    setLeads(items => [...items, { id: Date.now(), name, person: String(d.get("person") || ""), note: String(d.get("note") || ""), source: String(d.get("source")), stage: "Contatado" }]);
    close();
  }
  function updateLead(e) {
    e.preventDefault();
    const d = new FormData(e.currentTarget);
    setLeads(items => items.map(item => item.id === activeLeadId ? { ...item, stage: String(d.get("stage")), note: String(d.get("note")) } : item));
    close();
  }
  const selectedLead = leads.find(l => l.id === activeLeadId);
  return <main className="main-content module-main" id="conteudo">
    {active === "Vendas" && <>
      <Header title="Registrar venda" subtitle="Registre o pedido e atualize estoque e histórico automaticamente" onMenuClick={onMenuClick} />
      <div className="m-sale-layout">
        <div className="m-sale-steps">
          <section className="panel m-section"><h2>1. Cliente</h2><div className="m-client-choose">
            <select aria-label="Buscar cliente por nome" className="m-control" value={selectedClient} onChange={e => setSelectedClient(e.target.value)}>
              <option value="">Buscar por nome, telefone ou CPF</option>{clients.map(c => <option key={c.name}>{c.name}</option>)}</select>
            <button className="m-outline-button" type="button" onClick={() => open("clientNew")}>+ Cadastrar cliente</button>
          </div></section>
          <section className="panel m-section"><h2>2. Produto</h2><div className="m-fields-row">
            <Field label="Tamanho"><Select value={size} onChange={(v) => { setSize(v); setFinalPrice(v === "10L" ? 110 : 65); }} choices={["10L", "5L"]} /></Field>
            <Field label="Sabor"><Select value={flavor} onChange={setFlavor} choices={flavors} /></Field>
            <Field label="Quantidade"><input className="m-control" aria-label="Quantidade de caixas" min="1" step="1" type="number" value={quantity} onChange={e => setQuantity(Number(e.target.value))} /></Field>
          </div><p className={"m-assist " + (product.quantity < quantity ? "m-text-danger" : "m-text-success")}>Disponível em estoque: {product.quantity} caixas</p></section>
          <section className="panel m-section"><h2>3. Condição comercial</h2><div className="m-fields-row m-fields-two">
            <Field label="Preço de tabela"><input className="m-control" value={currency(product.price)} readOnly /></Field>
            <Field label="Valor final por caixa"><input className="m-control" aria-label="Valor final por caixa" type="number" step="0.01" min="0.01" value={finalPrice} onChange={e => setFinalPrice(Number(e.target.value))} /></Field>
          </div><p className={"m-assist " + (discount > 10 ? "m-text-danger" : "m-text-success")}>Desconto aplicado: {discount.toFixed(1).replace(".", ",")}% · {discount > 10 ? "autorização necessária" : "dentro do limite permitido"}</p></section>
          <section className="panel m-section"><h2>4. Entrega</h2><div className="m-delivery-options">
            {["Uber", "Retirada"].map(method => <button key={method} className={"m-choice " + (delivery === method ? "m-choice--selected" : "")} onClick={() => setDelivery(method)} type="button"><strong>{method}</strong><span>{delivery === method ? "Selecionado" : "Clique para selecionar"}</span></button>)}
            <Field label="Custo do Uber"><input className="m-control" type="number" min="0" step="0.01" disabled={delivery !== "Uber"} value={delivery === "Uber" ? uberCost : 0} onChange={e => setUberCost(Number(e.target.value))} /></Field>
          </div></section>
          <div className="m-warning"><strong>Atenção</strong><span>Ao confirmar, {quantity} caixas de {size} {flavor} serão baixadas do estoque.</span></div>
          {formError && <p className="m-error" role="alert">{formError}</p>}
        </div>
        <aside className="panel m-sale-summary"><h2>Resumo do pedido</h2><p className="m-purple">{selectedClient || "Selecione um cliente"} · {size} · {flavor}</p>
          <div className="m-summary-line"><span>Quantidade</span><strong>{quantity} caixas</strong></div>
          <div className="m-summary-line"><span>Preço unitário</span><strong>{currency(finalPrice)}</strong></div>
          <div className="m-summary-line"><span>Subtotal</span><strong>{currency(subtotal)}</strong></div>
          <div className="m-summary-line"><span>Entrega {delivery}</span><strong>{delivery === "Uber" ? currency(uberCost) : "Sem custo"}</strong></div>
          <div className="m-total"><span>Total do pedido</span><strong>{currency(subtotal)}</strong><small>Valor cobrado do cliente</small></div>
          <div className="m-impact"><strong>Impacto no estoque</strong><span>{product.quantity} → {Math.max(0, product.quantity - quantity)} caixas após confirmar</span></div>
          <button type="button" className="primary-button m-full-button" onClick={requestSale}>Confirmar venda</button>
        </aside>
      </div>
      {orders.length > 0 && <section className="panel m-recent-orders"><h2>Vendas registradas nesta demonstração</h2><Table headings={["Pedido", "Cliente", "Produto", "Caixas", "Valor"]}>{orders.map(o => <tr key={o.id}><td>#{o.id}</td><td>{o.client}</td><td>{o.product.replace("-", " · ")}</td><td>{o.quantity}</td><td>{currency(o.total)}</td></tr>)}</Table></section>}
    </>}
    {active === "Estoque" && <>
      <Header title="Estoque" subtitle="Controle por tamanho e sabor, com entradas e baixas automáticas" onMenuClick={onMenuClick}>
        <button type="button" className="m-outline-button" onClick={() => open("stockEntry")}>Registrar entrada</button>
        <button type="button" className="primary-button" onClick={() => open("stockAdjust")}>Ajustar estoque</button>
      </Header>
      <div className="m-metrics-three">
        <Metric label="Saldo total" value="1.248 caixas" helper="8 variações" />
        <Metric label="Baixo estoque" value="18 itens" helper="Atenção necessária" tone="warning" />
        <Metric label="Última movimentação" value={movements[0]?.when || "Hoje, 15:42"} helper={movements[0]?.type === "Entrada" ? "Entrada de " + movements[0].quantity : "Movimentação registrada"} tone="success" />
      </div>
      <div className="m-toolbar">
        <Select value={sizeFilter} onChange={setSizeFilter} choices={["Todos", "10L", "5L"].map(v => ({value:v,label: "Tamanho · " + v}))} />
        <Select value={flavorFilter} onChange={setFlavorFilter} choices={["Todos", ...flavors].map(v => ({value:v,label:"Sabor · " + v}))} />
        <Select value={statusFilter} onChange={setStatusFilter} choices={["Todos", "Saudável", "Atenção", "Baixo"].map(v=>({value:v,label:"Status · " + v}))} />
        <span className="m-stock-warning">{stock.filter(p => statusFor(p.quantity) === "Baixo").length} variações precisam de reposição prioritária</span>
      </div>
      <section className="panel m-table-panel"><Table headings={["Produto", "Tamanho", "Sabor", "Saldo atual", "Preço tabela", "Status"]}>{stockRows.map(p =>
        <tr key={p.id}><td>Açaí Secret</td><td>{p.size}</td><td>{p.flavor}</td><td>{p.quantity} caixas</td><td>{currency(p.price)}</td><td><Status value={statusFor(p.quantity)} /></td></tr>)}</Table></section>
      <section className="panel m-movement-panel"><h2>Histórico de movimentações</h2><Table headings={["Data", "Tipo", "Produto", "Quantidade", "Origem / motivo"]}>{movements.map((m,i) => <tr key={i}><td>{m.when}</td><td><span className={"m-status m-status--" + (m.type === "Entrada" ? "ok" : "brand")}>{m.type}</span></td><td>{m.product}</td><td>{m.quantity}</td><td>{m.reason}</td></tr>)}</Table></section>
    </>}
    {active === "Clientes" && <>
      <Header title="Clientes" subtitle="Histórico, recorrência e oportunidades de reativação" onMenuClick={onMenuClick}>
        <button type="button" className="primary-button" onClick={() => open("clientNew")}>+ Novo cliente</button>
      </Header>
      <div className="m-metrics-three">
        <Metric label="Clientes ativos" value="184" helper="Compraram recentemente" tone="success" />
        <Metric label="Sem compra recente" value="67" helper="Priorizar análise" tone="warning" />
        <Metric label="Novos no mês" value="12" helper="Primeira compra em agosto" />
      </div>
      <div className="m-toolbar">
        <input className="m-control m-search" placeholder="Buscar cliente, negócio ou telefone..." aria-label="Buscar clientes" value={query} onChange={e=>setQuery(e.target.value)} />
        <Select value={clientDeliveryFilter} onChange={setClientDeliveryFilter} choices={["Todas","Uber","Retirada"].map(v=>({value:v,label:"Entrega · " + v}))} />
        <Select value={statusFilter} onChange={setStatusFilter} choices={["Todos","Ativo","Atenção","Inativo"].map(v=>({value:v,label:"Status · " + v}))} />
        <span className="m-date-tag">Última compra · Todos</span>
      </div>
      <div className="m-clients-grid">
        <section className="panel m-table-panel"><Table headings={["Cliente","Entrega","Último pedido","Sem comprar","Status","Receita"]}>{clientRows.map(c=>
          <tr key={c.name}><td><strong>{c.name}</strong></td><td>{c.delivery}</td><td>{c.last}</td><td>{c.days ? c.days + " dias" : "—"}</td><td><Status value={c.status} /></td><td>{c.revenue}</td></tr>)}</Table>
          {!clientRows.length && <p className="m-muted">Nenhum cliente corresponde aos filtros.</p>}
        </section>
        <aside className="panel m-ranking"><h2>Há mais tempo sem comprar</h2><p className="m-muted">Ranking para orientar contato comercial</p>
          {[{name:"Açaí Express",days:162},{name:"Mix Açaí",days:145}, ...seedClients.filter(c=>c.days>=87).sort((a,b)=>b.days-a.days)].slice(0,5).map((c,i)=>
            <div key={c.name} className="m-rank-row"><span>{i+1}</span><strong>{c.name}</strong><small>{c.days} dias</small></div>)}
          <button className="m-cta-card" type="button" onClick={() => open("reactivation")}><strong>Reativar clientes</strong><span>Crie uma lista de contatos prioritários</span></button>
          <div className="m-hint"><strong>Critério de inatividade</strong><span>Será ajustado com base no histórico real de recompra dos clientes.</span></div>
        </aside>
      </div>
    </>}
    {active === "Prospecção" && <>
      <Header title="Prospecção" subtitle="Organize contatos, negociações e conversões em um único funil" onMenuClick={onMenuClick}>
        <button className="m-outline-button" type="button" onClick={()=>open("import")}>Importar lista</button>
        <button className="primary-button" type="button" onClick={()=>open("leadNew")}>+ Novo lead</button>
      </Header>
      <div className="m-toolbar"><input className="m-control m-search" placeholder="Buscar empresa, contato ou telefone..." aria-label="Buscar leads" value={query} onChange={e=>setQuery(e.target.value)} />
        <Select value={originFilter} onChange={setOriginFilter} choices={["Todas", ...srcOptions].map(v=>({value:v,label:"Origem · " + v}))} />
        <span className="m-date-tag">Responsável · Todos</span>
      </div>
      <div className="m-metrics-four">
        <Metric label="Contatado" value="18" helper="novos contatos" />
        <Metric label="Negociando" value="9" helper="oportunidades abertas" tone="warning" />
        <Metric label="Convertido" value="6" helper="viraram clientes" tone="success" />
        <Metric label="Taxa de conversão" value="33%" helper="no período" />
      </div>
      <div className="m-kanban">{stages.map(stage=>{
        const items = leadRows.filter(l=>l.stage===stage);
        return <section className={"m-lane m-lane--" + stage.toLowerCase()} key={stage}>
          <div className="m-lane-head"><strong>{stage}</strong><span>{items.length}</span></div>
          {items.map(lead=><article className="m-lead-card" key={lead.id}>
            <div className="m-lead-top"><strong>{lead.name}</strong><span>{lead.source}</span></div>
            <small>{lead.person}</small><p>{lead.note}</p>
            <div className="m-lead-actions"><button type="button" onClick={()=>{setActiveLeadId(lead.id);open("leadContact");}}>WhatsApp</button>
              <button type="button" onClick={()=>{setActiveLeadId(lead.id);open("followUp");}}>Follow-up</button></div>
          </article>)}
          {!items.length && <p className="m-muted">Nenhum lead nesta etapa.</p>}
        </section>;
      })}</div>
    </>}
    {active === "Relatórios" && <>
      <Header title="Relatórios" subtitle="Acompanhe desempenho semanal e mensal com comparação entre períodos" onMenuClick={onMenuClick}>
        <button type="button" className="primary-button" onClick={()=>window.print()}>Exportar PDF</button>
      </Header>
      <div className="panel m-report-toolbar"><div className="m-segment">{["Semanal","Mensal"].map(m=><button key={m} type="button" aria-pressed={reportMode===m} className={reportMode===m?"selected":""} onClick={()=>setReportMode(m)}>{m}</button>)}</div>
        <span className="m-date-tag">01/08/2026</span><span className="m-date-tag">20/08/2026</span><span className="m-muted m-report-annotation">{reportMode} · valores de referência do Figma</span>
      </div>
      <div className="m-metrics-four m-report-metrics">
        <Metric label="Caixas vendidas" value="1.248" helper="↑ 12% vs. período anterior" />
        <Metric label="Receita bruta" value="R$ 28.430" helper="↑ 8% vs. período anterior" tone="success" />
        <Metric label="Custos Uber" value="R$ 1.842" helper="↓ 5% vs. período anterior" tone="warning" />
        <Metric label="Receita após entrega" value="R$ 26.588" helper="Não inclui custo de produção" />
      </div>
      <div className="m-report-grid"><section className="panel m-report-chart"><h2>Vendas x período</h2>
        <div className="m-report-chartbars">{[35,57,43,73,37,80,62,80,65,81].map((v,i)=><div className="m-report-bar" key={i}><div className={"m-report-pillar " + (i%2?"dark":"")} style={{height:v+"%"}} /><span>{String(i+1).padStart(2,"0")}</span></div>)}</div>
      </section><section className="panel"><h2>Comparativo de períodos</h2><Table headings={["Indicador","Atual","Anterior","Variação"]}>
        {[["Caixas vendidas","1.248","1.114","+12%"],["Ticket médio","R$ 22,78","R$ 21,47","+6%"],["Custos Uber","R$ 1.842","R$ 1.934","-5%"],["Receita após entrega","R$ 26.588","R$ 24.391","+10%"]].map(x=><tr key={x[0]}>{x.map((v,i)=><td key={i} className={i===3?"m-text-success":""}>{v}</td>)}</tr>)}
      </Table></section></div>
      <div className="m-report-lower"><section className="panel"><h2>Clientes ativos vs. sem compra</h2><div className="m-ratio m-ratio-ok"><span>Clientes ativos</span><strong>87 clientes · 72%</strong></div><div className="m-ratio m-ratio-warn"><span>Sem compra recente</span><strong>34 clientes · 28%</strong></div></section>
        <section className="panel"><h2>Resumo por cliente</h2><Table headings={["Cliente","Pedidos","Caixas","Receita","Última compra"]}>{[
          ["Açaí Point","98","256","R$ 5.792","18/08/26"],
          ["Tropical Lanches","87","208","R$ 4.672","19/08/26"],
          ["Sabor & Cia","76","182","R$ 4.048","16/08/26"],
          ["Deck do Açaí","72","174","R$ 3.776","17/08/26"],
          ["Rei do Açaí","65","156","R$ 3.406","15/08/26"]
        ].map(r=><tr key={r[0]}>{r.map((v,i)=><td key={i}>{v}</td>)}</tr>)}</Table></section>
      </div>
      <div className="m-secondary-link"><button type="button" onClick={()=>open("diagnosis")}>Ver diagnóstico de desempenho do case →</button></div>
    </>}
    <footer className="m-demo-footer"><span>Protótipo interativo baseado no Figma Secret Açaí · Dados demonstrativos de agosto de 2026 · Alterações salvas somente neste navegador, não em um servidor.</span><button type="button" className="m-reset" onClick={() => { if (!window.confirm("Restaurar os dados originais do Figma? As alterações desta demonstração serão apagadas deste navegador.")) return; ["secret-acai-stock-2026-v1","secret-acai-clients-2026-v1","secret-acai-leads-2026-v1","secret-acai-moves-2026-v1","secret-acai-sales-2026-v1"].forEach(key => window.localStorage.removeItem(key)); window.location.reload(); }}>Restaurar dados do Figma</button></footer>
    {modal && <Modal title={{
      clientNew:"Novo cliente", stockEntry:"Registrar entrada", stockAdjust:"Ajustar estoque", leadNew:"Novo lead",
      followUp:"Follow-up",leadContact:"Contato comercial",saleConfirm:"Confirmar venda",saleSuccess:"Venda registrada",
      approval:"Autorização necessária", reactivation:"Reativar clientes",import:"Importar lista",diagnosis:"Diagnóstico de desempenho"
    }[modal]} description={{
      clientNew:"Cadastre o cliente para registrar pedidos e acompanhar o histórico.",
      stockEntry:"Adicione caixas produzidas ou repostas ao saldo disponível.",
      stockAdjust:"Use apenas para correções de contagem, perdas ou avarias.",
      leadNew:"Cadastre um possível cliente e programe o próximo contato.",
      saleConfirm:"Revise os dados antes de baixar o estoque e registrar o pedido.",
      followUp:"Registre o próximo passo comercial nesta demonstração."
    }[modal]} onClose={close}>
      {modal==="clientNew" && <form onSubmit={handleClientForm} className="m-modal-form">
        <Field label="Nome do negócio" required><input required className="m-control" name="name" placeholder="Ex: Açaí da Praça" /></Field>
        <Field label="Responsável"><input className="m-control" name="person" placeholder="Ex: Marina Souza" /></Field>
        <Field label="WhatsApp" required><input required className="m-control" name="phone" type="tel" placeholder="(71) 99999-9999" /></Field>
        <Field label="CPF / CNPJ"><input className="m-control" name="document" placeholder="Opcional" /></Field>
        <Field label="Endereço"><input className="m-control" name="address" placeholder="Rua, número, bairro e referência" /></Field>
        <div className="m-fields-row m-fields-two"><Field label="Entrega preferida"><select className="m-control" name="delivery"><option value="Uber">Uber</option><option value="Retirada">Retirada</option></select></Field><Field label="Cidade / bairro"><input className="m-control" name="city" placeholder="Salvador · BA" /></Field></div>
        <Field label="Observações comerciais"><textarea className="m-control" name="note" rows="3" placeholder="Ex: prefere pedidos às quintas; negociar volume acima de 10 caixas" /></Field>
        <p className="m-muted">Evite registrar informações pessoais sem necessidade operacional. Nesta demonstração, somente o nome e a entrega são salvos no navegador.</p>
        <div className="m-impact"><strong>Dados visíveis conforme perfil de acesso</strong><span>Funcionários operacionais recebem somente os campos necessários para atender e vender. As permissões reais ainda não estão conectadas.</span></div>
        <div className="m-modal-actions"><button type="button" onClick={close} className="m-outline-button">Cancelar</button><button className="primary-button">Salvar cliente</button></div></form>}
      {(modal==="stockEntry" || modal==="stockAdjust") && <form onSubmit={handleStockForm} className="m-modal-form">
        <div className="m-fields-row m-fields-two"><Field label="Tamanho" required><select name="size" className="m-control"><option>10L</option><option>5L</option></select></Field><Field label="Sabor" required><select name="flavor" className="m-control">{flavors.map(f=><option key={f}>{f}</option>)}</select></Field></div>
        <Field label={modal==="stockEntry"?"Quantidade de entrada":"Novo saldo total"} required><input className="m-control" name="quantity" type="number" min={modal==="stockEntry"?"1":"0"} step="1" defaultValue={modal==="stockEntry"?"20":"32"} required /></Field>
        {modal==="stockAdjust"&&<Field label="Motivo do ajuste" required><textarea className="m-control" name="reason" rows="3" required placeholder="Ex: correção de contagem ou avaria" /></Field>}
        <div className="m-modal-actions"><button type="button" className="m-outline-button" onClick={close}>Cancelar</button><button className="primary-button">Salvar movimentação</button></div>
      </form>}
      {modal==="leadNew" && <form onSubmit={handleLeadForm} className="m-modal-form">
        <Field label="Empresa / negócio" required><input name="name" className="m-control" placeholder="Ex: Bowl da Vila" required /></Field>
        <Field label="Pessoa de contato"><input name="person" className="m-control" placeholder="Ex: João Lima" /></Field>
        <Field label="WhatsApp"><input name="phone" className="m-control" type="tel" placeholder="(71) 99999-9999" /></Field>
        <div className="m-fields-row m-fields-two"><Field label="Origem" required><select name="source" className="m-control" required>{srcOptions.map(src=><option key={src}>{src}</option>)}</select></Field><Field label="Etapa inicial"><input className="m-control" readOnly value="Contatado" /></Field></div>
        <Field label="Cidade / bairro"><input className="m-control" name="city" placeholder="Salvador · BA" /></Field>
        <Field label="Notas"><textarea name="note" className="m-control" rows="3" placeholder="Ex: vende açaí e sorvetes; hoje compra de outro fornecedor" /></Field>
        <Field label="Próxima ação"><input name="next" className="m-control" placeholder="Enviar catálogo" /></Field>
        <Field label="Data do follow-up"><input name="followUp" className="m-control" type="date" defaultValue="2026-08-22" /></Field>
        <div className="m-impact"><strong>Conversão sem retrabalho</strong><span>Ao converter o lead, os dados principais poderão originar o cadastro de cliente. O vínculo com um banco de dados ainda não está implementado.</span></div>
        <p className="m-muted">Dados de contato não são transmitidos a servidores. Este protótipo salva apenas empresa, pessoa de contato, notas, origem e etapa no navegador.</p>
        <div className="m-modal-actions"><button type="button" className="m-outline-button" onClick={close}>Cancelar</button><button className="primary-button">Salvar lead</button></div>
      </form>
      {modal==="followUp" && selectedLead && <form className="m-modal-form" onSubmit={updateLead}><strong>{selectedLead.name} · {selectedLead.person}</strong><Field label="Etapa comercial"><select name="stage" defaultValue={selectedLead.stage} className="m-control">{stages.map(s=><option key={s}>{s}</option>)}</select></Field><Field label="Observação"><textarea name="note" className="m-control" rows="3" defaultValue={selectedLead.note} /></Field><div className="m-modal-actions"><button type="button" className="m-outline-button" onClick={close}>Cancelar</button><button className="primary-button">Salvar follow-up</button></div></form>}
      {modal==="leadContact" && selectedLead && <div className="m-modal-form"><p><strong>{selectedLead.name}</strong> · {selectedLead.person}</p><p>O Figma não fornece um telefone verificado para este lead. O WhatsApp não será aberto com um número inventado.</p><button type="button" className="primary-button m-full-button" onClick={()=>open("followUp")}>Registrar follow-up</button></div>}
      {modal==="saleConfirm" && <div className="m-modal-form">
        <div className="m-summary-line"><span>Cliente</span><strong>{selectedClient}</strong></div><div className="m-summary-line"><span>Produto</span><strong>{size} · {flavor}</strong></div><div className="m-summary-line"><span>Quantidade</span><strong>{quantity} caixas</strong></div><div className="m-summary-line"><span>Valor por caixa</span><strong>{currency(finalPrice)}</strong></div><div className="m-summary-line"><span>Entrega</span><strong>{delivery} {delivery==="Uber"?"· "+currency(uberCost):""}</strong></div>
        <div className="m-impact">Desconto de {discount.toFixed(1).replace(".",",")}% autorizado pela regra de demonstração.</div>
        <div className="m-total"><span>Total do pedido</span><strong>{currency(subtotal)}</strong><small>Estoque: {product.quantity} → {product.quantity-quantity} caixas</small></div>
        <div className="m-warning"><strong>Esta ação altera o estoque</strong><span>Somente no seu navegador. Nenhuma venda real será registrada.</span></div>
        <div className="m-modal-actions"><button className="m-outline-button" onClick={close}>Voltar e editar</button><button className="primary-button" onClick={confirmSale}>Confirmar venda</button></div></div>}
      {modal==="saleSuccess" && <div className="m-modal-form"><div className="m-success-icon">✓</div><h3>Pedido #{successId} concluído com sucesso.</h3><p className="m-muted">Atualizações realizadas nesta demonstração:</p><p>✓ Pedido #{successId} registrado</p><p>✓ Estoque {size} {flavor} atualizado</p><p>✓ Total do pedido: {currency(subtotal)}</p><p>✓ Forma de entrega registrada: {delivery}</p>
        <div className="m-modal-actions"><button className="m-outline-button" onClick={()=>{close();onNavigate("Dashboard");}}>Ir para dashboard</button><button className="primary-button" onClick={()=>{close();setQuantity(4);}}>Registrar nova venda</button></div></div>}
      {modal==="approval" && <div className="m-modal-form"><p>O desconto solicitado ultrapassa o limite de 10% configurado neste protótipo para o perfil operacional.</p><div className="m-summary-line"><span>Preço de tabela</span><strong>{currency(product.price)}</strong></div><div className="m-summary-line"><span>Valor solicitado</span><strong>{currency(finalPrice)}</strong></div><div className="m-summary-line"><span>Desconto solicitado</span><strong>{discount.toFixed(1).replace(".",",")}%</strong></div><p className="m-warning">O estoque ainda não será baixado. A aprovação real exige conta e permissões do gestor, não implementadas nesta demonstração.</p><div className="m-modal-actions"><button className="primary-button" onClick={close}>Voltar e editar</button></div></div>}
      {modal==="reactivation" && <div className="m-modal-form"><p>Lista de contatos prioritários por tempo sem compra, conforme o Figma:</p>{[["Açaí Express","162 dias"],["Mix Açaí","145 dias"],["Frutos do Açaí","128 dias"],["Sabor Natural","107 dias"]].map(x=><div className="m-summary-line" key={x[0]}><strong>{x[0]}</strong><span>{x[1]}</span></div>)}<p className="m-muted">No sistema real, a prioridade será ajustada pelo padrão de recompra de cada cliente.</p><button className="primary-button m-full-button" onClick={close}>Concluir análise</button></div>}
      {modal==="import" && <div className="m-modal-form"><p>O fluxo de importação está documentado no Figma, mas não há um serviço de importação de dados conectado nesta demonstração.</p><button className="primary-button m-full-button" onClick={close}>Entendi</button></div>}
      {modal==="diagnosis" && <div className="m-modal-form"><h3>Queda de 18,4% nas caixas vendidas</h3><p>O maior sinal está na redução de clientes recorrentes. Estoque e conversão de leads também contribuíram.</p><div className="m-summary-line"><span>Clientes compradores</span><strong>31 · anterior 42</strong></div><div className="m-summary-line"><span>Leads convertidos</span><strong>2 · anterior 6</strong></div><div className="m-summary-line"><span>Ruptura de estoque</span><strong>2 variações · 4 dias</strong></div><p className="m-muted">Exemplo de diagnóstico, não resultado de uma análise executada neste site.</p><a target="_blank" rel="noreferrer" href="https://www.figma.com/design/OmJYOxXm1vFodkfZBXwDd3?node-id=151-2">Ver diagnóstico completo no Figma</a></div>}
      {formError && <p className="m-error" role="alert">{formError}</p>}
    </Modal>}
  </main>;
}

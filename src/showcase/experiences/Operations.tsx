import { useState } from "react";
import { Plus, Minus, Truck, Check, ArrowRight } from "lucide-react";
import { stockMovement, money, downloadCsv } from "../model";
import {
  Metric,
  SectionTitle,
  type ExperienceProps,
  newId,
  Empty,
} from "../shared";

export function Inventory({ profile, state, update, notify }: ExperienceProps) {
  const [search, setSearch] = useState("");
  const [quantity, setQuantity] = useState(1);
  const stock = (id: string, fallback: number) => state.stock[id] ?? fallback;
  const move = (id: string, base: number, direction: "in" | "out") => {
    const current = stock(id, base);
    const next = stockMovement(current, quantity, direction);
    if (next === current) {
      notify("Movimento inválido. Confira a quantidade e o saldo disponível.");
      return;
    }
    update((s) => ({
      ...s,
      stock: { ...s.stock, [id]: next },
    }));
    notify(
      `${direction === "in" ? "Entrada" : "Saída"} de ${quantity} unidade(s) registrada.`,
    );
  };
  const units = profile.items.reduce((n, i) => n + stock(i.id, i.stock), 0);
  const value = profile.items.reduce(
    (n, i) => n + stock(i.id, i.stock) * i.price,
    0,
  );
  return (
    <>
      <SectionTitle
        eyebrow="CADA UNIDADE SOB CONTROLE"
        title={profile.headline}
        description="Registre entradas e saídas e acompanhe os produtos que precisam de reposição."
      />
      <div className="xp-metrics">
        <Metric label="Itens cadastrados" value={profile.items.length} />
        <Metric label="Unidades disponíveis" value={units} />
        <Metric label="Valor de referência" value={money(value)} />
        <Metric
          label="Reposição sugerida"
          value={profile.items.filter((i) => stock(i.id, i.stock) <= 3).length}
        />
      </div>
      <section className="xp-panel">
        <div className="xp-section-row">
          <h2>Inventário</h2>
          <button
            className="xp-quiet"
            onClick={() =>
              downloadCsv(
                [
                  ["Produto", "Saldo", "Valor unitário"],
                  ...profile.items.map((i) => [
                    i.name,
                    String(stock(i.id, i.stock)),
                    i.price.toFixed(2),
                  ]),
                ],
                `${profile.id}-estoque.csv`,
              )
            }
          >
            Exportar CSV
          </button>
        </div>
        <div className="xp-inline-form">
          <input
            aria-label="Buscar no estoque"
            placeholder="Buscar produto ou material…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <label className="xp-quantity-label">
            Quantidade do movimento
            <input
              type="number"
              min="1"
              step="1"
              max="9999"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="xp-table-wrap">
          <table className="xp-table">
            <thead>
              <tr>
                <th>Produto / material</th>
                <th>Saldo</th>
                <th>Condição</th>
                <th>Valor unitário</th>
                <th>Movimentar</th>
              </tr>
            </thead>
            <tbody>
              {profile.items
                .filter((i) =>
                  i.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((i) => (
                  <tr key={i.id}>
                    <td>
                      <b>{i.name}</b>
                      <small>SKU {i.id.toUpperCase()}</small>
                    </td>
                    <td>
                      <strong data-stock>{stock(i.id, i.stock)}</strong>
                      <small>unidades</small>
                    </td>
                    <td>
                      <span
                        className={`xp-pill ${stock(i.id, i.stock) <= 3 ? "warning" : ""}`}
                      >
                        {stock(i.id, i.stock) <= 3
                          ? "Repor estoque"
                          : "Disponível"}
                      </span>
                    </td>
                    <td>{money(i.price)}</td>
                    <td>
                      <div className="xp-table-actions">
                        <button
                          className="xp-quiet"
                          onClick={() => move(i.id, i.stock, "in")}
                          aria-label={`Entrada de ${i.name}`}
                        >
                          <Plus size={15} />
                          Entrada
                        </button>
                        <button
                          className="xp-quiet"
                          onClick={() => move(i.id, i.stock, "out")}
                          aria-label={`Saída de ${i.name}`}
                        >
                          <Minus size={15} />
                          Saída
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}

export function Logistics({ profile, state, update, notify }: ExperienceProps) {
  const stages = ["Preparação", "Coletado", "Em rota", "Entregue"];
  const [filter, setFilter] = useState("all");
  const stage = (id: string, index: number) =>
    Math.min(3, state.stages[id] ?? index);
  const advance = (id: string, index: number) => {
    const next = stage(id, index) + 1;
    update((s) => ({ ...s, stages: { ...s.stages, [id]: next } }));
    notify(`Remessa atualizada: ${stages[next]}.`);
  };
  return (
    <>
      <SectionTitle
        eyebrow="VISIBILIDADE DE PONTA A PONTA"
        title={profile.headline}
        description="Veja cada remessa avançar. As entregas e localizações abaixo são ilustrativas."
      />
      <div className="xp-metrics xp-metrics-three">
        <Metric label="Remessas acompanhadas" value={profile.items.length} />
        <Metric
          label="Em andamento"
          value={profile.items.filter((i, j) => stage(i.id, j) < 3).length}
        />
        <Metric
          label="Entregas concluídas"
          value={profile.items.filter((i, j) => stage(i.id, j) === 3).length}
        />
      </div>
      <div className="xp-chips">
        {["all", ...stages].map((s) => (
          <button
            key={s}
            className={filter === s ? "active" : ""}
            onClick={() => setFilter(s)}
          >
            {s === "all" ? "Todas as remessas" : s}
          </button>
        ))}
      </div>
      <div className="xp-shipments">
        {profile.items
          .filter(
            (i, index) =>
              filter === "all" || stages[stage(i.id, index)] === filter,
          )
          .map((i) => {
            const index = profile.items.indexOf(i);
            const current = stage(i.id, index);
            return (
              <article className="xp-panel xp-shipment" key={i.id}>
                <div className="xp-section-row">
                  <div className="xp-shipment-title">
                    <span className="xp-brand-symbol">
                      <Truck size={23} />
                    </span>
                    <div>
                      <small>REMESSA #{1042 + index}</small>
                      <h2>{i.name}</h2>
                      <p>
                        Origem: centro de distribuição · Destino: cliente demo
                      </p>
                    </div>
                  </div>
                  <span className="xp-pill">{stages[current]}</span>
                </div>
                <div className="xp-delivery-steps">
                  {stages.map((s, j) => (
                    <div className={j <= current ? "complete" : ""} key={s}>
                      <span>{j <= current ? <Check size={14} /> : j + 1}</span>
                      <b>{s}</b>
                    </div>
                  ))}
                </div>
                <div className="xp-section-row">
                  <small>Última atualização: etapa {current + 1} de 4</small>
                  <button
                    className="xp-button"
                    disabled={current === 3}
                    onClick={() => advance(i.id, index)}
                  >
                    {current === 3 ? "Entrega concluída" : "Avançar entrega"}
                    <ArrowRight size={16} />
                  </button>
                </div>
              </article>
            );
          })}
      </div>
    </>
  );
}

export function Support({ profile, state, update, notify }: ExperienceProps) {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState("Normal");
  const [filter, setFilter] = useState("all");
  const rows = [
    ...profile.items.map((i, j) => ({
      id: i.id,
      name: i.name,
      detail: j === 0 ? "Alta" : "Normal",
      initial: j,
    })),
    ...state.submissions.map((s) => ({ ...s, initial: 0 })),
  ];
  const stages = ["Aberto", "Em atendimento", "Resolvido"];
  const status = (r: (typeof rows)[number]) =>
    Math.min(2, state.stages[r.id] ?? r.initial);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    update((s) => ({
      ...s,
      submissions: [
        ...s.submissions,
        { id: newId(), name: name.trim(), detail: priority },
      ],
    }));
    setName("");
    notify("Chamado aberto na demonstração.");
  };
  return (
    <>
      <SectionTitle
        eyebrow="CADA SOLICITAÇÃO IMPORTA"
        title={profile.headline}
        description="Centralize pedidos de ajuda e acompanhe a resolução sem perder o contexto."
      />
      <div className="xp-metrics xp-metrics-three">
        {stages.map((s, j) => (
          <Metric
            key={s}
            label={s}
            value={rows.filter((r) => status(r) === j).length}
          />
        ))}
      </div>
      <div className="xp-two-columns">
        <section className="xp-panel">
          <div className="xp-section-row">
            <h2>Central de solicitações</h2>
            <select
              aria-label="Filtrar chamados"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            >
              <option value="all">Todas as etapas</option>
              {stages.map((s, j) => (
                <option value={j} key={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          {rows
            .filter((r) => filter === "all" || status(r) === Number(filter))
            .map((r, j) => (
              <article className="xp-ticket" key={r.id}>
                <div>
                  <small>
                    CHAMADO #{100 + j} · PRIORIDADE {r.detail.toUpperCase()}
                  </small>
                  <h3>{r.name}</h3>
                  <p>Equipe responsável · informação de demonstração</p>
                </div>
                <select
                  aria-label={`Status de ${r.name}`}
                  value={status(r)}
                  onChange={(e) => {
                    update((s) => ({
                      ...s,
                      stages: { ...s.stages, [r.id]: Number(e.target.value) },
                    }));
                    notify("Status do chamado atualizado.");
                  }}
                >
                  {stages.map((s, k) => (
                    <option value={k} key={s}>
                      {s}
                    </option>
                  ))}
                </select>
              </article>
            ))}
        </section>
        <form className="xp-panel xp-form" onSubmit={submit}>
          <h2>Abrir um chamado</h2>
          <p>Conte o que precisa de atenção.</p>
          <label>
            Assunto
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
              placeholder="Descreva a solicitação"
            />
          </label>
          <label>
            Prioridade
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              <option>Normal</option>
              <option>Alta</option>
              <option>Baixa</option>
            </select>
          </label>
          <button className="xp-button">
            <Plus size={16} />
            Abrir chamado demo
          </button>
        </form>
      </div>
    </>
  );
}

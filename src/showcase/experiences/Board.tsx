import { useState } from "react";
import { Plus, ArrowRight } from "lucide-react";
import { money } from "../model";
import { Metric, SectionTitle, type ExperienceProps, newId } from "../shared";

export function Board({ profile, state, update, notify }: ExperienceProps) {
  const [name, setName] = useState("");
  const [search, setSearch] = useState("");
  const crm = profile.kind === "crm";
  const stages = crm
    ? ["Novo contato", "Em conversa", "Proposta enviada", "Fechado"]
    : ["A fazer", "Em andamento", "Em revisão", "Concluído"];
  const rows = [
    ...profile.items.map((i, index) => ({
      id: i.id,
      name: i.name,
      detail: crm
        ? "Contato comercial · prioridade normal"
        : ["Design · Luiza", "Operação · Rafael", "Equipe · Marina"][index],
      price: i.price,
      initial: index,
    })),
    ...state.submissions.map((s) => ({ ...s, price: 0, initial: 0 })),
  ];
  const current = (row: (typeof rows)[number]) =>
    Math.min(3, state.stages[row.id] ?? row.initial);
  const done = rows.filter((r) => current(r) === 3).length;
  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    update((s) => ({
      ...s,
      submissions: [
        ...s.submissions,
        {
          id: newId(),
          name: name.trim(),
          detail: crm
            ? "Novo contato · equipe comercial"
            : "Equipe · nova tarefa",
        },
      ],
    }));
    setName("");
    notify(
      crm ? "Oportunidade adicionada ao funil." : "Tarefa criada no quadro.",
    );
  };
  const move = (id: string, stage: number) => {
    update((s) => ({ ...s, stages: { ...s.stages, [id]: stage } }));
    notify(`Movido para ${stages[stage]}.`);
  };
  return (
    <>
      <SectionTitle
        eyebrow={
          crm
            ? "RELACIONAMENTOS QUE GERAM RESULTADOS"
            : "DO PLANEJAMENTO À ENTREGA"
        }
        title={profile.headline}
        description={
          crm
            ? "Acompanhe cada oportunidade e experimente o avanço de uma negociação."
            : "Organize as prioridades e avance as tarefas pelo fluxo de trabalho."
        }
      />
      <div className="xp-metrics">
        <Metric
          label={crm ? "Oportunidades" : "Tarefas no quadro"}
          value={rows.length}
        />
        <Metric
          label={crm ? "Valor em negociação" : "Em andamento"}
          value={
            crm
              ? money(
                  rows
                    .filter((r) => current(r) < 3)
                    .reduce((a, r) => a + r.price, 0),
                )
              : rows.filter((r) => current(r) === 1).length
          }
        />
        <Metric
          label={crm ? "Negócios fechados" : "Entregas concluídas"}
          value={done}
        />
        <Metric
          label="Progresso do quadro"
          value={`${Math.round((done / rows.length) * 100)}%`}
        />
      </div>
      <div className="xp-panel">
        <div className="xp-section-row">
          <h2>{crm ? "Funil de vendas" : "Quadro de trabalho"}</h2>
          <span>Visão por etapa</span>
        </div>
        <form className="xp-inline-form" onSubmit={add}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            maxLength={120}
            aria-label={crm ? "Nome da oportunidade" : "Nome da tarefa"}
            placeholder={
              crm ? "Uma nova oportunidade…" : "O que precisa ser feito?"
            }
          />
          <button className="xp-button">
            <Plus size={16} />
            {crm ? "Adicionar oportunidade" : "Criar tarefa"}
          </button>
          <input
            className="xp-board-search"
            aria-label="Filtrar quadro"
            placeholder="Filtrar quadro…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </form>
        <div className="xp-board">
          {stages.map((stage, index) => (
            <section className="xp-board-column" key={stage}>
              <div className="xp-column-title">
                <span className={`xp-stage-dot xp-stage-${index}`} />
                <h3>{stage}</h3>
                <b>{rows.filter((r) => current(r) === index).length}</b>
              </div>
              {rows
                .filter(
                  (r) =>
                    current(r) === index &&
                    r.name.toLowerCase().includes(search.toLowerCase()),
                )
                .map((row) => (
                  <article className="xp-task" key={row.id}>
                    <span className="xp-task-tag">
                      {crm ? "OPORTUNIDADE" : "PRIORIDADE NORMAL"}
                    </span>
                    <h4>{row.name}</h4>
                    <p>{row.detail}</p>
                    {crm && <b className="xp-task-value">{money(row.price)}</b>}
                    <div className="xp-task-bottom">
                      <select
                        aria-label={`Etapa de ${row.name}`}
                        value={current(row)}
                        onChange={(e) => move(row.id, Number(e.target.value))}
                      >
                        {stages.map((label, i) => (
                          <option key={label} value={i}>
                            {label}
                          </option>
                        ))}
                      </select>
                      {index < 3 && (
                        <button
                          className="xp-icon-button"
                          aria-label={`Avançar ${row.name}`}
                          onClick={() => move(row.id, index + 1)}
                        >
                          <ArrowRight size={14} />
                        </button>
                      )}
                    </div>
                  </article>
                ))}
            </section>
          ))}
        </div>
      </div>
    </>
  );
}

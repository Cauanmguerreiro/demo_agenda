import { useState } from "react";
import { Download, ArrowDownLeft, ArrowUpRight } from "lucide-react";
import { money, downloadCsv } from "../model";
import { Metric, SectionTitle, type ExperienceProps, newId } from "../shared";

export function Finance({ profile, state, update, notify }: ExperienceProps) {
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState<"income" | "expense">("income");
  const [filter, setFilter] = useState("all");
  const entries = [
    ...profile.items.map((i, index) => ({
      id: i.id,
      name: i.name,
      amount: i.price,
      type: (index === 1 ? "expense" : "income") as "income" | "expense",
    })),
    ...state.ledger,
  ];
  const income = entries
    .filter((e) => e.type === "income")
    .reduce((n, e) => n + e.amount, 0);
  const expense = entries
    .filter((e) => e.type === "expense")
    .reduce((n, e) => n + e.amount, 0);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const number = Number(amount);
    if (!name.trim() || !Number.isFinite(number) || number <= 0) {
      notify("Informe uma descrição e um valor maior que zero.");
      return;
    }
    update((s) => ({
      ...s,
      ledger: [
        ...s.ledger,
        {
          id: newId(),
          name: name.trim(),
          amount: Math.round(number * 100) / 100,
          type,
        },
      ],
    }));
    setName("");
    setAmount("");
    notify("Lançamento registrado no financeiro demo.");
  };
  const exportData = () =>
    downloadCsv(
      [
        ["Descrição", "Tipo", "Valor"],
        ...entries.map((e) => [
          e.name,
          e.type === "income" ? "Entrada" : "Saída",
          e.amount.toFixed(2),
        ]),
      ],
      `${profile.id}-financeiro.csv`,
    );
  return (
    <>
      <SectionTitle
        eyebrow="CLAREZA PARA DECIDIR"
        title={profile.headline}
        description="Experimente lançamentos, confira o saldo e exporte o extrato de demonstração."
      />
      <div className="xp-metrics">
        <Metric
          label="Entradas registradas"
          value={money(income)}
          detail="Valores de demonstração"
        />
        <Metric label="Saídas registradas" value={money(expense)} />
        <Metric label="Saldo disponível" value={money(income - expense)} />
        <Metric label="Lançamentos" value={entries.length} />
      </div>
      <div className="xp-two-columns">
        <section className="xp-panel">
          <div className="xp-section-row">
            <h2>Movimentações</h2>
            <button className="xp-quiet" onClick={exportData}>
              <Download size={15} />
              Exportar CSV
            </button>
          </div>
          <div className="xp-chips">
            {[
              ["all", "Todas"],
              ["income", "Entradas"],
              ["expense", "Saídas"],
            ].map(([id, label]) => (
              <button
                key={id}
                onClick={() => setFilter(id)}
                className={filter === id ? "active" : ""}
              >
                {label}
              </button>
            ))}
          </div>
          <div className="xp-ledger">
            {entries
              .filter((e) => filter === "all" || e.type === filter)
              .map((e) => (
                <div className="xp-ledger-row" key={e.id}>
                  <span className={`xp-ledger-icon ${e.type}`}>
                    {e.type === "income" ? (
                      <ArrowDownLeft size={18} />
                    ) : (
                      <ArrowUpRight size={18} />
                    )}
                  </span>
                  <div>
                    <b>{e.name}</b>
                    <small>
                      {e.type === "income" ? "Entrada" : "Saída"} · lançamento
                      demo
                    </small>
                  </div>
                  <strong className={e.type}>
                    {e.type === "income" ? "+" : "−"} {money(e.amount)}
                  </strong>
                </div>
              ))}
          </div>
        </section>
        <form className="xp-panel xp-form" onSubmit={submit}>
          <h2>Novo lançamento</h2>
          <p>Teste a organização das suas movimentações.</p>
          <label>
            Descrição
            <input
              aria-label="Descrição do lançamento"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={120}
              placeholder="Ex.: pagamento de cliente"
            />
          </label>
          <label>
            Valor em reais
            <input
              aria-label="Valor do lançamento"
              type="number"
              min="0.01"
              max="999999999"
              step="0.01"
              required
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0,00"
            />
          </label>
          <label>
            Tipo
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
            >
              <option value="income">Entrada</option>
              <option value="expense">Saída</option>
            </select>
          </label>
          <button className="xp-button">Registrar lançamento</button>
          <small>As informações ficam somente nesta demonstração.</small>
        </form>
      </div>
    </>
  );
}

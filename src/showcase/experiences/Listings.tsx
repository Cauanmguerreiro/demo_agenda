import { useState } from "react";
import { Heart, MapPin, ArrowUpRight, X } from "lucide-react";
import { money } from "../model";
import {
  SectionTitle,
  ItemArt,
  Empty,
  type ExperienceProps,
  newId,
} from "../shared";

export function Listings({ profile, state, update, notify }: ExperienceProps) {
  const [query, setQuery] = useState("");
  const [max, setMax] = useState("");
  const [selected, setSelected] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const locations = [
    "Jardim · Porto Alegre",
    "Centro · Viamão",
    "Região Sul · Porto Alegre",
  ];
  const item = profile.items.find((i) => i.id === selected);
  const shown = profile.items.filter(
    (i, index) =>
      (i.name + " " + locations[index])
        .toLowerCase()
        .includes(query.toLowerCase()) &&
      (!max || i.price <= Number(max)),
  );
  const favorite = (id: string) =>
    update((s) => ({
      ...s,
      favorites: s.favorites.includes(id)
        ? s.favorites.filter((v) => v !== id)
        : [...s.favorites, id],
    }));
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !name.trim()) return;
    update((s) => ({
      ...s,
      submissions: [
        ...s.submissions,
        { id: newId(), name: name.trim(), detail: `Interesse em ${item.name}` },
      ],
    }));
    notify(
      `Interesse em ${item.name} registrado na demonstração. Nenhum contato foi enviado.`,
    );
    setSelected("");
    setName("");
    setEmail("");
  };
  return (
    <>
      <SectionTitle
        eyebrow="ENCONTRE UM NOVO LUGAR"
        title={profile.headline}
        description="Explore opções, salve favoritos e teste uma solicitação de interesse."
      />
      <div className="xp-property-search">
        <label>
          Busque por espaço ou região
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ex.: Centro, apartamento…"
          />
        </label>
        <label>
          Valor máximo (R$)
          <input
            type="number"
            min="0"
            value={max}
            onChange={(e) => setMax(e.target.value)}
            placeholder="Qualquer valor"
          />
        </label>
        <div>
          <b>{shown.length}</b>
          <span>opções encontradas</span>
        </div>
      </div>
      <div className="xp-listings">
        {shown.map((i, index) => (
          <article className="xp-listing" key={i.id}>
            <div className="xp-listing-image">
              <ItemArt item={i} variant="property" />
              <button
                className={`xp-save ${state.favorites.includes(i.id) ? "active" : ""}`}
                onClick={() => favorite(i.id)}
                aria-label={`Salvar ${i.name}`}
                aria-pressed={state.favorites.includes(i.id)}
              >
                <Heart
                  size={18}
                  fill={
                    state.favorites.includes(i.id) ? "currentColor" : "none"
                  }
                />
              </button>
              <span className="xp-listing-tag">DISPONÍVEL NO DEMO</span>
            </div>
            <div className="xp-listing-body">
              <small>
                <MapPin size={13} />
                {locations[profile.items.indexOf(i)]}
              </small>
              <h2>{i.name}</h2>
              <div className="xp-property-facts">
                <span>{[68, 120, 42][profile.items.indexOf(i)]} m²</span>
                <span>{[2, 3, 1][profile.items.indexOf(i)]} ambientes</span>
                <span>Iluminação natural</span>
              </div>
              <div className="xp-section-row">
                <div>
                  <b>{money(i.price)}</b>
                  <small>/ referência de locação</small>
                </div>
                <button
                  className="xp-icon-button"
                  onClick={() => setSelected(i.id)}
                  aria-label={`Ver ${i.name}`}
                >
                  <ArrowUpRight size={18} />
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>
      {!shown.length && (
        <Empty>Nenhum espaço encontrado com esses filtros.</Empty>
      )}
      {item && (
        <section className="xp-panel xp-property-detail">
          <div className="xp-section-row">
            <h2>{item.name}</h2>
            <button
              className="xp-quiet"
              onClick={() => setSelected("")}
              aria-label="Fechar detalhes"
            >
              <X size={18} />
            </button>
          </div>
          <p>
            Um espaço com boa iluminação, ambientes versáteis e localização
            conveniente. Descrição e valores ilustrativos para demonstrar a
            jornada de busca e captação.
          </p>
          <form className="xp-inline-form" onSubmit={submit}>
            <input
              aria-label="Nome do interessado"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
            />
            <input
              aria-label="E-mail do interessado"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <button className="xp-button">Simular interesse</button>
          </form>
        </section>
      )}
      {state.favorites.length > 0 && (
        <p className="xp-muted">
          {state.favorites.length} espaços salvos neste dispositivo.
        </p>
      )}
    </>
  );
}

import { useState } from "react";
import {
  Check,
  ArrowRight,
  ArrowUpRight,
  Calendar,
  MapPin,
} from "lucide-react";
import { money } from "../model";
import {
  SectionTitle,
  ItemArt,
  Metric,
  type ExperienceProps,
  newId,
} from "../shared";

export function Subscription({
  profile,
  state,
  update,
  notify,
}: ExperienceProps) {
  const [annual, setAnnual] = useState(false);
  const choose = (id: string, name: string) => {
    update((s) => ({
      ...s,
      activePlan: `${id}:${annual ? "annual" : "monthly"}`,
      canceled: false,
    }));
    notify(`Plano ${name} ativado na demonstração. Nenhuma cobrança real.`);
  };
  const selected = profile.items.find((i) =>
    state.activePlan.startsWith(`${i.id}:`),
  );
  return (
    <>
      <div className="xp-center-heading">
        <SectionTitle
          eyebrow="UMA SOLUÇÃO QUE CRESCE COM VOCÊ"
          title={profile.headline}
          description="Compare as possibilidades e experimente a jornada de adesão. Todos os planos são ilustrativos."
        />
        <div className="xp-billing-toggle">
          <button
            onClick={() => setAnnual(false)}
            className={!annual ? "active" : ""}
          >
            Mensal
          </button>
          <button
            onClick={() => setAnnual(true)}
            className={annual ? "active" : ""}
          >
            Anual <span>2 meses de economia</span>
          </button>
        </div>
      </div>
      <div className="xp-plans">
        {profile.items.map((i, index) => (
          <article
            className={`xp-plan ${index === 1 ? "featured" : ""}`}
            key={i.id}
          >
            {index === 1 && (
              <span className="xp-plan-recommendation">PARA IR MAIS LONGE</span>
            )}
            <span className="xp-eyebrow">PLANO {index + 1}</span>
            <h2>{i.name}</h2>
            <p>
              {
                [
                  "Para dar o primeiro passo com clareza.",
                  "Para uma rotina com mais possibilidades.",
                  "Para ampliar sua experiência.",
                ][index]
              }
            </p>
            <div className="xp-plan-price">
              <b>{money(annual ? i.price * 10 : i.price)}</b>
              <span>/{annual ? "ano" : "mês"}</span>
            </div>
            <ul>
              {[
                "Acesso à experiência principal",
                `${[1, 5, 15][index]} ${profile.kind === "subscription" && profile.id === "saas" ? "usuários" : "benefícios selecionados"}`,
                [
                  "Recursos essenciais",
                  "Recursos ampliados",
                  "Experiência completa",
                ][index],
                "Portal de acompanhamento",
              ].map((f) => (
                <li key={f}>
                  <Check size={15} />
                  {f}
                </li>
              ))}
            </ul>
            <button
              className="xp-button xp-full"
              onClick={() => choose(i.id, i.name)}
              aria-label={`Escolher ${i.name}`}
            >
              {selected?.id === i.id && !state.canceled
                ? "Plano escolhido"
                : "Escolher plano"}
              <ArrowRight size={16} />
            </button>
          </article>
        ))}
      </div>
      {selected && (
        <section className="xp-panel xp-subscription-status">
          <div>
            <span className="xp-eyebrow">SUA ASSINATURA DEMO</span>
            <h2>{selected.name}</h2>
            <p>
              {state.canceled
                ? "Assinatura cancelada na demonstração."
                : `Ativa · cobrança ${state.activePlan.endsWith("annual") ? "anual" : "mensal"} simulada`}
            </p>
          </div>
          <button
            className="xp-quiet"
            disabled={state.canceled}
            onClick={() => {
              update((s) => ({ ...s, canceled: true }));
              notify("Assinatura demo cancelada.");
            }}
          >
            Cancelar assinatura demo
          </button>
        </section>
      )}
    </>
  );
}

export function Events({ profile, state, update, notify }: ExperienceProps) {
  const [selected, setSelected] = useState(profile.items[0].id);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const item = profile.items.find((i) => i.id === selected)!;
  const enrolled = state.submissions.filter(
    (s) => s.detail === selected,
  ).length;
  const remaining = Math.max(0, item.stock - enrolled);
  const enroll = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !remaining) return;
    update((s) => ({
      ...s,
      submissions: [
        ...s.submissions,
        { id: newId(), name: name.trim(), detail: selected },
      ],
    }));
    notify(
      `Inscrição demo de ${name.trim()} confirmada para ${item.name}. Nenhum ingresso real foi emitido.`,
    );
    setName("");
    setEmail("");
  };
  return (
    <>
      <section className="xp-event-hero">
        <span className="xp-eyebrow">UM ENCONTRO COM NOVAS POSSIBILIDADES</span>
        <h1>{profile.headline}</h1>
        <div>
          <span>
            <Calendar size={17} />
            12 de novembro · programação ilustrativa
          </span>
          <span>
            <MapPin size={17} />
            Porto Alegre, RS · local fictício
          </span>
        </div>
        <span className="xp-event-asterisk" aria-hidden="true">
          ✳
        </span>
      </section>
      <div className="xp-two-columns">
        <section className="xp-panel">
          <div className="xp-section-row">
            <h2>Escolha sua experiência</h2>
            <span>Programação demo</span>
          </div>
          {profile.items.map((i, j) => (
            <button
              className={`xp-event-row ${selected === i.id ? "active" : ""}`}
              onClick={() => setSelected(i.id)}
              key={i.id}
            >
              <span className="xp-event-time">
                {9 + j * 2}:00<small>12 NOV</small>
              </span>
              <div>
                <h3>{i.name}</h3>
                <p>{profile.sector} · vagas limitadas no demo</p>
              </div>
              <b>{money(i.price)}</b>
              <ArrowRight size={17} />
            </button>
          ))}
        </section>
        <form className="xp-panel xp-form" onSubmit={enroll}>
          <span className="xp-eyebrow">RESERVE SUA PARTICIPAÇÃO DEMO</span>
          <h2>{item.name}</h2>
          <div className="xp-registration-price">
            <b>{money(item.price)}</b>
            <span>{remaining} vagas no demo</span>
          </div>
          <label>
            Nome do participante
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              placeholder="Seu nome"
            />
          </label>
          <label>
            E-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </label>
          <button className="xp-button" disabled={!remaining}>
            Simular inscrição
            <ArrowRight size={16} />
          </button>
          <small>Sem emissão de ingresso ou cobrança.</small>
        </form>
      </div>
      {state.submissions.length > 0 && (
        <section className="xp-panel xp-event-receipts">
          <h2>Inscrições nesta demonstração</h2>
          {state.submissions.map((s) => (
            <div key={s.id}>
              <Check size={16} />
              <b>{s.name}</b>
              <span>{profile.items.find((i) => i.id === s.detail)?.name}</span>
            </div>
          ))}
        </section>
      )}
    </>
  );
}

export function Landing({ profile, state, update, notify }: ExperienceProps) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [need, setNeed] = useState(profile.items[0].name);
  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    update((s) => ({
      ...s,
      submissions: [
        ...s.submissions,
        { id: newId(), name: name.trim(), detail: need },
      ],
    }));
    notify(
      "Solicitação registrada nesta demonstração. Nenhuma mensagem foi enviada.",
    );
    setName("");
    setEmail("");
  };
  return (
    <>
      <section className="xp-landing-hero">
        <div>
          <span className="xp-eyebrow">{profile.sector.toUpperCase()}</span>
          <h1>{profile.headline}</h1>
          <p>
            Ideias bem pensadas, cuidado em cada etapa e soluções que fazem
            sentido para você. Conheça o trabalho de {profile.name}.
          </p>
          <a className="xp-button" href="#contato">
            Vamos conversar
            <ArrowUpRight size={17} />
          </a>
          <div className="xp-landing-proof">
            <span>Planejamento</span>
            <i>·</i>
            <span>Personalização</span>
            <i>·</i>
            <span>Qualidade</span>
          </div>
        </div>
        <div className="xp-landing-art" aria-hidden="true">
          <span>↗</span>
          <div>
            FEITO PARA
            <br />
            <b>IR ALÉM.</b>
          </div>
          <i />
        </div>
      </section>
      <section className="xp-services">
        <div className="xp-section-row">
          <h2>Como podemos ajudar</h2>
          <span>O primeiro passo é entender você.</span>
        </div>
        <div className="xp-service-grid">
          {profile.items.map((i, j) => (
            <article key={i.id}>
              <span className="xp-service-number">0{j + 1}</span>
              <h3>{i.name}</h3>
              <p>
                {
                  [
                    "Entendemos o contexto, os objetivos e o que merece atenção antes de começar.",
                    "Construímos uma solução alinhada à necessidade, com clareza em cada decisão.",
                    "Acompanhamos a entrega com cuidado para transformar a proposta em resultado.",
                  ][j]
                }
              </p>
              <a href="#contato" onClick={() => setNeed(i.name)}>
                Quero saber mais
                <ArrowUpRight size={15} />
              </a>
            </article>
          ))}
        </div>
      </section>
      <section className="xp-landing-contact" id="contato">
        <div>
          <span className="xp-eyebrow">VAMOS TIRAR DO PAPEL</span>
          <h2>
            Toda boa parceria
            <br />
            começa com uma conversa.
          </h2>
          <p>
            Conte o que você está imaginando. Experimente como um site pode
            captar oportunidades para o seu negócio.
          </p>
          <div className="xp-contact-mark">
            {profile.name}
            <small>UMA MARCA FICTÍCIA. UMA POSSIBILIDADE REAL.</small>
          </div>
        </div>
        <form className="xp-panel xp-form" onSubmit={submit}>
          <label>
            Seu nome
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              placeholder="Como podemos chamar você?"
            />
          </label>
          <label>
            Seu e-mail
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="seu@email.com"
            />
          </label>
          <label>
            O que você precisa?
            <select value={need} onChange={(e) => setNeed(e.target.value)}>
              {profile.items.map((i) => (
                <option key={i.id}>{i.name}</option>
              ))}
            </select>
          </label>
          <button className="xp-button">
            Simular solicitação
            <ArrowRight size={16} />
          </button>
          <small>Este formulário não envia mensagens reais.</small>
          {state.submissions.length > 0 && (
            <p className="xp-inline-success">
              <Check size={15} />
              {state.submissions.length} solicitações registradas no demo.
            </p>
          )}
        </form>
      </section>
    </>
  );
}

import { useEffect, useState } from "react";
import type { DemoProfile } from "./catalog";
import { families } from "./catalog";
import {
  freshState,
  loadDemoState,
  saveDemoState,
  normalizeCart,
} from "./model";
import { Commerce } from "./experiences/Commerce";
import { Board } from "./experiences/Board";
import { Finance } from "./experiences/Finance";
import { Learning } from "./experiences/Learning";
import { Listings } from "./experiences/Listings";
import { Inventory, Logistics, Support } from "./experiences/Operations";
import { Subscription, Events, Landing } from "./experiences/Marketing";

export default function Experience({ profile }: { profile: DemoProfile }) {
  const [state, setState] = useState(() => {
    const stored = loadDemoState(profile.id, freshState());
    return { ...stored, cart: normalizeCart(stored.cart, profile.items) };
  });
  const [notice, setNotice] = useState("");
  useEffect(() => {
    saveDemoState(profile.id, state);
  }, [profile.id, state]);
  const props = { profile, state, update: setState, notify: setNotice };
  const publicPage = [
    "commerce",
    "food",
    "property",
    "events",
    "landing",
    "subscription",
  ].includes(profile.kind);
  return (
    <main
      className={`xp-root ${publicPage ? "xp-public" : "xp-workspace"} xp-kind-${profile.kind}`}
      style={{ "--xp-color": profile.color } as React.CSSProperties}
    >
      <header className="xp-brand-bar">
        <div className="xp-brand">
          <span className="xp-brand-symbol">
            {families[profile.kind].symbol}
          </span>
          <div>
            <b>{profile.name}</b>
            <small>{profile.sector}</small>
          </div>
        </div>
        <div className="xp-brand-meta">
          <span className="xp-live-dot" />{" "}
          {publicPage
            ? "Sua experiência começa aqui"
            : "Seu espaço de trabalho"}
          <span className="xp-avatar">
            {profile.name.substring(0, 2).toUpperCase()}
          </span>
        </div>
      </header>
      <div className="xp-demo-notice">
        <span>✦</span>
        <p>
          Você está em uma demonstração da CodeBrand. Dados fictícios e ações
          simuladas neste dispositivo.
        </p>
      </div>
      {notice && (
        <div className="xp-feedback" role="status">
          <span>✓</span>
          {notice}
          <button onClick={() => setNotice("")} aria-label="Fechar mensagem">
            ×
          </button>
        </div>
      )}
      <div className="xp-content">
        {["commerce", "food"].includes(profile.kind) && <Commerce {...props} />}
        {["crm", "projects"].includes(profile.kind) && <Board {...props} />}
        {profile.kind === "finance" && <Finance {...props} />}
        {profile.kind === "learning" && <Learning {...props} />}
        {profile.kind === "property" && <Listings {...props} />}
        {profile.kind === "inventory" && <Inventory {...props} />}
        {profile.kind === "logistics" && <Logistics {...props} />}
        {profile.kind === "support" && <Support {...props} />}
        {profile.kind === "subscription" && <Subscription {...props} />}
        {profile.kind === "events" && <Events {...props} />}
        {profile.kind === "landing" && <Landing {...props} />}
      </div>
      <footer className="xp-footer">
        <b>{profile.name}</b>
        <span>Uma possibilidade construída pela CodeBrand.</span>
        <span>DEMONSTRAÇÃO · SEM TRANSAÇÕES REAIS</span>
      </footer>
    </main>
  );
}

import { lazy, Suspense, useEffect, useState } from "react";
import { ArrowLeft, Copy, RotateCcw, Maximize2, Minimize2 } from "lucide-react";
import { getProfile } from "./showcase/catalog";
import { Gallery } from "./showcase/Gallery";
import "./showcase/showcase.css";
const AgendaApp = lazy(() => import("./AgendaApp"));
const Experience = lazy(() => import("./showcase/Experience"));
const readRoute = () => new URLSearchParams(window.location.search).get("demo");
const readPresentation = () =>
  new URLSearchParams(window.location.search).get("presentation") === "true";

export default function App() {
  const [id, setId] = useState(readRoute);
  const [revision, setRevision] = useState(0);
  const [presentation, setPresentation] = useState(readPresentation);
  const [feedback, setFeedback] = useState("");
  const profile = getProfile(id);
  useEffect(() => {
    const pop = () => {
      setId(readRoute());
      setPresentation(readPresentation());
      setFeedback("");
    };
    addEventListener("popstate", pop);
    return () => removeEventListener("popstate", pop);
  }, []);
  useEffect(() => {
    document.title = profile
      ? `${profile.name} · CodeBrand Showcase`
      : "CodeBrand Showcase · 70 possibilidades para o seu negócio";
    window.scrollTo(0, 0);
  }, [id, profile]);
  const navigate = (next: string | null) => {
    const url = new URL(location.href);
    if (next) url.searchParams.set("demo", next);
    else {
      url.searchParams.delete("demo");
      url.searchParams.delete("presentation");
    }
    history.pushState({}, "", url);
    setId(next);
    setPresentation(url.searchParams.get("presentation") === "true");
    setFeedback("");
  };
  const togglePresentation = () => {
    const url = new URL(location.href);
    if (!presentation) url.searchParams.set("presentation", "true");
    else url.searchParams.delete("presentation");
    history.replaceState({}, "", url);
    setPresentation(!presentation);
  };
  const share = async () => {
    try {
      await navigator.clipboard.writeText(location.href);
      setFeedback("Link copiado.");
    } catch {
      setFeedback("Copie o endereço na barra do navegador para compartilhar.");
    }
  };
  const reset = () => {
    try {
      localStorage.removeItem(`codebrand:demo:v1:${id}`);
    } catch {}
    setRevision((r) => r + 1);
    setFeedback("Demonstração restaurada.");
  };
  if (!id) return <Gallery onNavigate={navigate} />;
  if (!profile)
    return (
      <div className="cb-shell cb-not-found">
        <span className="cb-wordmark">
          codebrand<span>®</span>
        </span>
        <h1>Demonstração não encontrada</h1>
        <p>Explore o catálogo para escolher uma experiência disponível.</p>
        <button className="cb-button" onClick={() => navigate(null)}>
          Voltar ao catálogo
        </button>
      </div>
    );
  return (
    <div className={`cb-demo-root ${presentation ? "cb-presenting" : ""}`}>
      <nav className="cb-demo-bar" aria-label="Controles da demonstração">
        <button
          className="cb-quiet"
          onClick={() => navigate(null)}
          aria-label="Voltar ao catálogo"
        >
          <ArrowLeft size={16} />
          <span>Catálogo</span>
        </button>
        <div className="cb-demo-identity">
          <b>{profile.name}</b>
          <span>{profile.sector}</span>
        </div>
        <span className="cb-demo-badge">DEMO INTERATIVA</span>
        <div className="cb-demo-tools">
          {!presentation && (
            <>
              <button
                onClick={share}
                className="cb-quiet"
                aria-label="Copiar link da demonstração"
              >
                <Copy size={16} />
                <span>Compartilhar</span>
              </button>
              <button
                onClick={reset}
                className="cb-quiet"
                aria-label="Restaurar demonstração"
              >
                <RotateCcw size={16} />
                <span>Restaurar</span>
              </button>
            </>
          )}
          <button
            className="cb-quiet"
            onClick={togglePresentation}
            aria-label={
              presentation ? "Sair da apresentação" : "Modo apresentação"
            }
          >
            {presentation ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
        </div>
      </nav>
      {feedback && (
        <p className="cb-global-feedback" role="status">
          {feedback}
        </p>
      )}
      <Suspense
        fallback={
          <div className="cb-loading" role="status">
            Preparando a experiência…
          </div>
        }
      >
        {profile.kind === "agenda" ? (
          <AgendaApp
            key={`${id}-${revision}`}
            initialDemoId={id}
            onSelectDemo={navigate}
            presentationMode={presentation}
            onTogglePresentation={togglePresentation}
          />
        ) : (
          <Experience key={`${id}-${revision}`} profile={profile} />
        )}
      </Suspense>
    </div>
  );
}

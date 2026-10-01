import { useState } from "react";
import {
  ArrowUpRight,
  ArrowRight,
  Search,
  Heart,
  X,
  Layers,
  Code2,
  SlidersHorizontal,
} from "lucide-react";
import {
  families,
  filterProfiles,
  profiles,
  type DemoKind,
  type DemoProfile,
} from "./catalog";
import { loadDemoState, saveDemoState } from "./model";

export function MiniPreview({ profile }: { profile: DemoProfile }) {
  const type = profile.kind;
  return (
    <div
      className={`cb-preview cb-preview-${type}`}
      style={{ "--demo-color": profile.color } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="cb-preview-chrome">
        <i />
        <i />
        <i />
        <span>{profile.name.toLowerCase().replaceAll(" ", "")}</span>
      </div>
      <div className="cb-preview-content">
        {[
          "commerce",
          "food",
          "property",
          "events",
          "landing",
          "subscription",
        ].includes(type) ? (
          <>
            <div className="cb-preview-heading">
              <small>{profile.sector}</small>
              <b>{type === "landing" ? profile.headline : profile.name}</b>
            </div>
            <div className="cb-preview-tiles">
              {[0, 1, 2].map((i) => (
                <div key={i}>
                  <span>{[families[type].symbol, "◒", "◈"][i]}</span>
                  <i />
                  <i />
                </div>
              ))}
            </div>
          </>
        ) : (
          <>
            <div className="cb-preview-sidebar">
              <i />
              <i />
              <i />
              <i />
            </div>
            <div className="cb-preview-dashboard">
              <div className="cb-preview-stats">
                <b>
                  12<small>EM DIA</small>
                </b>
                <b>
                  86%<small>RESULTADO</small>
                </b>
                <b>
                  +24<small>ESTE MÊS</small>
                </b>
              </div>
              {["crm", "projects", "support"].includes(type) ? (
                <div className="cb-preview-kanban">
                  {[0, 1, 2].map((i) => (
                    <div key={i}>
                      <span />
                      <b />
                      <b />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="cb-preview-chart">
                  {[30, 52, 40, 74, 55, 90, 70].map((h, i) => (
                    <i key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export function Gallery({ onNavigate }: { onNavigate: (id: string) => void }) {
  const [query, setQuery] = useState("");
  const [kind, setKind] = useState<DemoKind | "all">("all");
  const [favorites, setFavorites] = useState(
    () => loadDemoState("gallery", { favorites: [] as string[] }).favorites,
  );
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const found = filterProfiles(
    query,
    kind,
    onlyFavorites ? favorites : undefined,
  );
  const toggleFavorite = (id: string) => {
    const next = favorites.includes(id)
      ? favorites.filter((v) => v !== id)
      : [...favorites, id];
    setFavorites(next);
    saveDemoState("gallery", { favorites: next });
  };
  const clear = () => {
    setQuery("");
    setKind("all");
    setOnlyFavorites(false);
  };
  return (
    <div className="cb-shell">
      <header className="cb-nav">
        <a href="#" className="cb-wordmark" aria-label="CodeBrand início">
          codebrand<span>®</span>
        </a>
        <span className="cb-nav-label">EXPERIÊNCIAS DIGITAIS</span>
        <a href="mailto:comercial@codebrand.app.br" className="cb-nav-contact">
          Vamos construir?
          <ArrowUpRight size={17} />
        </a>
      </header>
      <main>
        <section className="cb-hero">
          <div className="cb-hero-copy">
            <div className="cb-eyebrow">
              <span />A PRÓXIMA IDEIA PODE SER A SUA
            </div>
            <h1>
              Seu próximo negócio
              <br />
              pode <em>acontecer aqui.</em>
            </h1>
            <p>
              Explore o que a CodeBrand pode construir. De uma vitrine que vende
              a uma operação que flui — escolha um negócio e experimente as
              possibilidades.
            </p>
            <div className="cb-hero-actions">
              <button
                className="cb-button"
                onClick={() =>
                  document
                    .getElementById("catalogo")
                    ?.scrollIntoView({ behavior: "smooth" })
                }
              >
                Explorar demonstrações
                <ArrowRight size={18} />
              </button>
              <span>
                70 negócios.
                <br />
                <b>Um mundo de possibilidades.</b>
              </span>
            </div>
            <div className="cb-hero-proof">
              <span>
                <Code2 size={16} />
                Sistemas sob medida
              </span>
              <span>
                <Layers size={16} />
                14 famílias de soluções
              </span>
            </div>
          </div>
          <div className="cb-hero-art">
            <div className="cb-orbit-label">BUILT BY CODEBRAND ↗</div>
            <div className="cb-hero-window">
              <div className="cb-window-top">
                <div>
                  <i />
                  <i />
                  <i />
                </div>
                <span>uma ideia. infinitas possibilidades.</span>
                <ArrowUpRight size={14} />
              </div>
              <div className="cb-window-body">
                <div className="cb-window-title">
                  <small>VISÃO GERAL</small>
                  <b>
                    O seu negócio,
                    <br />
                    em outra dimensão.
                  </b>
                </div>
                <div className="cb-art-metrics">
                  <div>
                    <small>PEDIDOS</small>
                    <b>
                      128<span>↗ 24%</span>
                    </b>
                  </div>
                  <div>
                    <small>RECEITA</small>
                    <b>R$ 24,8k</b>
                  </div>
                </div>
                <div className="cb-art-chart">
                  {[35, 48, 39, 62, 55, 76, 63, 88, 100].map((h, i) => (
                    <div key={i} style={{ height: `${h}%` }} />
                  ))}
                </div>
                <div className="cb-art-bottom">
                  <span>SEG</span>
                  <span>QUA</span>
                  <span>SEX</span>
                  <span>DOM</span>
                </div>
              </div>
            </div>
            <div className="cb-float-card cb-float-one">
              <span className="cb-float-icon">↗</span>
              <div>
                <small>NOVA OPORTUNIDADE</small>
                <b>Uma ideia virou negócio.</b>
              </div>
            </div>
            <div className="cb-float-card cb-float-two">
              <span className="cb-float-icon">✓</span>
              <div>
                <small>MENOS TRABALHO MANUAL</small>
                <b>Mais tempo para crescer.</b>
              </div>
            </div>
            <div className="cb-art-stamp">
              70
              <small>
                DEMONSTRAÇÕES
                <br />
                PARA EXPLORAR
              </small>
            </div>
          </div>
        </section>
        <div className="cb-capability-strip">
          <span>VITRINES & E-COMMERCE</span>
          <i>✳</i>
          <span>SISTEMAS DE GESTÃO</span>
          <i>✳</i>
          <span>PORTAIS & PLATAFORMAS</span>
          <i>✳</i>
          <span>OPERAÇÕES DIGITAIS</span>
        </div>
        <section className="cb-catalog" id="catalogo">
          <div className="cb-catalog-heading">
            <div>
              <div className="cb-eyebrow">O QUE PODEMOS CONSTRUIR</div>
              <h2>
                Escolha uma possibilidade.
                <br />
                <span>Experimente por dentro.</span>
              </h2>
            </div>
            <p>
              São demonstrações interativas com dados fictícios.
              <br />
              Cada solução pode ser adaptada ao seu negócio.
            </p>
          </div>
          <div className="cb-catalog-layout">
            <aside className={`cb-categories ${filtersOpen ? "is-open" : ""}`}>
              <div className="cb-categories-title">
                POR SOLUÇÃO
                <button
                  className="cb-quiet cb-filter-close"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Fechar filtros"
                >
                  <X size={16} />
                </button>
              </div>
              <button
                className={kind === "all" ? "is-active" : ""}
                onClick={() => {
                  setKind("all");
                  setFiltersOpen(false);
                }}
              >
                <span>Todos os modelos</span>
                <b>{profiles.length}</b>
              </button>
              {Object.entries(families).map(([id, f]) => (
                <button
                  className={kind === id ? "is-active" : ""}
                  key={id}
                  onClick={() => {
                    setKind(id as DemoKind);
                    setFiltersOpen(false);
                  }}
                >
                  <span>{f.label}</span>
                  <b>{profiles.filter((p) => p.kind === id).length}</b>
                </button>
              ))}
              <div className="cb-sidebar-note">
                <span>✦</span>
                <b>Tem uma ideia diferente?</b>
                <p>
                  Essa vitrine é o começo.
                  <br />
                  Seu projeto pode ir além.
                </p>
                <a href="mailto:comercial@codebrand.app.br">
                  Conte para a gente
                  <ArrowUpRight size={14} />
                </a>
              </div>
            </aside>
            <div className="cb-catalog-results">
              <div className="cb-search-row">
                <label className="cb-search">
                  <Search size={18} />
                  <input
                    aria-label="Buscar demonstrações"
                    placeholder="Busque por negócio, segmento ou solução…"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  {query && (
                    <button
                      aria-label="Limpar busca"
                      onClick={() => setQuery("")}
                    >
                      <X size={16} />
                    </button>
                  )}
                </label>
                <button
                  className="cb-filter-toggle cb-quiet"
                  onClick={() => setFiltersOpen((v) => !v)}
                  aria-label="Filtrar soluções"
                >
                  <SlidersHorizontal size={18} />
                </button>
                <button
                  className={`cb-favorites-toggle ${onlyFavorites ? "is-active" : ""}`}
                  onClick={() => setOnlyFavorites((v) => !v)}
                  aria-pressed={onlyFavorites}
                >
                  <Heart size={17} />
                  <span>Favoritos</span>
                  <b>{favorites.length}</b>
                </button>
              </div>
              <div className="cb-results-meta">
                <span>
                  <b>{found.length}</b> demonstrações{" "}
                  {kind === "all"
                    ? "para descobrir"
                    : `de ${families[kind].label.toLowerCase()}`}
                </span>
                <span>EXPLORE. TESTE. IMAGINE.</span>
              </div>
              <div className="cb-demo-grid">
                {found.map((p) => (
                  <article
                    className="cb-demo-card"
                    key={p.id}
                    data-demo-card={p.id}
                  >
                    <button
                      className="cb-card-open"
                      onClick={() => onNavigate(p.id)}
                      aria-label={`Abrir ${p.name}`}
                    >
                      <MiniPreview profile={p} />
                    </button>
                    <button
                      className={`cb-card-favorite ${favorites.includes(p.id) ? "is-active" : ""}`}
                      onClick={() => toggleFavorite(p.id)}
                      aria-label={`${favorites.includes(p.id) ? "Desfavoritar" : "Favoritar"} ${p.name}`}
                      aria-pressed={favorites.includes(p.id)}
                    >
                      <Heart
                        size={16}
                        fill={
                          favorites.includes(p.id) ? "currentColor" : "none"
                        }
                      />
                    </button>
                    <div className="cb-card-info">
                      <div className="cb-card-kicker">
                        <span style={{ color: p.color }}>{p.sector}</span>
                        <span>DEMO</span>
                      </div>
                      <h3>{p.name}</h3>
                      <p>{p.description}</p>
                      <div className="cb-card-bottom">
                        <span>{families[p.kind].action}</span>
                        <button
                          onClick={() => onNavigate(p.id)}
                          aria-label={`Experimentar ${p.name}`}
                        >
                          <ArrowUpRight size={19} />
                        </button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
              {found.length === 0 && (
                <div className="cb-empty">
                  <Search size={32} />
                  <h3>Nenhuma demonstração encontrada</h3>
                  <p>Tente outro segmento ou explore todos os modelos.</p>
                  <button className="cb-button" onClick={clear}>
                    Limpar filtros
                  </button>
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="cb-cta">
          <div>
            <div className="cb-eyebrow">DA DEMONSTRAÇÃO À SUA REALIDADE</div>
            <h2>
              O próximo projeto
              <br />
              pode ter a <em>sua marca.</em>
            </h2>
            <p>
              Conte o que você quer construir. A CodeBrand transforma a
              necessidade do seu negócio em uma experiência digital própria.
            </p>
          </div>
          <a
            className="cb-button"
            href="mailto:comercial@codebrand.app.br?subject=Quero%20construir%20com%20a%20CodeBrand"
          >
            Conversar sobre meu projeto
            <ArrowUpRight size={18} />
          </a>
        </section>
      </main>
      <footer className="cb-footer">
        <span className="cb-wordmark">
          codebrand<span>®</span>
        </span>
        <span>Tecnologia com identidade. Possibilidades com propósito.</span>
        <a href="mailto:comercial@codebrand.app.br">
          comercial@codebrand.app.br
        </a>
      </footer>
    </div>
  );
}

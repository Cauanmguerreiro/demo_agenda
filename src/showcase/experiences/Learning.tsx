import { useState } from "react";
import { Play, Check, BookOpen, ArrowRight } from "lucide-react";
import { SectionTitle, Metric, type ExperienceProps } from "../shared";

export function Learning({ profile, state, update, notify }: ExperienceProps) {
  const [course, setCourse] = useState(profile.items[0].id);
  const [lesson, setLesson] = useState(0);
  const current = profile.items.find((i) => i.id === course)!;
  const lessons = [
    "Conheça os fundamentos",
    "Explore um exemplo prático",
    "Coloque em prática",
  ];
  const keys = lessons.map((_, i) => `${course}:${i}`);
  const count = keys.filter((k) => state.progress.includes(k)).length;
  const complete = () => {
    const key = `${course}:${lesson}`;
    update((s) => ({
      ...s,
      progress: s.progress.includes(key) ? s.progress : [...s.progress, key],
    }));
    notify("Aula concluída. Seu progresso demo foi salvo.");
    if (lesson < 2) setLesson(lesson + 1);
  };
  return (
    <>
      <SectionTitle
        eyebrow="SEU ESPAÇO DE APRENDIZAGEM"
        title={profile.headline}
        description="Escolha uma trilha e experimente a jornada do aluno. O conteúdo abaixo é uma aula ilustrativa."
      />
      <div className="xp-metrics xp-metrics-three">
        <Metric label="Trilhas disponíveis" value={profile.items.length} />
        <Metric label="Aulas concluídas" value={state.progress.length} />
        <Metric
          label="Seu progresso geral"
          value={`${Math.round((state.progress.length / 9) * 100)}%`}
        />
      </div>
      <div className="xp-learning-layout">
        <aside className="xp-panel xp-course-list">
          <h2>Suas trilhas</h2>
          {profile.items.map((i) => (
            <button
              key={i.id}
              className={course === i.id ? "active" : ""}
              onClick={() => {
                setCourse(i.id);
                setLesson(0);
              }}
            >
              <BookOpen size={18} />
              <span>
                <b>{i.name}</b>
                <small>3 aulas · conteúdo demonstrativo</small>
              </span>
              <ArrowRight size={15} />
            </button>
          ))}
        </aside>
        <section className="xp-course">
          <div className="xp-lesson-art">
            <span className="xp-play-circle">
              <Play size={30} />
            </span>
            <small>AULA {lesson + 1} · DEMONSTRAÇÃO</small>
            <h2>{lessons[lesson]}</h2>
            <p>{current.name}</p>
          </div>
          <div className="xp-panel xp-lesson-copy">
            <span className="xp-eyebrow">{current.name}</span>
            <h2>{lessons[lesson]}</h2>
            <p>
              {lesson === 0
                ? `Nesta trilha de ${profile.sector.toLowerCase()}, o primeiro passo é reconhecer o objetivo e organizar as bases do aprendizado.`
                : lesson === 1
                  ? "Observe um caso ilustrativo: uma equipe identifica um desafio, organiza as informações e testa uma solução simples antes de ampliar."
                  : "Seu exercício: escolha uma situação da sua rotina, registre três ações possíveis e defina qual delas você testaria primeiro."}
            </p>
            <div className="xp-section-row">
              <span>{count} de 3 aulas concluídas</span>
              <button
                className="xp-button"
                onClick={complete}
                disabled={state.progress.includes(keys[lesson])}
              >
                <Check size={16} />
                {state.progress.includes(keys[lesson])
                  ? "Aula concluída"
                  : "Concluir aula"}
              </button>
            </div>
            <div className="xp-progress">
              <span style={{ width: `${(count / 3) * 100}%` }} />
            </div>
            <div className="xp-lesson-tabs">
              {lessons.map((l, i) => (
                <button
                  key={l}
                  onClick={() => setLesson(i)}
                  className={lesson === i ? "active" : ""}
                >
                  {state.progress.includes(keys[i]) ? (
                    <Check size={15} />
                  ) : (
                    <span>{i + 1}</span>
                  )}
                  {l}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

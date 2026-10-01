import type { DemoProfile, DemoItem } from "./catalog";
import type { DemoState } from "./model";
export interface ExperienceProps {
  profile: DemoProfile;
  state: DemoState;
  update: (fn: (current: DemoState) => DemoState) => void;
  notify: (message: string) => void;
}
export function Metric({
  label,
  value,
  detail,
}: {
  label: string;
  value: string | number;
  detail?: string;
}) {
  return (
    <div className="xp-metric">
      <span>{label}</span>
      <b>{value}</b>
      {detail && <small>{detail}</small>}
    </div>
  );
}
export function SectionTitle({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="xp-section-title">
      <span>{eyebrow}</span>
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
export function ItemArt({
  item,
  variant = "product",
}: {
  item: DemoItem;
  variant?: string;
}) {
  return (
    <div className={`xp-item-art xp-art-${variant}`} aria-hidden="true">
      <div className="xp-art-object">
        {variant === "property" ? (
          <>
            <i />
            <b />
            <span />
          </>
        ) : (
          item.symbol
        )}
      </div>
      <span className="xp-art-caption">
        {variant === "food"
          ? "FEITO COM CUIDADO"
          : variant === "property"
            ? "UM NOVO LUGAR"
            : item.tag.toUpperCase()}
      </span>
    </div>
  );
}
export function Empty({ children }: { children: React.ReactNode }) {
  return <div className="xp-empty">{children}</div>;
}
export const newId = () =>
  globalThis.crypto?.randomUUID?.() ||
  `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;

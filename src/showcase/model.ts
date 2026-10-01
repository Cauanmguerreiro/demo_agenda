import type { DemoItem } from "./catalog";
export type Cart = Record<string, number>;
export interface LedgerEntry {
  id: string;
  name: string;
  amount: number;
  type: "income" | "expense";
}
export interface Submission {
  id: string;
  name: string;
  detail: string;
}
export interface DemoState {
  cart: Cart;
  stages: Record<string, number>;
  stock: Record<string, number>;
  progress: string[];
  favorites: string[];
  ledger: LedgerEntry[];
  submissions: Submission[];
  activePlan: string;
  canceled: boolean;
}
export const freshState = (): DemoState => ({
  cart: {},
  stages: {},
  stock: {},
  progress: [],
  favorites: [],
  ledger: [],
  submissions: [],
  activePlan: "",
  canceled: false,
});
export const money = (n: number) =>
  n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export function normalizeCart(
  cart: Cart,
  items: Pick<DemoItem, "id" | "stock">[],
): Cart {
  return Object.fromEntries(
    items.flatMap((item) => {
      const quantity = cart[item.id];
      return Number.isSafeInteger(quantity) && quantity > 0 && item.stock > 0
        ? [[item.id, Math.min(item.stock, quantity)]]
        : [];
    }),
  );
}
export function changeCart(
  cart: Cart,
  items: Pick<DemoItem, "id" | "price" | "stock">[],
  id: string,
  delta: number,
): Cart {
  const item = items.find((i) => i.id === id);
  if (!item || !Number.isInteger(delta)) return cart;
  const next = { ...cart };
  const quantity = Math.min(item.stock, Math.max(0, (cart[id] || 0) + delta));
  if (quantity) next[id] = quantity;
  else delete next[id];
  return next;
}
export function cartTotal(cart: Cart, items: Pick<DemoItem, "id" | "price">[]) {
  return (
    items.reduce(
      (total, i) => total + Math.round(i.price * 100) * (cart[i.id] || 0),
      0,
    ) / 100
  );
}
export function changeStock(current: number, delta: number) {
  return Number.isInteger(delta) && current + delta >= 0
    ? current + delta
    : current;
}
export function stockMovement(
  current: number,
  quantity: number,
  direction: "in" | "out",
) {
  if (
    !Number.isSafeInteger(current) ||
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    quantity > 9999
  )
    return current;
  return changeStock(current, quantity * (direction === "in" ? 1 : -1));
}
type StoragePort = {
  getItem: (key: string) => string | null;
  setItem: (key: string, value: string) => unknown;
};
export const storageKey = (id: string) => `codebrand:demo:v1:${id}`;
const dictionary = (value: unknown, type: "number" | "string") =>
  value !== null &&
  typeof value === "object" &&
  !Array.isArray(value) &&
  Object.entries(value).every(
    ([k, v]) =>
      !["__proto__", "constructor", "prototype"].includes(k) &&
      typeof v === type &&
      (type !== "number" || (Number.isFinite(v) && Number(v) >= 0)),
  );
function valid(value: unknown, initial: object): value is object {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  return Object.entries(initial).every(([k, fallback]) => {
    if (!(k in v)) return false;
    if (["cart", "stages", "stock"].includes(k))
      return (
        dictionary(v[k], "number") &&
        Object.values(v[k] as object).every(Number.isInteger)
      );
    if (["progress", "favorites"].includes(k))
      return (
        Array.isArray(v[k]) &&
        (v[k] as unknown[]).every((x) => typeof x === "string")
      );
    if (k === "ledger")
      return (
        Array.isArray(v[k]) &&
        (v[k] as LedgerEntry[]).every(
          (x) =>
            x &&
            typeof x.id === "string" &&
            typeof x.name === "string" &&
            Number.isFinite(x.amount) &&
            x.amount > 0 &&
            ["income", "expense"].includes(x.type),
        )
      );
    if (k === "submissions")
      return (
        Array.isArray(v[k]) &&
        (v[k] as Submission[]).every(
          (x) =>
            x &&
            typeof x.id === "string" &&
            typeof x.name === "string" &&
            typeof x.detail === "string",
        )
      );
    return typeof v[k] === typeof fallback;
  });
}
export function loadDemoState<T extends object>(
  id: string,
  initial: T,
  storage?: StoragePort,
): T {
  try {
    const raw = (storage ?? localStorage).getItem(storageKey(id));
    if (!raw) return initial;
    const parsed = JSON.parse(raw);
    return valid(parsed, initial) ? { ...initial, ...parsed } : initial;
  } catch {
    return initial;
  }
}
export function saveDemoState(
  id: string,
  state: object,
  storage?: StoragePort,
) {
  try {
    (storage ?? localStorage).setItem(storageKey(id), JSON.stringify(state));
  } catch {
    /* Demo remains usable without storage. */
  }
}
export function downloadCsv(rows: string[][], filename: string) {
  const csv =
    "\uFEFF" +
    rows
      .map((row) =>
        row.map((value) => `"${value.replace(/"/g, '""')}"`).join(";"),
      )
      .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([csv], { type: "text/csv;charset=utf-8" }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

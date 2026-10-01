import { useState } from "react";
import {
  Plus,
  Minus,
  ShoppingBag,
  ArrowRight,
  Search,
  Check,
} from "lucide-react";
import { changeCart, cartTotal, money } from "../model";
import { type ExperienceProps, ItemArt, Empty, newId } from "../shared";

export function Commerce({ profile, state, update, notify }: ExperienceProps) {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("featured");
  const [category, setCategory] = useState("Todos");
  const food = profile.kind === "food";
  const { items } = profile;
  const shown = items
    .filter(
      (i) =>
        (category === "Todos" || i.tag === category) &&
        i.name.toLowerCase().includes(search.toLowerCase()),
    )
    .sort((a, b) =>
      sort === "price"
        ? a.price - b.price
        : sort === "name"
          ? a.name.localeCompare(b.name)
          : 0,
    );
  const quantity = Object.values(state.cart).reduce((a, b) => a + b, 0);
  const change = (id: string, delta: number) =>
    update((s) => ({ ...s, cart: changeCart(s.cart, items, id, delta) }));
  const checkout = () => {
    if (!quantity) return;
    const total = cartTotal(state.cart, items);
    update((s) => ({
      ...s,
      cart: {},
      submissions: [
        ...s.submissions,
        {
          id: newId(),
          name: "Pedido simulado",
          detail: `${quantity} itens · ${money(total)}`,
        },
      ],
    }));
    notify(
      `Pedido simulado criado: ${quantity} itens, ${money(total)}. Nenhuma compra ou cobrança real.`,
    );
  };
  return (
    <>
      <section className={`xp-shop-hero ${food ? "xp-food-hero" : ""}`}>
        <div>
          <span className="xp-eyebrow">
            {food
              ? "SABOR QUE CHEGA ATÉ VOCÊ"
              : "UMA SELEÇÃO COM PERSONALIDADE"}
          </span>
          <h1>{profile.headline}</h1>
          <p>
            {food
              ? "Escolha seus favoritos, monte seu pedido e experimente a jornada do cardápio digital."
              : "Explore a coleção e experimente uma compra simples, do primeiro clique ao carrinho."}
          </p>
          <a href="#produtos" className="xp-button">
            {food ? "Explorar cardápio" : "Ver coleção"}
            <ArrowRight size={16} />
          </a>
        </div>
        <div className="xp-shop-hero-art" aria-hidden="true">
          <span>{food ? "◉" : "◈"}</span>
          <small>
            {food ? "FRESCO. ARTESANAL. SEU." : "O ESSENCIAL TEM IDENTIDADE."}
          </small>
          <i />
        </div>
      </section>
      <div className="xp-shop-layout" id="produtos">
        <section>
          <div className="xp-section-row">
            <h2>{food ? "Nosso cardápio" : "Nossa seleção"}</h2>
            <span>
              {items.length} {food ? "opções" : "produtos"}
            </span>
          </div>
          <div className="xp-shop-controls">
            <label className="xp-search">
              <Search size={16} />
              <input
                aria-label={food ? "Buscar no cardápio" : "Buscar produtos"}
                placeholder={
                  food
                    ? "O que você quer pedir?"
                    : "Encontre seu próximo favorito"
                }
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </label>
            <select
              aria-label="Ordenar produtos"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="featured">Destaques</option>
              <option value="price">Menor preço</option>
              <option value="name">Nome A–Z</option>
            </select>
          </div>
          <div className="xp-chips">
            {["Todos", ...items.map((i) => i.tag)].map((c) => (
              <button
                className={category === c ? "active" : ""}
                key={c}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
          <div className={`xp-products ${food ? "xp-menu-list" : ""}`}>
            {shown.map((i) => (
              <article className="xp-product" key={i.id}>
                <ItemArt item={i} variant={food ? "food" : "product"} />
                <div className="xp-product-body">
                  <span className="xp-eyebrow">{i.tag}</span>
                  <h3>{i.name}</h3>
                  <p>
                    {i.detail}.{" "}
                    {food
                      ? "Preparado na hora para você."
                      : "Design, qualidade e atenção aos detalhes."}
                  </p>
                  <div className="xp-product-buy">
                    <b>{money(i.price)}</b>
                    <button
                      className="xp-icon-button"
                      onClick={() => change(i.id, 1)}
                      disabled={(state.cart[i.id] || 0) >= i.stock}
                      aria-label={`Adicionar ${i.name}`}
                    >
                      <Plus size={18} />
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
          {!shown.length && (
            <Empty>
              Nenhum item encontrado. Tente outra busca ou categoria.
            </Empty>
          )}
        </section>
        <aside className="xp-cart">
          <div className="xp-section-row">
            <h2>
              <ShoppingBag size={18} />
              Seu pedido
            </h2>
            <span>{quantity}</span>
          </div>
          {!quantity ? (
            <Empty>
              Seu pedido começa com uma boa escolha.
              <br />
              Adicione um item para experimentar.
            </Empty>
          ) : (
            items
              .filter((i) => state.cart[i.id])
              .map((i) => (
                <div className="xp-cart-item" key={i.id}>
                  <div>
                    <b>{i.name}</b>
                    <small>{money(i.price)}</small>
                  </div>
                  <div className="xp-stepper">
                    <button
                      onClick={() => change(i.id, -1)}
                      aria-label={`Remover ${i.name}`}
                    >
                      <Minus size={13} />
                    </button>
                    <span data-cart-quantity>{state.cart[i.id]}</span>
                    <button
                      onClick={() => change(i.id, 1)}
                      aria-label={`Aumentar ${i.name}`}
                      disabled={state.cart[i.id] >= i.stock}
                    >
                      <Plus size={13} />
                    </button>
                  </div>
                </div>
              ))
          )}
          <div className="xp-cart-total">
            <span>Total do pedido</span>
            <b>{money(cartTotal(state.cart, items))}</b>
          </div>
          <button
            className="xp-button xp-full"
            onClick={checkout}
            disabled={!quantity}
          >
            Finalizar pedido demo
            <ArrowRight size={16} />
          </button>
          <small className="xp-muted">
            Checkout simulado. Nenhum pedido é enviado.
          </small>
          {state.submissions.length > 0 && (
            <div className="xp-receipt">
              <Check size={16} />
              <div>
                <b>Último pedido demo</b>
                <small>{state.submissions.at(-1)?.detail}</small>
              </div>
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

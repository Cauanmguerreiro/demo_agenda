import test from "node:test";
import assert from "node:assert/strict";

const catalog = await import("../src/showcase/catalog.ts").catch(() => null);
const model = await import("../src/showcase/model.ts").catch(() => null);

test("finds businesses by accent-insensitive search and workflow", () => {
  assert.ok(catalog, "business catalog must exist");
  assert.equal(catalog.profiles.length, 70);
  assert.equal(new Set(catalog.profiles.map((p) => p.id)).size, 70);
  assert.ok(
    catalog.filterProfiles("imoveis", "all").some((p) => p.kind === "property"),
  );
  assert.ok(catalog.filterProfiles("", "commerce").length >= 5);
  assert.equal(catalog.filterProfiles("zz-no-match", "all").length, 0);
});

test("cart computes money in cents and respects stock and removal", () => {
  assert.ok(model, "business rules must exist");
  const items = [{ id: "a", name: "Produto", price: 19.9, stock: 2 }];
  let cart = model.changeCart({}, items, "a", 1);
  cart = model.changeCart(cart, items, "a", 1);
  assert.equal(model.cartTotal(cart, items), 39.8);
  assert.deepEqual(model.changeCart(cart, items, "a", 1), { a: 2 });
  assert.deepEqual(model.changeCart(cart, items, "missing", 1), { a: 2 });
  cart = model.changeCart(cart, items, "a", -2);
  assert.deepEqual(cart, {});
  assert.deepEqual(model.changeCart(cart, items, "a", NaN), {});
});

test("inventory prevents negative units and invalid movements", () => {
  assert.ok(model);
  assert.equal(model.changeStock(3, -4), 3);
  assert.equal(model.changeStock(3, -2), 1);
  assert.equal(model.changeStock(3, 5), 8);
  assert.equal(model.changeStock(3, NaN), 3);
  assert.equal(model.changeStock(3, 0.5), 3);
});

test("local state isolates companies and recovers from corrupt storage", () => {
  assert.ok(model);
  const values = new Map<string, string>();
  const storage = {
    getItem: (k: string) => values.get(k) ?? null,
    setItem: (k: string, v: string) => values.set(k, v),
  };
  model.saveDemoState("one", { cart: { a: 2 } }, storage);
  assert.deepEqual(model.loadDemoState("one", { cart: {} }, storage), {
    cart: { a: 2 },
  });
  assert.deepEqual(model.loadDemoState("two", { cart: {} }, storage), {
    cart: {},
  });
  values.set("codebrand:demo:v1:one", "{bad");
  assert.deepEqual(model.loadDemoState("one", { cart: {} }, storage), {
    cart: {},
  });
  values.set("codebrand:demo:v1:one", '{"cart":null}');
  assert.deepEqual(model.loadDemoState("one", { cart: {} }, storage), {
    cart: {},
  });
  const blocked = {
    getItem: () => {
      throw Error("blocked");
    },
    setItem: () => {
      throw Error("blocked");
    },
  };
  assert.deepEqual(model.loadDemoState("one", { cart: {} }, blocked), {
    cart: {},
  });
  assert.doesNotThrow(() => model.saveDemoState("one", { cart: {} }, blocked));
});

test("restored carts drop removed products and clamp quantities to current stock", () => {
  assert.ok(model);
  assert.equal(typeof model.normalizeCart, "function");
  const items = [
    { id: "a", price: 19.9, stock: 2 },
    { id: "b", price: 4.5, stock: 0 },
  ];
  assert.deepEqual(model.normalizeCart({ a: 999, b: 2, removed: 4 }, items), {
    a: 2,
  });
  assert.deepEqual(model.normalizeCart({ a: -3 }, items), {});
  assert.deepEqual(model.normalizeCart({ a: 0.5 }, items), {});
});

test("stock movement rejects negative, zero, fractional and oversized user quantities", () => {
  assert.ok(model);
  assert.equal(typeof model.stockMovement, "function");
  assert.equal(model.stockMovement(12, -1, "out"), 12);
  assert.equal(model.stockMovement(12, -1, "in"), 12);
  assert.equal(model.stockMovement(12, 0, "in"), 12);
  assert.equal(model.stockMovement(12, 1.5, "out"), 12);
  assert.equal(model.stockMovement(12, 10000, "in"), 12);
  assert.equal(model.stockMovement(12, 1, "in"), 13);
  assert.equal(model.stockMovement(12, 1, "out"), 11);
  assert.equal(model.stockMovement(12, 13, "out"), 12);
});

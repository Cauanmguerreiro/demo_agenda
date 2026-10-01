import { createRequire } from "node:module";
import assert from "node:assert/strict";
const require = createRequire(import.meta.url);
import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { dirname, join } from "node:path";
const origin = process.env.DEMO_TEST_URL || "http://127.0.0.1:3000";
let server;
if (!process.env.DEMO_TEST_URL) {
  server = spawn(
    process.execPath,
    [
      join(dirname(require.resolve("vite/package.json")), "bin/vite.js"),
      "--host",
      "127.0.0.1",
      "--port",
      "3000",
      "--strictPort",
    ],
    { stdio: "pipe" },
  );
  let serverOutput = "";
  server.stderr.on("data", (chunk) => (serverOutput += chunk));
  server.stdout.on("data", (chunk) => (serverOutput += chunk));
  let ready = false;
  for (let attempt = 0; attempt < 100; attempt++) {
    if (server.exitCode !== null)
      throw new Error("Demo server exited: " + serverOutput);
    try {
      ready = serverOutput.includes("Local:") && (await fetch(origin)).ok;
    } catch {}
    if (ready) break;
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (!ready) {
    server.kill();
    throw new Error("Demo server failed to start: " + serverOutput);
  }
}
let browser;
try {
  browser = await chromium.launch({
    headless: true,
    executablePath: process.env.CHROMIUM_EXECUTABLE_PATH,
    args: ["--no-sandbox", "--disable-dev-shm-usage", "--disable-gpu"],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
  });
  page.setDefaultTimeout(10000);
  const errors = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.goto(origin);
  await page.getByRole("heading", { name: /Seu próximo negócio/ }).waitFor();
  assert.equal(await page.locator("[data-demo-card]").count(), 70);
  const demoIds = await page
    .locator("[data-demo-card]")
    .evaluateAll((cards) =>
      cards.map((card) => card.getAttribute("data-demo-card")),
    );
  if (process.env.DEMO_QA_DIR) {
    const { mkdir } = await import("node:fs/promises");
    await mkdir(process.env.DEMO_QA_DIR, { recursive: true });
    await page.screenshot({
      path: join(process.env.DEMO_QA_DIR, "gallery-desktop.png"),
    });
    await page.locator("#catalogo").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: join(process.env.DEMO_QA_DIR, "catalog-desktop.png"),
    });
  }
  await page
    .getByRole("button", { name: "Favoritar Forma Studio", exact: true })
    .click();
  await page.getByRole("button", { name: /Favoritos/ }).click();
  assert.equal(await page.locator("[data-demo-card]").count(), 1);
  await page.getByRole("button", { name: /Favoritos/ }).click();
  await page.getByLabel("Buscar demonstrações").fill("imoveis");
  assert.ok((await page.locator("[data-demo-card]").count()) > 0);
  await page.getByLabel("Buscar demonstrações").fill("nada-zzzzz");
  await page.getByText("Nenhuma demonstração encontrada").waitFor();
  await page.getByRole("button", { name: "Limpar filtros" }).click();
  for (const id of demoIds) {
    await page.goto(`${origin}/?demo=${id}`);
    await page.getByRole("button", { name: "Voltar ao catálogo" }).waitFor();
    assert.ok((await page.locator("main").innerText()).length > 100, id);
  }
  await page.goto(`${origin}/?demo=moda`);
  await page.getByRole("button", { name: "Adicionar Camisa de linho" }).click();
  await page.getByText("Total do pedido").waitFor();
  await page.reload();
  assert.equal(
    await page.locator("[data-cart-quantity]").first().innerText(),
    "1",
  );
  await page.getByRole("button", { name: "Finalizar pedido demo" }).click();
  await page.getByText(/Pedido simulado criado/).waitFor();
  await page.evaluate(() => {
    const key = "codebrand:demo:v1:moda";
    const stored = JSON.parse(localStorage.getItem(key));
    stored.cart = { "moda-0": 999, "removed-item": 2 };
    localStorage.setItem(key, JSON.stringify(stored));
  });
  await page.reload();
  assert.equal(
    await page.locator("[data-cart-quantity]").first().innerText(),
    "12",
  );
  assert.equal(await page.locator("[data-cart-quantity]").count(), 1);
  await page
    .getByRole("button", { name: "Restaurar demonstração", exact: true })
    .click();
  await page.goto(`${origin}/?demo=estoque-varejo`);
  await page.getByLabel("Quantidade do movimento", { exact: true }).fill("-1");
  await page
    .getByRole("button", { name: "Saída de Camiseta básica", exact: true })
    .click();
  assert.equal(await page.locator("[data-stock]").first().innerText(), "12");
  await page.getByLabel("Quantidade do movimento", { exact: true }).fill("1");
  await page
    .getByRole("button", { name: "Entrada de Camiseta básica" })
    .click();
  assert.equal(await page.locator("[data-stock]").first().innerText(), "13");
  await page.goto(`${origin}/?demo=escola-tech`);
  await page.getByRole("button", { name: "Concluir aula" }).click();
  await page.getByText("1 de 3 aulas concluídas").waitFor();
  await page.goto(`${origin}/?demo=bpo`);
  await page.getByLabel("Descrição do lançamento").fill("Teste de recebimento");
  await page.getByLabel("Valor do lançamento").fill("100");
  await page.getByRole("button", { name: "Registrar lançamento" }).click();
  await page.getByText("Teste de recebimento").waitFor();
  await page.goto(`${origin}/?demo=saas`);
  await page.getByRole("button", { name: "Escolher Essencial" }).click();
  await page.getByText(/Plano Essencial ativado/).waitFor();
  await page.getByRole("button", { name: "Cancelar assinatura demo" }).click();
  await page
    .getByRole("status")
    .filter({ hasText: "Assinatura demo cancelada." })
    .waitFor();
  await page.goto(`${origin}/?demo=seguros`);
  await page.getByLabel("Etapa de Seguro empresarial").selectOption("3");
  await page
    .getByRole("status")
    .filter({ hasText: "Movido para Fechado." })
    .waitFor();
  await page.getByLabel("Nome da oportunidade").fill("Empresa nova");
  await page.getByRole("button", { name: "Adicionar oportunidade" }).click();
  await page.getByRole("heading", { name: "Empresa nova" }).waitFor();
  await page.goto(`${origin}/?demo=agencia-projetos`);
  await page.getByLabel("Nome da tarefa").fill("Preparar apresentação");
  await page.getByRole("button", { name: "Criar tarefa", exact: true }).click();
  await page
    .getByRole("button", { name: "Avançar Preparar apresentação" })
    .click();
  await page
    .getByRole("status")
    .filter({ hasText: "Movido para Em andamento." })
    .waitFor();
  await page.goto(`${origin}/?demo=transportadora`);
  await page.getByRole("button", { name: "Avançar entrega" }).first().click();
  await page
    .getByRole("status")
    .filter({ hasText: "Remessa atualizada: Coletado." })
    .waitFor();
  await page.goto(`${origin}/?demo=helpdesk`);
  await page
    .getByLabel("Assunto", { exact: true })
    .fill("Acesso de novo colaborador");
  await page.getByRole("button", { name: "Abrir chamado demo" }).click();
  await page
    .getByLabel("Status de Acesso de novo colaborador")
    .selectOption("2");
  assert.equal(
    await page.getByLabel("Status de Acesso de novo colaborador").inputValue(),
    "2",
  );
  await page.goto(`${origin}/?demo=imoveis`);
  await page
    .getByRole("button", { name: "Ver Apartamento Jardim", exact: true })
    .click();
  await page.getByLabel("Nome do interessado").fill("Pessoa de exemplo");
  await page.getByLabel("E-mail do interessado").fill("exemplo@example.com");
  await page.getByRole("button", { name: "Simular interesse" }).click();
  await page.getByText(/Interesse em Apartamento Jardim registrado/).waitFor();
  await page.goto(`${origin}/?demo=conferencia`);
  await page.getByLabel("Nome do participante").fill("Pessoa de exemplo");
  await page.getByLabel("E-mail", { exact: true }).fill("exemplo@example.com");
  await page.getByRole("button", { name: "Simular inscrição" }).click();
  await page.getByText("11 vagas no demo", { exact: true }).waitFor();
  await page.goto(`${origin}/?demo=arquitetura`);
  await page.getByLabel("Seu nome", { exact: true }).fill("Pessoa de exemplo");
  await page
    .getByLabel("Seu e-mail", { exact: true })
    .fill("exemplo@example.com");
  await page.getByRole("button", { name: "Simular solicitação" }).click();
  await page
    .getByText("1 solicitações registradas no demo.", { exact: true })
    .waitFor();
  await page.goto(`${origin}/?demo=hamburgueria`);
  await page
    .getByRole("button", { name: "Adicionar Burger da casa", exact: true })
    .click();
  assert.equal(
    await page.locator("[data-cart-quantity]").first().innerText(),
    "1",
  );
  await page
    .getByRole("button", { name: "Restaurar demonstração", exact: true })
    .click();
  await page.getByText("Demonstração restaurada.", { exact: true }).waitFor();
  assert.equal(await page.locator("[data-cart-quantity]").count(), 0);
  await page
    .getByRole("button", { name: "Voltar ao catálogo", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Abrir Forma Studio", exact: true })
    .click();
  assert.ok(page.url().includes("?demo=moda"));
  await page.goBack();
  await page.getByRole("heading", { name: /Seu próximo negócio/ }).waitFor();
  await page.goto(`${origin}/?demo=saas&presentation=true`);
  assert.equal(
    await page
      .getByRole("button", { name: "Restaurar demonstração", exact: true })
      .count(),
    0,
  );
  await page
    .getByRole("button", { name: "Voltar ao catálogo", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Abrir Forma Studio", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Restaurar demonstração", exact: true })
    .waitFor();
  await page.goto(`${origin}/?demo=salao`);
  await page
    .getByRole("button", { name: "Modo apresentação", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Sair do Modo Apresentação", exact: true })
    .waitFor();
  await page
    .getByRole("button", { name: "Sair da apresentação", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Modo Apresentação", exact: true })
    .waitFor();
  await page.goto(`${origin}/?demo=desconhecido`);
  await page.getByText("Demonstração não encontrada").waitFor();
  await page.setViewportSize({ width: 375, height: 812 });
  for (const id of ["", ...demoIds]) {
    await page.goto(`${origin}/${id ? "?demo=" + id : ""}`);
    await page
      .getByRole("button", {
        name: id ? "Voltar ao catálogo" : "Explorar demonstrações",
        exact: true,
      })
      .waitFor();
    await page.locator("main").waitFor();
    assert.ok((await page.locator("main").innerText()).length > 100);
    if (!id) {
      const copyBox = await page.locator(".cb-hero-copy").boundingBox();
      assert.ok(
        copyBox.x + copyBox.width <= 375,
        "Gallery hero copy is clipped on mobile",
      );
    }
    assert.ok(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `mobile overflow ${id}`,
    );
  }
  if (process.env.DEMO_QA_DIR) {
    await page.goto(origin);
    await page.getByRole("heading", { name: /Seu próximo negócio/ }).waitFor();
    await page.screenshot({
      path: join(process.env.DEMO_QA_DIR, "gallery-mobile.png"),
    });
    await page.goto(`${origin}/?demo=moda`);
    await page
      .getByRole("heading", { name: "Vista sua próxima versão." })
      .waitFor();
    await page.screenshot({
      path: join(process.env.DEMO_QA_DIR, "store-mobile.png"),
      fullPage: true,
    });
  }
  assert.deepEqual(errors, []);
  console.log(
    "Browser smoke: all 70 profiles, 13 new business workflows, original agendas, gallery filters/favorites, persistence/reset, browser back and mobile widths passed.",
  );
} finally {
  await browser?.close();
  server?.kill();
}

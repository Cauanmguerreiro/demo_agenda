# CodeBrand Showcase

Uma vitrine interativa do que a **CodeBrand** pode construir: **70 negócios demonstráveis em 14 famílias de soluções**.

O projeto começou com sete modelos de agenda. Agora a entrada é um catálogo com busca, filtros, favoritos e experiências próprias para vendas, operação, atendimento, educação, captação e outros modelos de negócio.

## O que dá para experimentar

| Família                | Modelos | Jornada demonstrável                                                       |
| ---------------------- | ------: | -------------------------------------------------------------------------- |
| Agendas e serviços     |       7 | Agenda, clientes, profissionais, serviços e financeiro original            |
| Lojas e catálogos      |       6 | Buscar produtos, filtrar, ordenar, montar carrinho e finalizar pedido demo |
| Cardápios e delivery   |       5 | Escolher itens, alterar quantidades e simular um pedido                    |
| CRM e vendas           |       5 | Criar oportunidades e avançar negociações no funil                         |
| Financeiro e BPO       |       5 | Registrar entradas/saídas, calcular saldo e exportar CSV                   |
| Projetos e operação    |       5 | Criar tarefas, filtrar e mover pelo kanban                                 |
| Cursos e educação      |       5 | Escolher trilhas, explorar aulas e salvar progresso                        |
| Imóveis e espaços      |       5 | Buscar por região/valor, salvar opções e simular interesse                 |
| Logística e entregas   |       4 | Filtrar remessas e avançar o rastreamento por quatro etapas                |
| Suporte e solicitações |       4 | Abrir chamados, definir prioridade e atualizar status                      |
| Estoque e produção     |       5 | Movimentar unidades, identificar reposição e exportar inventário           |
| SaaS e assinaturas     |       4 | Comparar cobrança mensal/anual, escolher plano e cancelar no demo          |
| Eventos e ingressos    |       5 | Escolher programação e simular inscrições com controle de vagas            |
| Sites e captação       |       5 | Explorar serviços e experimentar um formulário de interesse                |
| **Total**              |  **70** | **Dados e ações específicos por família**                                  |

Confira os nomes, segmentos e links no [catálogo completo](docs/catalogo.md).

## Executar

Use **Node.js 22.12 ou superior**.

```bash
npm ci
npm run dev
```

Acesse `http://localhost:3000`. Para ambientes que só permitem loopback:

```bash
npm run dev -- --host 127.0.0.1
```

Não são necessárias chaves de API, Firebase, servidor de aplicação ou banco de dados.

## Apresentar para um prospect

1. Busque o segmento ou escolha uma família no catálogo.
2. Abra a demonstração e experimente a interação principal.
3. Use **Compartilhar** para copiar o link direto.
4. Use **Modo apresentação** para reduzir os controles da vitrine.
5. Use **Restaurar** para reiniciar a experiência atual.

Exemplos de links, usando o domínio onde o projeto for publicado:

```text
/?demo=moda
/?demo=hamburgueria
/?demo=seguros
/?demo=bpo
/?demo=escola-tech
/?demo=imoveis
/?demo=saas&presentation=true
/?demo=salao
```

As 63 novas experiências salvam alterações localmente, com dados separados por empresa. Os favoritos do catálogo também são salvos. As agendas originais mantêm sua gestão em memória e podem ser restauradas. A aplicação continua utilizável quando o navegador bloqueia o armazenamento.

## Limites da demonstração

As empresas, produtos, imóveis, eventos, preços e indicadores são fictícios. Checkout, inscrições, adesão e formulários produzem resultados locais: **não enviam mensagens, não processam pagamentos, não emitem ingressos e não criam pedidos reais**. O curso contém aulas ilustrativas, sem vídeos ou certificados reais. O contato comercial da CodeBrand usa um link de e-mail e depende da ação do visitante.

Esses modelos demonstram jornadas e interfaces. Integrações, autenticação, pagamento, dados reais e regras específicas são implementados no projeto contratado.

## Verificações

```bash
npm test
npm run lint
npm run build
npx playwright install chromium
npm run test:browser
```

O teste de navegador inicia e encerra seu próprio servidor Vite. Para testar uma publicação existente, use `DEMO_TEST_URL=https://seu-dominio`. Também aceita `CHROMIUM_EXECUTABLE_PATH` quando o ambiente oferece um Chromium próprio.

## Publicação estática

```bash
npm run build
```

Publique a pasta `dist` no provedor de hospedagem estática. A navegação usa parâmetros da URL. Para publicar em um subdiretório:

```bash
VITE_BASE_PATH=/demo_agenda/ npm run build
```

A fonte Plus Jakarta Sans é carregada do Google Fonts; se estiver indisponível, o layout usa a fonte do sistema.

## Adicionar uma possibilidade

- `src/showcase/catalog.ts`: famílias, perfis, termos, cores e itens fictícios.
- `src/showcase/experiences/`: interfaces e jornadas por modelo de negócio.
- `src/showcase/model.ts`: regras de carrinho, estoque, exportação e armazenamento.
- `src/showcase/Gallery.tsx`: vitrine, filtros, busca e favoritos.
- `src/showcase/Experience.tsx`: composição das experiências e persistência.
- `src/App.tsx`: links diretos, histórico, apresentação e restauração.
- `src/AgendaApp.tsx`: aplicação de agendamento original.

Para um novo negócio de uma família existente, adicione um perfil em `seeds`, com ID único, marca fictícia, segmento, chamada, cor e três itens relevantes. Para uma nova jornada, adicione um tipo em `DemoKind`, sua definição em `families` e um componente correspondente em `Experience.tsx`. Os testes verificam os contratos comerciais e evitam regressões na navegação.

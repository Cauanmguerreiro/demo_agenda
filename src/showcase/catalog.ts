import { demos } from "../config/demos";

export type DemoKind =
  | "agenda"
  | "commerce"
  | "food"
  | "crm"
  | "finance"
  | "projects"
  | "learning"
  | "property"
  | "logistics"
  | "support"
  | "inventory"
  | "subscription"
  | "events"
  | "landing";
export interface DemoItem {
  id: string;
  name: string;
  detail: string;
  tag: string;
  price: number;
  stock: number;
  symbol: string;
}
export interface DemoProfile {
  id: string;
  name: string;
  sector: string;
  kind: DemoKind;
  headline: string;
  description: string;
  color: string;
  tags: string[];
  items: DemoItem[];
}

export const families: Record<
  DemoKind,
  { label: string; action: string; description: string; symbol: string }
> = {
  agenda: {
    label: "Agendas & serviços",
    action: "Agendar atendimento",
    description: "Horários, clientes e profissionais",
    symbol: "◷",
  },
  commerce: {
    label: "Lojas & catálogos",
    action: "Montar um pedido",
    description: "Vitrines, carrinho e produtos",
    symbol: "▧",
  },
  food: {
    label: "Cardápios & delivery",
    action: "Fazer um pedido",
    description: "Cardápio digital e operação de pedidos",
    symbol: "◉",
  },
  crm: {
    label: "CRM & vendas",
    action: "Mover uma negociação",
    description: "Funil comercial e oportunidades",
    symbol: "↗",
  },
  finance: {
    label: "Financeiro & BPO",
    action: "Registrar um lançamento",
    description: "Entradas, saídas e fluxo de caixa",
    symbol: "＄",
  },
  projects: {
    label: "Projetos & operação",
    action: "Criar uma tarefa",
    description: "Kanban, responsáveis e execução",
    symbol: "▤",
  },
  learning: {
    label: "Cursos & educação",
    action: "Concluir uma aula",
    description: "Trilhas e progresso de aprendizagem",
    symbol: "◇",
  },
  property: {
    label: "Imóveis & espaços",
    action: "Explorar um imóvel",
    description: "Busca, favoritos e interesse",
    symbol: "⌂",
  },
  logistics: {
    label: "Logística & entregas",
    action: "Avançar uma entrega",
    description: "Remessas e rastreamento operacional",
    symbol: "→",
  },
  support: {
    label: "Suporte & solicitações",
    action: "Abrir um chamado",
    description: "Atendimento, prioridade e resolução",
    symbol: "◎",
  },
  inventory: {
    label: "Estoque & produção",
    action: "Movimentar o estoque",
    description: "Entradas, saídas e reposição",
    symbol: "▦",
  },
  subscription: {
    label: "SaaS & assinaturas",
    action: "Escolher um plano",
    description: "Planos, adesão e recorrência",
    symbol: "∞",
  },
  events: {
    label: "Eventos & ingressos",
    action: "Reservar um ingresso",
    description: "Programação, capacidade e inscrições",
    symbol: "✳",
  },
  landing: {
    label: "Sites & captação",
    action: "Solicitar uma proposta",
    description: "Marca, serviços e conversão",
    symbol: "✦",
  },
};

type Seed = [string, string, string, string, string, string[]];
const seeds: Record<Exclude<DemoKind, "agenda">, Seed[]> = {
  commerce: [
    [
      "moda",
      "Forma Studio",
      "Moda & vestuário",
      "Vista sua próxima versão.",
      "#A34456",
      ["Camisa de linho", "Calça alfaiataria", "Bolsa essencial"],
    ],
    [
      "decoracao",
      "Casa Nativa",
      "Casa & decoração",
      "Objetos que contam a sua história.",
      "#886A3F",
      ["Luminária arco", "Vaso de cerâmica", "Poltrona curva"],
    ],
    [
      "eletronicos",
      "Volt Store",
      "Eletrônicos",
      "Tecnologia que acompanha você.",
      "#245BE0",
      ["Fone sem fio", "Teclado mecânico", "Monitor portátil"],
    ],
    [
      "cosmeticos",
      "Aura Natural",
      "Cosméticos",
      "Sua rotina, naturalmente melhor.",
      "#476B48",
      ["Sérum facial", "Creme hidratante", "Kit autocuidado"],
    ],
    [
      "pet-commerce",
      "Mimo Pet",
      "Produtos pet",
      "Tudo para o seu melhor amigo.",
      "#CC7137",
      ["Cama aconchego", "Brinquedo interativo", "Coleira passeio"],
    ],
    [
      "atacado",
      "Nexo Atacado",
      "Atacado B2B",
      "Seu negócio bem abastecido.",
      "#335166",
      ["Caixa de embalagens", "Kit papelaria", "Lote de utilidades"],
    ],
  ],
  food: [
    [
      "hamburgueria",
      "Brasa Burger",
      "Hamburgueria",
      "Feito na brasa. Pedido do seu jeito.",
      "#C54A2A",
      ["Burger da casa", "Burger vegetariano", "Batata rústica"],
    ],
    [
      "pizzaria",
      "Forno 27",
      "Pizzaria",
      "Uma boa noite começa no forno.",
      "#AA3737",
      ["Pizza margherita", "Pizza quatro queijos", "Pizza de cogumelos"],
    ],
    [
      "cafeteria",
      "Grão & Prosa",
      "Cafeteria",
      "Uma pausa que vale o dia.",
      "#6B4F3E",
      ["Cappuccino", "Croissant", "Café coado"],
    ],
    [
      "marmitas",
      "Leve Cozinha",
      "Marmitas & alimentação",
      "Comida de verdade na sua rotina.",
      "#478057",
      ["Marmita equilibrada", "Bowl vegetal", "Combo semanal"],
    ],
    [
      "confeitaria",
      "Doce Atelier",
      "Confeitaria",
      "Pequenas celebrações, grandes sabores.",
      "#AB5070",
      ["Fatia de red velvet", "Caixa de brigadeiros", "Torta de frutas"],
    ],
  ],
  crm: [
    [
      "imobiliaria-crm",
      "Chave Negócios",
      "Vendas imobiliárias",
      "Cada oportunidade, no lugar certo.",
      "#426C80",
      ["Apartamento Jardim", "Casa da Serra", "Sala comercial Centro"],
    ],
    [
      "seguros",
      "Vértice Seguros",
      "Corretora de seguros",
      "Relacionamentos que viram negócios.",
      "#376D5F",
      ["Seguro empresarial", "Renovação residencial", "Proteção automotiva"],
    ],
    [
      "energia-solar",
      "Solare",
      "Energia solar",
      "Da primeira conversa à instalação.",
      "#B47821",
      ["Projeto residencial", "Sistema comercial", "Ampliação industrial"],
    ],
    [
      "agencia-crm",
      "Ponto Agência",
      "Agência de marketing",
      "Uma visão clara do próximo contrato.",
      "#7655A5",
      ["Campanha de lançamento", "Gestão de conteúdo", "Redesign de marca"],
    ],
    [
      "consultoria-crm",
      "Norte Consultoria",
      "Consultoria B2B",
      "Transforme conversas em crescimento.",
      "#405A98",
      [
        "Diagnóstico de operação",
        "Planejamento estratégico",
        "Programa de liderança",
      ],
    ],
  ],
  finance: [
    [
      "bpo",
      "Clara BPO",
      "BPO financeiro",
      "Os números claros. As decisões também.",
      "#347A6A",
      [
        "Mensalidade cliente Aurora",
        "Pagamento de fornecedor",
        "Serviço de conciliação",
      ],
    ],
    [
      "contabilidade",
      "Conta Certa",
      "Escritório contábil",
      "O financeiro do escritório em uma tela.",
      "#39678A",
      ["Honorários mensais", "Licença de software", "Consultoria tributária"],
    ],
    [
      "financeiro-loja",
      "Lume Gestão",
      "Financeiro do varejo",
      "Seu caixa, sem pontos cegos.",
      "#8D6640",
      ["Venda do balcão", "Compra de mercadorias", "Pedido da loja online"],
    ],
    [
      "financeiro-ong",
      "Raízes Social",
      "ONG & terceiro setor",
      "Transparência para fazer mais.",
      "#647A42",
      ["Doação recorrente", "Material de oficina", "Apoio de empresa"],
    ],
    [
      "financeiro-freelancer",
      "Solo Finance",
      "Profissionais autônomos",
      "Seu trabalho tem valor. Seu tempo também.",
      "#7864AD",
      [
        "Entrega de projeto",
        "Assinatura de ferramenta",
        "Parcela de consultoria",
      ],
    ],
  ],
  projects: [
    [
      "agencia-projetos",
      "Órbita Studio",
      "Agência criativa",
      "Ideias boas merecem uma boa execução.",
      "#7156A2",
      ["Criar identidade visual", "Revisar landing page", "Entregar campanha"],
    ],
    [
      "construcao",
      "Base Engenharia",
      "Construção & engenharia",
      "Uma obra organizada, etapa por etapa.",
      "#AE713E",
      ["Conferir fundação", "Comprar materiais", "Inspecionar acabamento"],
    ],
    [
      "juridico",
      "Atlas Jurídico",
      "Escritório jurídico",
      "Prazos e demandas sob controle.",
      "#42536F",
      ["Revisar contrato", "Organizar documentação", "Preparar reunião"],
    ],
    [
      "inovacao",
      "Pulso Inovação",
      "Inovação corporativa",
      "Da hipótese ao próximo experimento.",
      "#AE3D55",
      ["Mapear jornada", "Testar protótipo", "Avaliar resultados"],
    ],
    [
      "operacao",
      "Fluxo Operações",
      "Operação de PME",
      "Menos retrabalho. Mais trabalho feito.",
      "#46766E",
      ["Padronizar processo", "Treinar equipe", "Validar integração"],
    ],
  ],
  learning: [
    [
      "escola-tech",
      "Trilha Tech",
      "Escola de tecnologia",
      "Aprenda fazendo. Evolua construindo.",
      "#5754C4",
      [
        "Fundamentos de desenvolvimento",
        "Interfaces e experiência",
        "Primeiro projeto prático",
      ],
    ],
    [
      "idiomas",
      "Hello Escola",
      "Escola de idiomas",
      "Seu próximo passo fala outro idioma.",
      "#3E7898",
      ["Conversação essencial", "Inglês para trabalho", "Escuta e pronúncia"],
    ],
    [
      "treinamento",
      "Elo Academy",
      "Treinamento corporativo",
      "Conhecimento que move o time.",
      "#587A53",
      [
        "Integração de colaboradores",
        "Atendimento ao cliente",
        "Liderança na prática",
      ],
    ],
    [
      "mentoria",
      "Avança Mentoria",
      "Mentoria & carreira",
      "Construa o seu próximo capítulo.",
      "#967040",
      [
        "Planejamento de carreira",
        "Comunicação profissional",
        "Portfólio e posicionamento",
      ],
    ],
    [
      "cursos-criativos",
      "Oficina Criativa",
      "Cursos criativos",
      "Uma ideia nas mãos. Um mundo possível.",
      "#A84D61",
      ["Fotografia autoral", "Design de marcas", "Produção de conteúdo"],
    ],
  ],
  property: [
    [
      "imoveis",
      "Habita",
      "Imóveis residenciais",
      "Seu próximo lugar começa aqui.",
      "#436B5E",
      ["Apartamento Jardim", "Casa com pátio", "Studio Centro"],
    ],
    [
      "comercial",
      "Metro Comercial",
      "Imóveis comerciais",
      "Encontre espaço para crescer.",
      "#465B7D",
      ["Sala executiva", "Loja térrea", "Galpão logístico"],
    ],
    [
      "temporada",
      "Refúgio",
      "Hospedagem & temporada",
      "Dias leves em lugares especiais.",
      "#AD7847",
      ["Cabana da Serra", "Loft perto do mar", "Casa de campo"],
    ],
    [
      "coworking",
      "Junto Cowork",
      "Coworking",
      "Espaço para trabalhar. Gente para conectar.",
      "#7A5B9A",
      ["Sala de reunião", "Mesa compartilhada", "Escritório privativo"],
    ],
    [
      "espacos",
      "Celebra Espaços",
      "Locação de espaços",
      "O lugar certo para o seu encontro.",
      "#A14D65",
      ["Salão jardim", "Auditório central", "Terraço panorâmico"],
    ],
  ],
  logistics: [
    [
      "transportadora",
      "Rota Sul",
      "Transportadora",
      "Cada entrega com um próximo passo.",
      "#3A677C",
      ["Carga Porto Alegre", "Carga Caxias do Sul", "Carga Novo Hamburgo"],
    ],
    [
      "motoboy",
      "Vai Express",
      "Entregas urbanas",
      "Perto de quem precisa receber.",
      "#A36F2C",
      ["Entrega Centro", "Entrega Moinhos", "Entrega Cidade Baixa"],
    ],
    [
      "distribuidora",
      "Ponte Distribuição",
      "Distribuição B2B",
      "Da expedição até o seu cliente.",
      "#4A755E",
      ["Pedido Mercado Aurora", "Pedido Loja Nativa", "Pedido Oficina Norte"],
    ],
    [
      "logistica-ecommerce",
      "Pack Log",
      "Logística de e-commerce",
      "Seu pedido seguindo o caminho certo.",
      "#6E59A0",
      ["Pedido online 1042", "Pedido online 1043", "Pedido online 1044"],
    ],
  ],
  support: [
    [
      "helpdesk",
      "Nexo Help",
      "Suporte de TI",
      "Atendimento organizado do início ao fim.",
      "#4C67A0",
      [
        "Acesso ao sistema",
        "Configuração de e-mail",
        "Impressora indisponível",
      ],
    ],
    [
      "condominio",
      "Viva Condomínio",
      "Gestão condominial",
      "Um lugar melhor para conviver.",
      "#557962",
      [
        "Manutenção do elevador",
        "Iluminação da garagem",
        "Reserva de área comum",
      ],
    ],
    [
      "assistencia",
      "Repara",
      "Assistência técnica",
      "Cada reparo com atenção e clareza.",
      "#9A6946",
      ["Notebook sem iniciar", "Troca de tela", "Diagnóstico de bateria"],
    ],
    [
      "portal-cliente",
      "Elo Cliente",
      "Portal do cliente",
      "Solicitações que não se perdem.",
      "#8154A0",
      [
        "Alteração de cadastro",
        "Segunda via de documento",
        "Dúvida sobre o projeto",
      ],
    ],
  ],
  inventory: [
    [
      "estoque-varejo",
      "Prateleira",
      "Estoque de varejo",
      "O produto certo na hora certa.",
      "#427164",
      ["Camiseta básica", "Calça jeans", "Tênis casual"],
    ],
    [
      "industria",
      "Fabril",
      "Produção industrial",
      "Da matéria-prima ao produto pronto.",
      "#556987",
      ["Chapa de aço", "Componente usinado", "Kit de montagem"],
    ],
    [
      "oficina",
      "Torque Oficina",
      "Oficina mecânica",
      "Peças e materiais sem improviso.",
      "#A56635",
      ["Filtro de óleo", "Pastilha de freio", "Óleo lubrificante"],
    ],
    [
      "agro",
      "Campo Gestão",
      "Agro & insumos",
      "Mais controle em cada safra.",
      "#5D793C",
      ["Sementes de milho", "Fertilizante orgânico", "Embalagem para colheita"],
    ],
    [
      "almoxarifado",
      "Organiza",
      "Almoxarifado",
      "Cada material com seu lugar e seu saldo.",
      "#7D5B91",
      ["Papel A4", "Kit de ferramentas", "Material de limpeza"],
    ],
  ],
  subscription: [
    [
      "saas",
      "Flow SaaS",
      "Software por assinatura",
      "Uma operação mais simples começa aqui.",
      "#6057C5",
      ["Essencial", "Equipe", "Escala"],
    ],
    [
      "clube",
      "Círculo Clube",
      "Clube de benefícios",
      "Boas escolhas, todos os meses.",
      "#9C683E",
      ["Descoberta", "Experiência", "Completo"],
    ],
    [
      "assinatura-cafe",
      "Grão Clube",
      "Assinatura de café",
      "Seu próximo café já está a caminho.",
      "#70513C",
      ["Uma origem", "Duas origens", "Seleção especial"],
    ],
    [
      "comunidade",
      "Liga Comunidade",
      "Comunidade profissional",
      "Cresça perto de quem também constrói.",
      "#52766B",
      ["Conectar", "Participar", "Protagonizar"],
    ],
  ],
  events: [
    [
      "conferencia",
      "Conecta Summit",
      "Conferência de negócios",
      "Ideias que aproximam. Conexões que ficam.",
      "#7652A4",
      [
        "Abertura e tendências",
        "Oficina de inovação",
        "Networking de negócios",
      ],
    ],
    [
      "festival",
      "Vibe Festival",
      "Festival cultural",
      "Um dia para viver algo diferente.",
      "#B14E51",
      ["Palco principal", "Oficina criativa", "Encontro com artistas"],
    ],
    [
      "workshop",
      "Mão na Massa",
      "Workshops práticos",
      "Saia com algo que você construiu.",
      "#3F7A70",
      ["Design na prática", "Automação para negócios", "Prototipagem rápida"],
    ],
    [
      "esporte",
      "Move Run",
      "Evento esportivo",
      "Seu próximo desafio tem uma largada.",
      "#9A7127",
      ["Percurso de 5 km", "Percurso de 10 km", "Caminhada de 3 km"],
    ],
    [
      "feira",
      "Feira Local",
      "Feira de empreendedores",
      "Pequenos negócios. Grandes encontros.",
      "#687D43",
      ["Rodada de negócios", "Exposição de produtos", "Palestra de marketing"],
    ],
  ],
  landing: [
    [
      "arquitetura",
      "Linha Arquitetura",
      "Arquitetura & interiores",
      "Espaços pensados para a sua vida.",
      "#847057",
      [
        "Projeto residencial",
        "Interiores comerciais",
        "Consultoria de ambientes",
      ],
    ],
    [
      "consultoria",
      "Horizonte",
      "Consultoria empresarial",
      "Seu próximo crescimento tem direção.",
      "#3D677C",
      [
        "Diagnóstico operacional",
        "Estratégia de crescimento",
        "Implementação de processos",
      ],
    ],
    [
      "fotografia",
      "Luz Studio",
      "Fotografia & audiovisual",
      "Histórias que merecem ser vistas.",
      "#A55E4F",
      ["Ensaio de marca", "Cobertura de eventos", "Fotografia de produto"],
    ],
    [
      "industria-site",
      "Metal Norte",
      "Indústria B2B",
      "Precisão em cada parceria.",
      "#516480",
      ["Peças sob medida", "Montagem industrial", "Manutenção especializada"],
    ],
    [
      "impacto",
      "PIT Lab",
      "Projetos de impacto",
      "Ideias locais. Possibilidades enormes.",
      "#3C7597",
      ["Oficinas de tecnologia", "Projetos em equipe", "Mentoria para jovens"],
    ],
  ],
};

const prices: Record<Exclude<DemoKind, "agenda">, number[]> = {
  commerce: [129.9, 219.9, 89.9],
  food: [32.9, 39.9, 18.9],
  crm: [4200, 7800, 2600],
  finance: [1800, 450, 1200],
  projects: [0, 0, 0],
  learning: [149, 249, 199],
  property: [2400, 3500, 1800],
  logistics: [180, 240, 95],
  support: [0, 0, 0],
  inventory: [79.9, 189.9, 249.9],
  subscription: [39, 89, 179],
  events: [79, 129, 49],
  landing: [1200, 2800, 900],
};

const allProfiles: DemoProfile[] = [
  ...Object.values(demos).map((d) => ({
    id: d.id,
    name: d.business.name,
    sector: d.business.category,
    kind: "agenda" as const,
    headline: d.business.tagline,
    description:
      "Organize horários, profissionais, clientes e o financeiro do atendimento.",
    color: d.colors.primary,
    tags: ["Agenda", "Clientes", "Financeiro"],
    items: [],
  })),
  ...Object.entries(seeds).flatMap(([family, entries]) =>
    entries.map(([id, name, sector, headline, color, names]) => {
      const kind = family as Exclude<DemoKind, "agenda">;
      return {
        id,
        name,
        sector,
        kind,
        headline,
        color,
        description: families[kind].description,
        tags: [families[kind].label, sector, "Interativo"],
        items: names.map((n, i) => ({
          id: `${id}-${i}`,
          name: n,
          detail: [
            `Seleção ${name}`,
            `Especialidade de ${name}`,
            "Disponível nesta demonstração",
          ][i],
          tag: ["Destaques", "Novidades", "Essenciais"][i],
          price: prices[kind][i],
          stock: [12, 8, 3][i],
          symbol: ["◈", "◒", "▧"][i],
        })),
      };
    }),
  ),
];

// Surface a different workflow in every early card, then cycle through segments.
const showcaseOrder: DemoKind[] = [
  "commerce",
  "food",
  "crm",
  "finance",
  "projects",
  "learning",
  "property",
  "logistics",
  "support",
  "inventory",
  "subscription",
  "events",
  "landing",
  "agenda",
];
export const profiles: DemoProfile[] = Array.from({ length: 7 }, (_, index) =>
  showcaseOrder.flatMap((kind) => {
    const profile = allProfiles.filter((p) => p.kind === kind)[index];
    return profile ? [profile] : [];
  }),
).flat();

const normalize = (s: string) =>
  s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
export function filterProfiles(
  query: string,
  kind: DemoKind | "all",
  favorites?: string[],
) {
  const term = normalize(query.trim());
  return profiles.filter(
    (p) =>
      (kind === "all" || p.kind === kind) &&
      (!favorites || favorites.includes(p.id)) &&
      normalize(
        [p.name, p.sector, p.headline, p.description, ...p.tags].join(" "),
      ).includes(term),
  );
}
export const getProfile = (id: string | null) =>
  profiles.find((p) => p.id === id);

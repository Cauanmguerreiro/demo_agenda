# CodeBrand Showcase

## Objetivo
Transformar sete demonstrações de agenda em uma vitrine comercial com 70 negócios demonstráveis. O visitante deve reconhecer seu segmento, experimentar um fluxo e entender o que a CodeBrand pode construir.

## Escopo
- Preservar as sete agendas existentes.
- Adicionar 63 perfis em 13 famílias: lojas, alimentação, CRM, financeiro, projetos, educação, imóveis, logística, suporte, estoque, assinaturas, eventos e páginas institucionais.
- Home com identidade CodeBrand (#B40F0F, #141117, #C88614), busca sem acentos, filtros por família, favoritos e cartões com prévias.
- Cada família tem interface e interação próprias. Perfis trazem produtos, serviços, termos, preços e conteúdo do segmento.
- Rotas compartilháveis por `?demo=id`, histórico do navegador, retorno ao catálogo e seleção das agendas existentes.
- Dados fictícios e ações locais, sem enviar pedidos, pagamentos ou contatos reais. Aviso claro de demonstração e conclusão simulada.
- Persistência por perfil no dispositivo; restauração apenas da demonstração atual; tolerância a armazenamento indisponível ou inválido.
- Layout utilizável de 375px a desktop; foco visível, campos rotulados e feedback de ações.

## Arquitetura
React/Vite/TypeScript existentes. `AgendaApp` preserva o sistema anterior; `App` resolve rotas e carrega agendas e novas experiências sob demanda. `showcase/catalog.ts` contém os perfis. `showcase/model.ts` concentra regras de carrinho, estoque, estados e armazenamento. Componentes por família compartilham somente elementos visuais e dados tipados.

## Validação
TypeScript, build, testes Node para busca, carrinho, estoque e armazenamento; testes em Chromium para navegação, todas as famílias, atualização persistida, retorno às agendas e largura móvel. Instalação com lockfile; correção do conflito existente de esbuild com Vite.

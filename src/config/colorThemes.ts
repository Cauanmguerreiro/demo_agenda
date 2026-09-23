import { BrandColors } from './defaultConfig';

export interface ColorThemePreset {
  id: string;
  name: string;
  segment: string;
  segmentName: string;
  description: string;
  badge?: string;
  colors: BrandColors;
}

export const businessThemes: ColorThemePreset[] = [
  // SALÃO DE BELEZA
  {
    id: 'salao-rose-gold',
    name: 'Rose Gold & Glamour',
    segment: 'salao',
    segmentName: 'Salão de Beleza',
    description: 'Tom rosa nobre com dourado suave, perfeito para salões premium e studios capilares.',
    badge: 'Mais Usado',
    colors: {
      primary: '#BE185D', // Pink-700
      primaryHover: '#9D174D',
      secondary: '#FDF2F8',
      accent: '#F59E0B',
      background: '#FDF2F8',
      surface: '#FFFFFF',
      textPrimary: '#4C0519',
    },
  },
  {
    id: 'salao-lavanda-luxo',
    name: 'Lavanda & Violeta Imperial',
    segment: 'salao',
    segmentName: 'Salão de Beleza',
    description: 'Tons violeta e lavanda que transmitem modernidade, sofisticação e criatividade.',
    badge: 'Sofisticado',
    colors: {
      primary: '#7C3AED', // Violet-600
      primaryHover: '#6D28D9',
      secondary: '#F5F3FF',
      accent: '#10B981',
      background: '#FAF5FF',
      surface: '#FFFFFF',
      textPrimary: '#1E1B4B',
    },
  },
  {
    id: 'salao-nude-champagne',
    name: 'Nude & Champagne',
    segment: 'salao',
    segmentName: 'Salão de Beleza',
    description: 'Paleta minimalista, elegante e clean inspirada em spas e espaços boutique.',
    badge: 'Minimalista',
    colors: {
      primary: '#9A3412', // Warm amber / terracotta
      primaryHover: '#7C2D12',
      secondary: '#FFF7ED',
      accent: '#D97706',
      background: '#FAFAF9',
      surface: '#FFFFFF',
      textPrimary: '#292524',
    },
  },

  // BARBEARIA
  {
    id: 'barbearia-classic-amber',
    name: 'Vintage Âmbar & Whisky',
    segment: 'barbearia',
    segmentName: 'Barbearia Clássica',
    description: 'Estilo clássico e rústico, inspirado em navalhas tradicionais e madeiras nobres.',
    badge: 'Clássico',
    colors: {
      primary: '#B45309', // Amber-700
      primaryHover: '#92400E',
      secondary: '#FEF3C7',
      accent: '#D97706',
      background: '#FFFBEB',
      surface: '#FFFFFF',
      textPrimary: '#1E293B',
    },
  },
  {
    id: 'barbearia-charcoal-steel',
    name: 'Carvão & Aço Navalha',
    segment: 'barbearia',
    segmentName: 'Barbearia Clássica',
    description: 'Preto grafite escovado com detalhes dourados. Estética industrial e marcante.',
    badge: 'Mais Usado',
    colors: {
      primary: '#1E293B', // Slate-800
      primaryHover: '#0F172A',
      secondary: '#F1F5F9',
      accent: '#D97706',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      textPrimary: '#0F172A',
    },
  },
  {
    id: 'barbearia-couro-marrom',
    name: 'Couro Rústico & Tabaco',
    segment: 'barbearia',
    segmentName: 'Barbearia Clássica',
    description: 'Tons marrons quentes inspirados nas cadeiras de couro legítimo de barbearias tradicionais.',
    badge: 'Vintage',
    colors: {
      primary: '#78350F', // Warm wood brown
      primaryHover: '#451A03',
      secondary: '#FEF3C7',
      accent: '#B45309',
      background: '#FFFDF9',
      surface: '#FFFFFF',
      textPrimary: '#1C1917',
    },
  },

  // CLÍNICA MÉDICA
  {
    id: 'clinica-azul-saude',
    name: 'Azul Clínico Confiança',
    segment: 'clinica',
    segmentName: 'Clínica Médica',
    description: 'Azul médico consagrado que inspira segurança, higiene, precisão e tranquilidade.',
    badge: 'Recomendado',
    colors: {
      primary: '#0284C7', // Sky-600
      primaryHover: '#0369A1',
      secondary: '#F0F9FF',
      accent: '#10B981',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      textPrimary: '#0F172A',
    },
  },
  {
    id: 'clinica-verde-hospitalar',
    name: 'Verde Saúde & Vitalidade',
    segment: 'clinica',
    segmentName: 'Clínica Médica',
    description: 'Verde esmeralda/menta medicinal associado ao bem-estar e renovação da saúde.',
    badge: 'Vitalidade',
    colors: {
      primary: '#0D9488', // Teal-600
      primaryHover: '#0F766E',
      secondary: '#F0FDFA',
      accent: '#0284C7',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      textPrimary: '#134E4A',
    },
  },
  {
    id: 'clinica-azul-marinho-nobre',
    name: 'Azul Real & Especialidades',
    segment: 'clinica',
    segmentName: 'Clínica Médica',
    description: 'Azul marinho com seriedade para centros de diagnóstico, cirurgia e consultórios médicos.',
    badge: 'Sério & Técnico',
    colors: {
      primary: '#1D4ED8', // Blue-700
      primaryHover: '#1E40AF',
      secondary: '#EFF6FF',
      accent: '#059669',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      textPrimary: '#0F172A',
    },
  },

  // CLÍNICA ESTÉTICA
  {
    id: 'estetica-champagne-dourado',
    name: 'Dourado Champagne & Glow',
    segment: 'estetica',
    segmentName: 'Clínica Estética',
    description: 'Paleta dourada requintada, ideal para harmonização facial, laser e dermatologia estética.',
    badge: 'Mais Vendido',
    colors: {
      primary: '#B45309', // Warm gold
      primaryHover: '#92400E',
      secondary: '#FEF3C7',
      accent: '#D97706',
      background: '#FFFDF7',
      surface: '#FFFFFF',
      textPrimary: '#292524',
    },
  },
  {
    id: 'estetica-menta-spa',
    name: 'Verde Menta & SPA Fresh',
    segment: 'estetica',
    segmentName: 'Clínica Estética',
    description: 'Sensação refrescante de relaxamento e pureza, excelente para drenagens e bioestimuladores.',
    badge: 'Relaxante',
    colors: {
      primary: '#059669', // Emerald-600
      primaryHover: '#047857',
      secondary: '#ECFDF5',
      accent: '#10B981',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      textPrimary: '#064E3B',
    },
  },
  {
    id: 'estetica-rose-delicado',
    name: 'Rosé Perolado & Seda',
    segment: 'estetica',
    segmentName: 'Clínica Estética',
    description: 'Tom rosé elegante, delicado e acolhedor para tratamentos corporais e faciais.',
    badge: 'Delicado',
    colors: {
      primary: '#DB2777', // Pink-600
      primaryHover: '#BE185D',
      secondary: '#FDF2F8',
      accent: '#F59E0B',
      background: '#FDF4F8',
      surface: '#FFFFFF',
      textPrimary: '#500724',
    },
  },

  // PSICOLOGIA
  {
    id: 'psicologia-salvia-sereno',
    name: 'Verde Sálvia & Acolhimento',
    segment: 'psicologia',
    segmentName: 'Psicologia',
    description: 'Verde herbal suave e acolhedor, reduz a ansiedade e transmite confiança nas sessões.',
    badge: 'Acolhedor',
    colors: {
      primary: '#0D9488', // Teal-600
      primaryHover: '#0F766E',
      secondary: '#F0FDFA',
      accent: '#0284C7',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      textPrimary: '#134E4A',
    },
  },
  {
    id: 'psicologia-azul-zen',
    name: 'Azul Sereno & Calmaria',
    segment: 'psicologia',
    segmentName: 'Psicologia',
    description: 'Equilíbrio mental e clareza de pensamentos através de tons azuis suaves e neutros.',
    badge: 'Calmaria',
    colors: {
      primary: '#0284C7', // Sky-600
      primaryHover: '#0369A1',
      secondary: '#F0F9FF',
      accent: '#10B981',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      textPrimary: '#0F172A',
    },
  },
  {
    id: 'psicologia-warm-terracota',
    name: 'Terracota & Empatia',
    segment: 'psicologia',
    segmentName: 'Psicologia',
    description: 'Cores quentes que remetem ao afeto, escuta ativa e calor humano.',
    badge: 'Empatia',
    colors: {
      primary: '#C2410C', // Orange-700
      primaryHover: '#9A3412',
      secondary: '#FFF7ED',
      accent: '#D97706',
      background: '#FFFDF9',
      surface: '#FFFFFF',
      textPrimary: '#431407',
    },
  },

  // PET SHOP
  {
    id: 'petshop-alegria-laranja',
    name: 'Laranja Pet & Energia',
    segment: 'petshop',
    segmentName: 'Pet Shop & Estética Animal',
    description: 'Laranja dinâmico e amigável que comunica carinho pelos pets e agilidade no atendimento.',
    badge: 'Mais Popular',
    colors: {
      primary: '#EA580C', // Orange-600
      primaryHover: '#C2410C',
      secondary: '#FFF7ED',
      accent: '#F59E0B',
      background: '#FFFDF9',
      surface: '#FFFFFF',
      textPrimary: '#431407',
    },
  },
  {
    id: 'petshop-turquesa-fresco',
    name: 'Turquesa Banho & Fresh',
    segment: 'petshop',
    segmentName: 'Pet Shop & Estética Animal',
    description: 'Tom azul turquesa vibrante associado a banhos perfumados, tosa higiênica e bem-estar animal.',
    badge: 'Higienização',
    colors: {
      primary: '#0891B2', // Cyan-600
      primaryHover: '#0E7490',
      secondary: '#ECFEFF',
      accent: '#F59E0B',
      background: '#F0FDFA',
      surface: '#FFFFFF',
      textPrimary: '#164E63',
    },
  },
  {
    id: 'petshop-verde-veterinario',
    name: 'Verde Fauna & Natureza',
    segment: 'petshop',
    segmentName: 'Pet Shop & Estética Animal',
    description: 'Verde orgânico e saudável para clínicas veterinárias e pet shops sustentáveis.',
    badge: 'Veterinário',
    colors: {
      primary: '#16A34A', // Green-600
      primaryHover: '#15803D',
      secondary: '#F0FDF4',
      accent: '#EA580C',
      background: '#F0FDF4',
      surface: '#FFFFFF',
      textPrimary: '#14532D',
    },
  },

  // GENÉRICO / CORPORATIVO
  {
    id: 'generico-indigo-tech',
    name: 'Índigo Tech Corporativo',
    segment: 'generico',
    segmentName: 'Corporativo & Consultoria',
    description: 'Paleta padrão moderna e polida para qualquer segmento corporativo ou assessoria.',
    badge: 'Versátil',
    colors: {
      primary: '#4F46E5', // Indigo-600
      primaryHover: '#4338CA',
      secondary: '#EEF2FF',
      accent: '#10B981',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      textPrimary: '#1E1B4B',
    },
  },
  {
    id: 'generico-ardosia-dark',
    name: 'Ardósia & Grafite Executivo',
    segment: 'generico',
    segmentName: 'Corporativo & Consultoria',
    description: 'Tom neutro de alta elegância para consultorias e escritórios executivos.',
    badge: 'Executivo',
    colors: {
      primary: '#334155', // Slate-700
      primaryHover: '#1E293B',
      secondary: '#F1F5F9',
      accent: '#2563EB',
      background: '#F8FAFC',
      surface: '#FFFFFF',
      textPrimary: '#0F172A',
    },
  },
];

import { AppFeatures, defaultFeatures } from './features';

export interface BusinessConfig {
  name: string;
  shortName: string;
  category: string;
  tagline: string;
  phone: string;
  address: string;
  logoUrl?: string;
  responsibleName: string;
  responsibleRole: string;
}

export interface TerminologyConfig {
  customer: string;
  customers: string;
  professional: string;
  professionals: string;
  service: string;
  services: string;
  appointment: string;
  appointments: string;
  attendance: string;
  attendances: string;
  specialty?: string;
  specialties?: string;
  petSingular?: string; // used for pet shop
  petPlural?: string;
}

export interface BrandColors {
  primary: string;
  primaryHover: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  textPrimary: string;
}

export interface DemoConfig {
  id: string;
  business: BusinessConfig;
  terminology: TerminologyConfig;
  features: AppFeatures;
  colors: BrandColors;
}

export interface AppConfig extends DemoConfig {
  demoMode: boolean;
  locale: string;
  currency: string;
  presentationMode: boolean;
}

export const defaultBrandColors: BrandColors = {
  primary: '#6757E5',
  primaryHover: '#5546D2',
  secondary: '#EEEAFE',
  accent: '#16A36A',
  background: '#F8FAFC',
  surface: '#FFFFFF',
  textPrimary: '#0F172A',
};

export const defaultTerminology: TerminologyConfig = {
  customer: 'Cliente',
  customers: 'Clientes',
  professional: 'Profissional',
  professionals: 'Profissionais',
  service: 'Serviço',
  services: 'Serviços',
  appointment: 'Agendamento',
  appointments: 'Agendamentos',
  attendance: 'Atendimento',
  attendances: 'Atendimentos',
  specialty: 'Especialidade',
  specialties: 'Especialidades',
};

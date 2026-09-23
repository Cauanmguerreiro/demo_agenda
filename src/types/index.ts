import { AppFeatures } from '../config/features';
import { BusinessConfig, TerminologyConfig, BrandColors } from '../config/defaultConfig';

export type AppointmentStatus = 'confirmado' | 'pendente' | 'finalizado' | 'cancelado';
export type PaymentMethod = 'PIX' | 'Cartão de Crédito' | 'Cartão de Débito' | 'Dinheiro' | 'Transferência';

export interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  registeredAt: string;
  totalAppointments: number;
  totalSpent: number;
  lastAppointment: string;
  nextAppointment?: string;
  notes: string;
  status: 'Recorrente' | 'Novo' | 'Frequente' | 'Inativo';
  petName?: string; // used for petshop demo
  petBreed?: string;
}

export interface Professional {
  id: string;
  name: string;
  role: string;
  avatarColor: string;
  initials: string;
  appointmentsCount: number;
  revenueGenerated: number;
  commissionRate: number; // e.g., 40%
  workingHours: string;
  rating: number;
  active: boolean;
}

export interface Service {
  id: string;
  name: string;
  category: string;
  price: number;
  durationMinutes: number;
  assignedProfessionals: string[];
  active: boolean;
  description?: string;
}

export interface Appointment {
  id: string;
  clientId: string;
  clientName: string;
  clientPhone: string;
  petName?: string;
  serviceId: string;
  serviceName: string;
  professionalId: string;
  professionalName: string;
  date: string; // YYYY-MM-DD or readable
  time: string; // HH:MM
  durationMinutes: number;
  price: number;
  status: AppointmentStatus;
  notes?: string;
  paymentMethod?: PaymentMethod;
}

export interface FinancialRecord {
  id: string;
  date: string;
  clientName: string;
  serviceName: string;
  professionalName: string;
  paymentMethod: PaymentMethod;
  amount: number;
  status: 'concluido' | 'pendente';
}

export interface ClientHistoryItem {
  id: string;
  date: string;
  serviceName: string;
  professionalName: string;
  price: number;
  status: AppointmentStatus;
  notes: string;
}

export interface TopServiceMetric {
  name: string;
  count: number;
  percentage: number;
}

export interface DashboardMetrics {
  appointmentsToday: number;
  appointmentsTodayDelta: string;
  revenueToday: number;
  revenueTodayDelta: string;
  clientsThisMonth: number;
  clientsThisMonthDelta: string;
  occupancyRate: number;
  occupancyRateDelta: string;
  topServices: TopServiceMetric[];
  revenueLast7Days: { day: string; amount: number }[];
}

export interface DemoDataSet {
  clients: Client[];
  professionals: Professional[];
  services: Service[];
  appointments: Appointment[];
  financialRecords: FinancialRecord[];
  clientHistories: Record<string, ClientHistoryItem[]>;
  dashboardMetrics: DashboardMetrics;
}

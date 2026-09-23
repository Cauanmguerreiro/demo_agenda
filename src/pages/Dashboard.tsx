import React from 'react';
import { DemoConfig } from '../config/defaultConfig';
import { Appointment, Client, Service, Professional, DashboardMetrics } from '../types';
import { StatCard } from '../components/StatCard';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import {
  Calendar,
  DollarSign,
  Users,
  Clock,
  ArrowUpRight,
  AlertCircle,
  CheckCircle,
  XCircle,
} from 'lucide-react';

interface DashboardProps {
  config: DemoConfig;
  metrics: DashboardMetrics;
  todayAppointments: Appointment[];
  pendingAppointments: Appointment[];
  onApproveAppointment: (id: string) => void;
  onRejectAppointment: (id: string) => void;
  onNavigate: (route: string) => void;
  onOpenNewAppointment: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  config,
  metrics,
  todayAppointments,
  pendingAppointments,
  onApproveAppointment,
  onRejectAppointment,
  onNavigate,
  onOpenNewAppointment,
}) => {
  const { terminology, features } = config;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner / Pending Approvals Alert (if enabled) */}
      {features.approvalRequired && pendingAppointments.length > 0 && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-xl bg-amber-50 border border-amber-200 gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-amber-100 text-amber-700 shrink-0">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xs font-semibold text-amber-900">
                Você possui {pendingAppointments.length}{' '}
                {pendingAppointments.length === 1
                  ? `${terminology.appointment?.toLowerCase() || 'agendamento'} pendente`
                  : `${terminology.appointments?.toLowerCase() || 'agendamentos'} pendentes`}
              </h3>
              <p className="text-xs text-amber-700">
                Revise as solicitações antes de confirmar na agenda de horários.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => onNavigate('appointments')}
              className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-600 text-white hover:bg-amber-700 transition-colors"
            >
              Gerenciar Solicitações
            </button>
          </div>
        </div>
      )}

      {/* Main Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title={`${terminology.attendances || 'Atendimentos'} hoje`}
          value={metrics.appointmentsToday}
          delta={metrics.appointmentsTodayDelta}
          icon={<Calendar className="w-4 h-4" />}
        />
        <StatCard
          title="Faturamento hoje"
          value={formatCurrency(metrics.revenueToday)}
          delta={metrics.revenueTodayDelta}
          icon={<DollarSign className="w-4 h-4" />}
        />
        <StatCard
          title={`${terminology.customers || 'Clientes'} no mês`}
          value={metrics.clientsThisMonth}
          delta={metrics.clientsThisMonthDelta}
          icon={<Users className="w-4 h-4" />}
        />
        <StatCard
          title="Ocupação da agenda"
          value={`${metrics.occupancyRate}%`}
          delta={metrics.occupancyRateDelta}
          icon={<Clock className="w-4 h-4" />}
        />
      </div>

      {/* Center Layout: Today's Appointments & Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Next Appointments */}
        <div className="lg:col-span-2 space-y-4">
          <div className="app-card">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  Próximos {terminology.attendances?.toLowerCase() || 'atendimentos'} hoje
                </h2>
                <p className="text-xs text-slate-500">
                  Horários confirmados e em andamento
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('agenda')}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
              >
                <span>Ver agenda completa</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100">
              {todayAppointments.slice(0, 6).map((app) => (
                <div
                  key={app.id}
                  className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 hover:bg-slate-50/60 -mx-4 px-4 transition-colors rounded-lg"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="px-2.5 py-1.5 rounded-md bg-slate-100 text-xs font-bold text-slate-800 tabular-nums shrink-0">
                      {app.time}
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-semibold text-slate-900 truncate">
                        {app.clientName}
                      </div>
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1.5">
                        <span>{app.serviceName}</span>
                        {features.professionals !== false && (
                          <>
                            <span aria-hidden="true">·</span>
                            <span>{app.professionalName}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold text-slate-900 tabular-nums">
                        {formatCurrency(app.price)}
                      </div>
                      <div className="text-[10px] text-slate-400">
                        {app.durationMinutes} min
                      </div>
                    </div>
                    <StatusBadge status={app.status} />

                    {app.status === 'pendente' && features.approvalRequired && (
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => onApproveAppointment(app.id)}
                          className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                          title="Aprovar"
                        >
                          <CheckCircle className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onRejectAppointment(app.id)}
                          className="p-1 rounded text-rose-600 hover:bg-rose-50"
                          title="Recusar"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Revenue Mini Chart */}
          <div className="app-card">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-sm font-semibold text-slate-900">
                  {terminology.attendances || 'Atendimentos'} nos últimos 7 dias
                </h2>
                <p className="text-xs text-slate-500">
                  Volume de faturamento e fluxo recente
                </p>
              </div>
              <span className="text-xs font-semibold text-slate-700 tabular-nums">
                Total:{' '}
                {formatCurrency(
                  metrics.revenueLast7Days.reduce((acc, d) => acc + d.amount, 0)
                )}
              </span>
            </div>

            <div className="pt-4">
              <div className="flex items-end justify-between gap-2 h-36">
                {metrics.revenueLast7Days.map((item, idx) => {
                  const max = Math.max(...metrics.revenueLast7Days.map((d) => d.amount));
                  const heightPercent = max > 0 ? (item.amount / max) * 100 : 20;
                  const isToday = idx === metrics.revenueLast7Days.length - 1;

                  return (
                    <div
                      key={item.day}
                      className="flex-1 flex flex-col items-center gap-2 group"
                    >
                      <span className="text-[10px] text-slate-400 font-mono opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                        {item.amount}
                      </span>
                      <div className="w-full bg-slate-100 rounded-t-md relative flex items-end h-24">
                        <div
                          className={`w-full rounded-t-md transition-all duration-300 ${
                            isToday ? 'bg-indigo-600' : 'bg-slate-300 hover:bg-slate-400'
                          }`}
                          style={{
                            height: `${heightPercent}%`,
                            backgroundColor: isToday ? config.colors.primary : undefined,
                          }}
                        />
                      </div>
                      <span
                        className={`text-[11px] font-medium ${
                          isToday ? 'text-slate-900 font-bold' : 'text-slate-500'
                        }`}
                      >
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Right Col: Top Services & Quick Actions */}
        <div className="space-y-6">
          {/* Top Services Breakdown */}
          <div className="app-card">
            <h2 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-100">
              {config.id === 'clinica'
                ? 'Especialidades mais procuradas'
                : `${terminology.services || 'Serviços'} mais realizados`}
            </h2>

            <div className="mt-4 space-y-3.5">
              {metrics.topServices.map((svc) => (
                <div key={svc.name} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-700 truncate pr-2">
                      {svc.name}
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {svc.percentage}%
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${svc.percentage}%`,
                        backgroundColor: config.colors.primary,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="app-card bg-gradient-to-br from-slate-50 to-slate-100/60">
            <h2 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
              Ações Rápidas
            </h2>
            <div className="space-y-2">
              <button
                type="button"
                onClick={onOpenNewAppointment}
                className="w-full btn-primary text-xs justify-start py-2 px-3"
              >
                + Novo {terminology.appointment || 'Agendamento'}
              </button>
              <button
                type="button"
                onClick={() => onNavigate('clients')}
                className="w-full btn-secondary text-xs justify-start py-2 px-3"
              >
                Cadastrar novo {terminology.customer?.toLowerCase() || 'cliente'}
              </button>
              {features.financial !== false && (
                <button
                  type="button"
                  onClick={() => onNavigate('financial')}
                  className="w-full btn-secondary text-xs justify-start py-2 px-3"
                >
                  Registrar recebimento
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { DemoConfig } from '../config/defaultConfig';
import { Appointment, Professional } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { EmptyState } from '../components/EmptyState';
import { formatCurrency } from '../utils/formatters';
import { Search, CheckCircle2, XCircle, Clock, Calendar, Plus } from 'lucide-react';

interface AppointmentsProps {
  config: DemoConfig;
  appointments: Appointment[];
  professionals: Professional[];
  onApproveAppointment: (id: string) => void;
  onRejectAppointment: (id: string) => void;
  onOpenNewAppointment: () => void;
}

export const Appointments: React.FC<AppointmentsProps> = ({
  config,
  appointments,
  professionals,
  onApproveAppointment,
  onRejectAppointment,
  onOpenNewAppointment,
}) => {
  const { terminology, features } = config;
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateFilter, setDateFilter] = useState<string>('all');

  const pendingAppointments = appointments.filter((a) => a.status === 'pendente');

  const filteredAppointments = appointments.filter((app) => {
    const matchesSearch =
      app.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.serviceName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      app.professionalName.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    const matchesDate = dateFilter === 'all' || app.date === dateFilter;

    return matchesSearch && matchesStatus && matchesDate;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Pending Approvals Section (If Enabled and has items) */}
      {features.approvalRequired && pendingAppointments.length > 0 && (
        <div className="app-card border-amber-200 bg-amber-50/40 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-sm font-bold text-amber-900">
                Solicitações Pendentes de Aprovação ({pendingAppointments.length})
              </h2>
            </div>
            <span className="text-[11px] text-amber-700">
              Necessário aceite da administração
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
            {pendingAppointments.map((app) => (
              <div
                key={app.id}
                className="bg-white p-3.5 rounded-lg border border-amber-200 shadow-2xs flex flex-col justify-between gap-3"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="text-xs font-bold text-slate-900 truncate">
                      {app.clientName}
                    </h4>
                    <span className="text-[11px] font-bold text-slate-700 tabular-nums">
                      {formatCurrency(app.price)}
                    </span>
                  </div>

                  <p className="text-xs text-indigo-700 font-medium mt-0.5">
                    {app.serviceName}
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                    <span className="font-semibold text-slate-700">
                      {app.date}, {app.time}
                    </span>
                    {features.professionals !== false && (
                      <>
                        <span aria-hidden="true">·</span>
                        <span className="truncate">{app.professionalName}</span>
                      </>
                    )}
                  </div>

                  {app.notes && (
                    <p className="text-[11px] text-slate-400 italic mt-1.5 line-clamp-1">
                      "{app.notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-1.5 pt-2 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={() => onApproveAppointment(app.id)}
                    className="flex-1 py-1 px-2 rounded-md bg-emerald-600 text-white text-[11px] font-semibold hover:bg-emerald-700 flex items-center justify-center gap-1 transition-colors"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Aprovar</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onRejectAppointment(app.id)}
                    className="py-1 px-2 rounded-md border border-rose-200 text-rose-600 hover:bg-rose-50 text-[11px] font-semibold flex items-center justify-center gap-1 transition-colors"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Recusar</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Filter & Action Bar */}
      <div className="app-card flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Buscar por ${terminology.customer?.toLowerCase() || 'cliente'}, ${terminology.service?.toLowerCase() || 'serviço'} ou ${terminology.professional?.toLowerCase() || 'profissional'}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="app-input pl-9 text-xs"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="app-select py-1 px-2.5 text-xs w-auto"
          >
            <option value="all">Todos os status</option>
            <option value="confirmado">Confirmados</option>
            <option value="pendente">Pendentes</option>
            <option value="finalizado">Finalizados</option>
            <option value="cancelado">Cancelados</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="app-select py-1 px-2.5 text-xs w-auto"
          >
            <option value="all">Qualquer data</option>
            <option value="Hoje">Hoje</option>
            <option value="Amanhã">Amanhã</option>
            <option value="Ontem">Ontem</option>
          </select>

          <button
            type="button"
            onClick={onOpenNewAppointment}
            className="btn-primary text-xs py-1.5 px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo</span>
          </button>
        </div>
      </div>

      {/* Table & Responsive Mobile Cards */}
      <div className="app-card p-0 overflow-hidden">
        {filteredAppointments.length > 0 ? (
          <>
            {/* Mobile Card List (< md) */}
            <div className="md:hidden divide-y divide-slate-100">
              {filteredAppointments.map((app) => (
                <div key={app.id} className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight">
                        {app.clientName}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {app.serviceName}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1.5 text-slate-600 border-t border-slate-50">
                    <span className="font-semibold text-slate-800 tabular-nums">
                      {app.date}, {app.time}
                      {features.professionals !== false && (
                        <span className="text-slate-400 font-normal"> · {app.professionalName}</span>
                      )}
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatCurrency(app.price)}
                    </span>
                  </div>

                  {app.status === 'pendente' && features.approvalRequired && (
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => onApproveAppointment(app.id)}
                        className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Aprovar</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => onRejectAppointment(app.id)}
                        className="py-1.5 px-3 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        <span>Recusar</span>
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Desktop Table (>= md) */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Horário / Data</th>
                    <th className="py-3 px-4">{terminology.customer || 'Cliente'}</th>
                    <th className="py-3 px-4">{terminology.service || 'Serviço'}</th>
                    {features.professionals !== false && (
                      <th className="py-3 px-4">{terminology.professional || 'Profissional'}</th>
                    )}
                    <th className="py-3 px-4 text-right">Valor</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4 text-right">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredAppointments.map((app) => (
                    <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 whitespace-nowrap">
                        <div className="font-bold text-slate-900 tabular-nums">
                          {app.time}
                        </div>
                        <div className="text-[10px] text-slate-400">{app.date}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">{app.clientName}</div>
                        <div className="text-[11px] text-slate-400">{app.clientPhone}</div>
                      </td>

                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-900">{app.serviceName}</div>
                        <div className="text-[11px] text-slate-400">{app.durationMinutes} min</div>
                      </td>

                      {features.professionals !== false && (
                        <td className="py-3 px-4 whitespace-nowrap text-slate-700">
                          {app.professionalName}
                        </td>
                      )}

                      <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums whitespace-nowrap">
                        {formatCurrency(app.price)}
                      </td>

                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <StatusBadge status={app.status} />
                      </td>

                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        {app.status === 'pendente' && features.approvalRequired ? (
                          <div className="inline-flex items-center gap-1">
                            <button
                              type="button"
                              onClick={() => onApproveAppointment(app.id)}
                              className="p-1 rounded text-emerald-600 hover:bg-emerald-50"
                              title="Aprovar"
                            >
                              <CheckCircle2 className="w-4 h-4" />
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
                        ) : (
                          <span className="text-[11px] text-slate-400 font-medium">Registrado</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ) : (
          <EmptyState
            title={`Nenhum ${terminology.appointment?.toLowerCase() || 'agendamento'} encontrado`}
            description="Tente ajustar os filtros ou registre um novo agendamento para este período."
            actionLabel={`+ Novo ${terminology.appointment || 'Agendamento'}`}
            onAction={onOpenNewAppointment}
          />
        )}
      </div>
    </div>
  );
};

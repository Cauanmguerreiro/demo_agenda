import React, { useState } from 'react';
import { DemoConfig } from '../config/defaultConfig';
import { Appointment, Professional } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import { Plus, ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Filter } from 'lucide-react';

interface AgendaProps {
  config: DemoConfig;
  appointments: Appointment[];
  professionals: Professional[];
  onOpenNewAppointment: (presetTime?: string) => void;
  onSelectAppointment?: (appointment: Appointment) => void;
}

const TIME_SLOTS = [
  '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
  '17:00', '17:30', '18:00', '18:30'
];

const WEEKDAYS = [
  { label: 'Segunda', date: '21/09' },
  { label: 'Terça', date: '22/09' },
  { label: 'Quarta (Hoje)', date: '23/09', isToday: true },
  { label: 'Quinta', date: '24/09' },
  { label: 'Sexta', date: '25/09' },
  { label: 'Sábado', date: '26/09' },
];

export const Agenda: React.FC<AgendaProps> = ({
  config,
  appointments,
  professionals,
  onOpenNewAppointment,
}) => {
  const { terminology, features } = config;

  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Filter appointments
  const filteredAppointments = appointments.filter((app) => {
    if (selectedProfessional !== 'all' && app.professionalId !== selectedProfessional) {
      return false;
    }
    if (statusFilter !== 'all' && app.status !== statusFilter) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Toolbar: Date Navigation, View Mode Tabs, Filter Dropdown */}
      <div className="app-card flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Date Switcher */}
        <div className="flex items-center justify-between sm:justify-start gap-2 w-full sm:w-auto">
          <div className="flex items-center border border-slate-200 rounded-lg overflow-hidden bg-white shrink-0">
            <button
              type="button"
              className="p-1.5 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Dia anterior"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="px-2.5 sm:px-3 py-1.5 text-xs font-semibold text-slate-800 tabular-nums">
              <span className="hidden sm:inline">Quarta-feira, </span>23 de Setembro<span className="hidden md:inline"> de 2026</span>
            </span>
            <button
              type="button"
              className="p-1.5 hover:bg-slate-50 text-slate-600 transition-colors"
              title="Próximo dia"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          <button
            type="button"
            className="px-2.5 py-1 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-md transition-colors shrink-0"
          >
            Hoje
          </button>
        </div>

        {/* Right: Filters and View Mode */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          {/* Status Filter */}
          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
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
          </div>

          {/* Professional Filter (if enabled) */}
          {features.professionals !== false && (
            <select
              value={selectedProfessional}
              onChange={(e) => setSelectedProfessional(e.target.value)}
              className="app-select py-1 px-2.5 text-xs w-auto max-w-[170px] truncate"
            >
              <option value="all">Todos os {terminology.professionals?.toLowerCase() || 'profissionais'}</option>
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          )}

          {/* View Mode Segmented Control */}
          <div className="flex items-center p-1 bg-slate-100 rounded-lg border border-slate-200/60">
            <button
              type="button"
              onClick={() => setViewMode('day')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'day'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dia
            </button>
            <button
              type="button"
              onClick={() => setViewMode('week')}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
                viewMode === 'week'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Semana
            </button>
          </div>

          {/* Quick Add CTA */}
          <button
            type="button"
            onClick={() => onOpenNewAppointment()}
            className="btn-primary text-xs py-1.5 px-3"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Novo</span>
          </button>
        </div>
      </div>

      {/* Day View Timeline */}
      {viewMode === 'day' ? (
        <div className="app-card p-0 overflow-hidden">
          <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Horário de Atendimento (Grade Contínua)</span>
            <span>{filteredAppointments.length} horários listados</span>
          </div>

          <div className="divide-y divide-slate-100">
            {TIME_SLOTS.map((slot) => {
              const matchingApps = filteredAppointments.filter((a) => a.time === slot);
              const hasApp = matchingApps.length > 0;

              return (
                <div
                  key={slot}
                  className={`flex flex-col sm:flex-row items-start sm:items-center py-2.5 px-4 sm:px-6 transition-colors ${
                    hasApp ? 'bg-white' : 'hover:bg-slate-50/50 group'
                  }`}
                >
                  {/* Slot Label */}
                  <div className="w-16 font-mono text-xs font-semibold text-slate-500 tabular-nums shrink-0 py-1">
                    {slot}
                  </div>

                  {/* Slot Content */}
                  <div className="flex-1 w-full pl-0 sm:pl-4">
                    {hasApp ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {matchingApps.map((app) => (
                          <div
                            key={app.id}
                            className="p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 shadow-2xs transition-all flex flex-col justify-between gap-2"
                            style={{ borderLeftColor: config.colors.primary, borderLeftWidth: '3px' }}
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <h3 className="text-xs font-bold text-slate-900 leading-tight">
                                  {app.clientName}
                                </h3>
                                <p className="text-[11px] text-slate-500 mt-0.5">
                                  {app.serviceName}
                                </p>
                              </div>
                              <StatusBadge status={app.status} />
                            </div>

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100/80">
                              <span className="flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {app.durationMinutes} min
                                {features.professionals !== false && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span>{app.professionalName}</span>
                                  </>
                                )}
                              </span>
                              <span className="font-bold text-slate-900 tabular-nums">
                                {formatCurrency(app.price)}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div
                        onClick={() => onOpenNewAppointment(slot)}
                        className="py-1 text-xs text-slate-400 opacity-0 group-hover:opacity-100 cursor-pointer flex items-center gap-1.5 transition-opacity"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Disponível para agendamento às {slot}</span>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Week View Grid */
        <div className="app-card p-0 overflow-x-auto">
          <div className="min-w-[800px]">
            {/* Week Header */}
            <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-50 text-center py-2.5 text-xs font-semibold">
              <div className="text-slate-400">Horário</div>
              {WEEKDAYS.map((day) => (
                <div
                  key={day.label}
                  className={`px-2 ${day.isToday ? 'text-indigo-600 font-bold' : 'text-slate-700'}`}
                >
                  <div>{day.label}</div>
                  <div className="text-[10px] text-slate-400 font-mono">{day.date}</div>
                </div>
              ))}
            </div>

            {/* Time Slot Grid Rows */}
            <div className="divide-y divide-slate-100">
              {['09:00', '10:00', '11:00', '13:30', '14:30', '15:30', '16:30', '17:30'].map((time) => (
                <div key={time} className="grid grid-cols-7 min-h-[60px]">
                  <div className="p-2 text-center text-xs font-mono text-slate-400 border-r border-slate-100 flex items-center justify-center">
                    {time}
                  </div>

                  {WEEKDAYS.map((day, idx) => {
                    // Show some realistic demo placements for the day
                    const matchingApp = filteredAppointments.find(
                      (a) => a.time === time && (day.isToday ? true : idx % 2 === 0)
                    );

                    return (
                      <div
                        key={day.label}
                        onClick={() => !matchingApp && onOpenNewAppointment(time)}
                        className={`p-1.5 border-r border-slate-100 relative hover:bg-slate-50/50 transition-colors ${
                          day.isToday ? 'bg-indigo-50/20' : ''
                        }`}
                      >
                        {matchingApp ? (
                          <div
                            className="p-1.5 rounded-md bg-white border border-slate-200 shadow-2xs text-left"
                            style={{ borderLeftColor: config.colors.primary, borderLeftWidth: '2.5px' }}
                          >
                            <div className="text-[11px] font-bold text-slate-900 truncate">
                              {matchingApp.clientName}
                            </div>
                            <div className="text-[10px] text-slate-500 truncate">
                              {matchingApp.serviceName}
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

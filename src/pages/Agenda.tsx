import React, { useState } from 'react';
import { DemoConfig } from '../config/defaultConfig';
import { Appointment, Professional } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency } from '../utils/formatters';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Plus,
  Filter,
  User,
  CalendarDays,
  Sparkles,
} from 'lucide-react';

interface AgendaProps {
  config: DemoConfig;
  appointments: Appointment[];
  professionals: Professional[];
  onOpenNewAppointment: (timeSlot?: string) => void;
}

const DAY_TIME_SLOTS = [
  '08:00',
  '08:30',
  '09:00',
  '09:30',
  '10:00',
  '10:30',
  '11:00',
  '11:30',
  '12:00',
  '13:00',
  '13:30',
  '14:00',
  '14:30',
  '15:00',
  '15:30',
  '16:00',
  '16:30',
  '17:00',
  '17:30',
  '18:00',
  '18:30',
];

const WEEK_HOURS = [
  '08:00',
  '09:00',
  '10:00',
  '11:00',
  '12:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
];

// Helper to get Monday of current week
function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  const diff = date.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(date.setDate(diff));
}

export const Agenda: React.FC<AgendaProps> = ({
  config,
  appointments,
  professionals,
  onOpenNewAppointment,
}) => {
  const [viewMode, setViewMode] = useState<'day' | 'week'>('day');
  const [selectedProfessional, setSelectedProfessional] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedDate, setSelectedDate] = useState<Date>(new Date(2026, 8, 23)); // 23/09/2026

  const { terminology, features } = config;

  // Filter appointments by professional & status
  const filteredAppointments = appointments.filter((app) => {
    if (selectedProfessional !== 'all' && app.professionalId !== selectedProfessional) {
      return false;
    }
    if (statusFilter !== 'all' && app.status !== statusFilter) {
      return false;
    }
    return true;
  });

  // Calculate 7 days of the current week (Monday to Sunday)
  const monday = getMonday(selectedDate);
  const weekDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);

    const isToday =
      d.getDate() === 23 && d.getMonth() === 8 && d.getFullYear() === 2026;

    const weekdayShort = d.toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '');
    const weekdayFull = d.toLocaleDateString('pt-BR', { weekday: 'long' });
    const dayNumber = d.getDate();
    const dayMonth = `${String(dayNumber).padStart(2, '0')}/${String(d.getMonth() + 1).padStart(2, '0')}`;

    return {
      dateObj: d,
      weekdayShort: weekdayShort.charAt(0).toUpperCase() + weekdayShort.slice(1),
      weekdayFull: weekdayFull.charAt(0).toUpperCase() + weekdayFull.slice(1),
      dayNumber,
      dayMonth,
      isToday,
      isSameAsSelected:
        d.getDate() === selectedDate.getDate() &&
        d.getMonth() === selectedDate.getMonth(),
    };
  });

  // Next / Prev handlers
  const handlePrevDate = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() - (viewMode === 'week' ? 7 : 1));
    setSelectedDate(next);
  };

  const handleNextDate = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + (viewMode === 'week' ? 7 : 1));
    setSelectedDate(next);
  };

  const handleToday = () => {
    setSelectedDate(new Date(2026, 8, 23));
  };

  // Header Title strings
  const formattedDayTitle = `${selectedDate.toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
  })}, ${selectedDate.getFullYear()}`;

  const formattedWeekTitle = `Semana de ${weekDays[0].dayNumber} a ${weekDays[6].dayNumber} de ${weekDays[6].dateObj.toLocaleDateString('pt-BR', { month: 'long' })}, ${selectedDate.getFullYear()}`;

  // Matching appointments for week columns
  const getAppointmentsForDayAndHour = (day: (typeof weekDays)[0], hourPrefix: string) => {
    return filteredAppointments.filter((app) => {
      // Match hour prefix (e.g. '09' in '09:00' or '09:30')
      const appHour = app.time.split(':')[0];
      if (appHour !== hourPrefix.split(':')[0]) return false;

      // Match date
      if (day.isToday) {
        return app.date === 'Hoje' || app.date === day.dayMonth;
      }
      if (day.weekdayShort.toLowerCase().startsWith('qui')) {
        return app.date === 'Amanhã' || app.date === day.dayMonth;
      }
      if (day.weekdayShort.toLowerCase().startsWith('ter')) {
        return app.date === 'Ontem' || app.date === day.dayMonth;
      }
      return app.date === day.dayMonth;
    });
  };

  return (
    <div className="space-y-4 animate-fade-in pb-12">
      {/* Top Toolbar: Date Navigation, View Mode Tabs, Filter Dropdowns */}
      <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-5 transition-all">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          {/* Left Block: Date Navigation & Summary */}
          <div className="flex flex-wrap items-center gap-3.5 sm:gap-4">
            {/* Calendar Icon Badge */}
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0 shadow-2xs border border-indigo-100"
              style={{
                backgroundColor: config.colors.secondary || '#EEF2FF',
                color: config.colors.primary || '#4F46E5',
              }}
            >
              {viewMode === 'day' ? (
                <CalendarIcon className="w-5 h-5" />
              ) : (
                <CalendarDays className="w-5 h-5" />
              )}
            </div>

            {/* Date Details */}
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight capitalize">
                  {viewMode === 'day' ? formattedDayTitle : formattedWeekTitle}
                </h2>

                {viewMode === 'day' && (
                  <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-[11px] font-semibold rounded-md bg-slate-100 text-slate-600 capitalize">
                    {selectedDate.toLocaleDateString('pt-BR', { weekday: 'long' })}
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                <span className="flex items-center gap-1.5 font-medium">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {filteredAppointments.length}{' '}
                  {filteredAppointments.length === 1
                    ? terminology.appointment?.toLowerCase() || 'agendamento'
                    : terminology.appointments?.toLowerCase() || 'agendamentos'}{' '}
                  listados
                </span>
                <span className="text-slate-300">·</span>
                <span className="text-slate-400">08:00 - 18:30</span>
              </div>
            </div>

            {/* Date Stepper Controls */}
            <div className="flex items-center gap-1.5 ml-auto sm:ml-2 pl-0 sm:pl-3 sm:border-l border-slate-100">
              <div className="flex items-center bg-slate-50 border border-slate-200/80 rounded-lg p-0.5">
                <button
                  type="button"
                  onClick={handlePrevDate}
                  className="p-1.5 rounded-md hover:bg-white hover:text-slate-900 hover:shadow-2xs text-slate-600 transition-all"
                  title={viewMode === 'week' ? 'Semana anterior' : 'Dia anterior'}
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handleNextDate}
                  className="p-1.5 rounded-md hover:bg-white hover:text-slate-900 hover:shadow-2xs text-slate-600 transition-all"
                  title={viewMode === 'week' ? 'Próxima semana' : 'Próximo dia'}
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              <button
                type="button"
                onClick={handleToday}
                className="px-2.5 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200/80 rounded-lg transition-colors"
              >
                Hoje
              </button>
            </div>
          </div>

          {/* Right Block: View Mode, Filters & Primary CTA */}
          <div className="flex flex-wrap items-center gap-2.5 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100 justify-start lg:justify-end">
            {/* View Mode Segmented Switch */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/60 shadow-2xs">
              <button
                type="button"
                onClick={() => setViewMode('day')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'day'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Dia</span>
              </button>

              <button
                type="button"
                onClick={() => setViewMode('week')}
                className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                  viewMode === 'week'
                    ? 'bg-white text-slate-900 shadow-2xs'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <CalendarDays className="w-3.5 h-3.5 text-slate-400" />
                <span>Semana</span>
              </button>
            </div>

            {/* Filter by Status */}
            <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1 shadow-2xs">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="text-xs font-medium text-slate-700 bg-transparent border-none focus:outline-hidden cursor-pointer pr-1"
              >
                <option value="all">Todos os status</option>
                <option value="confirmado">Confirmados</option>
                <option value="pendente">Pendentes</option>
                <option value="finalizado">Finalizados</option>
                <option value="cancelado">Cancelados</option>
              </select>
            </div>

            {/* Filter by Professional (if enabled) */}
            {features.professionals !== false && (
              <div className="flex items-center gap-1.5 bg-white border border-slate-200/90 rounded-xl px-2.5 py-1 shadow-2xs max-w-[190px]">
                <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <select
                  value={selectedProfessional}
                  onChange={(e) => setSelectedProfessional(e.target.value)}
                  className="text-xs font-medium text-slate-700 bg-transparent border-none focus:outline-hidden cursor-pointer truncate pr-1"
                >
                  <option value="all">Todos {terminology.professionals?.toLowerCase() || 'profissionais'}</option>
                  {professionals.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* New Appointment CTA */}
            <button
              type="button"
              onClick={() => onOpenNewAppointment('10:00')}
              className="btn-primary text-xs py-2 px-3.5 rounded-xl shadow-xs flex items-center gap-1.5 ml-auto sm:ml-0"
              style={{ backgroundColor: config.colors.primary }}
            >
              <Plus className="w-3.5 h-3.5 text-white" />
              <span>Novo {terminology.appointment || 'Agendamento'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DAY VIEW MODE */}
      {/* ========================================================================= */}
      {viewMode === 'day' ? (
        <div className="app-card p-0 overflow-hidden shadow-xs">
          <div className="px-6 py-3 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-600">
            <span>Horário de Atendimento (Grade Contínua)</span>
            <span>{filteredAppointments.length} agendamentos cadastrados</span>
          </div>

          <div className="divide-y divide-slate-100">
            {DAY_TIME_SLOTS.map((slot) => {
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
                            className="p-3 rounded-xl border border-slate-200 bg-white hover:border-slate-300 shadow-2xs transition-all flex flex-col justify-between gap-2"
                            style={{ borderLeftColor: config.colors.primary, borderLeftWidth: '3.5px' }}
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

                            <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1.5 border-t border-slate-100/80">
                              <span className="flex items-center gap-1 font-medium">
                                <Clock className="w-3 h-3 text-slate-400" />
                                {app.durationMinutes} min
                                {features.professionals !== false && (
                                  <>
                                    <span aria-hidden="true">·</span>
                                    <span className="font-semibold text-slate-700">{app.professionalName}</span>
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
                        className="py-1 text-xs text-slate-400 opacity-0 group-hover:opacity-100 cursor-pointer flex items-center gap-1.5 transition-opacity hover:text-slate-700"
                      >
                        <Plus className="w-3.5 h-3.5 text-indigo-500" />
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
        /* ========================================================================= */
        /* 2. ENHANCED WEEK VIEW MODE */
        /* ========================================================================= */
        <div className="app-card p-0 overflow-hidden shadow-xs border border-slate-200/90">
          {/* Scrollable Container with Sticky Columns */}
          <div className="overflow-x-auto">
            <div className="min-w-[920px]">
              {/* Sticky Week Header (7 days + 1 time column = 8 columns) */}
              <div className="sticky top-0 z-20 grid grid-cols-[68px_repeat(7,1fr)] bg-slate-50/95 backdrop-blur-sm border-b border-slate-200 shadow-2xs">
                {/* Top-left corner (Time Gutter) */}
                <div className="p-3 text-center text-[11px] font-semibold text-slate-400 border-r border-slate-200/80 flex items-center justify-center sticky left-0 bg-slate-50 z-30">
                  <Clock className="w-3.5 h-3.5" />
                </div>

                {/* 7 Day Header Columns */}
                {weekDays.map((day) => {
                  const isToday = day.isToday;

                  return (
                    <div
                      key={day.dayMonth}
                      onClick={() => {
                        setSelectedDate(day.dateObj);
                        setViewMode('day');
                      }}
                      className={`py-3 px-2 text-center border-r border-slate-200/80 last:border-r-0 cursor-pointer transition-colors group ${
                        isToday ? 'bg-indigo-50/60' : 'hover:bg-slate-100/70'
                      }`}
                      title={`Ver agenda de ${day.weekdayFull}, ${day.dayMonth}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        <span
                          className={`text-[11px] uppercase tracking-wider font-bold transition-colors ${
                            isToday
                              ? 'text-indigo-600'
                              : 'text-slate-500 group-hover:text-slate-900'
                          }`}
                        >
                          {day.weekdayShort}
                        </span>

                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all tabular-nums ${
                            isToday
                              ? 'bg-indigo-600 text-white shadow-2xs scale-105'
                              : 'text-slate-800 group-hover:bg-slate-200/60'
                          }`}
                          style={isToday ? { backgroundColor: config.colors.primary } : undefined}
                        >
                          {day.dayNumber}
                        </div>

                        <span className="text-[10px] text-slate-400 font-medium">
                          {day.dayMonth}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Grid Timeline Rows */}
              <div className="divide-y divide-slate-100 bg-white">
                {WEEK_HOURS.map((hour) => {
                  return (
                    <div
                      key={hour}
                      className="grid grid-cols-[68px_repeat(7,1fr)] min-h-[92px] relative group/row"
                    >
                      {/* Time Column (Sticky on Horizontal Scroll) */}
                      <div className="p-2 text-center text-xs font-mono font-medium text-slate-400 border-r border-slate-200/80 flex items-start justify-center pt-2.5 sticky left-0 bg-white z-10 select-none shadow-r">
                        {hour}
                      </div>

                      {/* 7 Day Slot Cells */}
                      {weekDays.map((day) => {
                        const matchingApps = getAppointmentsForDayAndHour(day, hour);
                        const isToday = day.isToday;

                        return (
                          <div
                            key={day.dayMonth}
                            className={`p-1.5 border-r border-slate-100 last:border-r-0 relative transition-colors group/cell ${
                              isToday ? 'bg-indigo-50/15' : 'hover:bg-slate-50/50'
                            }`}
                          >
                            {/* Half-hour guide line */}
                            <div className="absolute top-1/2 left-0 right-0 border-b border-dashed border-slate-100 pointer-events-none" />

                            {/* Appointments list in this slot */}
                            <div className="relative z-10 flex flex-col gap-1.5 h-full">
                              {matchingApps.map((app) => (
                                <div
                                  key={app.id}
                                  className="p-2 rounded-lg bg-white border border-slate-200/90 shadow-2xs hover:shadow-md hover:scale-[1.02] transition-all cursor-pointer text-left space-y-1"
                                  style={{
                                    borderLeftColor: config.colors.primary,
                                    borderLeftWidth: '3.5px',
                                  }}
                                  title={`${app.clientName} - ${app.serviceName} (${app.time} · ${app.durationMinutes} min)`}
                                >
                                  {/* Client & Status */}
                                  <div className="flex items-start justify-between gap-1">
                                    <span className="text-[11px] font-bold text-slate-900 truncate leading-tight">
                                      {app.clientName}
                                    </span>
                                    <span
                                      className={`w-2 h-2 rounded-full shrink-0 ${
                                        app.status === 'confirmado'
                                          ? 'bg-emerald-500'
                                          : app.status === 'pendente'
                                          ? 'bg-amber-500'
                                          : 'bg-slate-400'
                                      }`}
                                    />
                                  </div>

                                  {/* Service */}
                                  <p className="text-[10px] text-slate-500 truncate leading-tight">
                                    {app.serviceName}
                                  </p>

                                  {/* Time & Professional */}
                                  <div className="flex items-center justify-between text-[9px] text-slate-400 pt-0.5 border-t border-slate-50 font-medium">
                                    <span className="tabular-nums font-semibold text-slate-700">
                                      {app.time}
                                    </span>
                                    <span className="truncate max-w-[65px]">
                                      {app.professionalName.split(' ')[0]}
                                    </span>
                                  </div>
                                </div>
                              ))}

                              {/* Empty slot hover button */}
                              {matchingApps.length === 0 && (
                                <button
                                  type="button"
                                  onClick={() => onOpenNewAppointment(hour)}
                                  className="w-full h-full min-h-[70px] rounded-lg border border-transparent hover:border-dashed hover:border-slate-300 hover:bg-slate-50/80 flex items-center justify-center opacity-0 group-hover/cell:opacity-100 transition-opacity text-slate-400 hover:text-slate-700 text-[11px] font-medium"
                                  title={`Agendar para ${day.weekdayShort} às ${hour}`}
                                >
                                  <Plus className="w-3.5 h-3.5 mr-1 text-indigo-500" />
                                  <span>Agendar</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Week Footer Legend */}
          <div className="px-4 py-3 bg-slate-50/80 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 text-[11px] text-slate-500">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                Confirmado
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                Pendente
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-slate-400" />
                Finalizado
              </span>
            </div>

            <div className="text-slate-400 text-[10px]">
              Dica: Clique no cabeçalho de um dia para abrir a visão diária detalhada.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

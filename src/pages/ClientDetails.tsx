import React, { useState } from 'react';
import { DemoConfig } from '../config/defaultConfig';
import { Client, ClientHistoryItem, Appointment } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { formatCurrency, getInitials } from '../utils/formatters';
import {
  ArrowLeft,
  Phone,
  Mail,
  Calendar,
  DollarSign,
  Clock,
  FileText,
  Save,
  Plus,
} from 'lucide-react';

interface ClientDetailsProps {
  config: DemoConfig;
  client: Client;
  history: ClientHistoryItem[];
  clientAppointments: Appointment[];
  onBack: () => void;
  onUpdateClientNotes: (clientId: string, newNotes: string) => void;
  onOpenNewAppointment: () => void;
}

export const ClientDetails: React.FC<ClientDetailsProps> = ({
  config,
  client,
  history,
  clientAppointments,
  onBack,
  onUpdateClientNotes,
  onOpenNewAppointment,
}) => {
  const { terminology, features } = config;
  const [notes, setNotes] = useState(client.notes || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveNotes = () => {
    setIsSaving(true);
    onUpdateClientNotes(client.id, notes);
    setTimeout(() => setIsSaving(false), 500);
  };

  // Combine appointment history with recorded timeline
  const combinedHistory = [
    ...clientAppointments.map((a) => ({
      id: a.id,
      date: a.date,
      serviceName: a.serviceName,
      professionalName: a.professionalName,
      price: a.price,
      status: a.status,
      notes: a.notes || '',
    })),
    ...history,
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with back button & quick action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors w-fit"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Voltar para {terminology.customers?.toLowerCase() || 'clientes'}</span>
        </button>

        <button
          type="button"
          onClick={onOpenNewAppointment}
          className="btn-primary text-xs py-1.5 px-3 w-fit"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Agendar para este {terminology.customer?.toLowerCase() || 'cliente'}</span>
        </button>
      </div>

      {/* Profile Overview Card */}
      <div className="app-card">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg text-white shrink-0 shadow-xs"
              style={{ backgroundColor: config.colors.primary }}
            >
              {getInitials(client.name)}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg font-bold text-slate-900">{client.name}</h2>
                <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-indigo-50 text-indigo-700">
                  {client.status}
                </span>
                {client.petName && (
                  <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800">
                    Animal: {client.petName}
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-2">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-slate-400" />
                  {client.phone}
                </span>
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-slate-400" />
                  {client.email}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  Cliente desde: {client.registeredAt}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100 min-w-[240px]">
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                {terminology.attendances || 'Atendimentos'}
              </span>
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {client.totalAppointments}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                Total Faturado
              </span>
              <span className="text-base font-bold text-slate-900 tabular-nums">
                {formatCurrency(client.totalSpent)}
              </span>
            </div>
          </div>
        </div>

        {/* Observation Notes Box */}
        <div className="pt-4">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-500" />
              <span>Observações Clínicas / Preferências do {terminology.customer || 'Cliente'}</span>
            </label>
            <button
              type="button"
              onClick={handleSaveNotes}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Salvo!' : 'Salvar nota'}</span>
            </button>
          </div>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="app-input text-xs resize-none"
            placeholder="Registre aqui informações relevantes sobre preferências, alergias, procedimentos anteriores..."
          />
        </div>
      </div>

      {/* Attendance History Timeline */}
      <div className="app-card">
        <h3 className="text-sm font-semibold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
          <Clock className="w-4 h-4 text-slate-500" />
          <span>Histórico de {terminology.attendances || 'Atendimentos'}</span>
        </h3>

        {combinedHistory.length > 0 ? (
          <div className="divide-y divide-slate-100 mt-2">
            {combinedHistory.map((item, idx) => (
              <div
                key={`${item.id}-${idx}`}
                className="py-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2"
              >
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-slate-900">
                        {item.serviceName}
                      </span>
                      <StatusBadge status={item.status} />
                    </div>
                    <div className="text-[11px] text-slate-500 flex items-center gap-2 mt-0.5">
                      <span>Data: {item.date}</span>
                      {features.professionals !== false && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span>{item.professionalName}</span>
                        </>
                      )}
                    </div>
                    {item.notes && (
                      <p className="text-[11px] text-slate-400 italic mt-1">
                        "{item.notes}"
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right font-bold text-xs text-slate-900 tabular-nums">
                  {formatCurrency(item.price)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-xs text-slate-500">
            Nenhum histórico registrado ainda para este {terminology.customer?.toLowerCase() || 'cliente'}.
          </div>
        )}
      </div>
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { DemoConfig } from '../config/defaultConfig';
import { Client, Service, Professional, Appointment } from '../types';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: DemoConfig;
  clients: Client[];
  services: Service[];
  professionals: Professional[];
  onAddAppointment: (appointment: Appointment) => void;
  initialTime?: string;
  initialDate?: string;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  config,
  clients,
  services,
  professionals,
  onAddAppointment,
  initialTime = '10:00',
  initialDate = 'Hoje',
}) => {
  const { terminology, features } = config;

  const [clientId, setClientId] = useState('');
  const [customClientName, setCustomClientName] = useState('');
  const [serviceId, setServiceId] = useState('');
  const [professionalId, setProfessionalId] = useState('');
  const [date, setDate] = useState(initialDate);
  const [time, setTime] = useState(initialTime);
  const [duration, setDuration] = useState(45);
  const [price, setPrice] = useState(100);
  const [status, setStatus] = useState<'confirmado' | 'pendente'>('confirmado');
  const [notes, setNotes] = useState('');

  // Update initial fields when opened
  useEffect(() => {
    if (isOpen) {
      if (clients.length > 0 && !clientId) setClientId(clients[0].id);
      if (services.length > 0 && !serviceId) {
        setServiceId(services[0].id);
        setDuration(services[0].durationMinutes);
        setPrice(services[0].price);
      }
      if (professionals.length > 0 && !professionalId) {
        setProfessionalId(professionals[0].id);
      }
      setTime(initialTime);
      setDate(initialDate);
    }
  }, [isOpen, clients, services, professionals, initialTime, initialDate]);

  const handleServiceChange = (sId: string) => {
    setServiceId(sId);
    const found = services.find((s) => s.id === sId);
    if (found) {
      setDuration(found.durationMinutes);
      setPrice(found.price);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedClient = clients.find((c) => c.id === clientId);
    const selectedService = services.find((s) => s.id === serviceId);
    const selectedProfessional = professionals.find((p) => p.id === professionalId);

    const clientName = customClientName.trim()
      ? customClientName.trim()
      : selectedClient?.name || 'Cliente Avulso';

    const clientPhone = selectedClient?.phone || '(00) 90000-0000';
    const petName = selectedClient?.petName;

    const newAppointment: Appointment = {
      id: `app-${Date.now()}`,
      clientId: selectedClient?.id || `c-${Date.now()}`,
      clientName,
      clientPhone,
      petName,
      serviceId: selectedService?.id || 's-custom',
      serviceName: selectedService?.name || 'Serviço Agendado',
      professionalId: selectedProfessional?.id || 'p-none',
      professionalName: selectedProfessional?.name || 'Geral',
      date: date || 'Hoje',
      time: time || '10:00',
      durationMinutes: Number(duration) || 45,
      price: Number(price) || 0,
      status,
      notes: notes.trim(),
    };

    onAddAppointment(newAppointment);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Novo ${terminology.appointment || 'Agendamento'}`}
      subtitle={`Preencha os detalhes para registrar o horário do ${terminology.customer?.toLowerCase() || 'cliente'}.`}
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Client Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {terminology.customer || 'Cliente'} cadastrado
          </label>
          <select
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value);
              setCustomClientName('');
            }}
            className="app-select"
          >
            {clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} {c.petName ? `(Pet: ${c.petName})` : ''} - {c.phone}
              </option>
            ))}
          </select>
        </div>

        {/* Or Type Name */}
        <div>
          <label className="block text-xs font-medium text-slate-500 mb-1">
            Ou digite outro nome para agendamento avulso:
          </label>
          <input
            type="text"
            placeholder={`Ex: Novo ${terminology.customer || 'cliente'}`}
            value={customClientName}
            onChange={(e) => setCustomClientName(e.target.value)}
            className="app-input text-xs"
          />
        </div>

        {/* Service Selection */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {terminology.service || 'Serviço'}
          </label>
          <select
            value={serviceId}
            onChange={(e) => handleServiceChange(e.target.value)}
            className="app-select"
            required
          >
            {services.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} ({s.durationMinutes} min) - R$ {s.price}
              </option>
            ))}
          </select>
        </div>

        {/* Professional (if enabled) */}
        {features.professionals !== false && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              {terminology.professional || 'Profissional'}
            </label>
            <select
              value={professionalId}
              onChange={(e) => setProfessionalId(e.target.value)}
              className="app-select"
            >
              {professionals.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} - {p.role}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Date and Time */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Data</label>
            <select
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="app-select"
            >
              <option value="Hoje">Hoje</option>
              <option value="Amanhã">Amanhã</option>
              <option value="Em 2 dias">Em 2 dias</option>
              <option value="Próxima semana">Próxima semana</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Horário</label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="app-input"
              required
            />
          </div>
        </div>

        {/* Duration and Price */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Duração (minutos)
            </label>
            <input
              type="number"
              min="10"
              step="5"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              className="app-input tabular-nums"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Valor (R$)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="app-input tabular-nums"
              required
            />
          </div>
        </div>

        {/* Status */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Status inicial</label>
          <div className="flex gap-4">
            <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="confirmado"
                checked={status === 'confirmado'}
                onChange={() => setStatus('confirmado')}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span>Confirmado</span>
            </label>

            <label className="inline-flex items-center gap-1.5 text-xs text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="status"
                value="pendente"
                checked={status === 'pendente'}
                onChange={() => setStatus('pendente')}
                className="text-amber-600 focus:ring-amber-500"
              />
              <span>Pendente de aprovação</span>
            </label>
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">Observações</label>
          <textarea
            rows={2}
            placeholder="Ex: Preferência do cliente, detalhes específicos ou restrições..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="app-input resize-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
          <button type="button" onClick={onClose} className="btn-secondary text-xs">
            Cancelar
          </button>
          <button type="submit" className="btn-primary text-xs">
            Confirmar Agendamento
          </button>
        </div>
      </form>
    </Modal>
  );
};

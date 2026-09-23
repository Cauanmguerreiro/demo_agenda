import React, { useState } from 'react';
import { DemoConfig } from '../config/defaultConfig';
import { Client } from '../types';
import { formatCurrency, getInitials } from '../utils/formatters';
import { EmptyState } from '../components/EmptyState';
import { Modal } from '../components/Modal';
import { Search, Plus, Phone, Calendar, ArrowRight, Dog } from 'lucide-react';

interface ClientsProps {
  config: DemoConfig;
  clients: Client[];
  onSelectClient: (clientId: string) => void;
  onAddClient: (client: Client) => void;
}

export const Clients: React.FC<ClientsProps> = ({
  config,
  clients,
  onSelectClient,
  onAddClient,
}) => {
  const { terminology } = config;
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New client form state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [petName, setPetName] = useState('');
  const [notes, setNotes] = useState('');

  const isPetShop = config.id === 'petshop';

  const filteredClients = clients.filter((c) => {
    const search = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(search) ||
      c.phone.toLowerCase().includes(search) ||
      (c.petName && c.petName.toLowerCase().includes(search))
    );
  });

  const handleCreateClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const newClient: Client = {
      id: `c-${Date.now()}`,
      name: name.trim(),
      phone: phone.trim() || '(00) 90000-0000',
      email: email.trim() || `${name.toLowerCase().replace(/\s+/g, '.')}@email.com`,
      registeredAt: 'Hoje',
      totalAppointments: 0,
      totalSpent: 0,
      lastAppointment: 'Sem registros anteriores',
      notes: notes.trim(),
      status: 'Novo',
      petName: isPetShop ? petName.trim() : undefined,
    };

    onAddClient(newClient);
    setIsModalOpen(false);
    setName('');
    setPhone('');
    setEmail('');
    setPetName('');
    setNotes('');
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Search and Add Toolbar */}
      <div className="app-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder={`Buscar por nome, telefone ${isPetShop ? 'ou nome do animal' : ''}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="app-input pl-9 text-xs"
          />
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="btn-primary text-xs py-2 px-3"
        >
          <Plus className="w-4 h-4" />
          <span>Cadastrar {terminology.customer || 'Cliente'}</span>
        </button>
      </div>

      {/* Grid of Clients */}
      {filteredClients.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClients.map((client) => (
            <div
              key={client.id}
              onClick={() => onSelectClient(client.id)}
              className="app-card hover:border-slate-300 hover:shadow-xs cursor-pointer transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0"
                      style={{ backgroundColor: config.colors.primary }}
                    >
                      {getInitials(client.name)}
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-bold text-slate-900 truncate group-hover:text-indigo-600 transition-colors">
                        {client.name}
                      </h3>
                      {client.petName && (
                        <div className="text-[11px] text-amber-700 font-semibold flex items-center gap-1 mt-0.5">
                          <Dog className="w-3 h-3" />
                          <span>Pet: {client.petName}</span>
                        </div>
                      )}
                      <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
                        <Phone className="w-3 h-3 text-slate-400" />
                        <span>{client.phone}</span>
                      </div>
                    </div>
                  </div>

                  <span className="px-2 py-0.5 text-[10px] font-semibold rounded-full bg-slate-100 text-slate-700 shrink-0">
                    {client.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 py-2.5 border-t border-b border-slate-100 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      {terminology.attendances || 'Atendimentos'}
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {client.totalAppointments}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                      Total investido
                    </span>
                    <span className="font-bold text-slate-900 tabular-nums">
                      {formatCurrency(client.totalSpent)}
                    </span>
                  </div>
                </div>

                <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">Último: {client.lastAppointment}</span>
                </div>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-indigo-600 group-hover:text-indigo-700">
                <span>Ver histórico completo</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EmptyState
          title={`Nenhum ${terminology.customer?.toLowerCase() || 'cliente'} encontrado`}
          description="Nenhum resultado corresponde à sua pesquisa. Você pode cadastrar um novo agora."
          actionLabel={`+ Cadastrar ${terminology.customer || 'Cliente'}`}
          onAction={() => setIsModalOpen(true)}
        />
      )}

      {/* Modal to Add New Client */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={`Cadastrar Novo ${terminology.customer || 'Cliente'}`}
        subtitle={`Adicione os dados cadastrais do ${terminology.customer?.toLowerCase() || 'cliente'}.`}
      >
        <form onSubmit={handleCreateClient} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome completo
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Mariana Silveira"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="app-input"
            />
          </div>

          {isPetShop && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nome do Animal / Raça
              </label>
              <input
                type="text"
                placeholder="Ex: Thor (Golden Retriever)"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="app-input"
              />
            </div>
          )}

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                placeholder="(00) 90000-0000"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="app-input"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                E-mail
              </label>
              <input
                type="email"
                placeholder="nome@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="app-input"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Observações e preferências
            </label>
            <textarea
              rows={2}
              placeholder="Ex: Restrições, preferências de atendimento ou histórico relevante..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="app-input resize-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="btn-secondary text-xs"
            >
              Cancelar
            </button>
            <button type="submit" className="btn-primary text-xs">
              Salvar Cadastro
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

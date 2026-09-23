import React, { useState } from 'react';
import { DemoConfig } from '../config/defaultConfig';
import { Service } from '../types';
import { formatCurrency, formatDuration } from '../utils/formatters';
import { Modal } from '../components/Modal';
import { Plus, Clock, Tag, UserCheck, Edit3 } from 'lucide-react';

interface ServicesProps {
  config: DemoConfig;
  services: Service[];
  onAddService: (service: Service) => void;
  onUpdateService: (service: Service) => void;
}

export const Services: React.FC<ServicesProps> = ({
  config,
  services,
  onAddService,
  onUpdateService,
}) => {
  const { terminology, features } = config;
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [price, setPrice] = useState(100);
  const [durationMinutes, setDurationMinutes] = useState(45);
  const [description, setDescription] = useState('');

  const categories = Array.from(new Set(services.map((s) => s.category)));

  const filteredServices = services.filter((s) => {
    return selectedCategory === 'all' || s.category === selectedCategory;
  });

  const handleOpenCreate = () => {
    setEditingService(null);
    setName('');
    setCategory(categories[0] || 'Geral');
    setPrice(100);
    setDurationMinutes(45);
    setDescription('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (s: Service) => {
    setEditingService(s);
    setName(s.name);
    setCategory(s.category);
    setPrice(s.price);
    setDurationMinutes(s.durationMinutes);
    setDescription(s.description || '');
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (editingService) {
      onUpdateService({
        ...editingService,
        name: name.trim(),
        category: category.trim() || 'Geral',
        price: Number(price) || 0,
        durationMinutes: Number(durationMinutes) || 30,
        description: description.trim(),
      });
    } else {
      const newService: Service = {
        id: `s-${Date.now()}`,
        name: name.trim(),
        category: category.trim() || 'Geral',
        price: Number(price) || 0,
        durationMinutes: Number(durationMinutes) || 30,
        assignedProfessionals: ['Equipe Geral'],
        active: true,
        description: description.trim(),
      };
      onAddService(newService);
    }

    setIsModalOpen(false);
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {/* Top Toolbar */}
      <div className="app-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedCategory('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:text-slate-900'
            }`}
          >
            Todas as Categorias ({services.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
                selectedCategory === cat
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleOpenCreate}
          className="btn-primary text-xs py-2 px-3 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Novo {terminology.service || 'Serviço'}</span>
        </button>
      </div>

      {/* Grid of Services */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredServices.map((svc) => (
          <div
            key={svc.id}
            className="app-card flex flex-col justify-between hover:border-slate-300 transition-all group"
          >
            <div>
              <div className="flex items-start justify-between gap-2 mb-2">
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-md bg-slate-100 text-slate-600 uppercase tracking-wider flex items-center gap-1">
                  <Tag className="w-2.5 h-2.5 text-slate-400" />
                  {svc.category}
                </span>

                <button
                  type="button"
                  onClick={() => handleOpenEdit(svc)}
                  className="p-1 rounded text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                  title="Editar serviço"
                >
                  <Edit3 className="w-3.5 h-3.5" />
                </button>
              </div>

              <h3 className="text-sm font-bold text-slate-900 leading-tight mb-1">
                {svc.name}
              </h3>

              {svc.description && (
                <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                  {svc.description}
                </p>
              )}

              {features.professionals !== false && svc.assignedProfessionals.length > 0 && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-2">
                  <UserCheck className="w-3 h-3 text-slate-400 shrink-0" />
                  <span className="truncate">
                    Disponível com: {svc.assignedProfessionals.join(', ')}
                  </span>
                </div>
              )}
            </div>

            <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1 font-medium text-slate-500">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                {formatDuration(svc.durationMinutes)}
              </span>
              <span className="text-sm font-bold text-slate-900 tabular-nums">
                {formatCurrency(svc.price)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Create / Edit Service Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={
          editingService
            ? `Editar ${terminology.service || 'Serviço'}`
            : `Novo ${terminology.service || 'Serviço'}`
        }
        subtitle="Configure os parâmetros de precificação e tempo de execução."
      >
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Nome do {terminology.service?.toLowerCase() || 'serviço'}
            </label>
            <input
              type="text"
              required
              placeholder="Ex: Consulta Cardiológica / Corte Feminino / Banho Pet"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="app-input"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Categoria
              </label>
              <input
                type="text"
                required
                placeholder="Ex: Cabelo, Facial, Clínica Geral"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="app-input"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Duração (minutos)
              </label>
              <input
                type="number"
                min="10"
                step="5"
                required
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(Number(e.target.value))}
                className="app-input tabular-nums"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Valor cobrado (R$)
            </label>
            <input
              type="number"
              min="0"
              step="1"
              required
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              className="app-input tabular-nums"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Descrição detalhada
            </label>
            <textarea
              rows={2}
              placeholder="Descreva o que está incluso neste atendimento..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
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
              Salvar {terminology.service || 'Serviço'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

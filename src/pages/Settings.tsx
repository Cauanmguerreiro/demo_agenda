import React, { useState } from 'react';
import { DemoConfig } from '../config/defaultConfig';
import { Save, Check } from 'lucide-react';

interface SettingsProps {
  config: DemoConfig;
  onUpdateConfig: (updated: Partial<DemoConfig>) => void;
}

export const Settings: React.FC<SettingsProps> = ({ config, onUpdateConfig }) => {
  const { business, features } = config;

  const [intervalMinutes, setIntervalMinutes] = useState('30');
  const [minAdvanceHours, setMinAdvanceHours] = useState('2');
  const [maxAdvanceDays, setMaxAdvanceDays] = useState('60');
  const [cancelAdvanceHours, setCancelAdvanceHours] = useState('4');

  const [approvalRequired, setApprovalRequired] = useState(features.approvalRequired);
  const [individualAgenda, setIndividualAgenda] = useState(features.individualAgenda);
  const [commissions, setCommissions] = useState(features.commissions);
  const [allowCancel, setAllowCancel] = useState(true);
  const [allowReschedule, setAllowReschedule] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateConfig({
      features: {
        ...features,
        approvalRequired,
        individualAgenda,
        commissions,
      },
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <form onSubmit={handleSave} className="max-w-4xl space-y-6 animate-fade-in">
      <div className="app-card flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Configurações Operacionais do Estabelecimento
          </h2>
          <p className="text-xs text-slate-500">
            Defina horários de atendimento, regras de tolerância e políticas de cancelamento
          </p>
        </div>

        <button type="submit" className="btn-primary text-xs py-1.5 px-3">
          {saved ? (
            <>
              <Check className="w-3.5 h-3.5 text-white" />
              <span>Salvo com sucesso!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Salvar Alterações</span>
            </>
          )}
        </button>
      </div>

      {/* Agenda & Funcionamento */}
      <div className="app-card space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
          Grade de Horários & Intervalos
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Intervalo padrão entre horários
            </label>
            <select
              value={intervalMinutes}
              onChange={(e) => setIntervalMinutes(e.target.value)}
              className="app-select text-xs"
            >
              <option value="15">15 minutos</option>
              <option value="30">30 minutos (recomendado)</option>
              <option value="45">45 minutos</option>
              <option value="60">60 minutos (1 hora)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Antecedência mínima para agendar
            </label>
            <select
              value={minAdvanceHours}
              onChange={(e) => setMinAdvanceHours(e.target.value)}
              className="app-select text-xs"
            >
              <option value="1">1 hora antes</option>
              <option value="2">2 horas antes</option>
              <option value="6">6 horas antes</option>
              <option value="24">24 horas antes (1 dia)</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Máximo para agendamento futuro
            </label>
            <select
              value={maxAdvanceDays}
              onChange={(e) => setMaxAdvanceDays(e.target.value)}
              className="app-select text-xs"
            >
              <option value="30">30 dias</option>
              <option value="60">60 dias</option>
              <option value="90">90 dias</option>
            </select>
          </div>
        </div>

        {/* Business Hours Table */}
        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 mb-2">
            Horário de Funcionamento Semanal
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Segunda a Sexta</span>
              <span className="font-mono text-slate-600">08:00 às 19:00</span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-between">
              <span className="font-semibold text-slate-700">Sábado</span>
              <span className="font-mono text-slate-600">08:30 às 18:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Regras de Agendamento e Cancelamento */}
      <div className="app-card space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
          Políticas de Aprovação & Cancelamento
        </h3>

        <div className="divide-y divide-slate-100 space-y-3 pt-1">
          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Exigir aprovação manual prévia
              </div>
              <p className="text-[11px] text-slate-500">
                Os agendamentos feitos ficam em status "Pendente" até confirmação da recepção.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setApprovalRequired(!approvalRequired)}
              className="app-switch"
              data-checked={approvalRequired}
            >
              <span className="app-switch-thumb" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Permitir cancelamento online pelo cliente
              </div>
              <p className="text-[11px] text-slate-500">
                Clientes podem cancelar sem contato telefônico dentro da tolerância estipulada.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAllowCancel(!allowCancel)}
              className="app-switch"
              data-checked={allowCancel}
            >
              <span className="app-switch-thumb" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Permitir remarcação de horários
              </div>
              <p className="text-[11px] text-slate-500">
                Permite ao cliente trocar o horário por outro disponível.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setAllowReschedule(!allowReschedule)}
              className="app-switch"
              data-checked={allowReschedule}
            >
              <span className="app-switch-thumb" />
            </button>
          </div>
        </div>

        <div className="pt-2">
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Tempo limite de antecedência para cancelamento sem taxa
          </label>
          <select
            value={cancelAdvanceHours}
            onChange={(e) => setCancelAdvanceHours(e.target.value)}
            className="app-select text-xs max-w-xs"
          >
            <option value="2">2 horas antes</option>
            <option value="4">4 horas antes</option>
            <option value="12">12 horas antes</option>
            <option value="24">24 horas antes</option>
          </select>
        </div>
      </div>

      {/* Profissionais e Comissões */}
      <div className="app-card space-y-4">
        <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
          Agenda por Profissional & Comissões
        </h3>

        <div className="divide-y divide-slate-100 space-y-3 pt-1">
          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Agenda individual por profissional
              </div>
              <p className="text-[11px] text-slate-500">
                Permite filtrar e visualizar a grade individual de cada membro da equipe.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setIndividualAgenda(!individualAgenda)}
              className="app-switch"
              data-checked={individualAgenda}
            >
              <span className="app-switch-thumb" />
            </button>
          </div>

          <div className="flex items-center justify-between pt-3">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Cálculo automático de comissionamento
              </div>
              <p className="text-[11px] text-slate-500">
                Exibe percentual e valor de comissão nos relatórios e extratos.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCommissions(!commissions)}
              className="app-switch"
              data-checked={commissions}
            >
              <span className="app-switch-thumb" />
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

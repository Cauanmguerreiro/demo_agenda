import React, { useState } from 'react';
import { DemoConfig } from '../config/defaultConfig';
import { DemoSwitcher } from './DemoSwitcher';
import { Plus, Eye, EyeOff, Menu } from 'lucide-react';
import { getInitials } from '../utils/formatters';

interface HeaderProps {
  config: DemoConfig;
  presentationMode: boolean;
  onTogglePresentation: () => void;
  onSelectDemo: (id: string) => void;
  onOpenNewAppointment: () => void;
  onOpenMobileMenu?: () => void;
  currentRoute: string;
}

export const Header: React.FC<HeaderProps> = ({
  config,
  presentationMode,
  onTogglePresentation,
  onSelectDemo,
  onOpenNewAppointment,
  onOpenMobileMenu,
  currentRoute,
}) => {
  const [logoError, setLogoError] = useState(false);

  const getBreadcrumbTitle = () => {
    switch (currentRoute) {
      case 'dashboard': return 'Visão Geral';
      case 'agenda': return 'Agenda Diária & Semanal';
      case 'appointments': return config.terminology.appointments || 'Agendamentos';
      case 'clients': return config.terminology.customers || 'Clientes';
      case 'client-details': return `Perfil do ${config.terminology.customer || 'Cliente'}`;
      case 'services': return config.terminology.services || 'Serviços';
      case 'professionals': return config.terminology.professionals || 'Profissionais';
      case 'financial': return 'Fluxo Financeiro';
      case 'reports': return 'Relatórios e Indicadores';
      case 'settings': return 'Configurações Operacionais';
      case 'demo-config': return 'Configurador de Demonstração';
      default: return 'Painel Principal';
    }
  };

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 md:px-6 bg-white border-b border-slate-200">
      {/* Zone 1: Mobile toggle & Breadcrumb / Establishment title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="p-1.5 rounded-lg md:hidden text-slate-500 hover:text-slate-900 hover:bg-slate-100"
          aria-label="Abrir menu lateral"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 truncate">
          <div className="hidden sm:flex items-center gap-2">
            {!logoError && config.business.logoUrl ? (
              <img
                src={config.business.logoUrl}
                alt={config.business.name}
                className="w-7 h-7 rounded-md object-contain"
                referrerPolicy="no-referrer"
                onError={() => setLogoError(true)}
              />
            ) : null}
            <span className="text-sm font-bold tracking-tight text-slate-900 truncate">
              {config.business.name}
            </span>
            <span className="text-slate-300">/</span>
          </div>

          <h1 className="text-sm font-semibold text-slate-800 truncate">
            {getBreadcrumbTitle()}
          </h1>

          {!presentationMode && (
            <span className="hidden lg:inline-flex items-center px-2 py-0.5 text-[10px] font-semibold text-indigo-700 bg-indigo-50 border border-indigo-200/60 rounded">
              MODO DEMO
            </span>
          )}
        </div>
      </div>

      {/* Zone 2: Center subtle date display (desktop only) */}
      <div className="hidden xl:flex items-center gap-2 text-xs text-slate-500">
        <span>{config.business.category}</span>
        <span aria-hidden="true">·</span>
        <span className="tabular-nums">
          {new Date().toLocaleDateString('pt-BR', {
            weekday: 'short',
            day: '2-digit',
            month: 'short',
            year: 'numeric',
          })}
        </span>
      </div>

      {/* Zone 3: Actions (Demo switcher, Presentation toggle, Primary CTA, Responsible profile) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {!presentationMode ? (
          <>
            <DemoSwitcher
              currentDemoId={config.id}
              onSelectDemo={onSelectDemo}
            />

            <button
              type="button"
              onClick={onTogglePresentation}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors border border-transparent hover:border-slate-200"
              title="Ocultar elementos de configuração para demonstrar ao cliente"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Apresentação</span>
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={onTogglePresentation}
            className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
            title="Sair do modo de apresentação e reativar controles de demo"
          >
            <EyeOff className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Sair do Modo Apresentação</span>
            <span className="sm:hidden">Sair</span>
          </button>
        )}

        <button
          type="button"
          onClick={onOpenNewAppointment}
          className="btn-primary text-xs py-1.5 px-3"
          title={`Criar novo ${config.terminology.appointment || 'agendamento'}`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Novo {config.terminology.appointment || 'Agendamento'}</span>
          <span className="sm:hidden">Novo</span>
        </button>

        {/* Responsible user avatar lockup */}
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white shrink-0 shadow-xs"
          style={{ backgroundColor: config.colors.primary }}
          title={`${config.business.responsibleName} (${config.business.responsibleRole})`}
        >
          {getInitials(config.business.responsibleName || 'Bella')}
        </div>
      </div>
    </header>
  );
};

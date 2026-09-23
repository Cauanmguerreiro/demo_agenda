import React, { useState } from 'react';
import {
  LayoutDashboard,
  Calendar,
  CalendarCheck2,
  Users,
  Briefcase,
  UserCheck,
  CircleDollarSign,
  BarChart3,
  Settings,
  SlidersHorizontal,
  X,
  Sparkles,
} from 'lucide-react';
import { DemoConfig } from '../config/defaultConfig';

interface SidebarProps {
  config: DemoConfig;
  currentRoute: string;
  onRouteChange: (route: string) => void;
  pendingCount?: number;
  presentationMode: boolean;
  mobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  config,
  currentRoute,
  onRouteChange,
  pendingCount = 0,
  presentationMode,
  mobileOpen,
  onCloseMobile,
}) => {
  const [logoError, setLogoError] = useState(false);
  const { terminology, features, business } = config;

  const navItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: LayoutDashboard,
      visible: true,
    },
    {
      id: 'agenda',
      label: 'Agenda',
      icon: Calendar,
      visible: true,
    },
    {
      id: 'appointments',
      label: terminology.appointments || 'Agendamentos',
      icon: CalendarCheck2,
      badge: features.approvalRequired && pendingCount > 0 ? pendingCount : null,
      visible: true,
    },
    {
      id: 'clients',
      label: terminology.customers || 'Clientes',
      icon: Users,
      visible: true,
    },
    {
      id: 'services',
      label: terminology.services || 'Serviços',
      icon: Briefcase,
      visible: true,
    },
    {
      id: 'professionals',
      label: terminology.professionals || 'Profissionais',
      icon: UserCheck,
      visible: features.professionals !== false,
    },
    {
      id: 'financial',
      label: 'Financeiro',
      icon: CircleDollarSign,
      visible: features.financial !== false,
    },
    {
      id: 'reports',
      label: 'Relatórios',
      icon: BarChart3,
      visible: features.reports !== false,
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: Settings,
      visible: true,
    },
  ];

  const handleNavClick = (id: string) => {
    onRouteChange(id);
    onCloseMobile();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-white border-r border-slate-200 select-none">
      {/* Brand logo & establishment identity */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
        <div className="flex items-center gap-3 min-w-0">
          {!logoError && business.logoUrl ? (
            <img
              src={business.logoUrl}
              alt={business.name}
              className="w-8 h-8 rounded-lg object-contain bg-slate-50 border border-slate-100"
              referrerPolicy="no-referrer"
              onError={() => setLogoError(true)}
            />
          ) : (
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs"
              style={{ backgroundColor: config.colors.primary }}
            >
              {business.name.substring(0, 1).toUpperCase()}
            </div>
          )}

          <div className="min-w-0">
            <h2 className="text-sm font-bold text-slate-900 truncate leading-tight">
              {business.name}
            </h2>
            <p className="text-[11px] text-slate-500 truncate leading-tight mt-0.5">
              {business.category}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onCloseMobile}
          className="md:hidden p-1 text-slate-400 hover:text-slate-600 rounded-md"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main navigation links */}
      <div className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Menu Principal
        </div>

        {navItems
          .filter((item) => item.visible)
          .map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
                  isActive
                    ? 'bg-slate-100 text-slate-900 font-semibold'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 transition-colors ${
                      isActive ? 'text-indigo-600' : 'text-slate-400'
                    }`}
                    style={isActive ? { color: config.colors.primary } : undefined}
                  />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge !== null && item.badge !== undefined && (
                  <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-full bg-amber-100 text-amber-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
      </div>

      {/* Demo Configurator Section (Hidden if presentationMode) */}
      {!presentationMode && (
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="px-3 pb-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Demonstração
          </div>
          <button
            type="button"
            onClick={() => handleNavClick('demo-config')}
            className={`w-full flex items-center justify-between px-3 py-2 text-xs font-medium rounded-lg transition-colors text-left ${
              currentRoute === 'demo-config'
                ? 'bg-indigo-50 text-indigo-700 font-semibold border border-indigo-200/60'
                : 'text-indigo-900 bg-indigo-50/50 hover:bg-indigo-50 hover:text-indigo-700'
            }`}
          >
            <div className="flex items-center gap-2.5 truncate">
              <SlidersHorizontal className="w-4 h-4 shrink-0 text-indigo-600" />
              <span className="truncate font-semibold">Configurar Demo</span>
            </div>
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" />
          </button>
        </div>
      )}

      {/* Bottom user status */}
      <div className="px-4 py-3 border-t border-slate-100 flex items-center gap-2.5 text-xs text-slate-500">
        <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
        <span className="truncate">Sistema Operacional</span>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop static sidebar */}
      <aside
        className="hidden md:block shrink-0 h-screen sticky top-0"
        style={{ width: 'var(--sidebar-width)' }}
      >
        {sidebarContent}
      </aside>

      {/* Mobile drawer backdrop and slide-over */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          <div
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity"
            onClick={onCloseMobile}
            aria-hidden="true"
          />
          <div className="relative w-64 max-w-[80vw] h-full shadow-2xl z-10 animate-slide-in">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
};

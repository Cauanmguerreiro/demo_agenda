import React from 'react';
import { DemoConfig } from '../config/defaultConfig';
import { Professional } from '../types';
import { formatCurrency, getInitials } from '../utils/formatters';
import { Star, Clock, Calendar, DollarSign, Percent } from 'lucide-react';

interface ProfessionalsProps {
  config: DemoConfig;
  professionals: Professional[];
}

export const Professionals: React.FC<ProfessionalsProps> = ({
  config,
  professionals,
}) => {
  const { terminology, features } = config;

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="app-card flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Corpo de {terminology.professionals || 'Profissionais'}
          </h2>
          <p className="text-xs text-slate-500">
            Gerenciamento de agenda individual, comissionamento e produtividade
          </p>
        </div>
        <span className="text-xs font-semibold text-slate-500 tabular-nums">
          {professionals.length} especialistas ativos
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {professionals.map((prof) => (
          <div
            key={prof.id}
            className="app-card flex flex-col justify-between hover:border-slate-300 transition-all"
          >
            <div>
              {/* Header with Avatar and Rating */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-sm text-white shadow-xs"
                    style={{ backgroundColor: prof.avatarColor || config.colors.primary }}
                  >
                    {getInitials(prof.name)}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-900 leading-tight">
                      {prof.name}
                    </h3>
                    <p className="text-[11px] text-slate-500 mt-0.5">{prof.role}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                  <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                  <span className="tabular-nums">{prof.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Working Hours */}
              <div className="mt-3 text-[11px] text-slate-500 flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{prof.workingHours}</span>
              </div>

              {/* Metrics Grid */}
              <div className="grid grid-cols-2 gap-2 mt-4 p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    {terminology.attendances || 'Atendimentos'}
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {prof.appointmentsCount}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider block">
                    Faturamento Gerado
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {formatCurrency(prof.revenueGenerated)}
                  </span>
                </div>
              </div>
            </div>

            {/* Bottom Commission Tag (if enabled) */}
            {features.commissions && prof.commissionRate > 0 && (
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500 flex items-center gap-1">
                  <Percent className="w-3 h-3 text-slate-400" />
                  Taxa de comissão:
                </span>
                <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded tabular-nums">
                  {prof.commissionRate}%
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

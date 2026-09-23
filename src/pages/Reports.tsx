import React, { useState } from 'react';
import { DemoConfig } from '../config/defaultConfig';
import { Professional, TopServiceMetric } from '../types';
import { formatCurrency } from '../utils/formatters';
import { BarChart3, TrendingUp, Users, Calendar, Percent, ShieldCheck } from 'lucide-react';

interface ReportsProps {
  config: DemoConfig;
  professionals: Professional[];
  topServices: TopServiceMetric[];
}

export const Reports: React.FC<ReportsProps> = ({
  config,
  professionals,
  topServices,
}) => {
  const { terminology, features } = config;
  const [period, setPeriod] = useState<'30' | '90' | '365'>('30');

  // Performance data
  const monthlyRevenue = [
    { month: 'Mai', value: 28400, count: 180 },
    { month: 'Jun', value: 31200, count: 195 },
    { month: 'Jul', value: 33800, count: 210 },
    { month: 'Ago', value: 36500, count: 228 },
    { month: 'Set (Atual)', value: 39100, count: 245 },
  ];

  const maxMonthly = Math.max(...monthlyRevenue.map((m) => m.value));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Header & Period Selector */}
      <div className="app-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-sm font-bold text-slate-900">
            Relatórios e Indicadores Estratégicos
          </h2>
          <p className="text-xs text-slate-500">
            Análise consolidada de desempenho, ocupação e retenção
          </p>
        </div>

        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg border border-slate-200/60">
          <button
            type="button"
            onClick={() => setPeriod('30')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              period === '30' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Últimos 30 dias
          </button>
          <button
            type="button"
            onClick={() => setPeriod('90')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              period === '90' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Trimestre
          </button>
          <button
            type="button"
            onClick={() => setPeriod('365')}
            className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors ${
              period === '365' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600'
            }`}
          >
            Ano Atual
          </button>
        </div>
      </div>

      {/* Overview Metric Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="app-card">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
            Faturamento Médio Mensal
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            R$ 33.800
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            +14.2% em relação ao período anterior
          </span>
        </div>

        <div className="app-card">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
            Taxa de Ocupação Média
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            81.4%
          </div>
          <span className="text-xs text-slate-500 mt-1 block">
            Pico nas quintas e sextas
          </span>
        </div>

        <div className="app-card">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
            Taxa de Retenção
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            73%
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            Clientes recorrentes ativos
          </span>
        </div>

        <div className="app-card">
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wider block">
            Cancelamentos & No-show
          </span>
          <div className="mt-2 text-2xl font-bold text-slate-900 tabular-nums">
            3.8%
          </div>
          <span className="text-xs text-emerald-600 font-semibold mt-1 block">
            Abaixo do limite de alerta (5%)
          </span>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Growth Chart */}
        <div className="app-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              <span>Evolução do Faturamento Mensal</span>
            </h3>
            <span className="text-xs font-bold text-slate-700 tabular-nums">
              Meta: R$ 40k
            </span>
          </div>

          <div className="pt-6">
            <div className="flex items-end justify-between gap-3 h-44">
              {monthlyRevenue.map((item) => {
                const heightPercent = (item.value / maxMonthly) * 100;
                return (
                  <div key={item.month} className="flex-1 flex flex-col items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-700 tabular-nums font-mono">
                      {formatCurrency(item.value)}
                    </span>
                    <div className="w-full bg-slate-100 rounded-t-lg relative flex items-end h-32">
                      <div
                        className="w-full rounded-t-lg transition-all duration-500"
                        style={{
                          height: `${heightPercent}%`,
                          backgroundColor: config.colors.primary,
                        }}
                      />
                    </div>
                    <span className="text-xs font-medium text-slate-600">
                      {item.month}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Services Breakdown */}
        <div className="app-card">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-indigo-600" />
              <span>
                {config.id === 'clinica'
                  ? 'Especialidades com maior demanda'
                  : 'Ranking de Serviços Mais Realizados'}
              </span>
            </h3>
            <span className="text-xs text-slate-500">Volume (%)</span>
          </div>

          <div className="pt-4 space-y-3.5">
            {topServices.map((svc, idx) => (
              <div key={svc.name} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-slate-800 flex items-center gap-2">
                    <span className="text-slate-400 font-mono text-[10px]">
                      0{idx + 1}.
                    </span>
                    {svc.name}
                  </span>
                  <span className="font-bold text-slate-900 tabular-nums">
                    {svc.count} {terminology.attendances?.toLowerCase() || 'atendimentos'} ({svc.percentage}%)
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${svc.percentage}%`,
                      backgroundColor: config.colors.primary,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Professionals Leaderboard (if enabled) */}
        {features.professionals !== false && (
          <div className="app-card lg:col-span-2">
            <h3 className="text-xs font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
              <Users className="w-4 h-4 text-indigo-600" />
              <span>Desempenho por {terminology.professional || 'Profissional'}</span>
            </h3>

            <div className="overflow-x-auto pt-2">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-semibold">
                  <tr>
                    <th className="py-2.5 px-3">{terminology.professional || 'Profissional'}</th>
                    <th className="py-2.5 px-3">Especialidade</th>
                    <th className="py-2.5 px-3 text-center">{terminology.attendances || 'Atendimentos'}</th>
                    <th className="py-2.5 px-3 text-right">Faturamento</th>
                    <th className="py-2.5 px-3 text-center">Avaliação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {professionals.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50">
                      <td className="py-3 px-3 font-bold text-slate-900">{p.name}</td>
                      <td className="py-3 px-3 text-slate-600">{p.role}</td>
                      <td className="py-3 px-3 text-center font-semibold tabular-nums">
                        {p.appointmentsCount}
                      </td>
                      <td className="py-3 px-3 text-right font-bold tabular-nums text-slate-900">
                        {formatCurrency(p.revenueGenerated)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        <span className="font-bold text-amber-600 tabular-nums">
                          ★ {p.rating.toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

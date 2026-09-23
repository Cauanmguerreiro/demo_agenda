import React, { useState } from 'react';
import { DemoConfig } from '../config/defaultConfig';
import { FinancialRecord } from '../types';
import { StatCard } from '../components/StatCard';
import { formatCurrency } from '../utils/formatters';
import { DollarSign, TrendingUp, CreditCard, Clock, Filter, ArrowDownToLine } from 'lucide-react';

interface FinancialProps {
  config: DemoConfig;
  records: FinancialRecord[];
}

export const Financial: React.FC<FinancialProps> = ({ config, records }) => {
  const { terminology } = config;
  const [methodFilter, setMethodFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const totalRevenue = records
    .filter((r) => r.status === 'concluido')
    .reduce((acc, r) => acc + r.amount, 0);

  const pendingRevenue = records
    .filter((r) => r.status === 'pendente')
    .reduce((acc, r) => acc + r.amount, 0);

  const averageTicket =
    records.length > 0 ? Math.round(totalRevenue / (records.filter((r) => r.status === 'concluido').length || 1)) : 0;

  const filteredRecords = records.filter((r) => {
    const matchesMethod = methodFilter === 'all' || r.paymentMethod === methodFilter;
    const matchesStatus = statusFilter === 'all' || r.status === statusFilter;
    return matchesMethod && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-fade-in">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Faturamento Realizado"
          value={formatCurrency(totalRevenue)}
          delta="+18% vs mês anterior"
          icon={<DollarSign className="w-4 h-4" />}
        />
        <StatCard
          title="Recebimentos Pendentes"
          value={formatCurrency(pendingRevenue)}
          subtitle="Aguardando liquidação"
          isPositive={false}
          icon={<Clock className="w-4 h-4" />}
        />
        <StatCard
          title="Ticket Médio"
          value={formatCurrency(averageTicket)}
          delta="+6.4% crescimento"
          icon={<TrendingUp className="w-4 h-4" />}
        />
        <StatCard
          title="Total de Lançamentos"
          value={records.length}
          subtitle="Neste período"
          icon={<CreditCard className="w-4 h-4" />}
        />
      </div>

      {/* Filter Toolbar */}
      <div className="app-card flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-400" />
          <h3 className="text-xs font-bold text-slate-900">Extrato de Movimentações</h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <select
            value={methodFilter}
            onChange={(e) => setMethodFilter(e.target.value)}
            className="app-select py-1 px-2.5 text-xs w-auto"
          >
            <option value="all">Todas as formas de pagamento</option>
            <option value="PIX">PIX</option>
            <option value="Cartão de Crédito">Cartão de Crédito</option>
            <option value="Cartão de Débito">Cartão de Débito</option>
            <option value="Dinheiro">Dinheiro</option>
            <option value="Transferência">Transferência</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="app-select py-1 px-2.5 text-xs w-auto"
          >
            <option value="all">Todos os status</option>
            <option value="concluido">Concluídos</option>
            <option value="pendente">Pendentes</option>
          </select>
        </div>
      </div>

      {/* Financial Records Ledger */}
      <div className="app-card p-0 overflow-hidden">
        {/* Mobile View (< md) */}
        <div className="md:hidden divide-y divide-slate-100">
          {filteredRecords.map((r) => (
            <div key={r.id} className="p-4 space-y-2">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <h4 className="text-xs font-bold text-slate-900">{r.clientName}</h4>
                  <p className="text-[11px] text-slate-500 mt-0.5">{r.serviceName}</p>
                </div>
                <span
                  className={`inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-semibold rounded-full ${
                    r.status === 'concluido'
                      ? 'bg-emerald-50 text-emerald-700'
                      : 'bg-amber-50 text-amber-700'
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      r.status === 'concluido' ? 'bg-emerald-600' : 'bg-amber-600'
                    }`}
                  />
                  {r.status === 'concluido' ? 'Liquidado' : 'Pendente'}
                </span>
              </div>

              <div className="flex items-center justify-between text-xs pt-1.5 border-t border-slate-50 text-slate-500">
                <span className="text-[11px]">
                  {r.date} · {r.paymentMethod}
                </span>
                <span className="font-bold text-slate-900 tabular-nums">
                  {formatCurrency(r.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table (>= md) */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Data & Horário</th>
                <th className="py-3 px-4">{terminology.customer || 'Cliente'}</th>
                <th className="py-3 px-4">{terminology.service || 'Serviço'}</th>
                <th className="py-3 px-4">{terminology.professional || 'Profissional'}</th>
                <th className="py-3 px-4">Forma de Pagamento</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRecords.map((r) => (
                <tr key={r.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 whitespace-nowrap text-slate-500 font-medium">
                    {r.date}
                  </td>
                  <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                    {r.clientName}
                  </td>
                  <td className="py-3 px-4 text-slate-700">{r.serviceName}</td>
                  <td className="py-3 px-4 text-slate-500 whitespace-nowrap">
                    {r.professionalName}
                  </td>
                  <td className="py-3 px-4 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-medium text-[11px]">
                      {r.paymentMethod}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums whitespace-nowrap">
                    {formatCurrency(r.amount)}
                  </td>
                  <td className="py-3 px-4 text-center whitespace-nowrap">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-semibold rounded-full ${
                        r.status === 'concluido'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-amber-50 text-amber-700'
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          r.status === 'concluido' ? 'bg-emerald-600' : 'bg-amber-600'
                        }`}
                      />
                      {r.status === 'concluido' ? 'Liquidado' : 'Pendente'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

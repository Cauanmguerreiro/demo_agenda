import React, { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  delta?: string;
  isPositive?: boolean;
  icon?: ReactNode;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  delta,
  isPositive = true,
  icon,
}) => {
  return (
    <div className="app-card flex flex-col justify-between transition-all hover:border-slate-300">
      <div className="flex items-start justify-between">
        <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
          {title}
        </span>
        {icon && (
          <div className="p-2 rounded-lg bg-slate-100 text-slate-600">
            {icon}
          </div>
        )}
      </div>

      <div className="mt-3">
        <div className="text-2xl lg:text-3xl font-bold tracking-tight text-slate-900 tabular-nums">
          {value}
        </div>
        {(delta || subtitle) && (
          <div className="mt-1 flex items-center gap-1.5 text-xs">
            {delta && (
              <span
                className={`font-semibold ${
                  isPositive ? 'text-emerald-600' : 'text-amber-600'
                }`}
              >
                {delta}
              </span>
            )}
            {subtitle && <span className="text-slate-500">{subtitle}</span>}
          </div>
        )}
      </div>
    </div>
  );
};

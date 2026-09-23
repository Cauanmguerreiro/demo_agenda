import React from 'react';
import { AppointmentStatus } from '../types';

interface StatusBadgeProps {
  status: AppointmentStatus | string;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const normalized = status.toLowerCase();

  let dotColor = '#16A34A'; // green
  let textColor = '#15803D';
  let bgColor = '#F0FDF4';
  let label = 'Confirmado';

  if (normalized === 'pendente') {
    dotColor = '#D97706'; // amber
    textColor = '#B45309';
    bgColor = '#FFFBEB';
    label = 'Pendente';
  } else if (normalized === 'finalizado') {
    dotColor = '#2563EB'; // blue
    textColor = '#1D4ED8';
    bgColor = '#EFF6FF';
    label = 'Finalizado';
  } else if (normalized === 'cancelado') {
    dotColor = '#DC2626'; // red
    textColor = '#B91C1C';
    bgColor = '#FEF2F2';
    label = 'Cancelado';
  } else {
    label = status;
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 text-xs font-medium rounded-full ${className}`}
      style={{ backgroundColor: bgColor, color: textColor }}
    >
      <span
        className="w-1.5 h-1.5 rounded-full shrink-0"
        style={{ backgroundColor: dotColor }}
        aria-hidden="true"
      />
      <span>{label}</span>
    </span>
  );
};

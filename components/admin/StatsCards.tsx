import React from 'react';
import { Users, Clock, CheckCircle2, XCircle, Send, AlertCircle } from 'lucide-react';

interface StatsProps {
  stats: {
    total: number;
    pending: number;
    accepted: number;
    rejected: number;
    emailsSent: number;
    emailsPending: number;
  };
  onFilterChange?: (status: string, emailStatus?: string) => void;
  activeStatus?: string;
  activeEmailStatus?: string;
}

export const StatsCards: React.FC<StatsProps> = ({
  stats,
  onFilterChange,
  activeStatus = 'ALL',
  activeEmailStatus = 'ALL',
}) => {
  const cards = [
    {
      id: 'total',
      title: 'إجمالي الطلبات',
      value: stats.total,
      icon: <Users className="w-5 h-5 text-slate-700" />,
      bg: 'bg-slate-50 border-slate-200',
      active: activeStatus === 'ALL' && activeEmailStatus === 'ALL',
      onClick: () => onFilterChange && onFilterChange('ALL', 'ALL'),
    },
    {
      id: 'pending',
      title: 'قيد المراجعة',
      value: stats.pending,
      icon: <Clock className="w-5 h-5 text-amber-600" />,
      bg: 'bg-amber-50/60 border-amber-200 text-amber-900',
      active: activeStatus === 'PENDING',
      onClick: () => onFilterChange && onFilterChange('PENDING', 'ALL'),
    },
    {
      id: 'accepted',
      title: 'تم قبولهم',
      value: stats.accepted,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-600" />,
      bg: 'bg-emerald-50/60 border-emerald-200 text-emerald-900',
      active: activeStatus === 'ACCEPTED' && activeEmailStatus === 'ALL',
      onClick: () => onFilterChange && onFilterChange('ACCEPTED', 'ALL'),
    },
    {
      id: 'rejected',
      title: 'مرفوضون',
      value: stats.rejected,
      icon: <XCircle className="w-5 h-5 text-rose-600" />,
      bg: 'bg-rose-50/60 border-rose-200 text-rose-900',
      active: activeStatus === 'REJECTED',
      onClick: () => onFilterChange && onFilterChange('REJECTED', 'ALL'),
    },
    {
      id: 'emails-sent',
      title: 'إيميلات مرسلة',
      value: stats.emailsSent,
      icon: <Send className="w-5 h-5 text-blue-600" />,
      bg: 'bg-blue-50/60 border-blue-200 text-blue-900',
      active: activeEmailStatus === 'SENT',
      onClick: () => onFilterChange && onFilterChange('ALL', 'SENT'),
    },
    {
      id: 'emails-pending',
      title: 'إيميلات بانتظار الإرسال',
      value: stats.emailsPending,
      icon: <AlertCircle className="w-5 h-5 text-indigo-600" />,
      bg: 'bg-indigo-50/60 border-indigo-200 text-indigo-900',
      active: activeEmailStatus === 'PENDING',
      onClick: () => onFilterChange && onFilterChange('ALL', 'PENDING'),
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={card.onClick}
          className={`rounded-2xl p-4 border transition-all duration-200 cursor-pointer shadow-sm ${
            card.bg
          } ${
            card.active
              ? 'ring-2 ring-kemix-blue ring-offset-2 scale-[1.02] shadow-md'
              : 'hover:scale-[1.01] hover:shadow-md'
          }`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-600 truncate">{card.title}</span>
            <div className="p-1.5 rounded-lg bg-white/80 shadow-xs">{card.icon}</div>
          </div>
          <div className="text-2xl font-black text-slate-900">{card.value}</div>
        </div>
      ))}
    </div>
  );
};

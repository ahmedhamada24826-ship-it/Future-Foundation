import React from 'react';

interface BadgeProps {
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED' | string;
  className?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<BadgeProps> = ({ status, className = '', size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'px-2.5 py-0.5 text-xs' : 'px-3 py-1 text-xs font-semibold';

  switch (status) {
    case 'ACCEPTED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          تم القبول (Accepted)
        </span>
      );
    case 'REJECTED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 text-rose-700 ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
          مرفوض (Rejected)
        </span>
      );
    case 'PENDING':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 rounded-full bg-amber-50 border border-amber-200 text-amber-700 ${sizeClasses} ${className}`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          قيد المراجعة (Pending)
        </span>
      );
  }
};

interface EmailStatusBadgeProps {
  emailSentAt: Date | string | null;
  emailLastError?: string | null;
  status: string;
}

export const EmailStatusBadge: React.FC<EmailStatusBadgeProps> = ({
  emailSentAt,
  emailLastError,
  status,
}) => {
  if (emailSentAt) {
    const isMock = emailLastError && emailLastError.includes('[DEV-MOCK]');
    return (
      <span
        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
          isMock
            ? 'bg-purple-50 border border-purple-200 text-purple-700'
            : 'bg-blue-50 border border-blue-200 text-blue-700'
        }`}
      >
        <svg className="w-3 h-3 text-current" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
        {isMock ? 'محاكاة (Mock)' : 'تم الإرسال'}
      </span>
    );
  }

  if (emailLastError) {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-red-50 border border-red-200 px-2.5 py-0.5 text-xs font-medium text-red-600">
        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
        فشل الإرسال
      </span>
    );
  }

  if (status === 'ACCEPTED') {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-yellow-50 border border-yellow-200 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
        <span className="w-1.5 h-1.5 rounded-full bg-yellow-500 animate-pulse" />
        بانتظار الإرسال
      </span>
    );
  }

  return <span className="text-xs text-slate-400">—</span>;
};

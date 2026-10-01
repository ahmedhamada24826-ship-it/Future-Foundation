'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { StatusBadge, EmailStatusBadge } from '@/components/ui/Badge';
import {
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  Eye,
  CheckCircle2,
  XCircle,
  Mail,
  Trash2,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
  RefreshCw,
  Phone,
  Calendar,
  Layers,
} from 'lucide-react';

interface Applicant {
  id: string;
  applicationId: string;
  fullName: string;
  email: string;
  phone: string;
  governorate: string;
  age: number;
  educationLevel: string;
  occupation: string;
  status: string;
  registeredAt: string;
  acceptedAt: string | null;
  emailSentAt: string | null;
  emailSendAttempts: number;
  emailLastError: string | null;
}

interface ApplicationsTableProps {
  applicants: Applicant[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (p: number) => void;
  search: string;
  onSearchChange: (s: string) => void;
  statusFilter: string;
  onStatusFilterChange: (s: string) => void;
  emailStatusFilter: string;
  onEmailStatusFilterChange: (s: string) => void;
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (col: string) => void;
  onStatusUpdate: (id: string, newStatus: string) => Promise<void>;
  onSendEmail: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  isLoading: boolean;
  onRefresh: () => void;
}

export const ApplicationsTable: React.FC<ApplicationsTableProps> = ({
  applicants,
  total,
  page,
  totalPages,
  onPageChange,
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  emailStatusFilter,
  onEmailStatusFilterChange,
  sortBy,
  sortOrder,
  onSortChange,
  onStatusUpdate,
  onSendEmail,
  onDelete,
  isLoading,
  onRefresh,
}) => {
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const handleAction = async (id: string, action: () => Promise<void>) => {
    setActionLoadingId(id);
    try {
      await action();
    } finally {
      setActionLoadingId(null);
    }
  };

  const getExportUrl = (format: 'xlsx' | 'csv') => {
    const params = new URLSearchParams();
    params.set('format', format);
    if (search) params.set('search', search);
    if (statusFilter !== 'ALL') params.set('status', statusFilter);
    if (emailStatusFilter !== 'ALL') params.set('emailStatus', emailStatusFilter);
    return `/api/applications/export?${params.toString()}`;
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      
      {/* Top Controls Toolbar */}
      <div className="p-5 border-b border-slate-200/90 bg-slate-50/50 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="بحث بالاسم، الإيميل، الهاتف، رقم الطلب، أو المحافظة..."
            className="w-full pr-10 pl-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
        </div>

        {/* Filters and Exports */}
        <div className="flex flex-wrap items-center gap-2.5">
          
          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
            className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemix-blue/20"
          >
            <option value="ALL">جميع الحالات</option>
            <option value="PENDING">قيد المراجعة (Pending)</option>
            <option value="ACCEPTED">تم القبول (Accepted)</option>
            <option value="REJECTED">مرفوض (Rejected)</option>
          </select>

          {/* Email Status Filter */}
          <select
            value={emailStatusFilter}
            onChange={(e) => onEmailStatusFilterChange(e.target.value)}
            className="bg-white border border-slate-200 text-xs font-semibold text-slate-700 px-3 py-2.5 rounded-xl focus:outline-none focus:ring-2 focus:ring-kemix-blue/20"
          >
            <option value="ALL">جميع حالات البريد</option>
            <option value="SENT">تم إرسال الإيميل</option>
            <option value="PENDING">مقبول وبانتظار الإرسال</option>
            <option value="FAILED">فشل في الإرسال</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-kemix-blue hover:border-kemix-blue transition-colors shadow-xs"
            title="تحديث البيانات"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          {/* Export Excel Button */}
          <a
            href={getExportUrl('xlsx')}
            download
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>تصدير Excel</span>
          </a>

          {/* Export CSV Button */}
          <a
            href={getExportUrl('csv')}
            download
            className="bg-slate-700 hover:bg-slate-800 text-white text-xs font-bold px-3 py-2.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
          >
            <FileText className="w-4 h-4" />
            <span>CSV</span>
          </a>

        </div>

      </div>

      {/* Desktop Table View */}
      <div className="overflow-x-auto hidden md:block">
        <table className="w-full text-right text-xs">
          <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
            <tr>
              <th className="py-3.5 px-4">رقم الطلب</th>
              <th className="py-3.5 px-4">الاسم وبيانات الاتصال</th>
              <th className="py-3.5 px-4">المحافظة والسن</th>
              <th className="py-3.5 px-4 cursor-pointer hover:text-kemix-blue" onClick={() => onSortChange('registeredAt')}>
                <div className="flex items-center gap-1">
                  <span>تاريخ التسجيل</span>
                  <ArrowUpDown className="w-3 h-3" />
                </div>
              </th>
              <th className="py-3.5 px-4">حالة الطلب</th>
              <th className="py-3.5 px-4">حالة البريد</th>
              <th className="py-3.5 px-4 text-center">الإجراءات</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {applicants.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  لا توجد طلبات تطابق معايير البحث الحالية.
                </td>
              </tr>
            ) : (
              applicants.map((app) => (
                <tr key={app.id} className="hover:bg-blue-50/30 transition-colors">
                  
                  {/* Application ID */}
                  <td className="py-3.5 px-4 font-mono font-bold text-kemix-navy" dir="ltr">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="hover:underline hover:text-kemix-blue"
                    >
                      {app.applicationId}
                    </Link>
                  </td>

                  {/* Name & Contact */}
                  <td className="py-3.5 px-4">
                    <Link
                      href={`/admin/applications/${app.id}`}
                      className="font-bold text-slate-900 hover:text-kemix-blue block text-sm"
                    >
                      {app.fullName}
                    </Link>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-0.5" dir="ltr">
                      <span>{app.email}</span>
                      <span>•</span>
                      <span>{app.phone}</span>
                    </div>
                  </td>

                  {/* Gov & Age */}
                  <td className="py-3.5 px-4 text-slate-700">
                    <div>{app.governorate}</div>
                    <div className="text-[11px] text-slate-400">{app.age} سنة • {app.occupation}</div>
                  </td>

                  {/* Registration Date */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{new Date(app.registeredAt).toLocaleDateString('ar-EG')}</div>
                    <div className="text-[10px] text-slate-400 font-mono" dir="ltr">
                      {new Date(app.registeredAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4">
                    <StatusBadge status={app.status} size="sm" />
                    {app.acceptedAt && (
                      <div className="text-[10px] text-emerald-600 mt-0.5">
                        قبل في: {new Date(app.acceptedAt).toLocaleDateString('ar-EG')}
                      </div>
                    )}
                  </td>

                  {/* Email Status */}
                  <td className="py-3.5 px-4">
                    <EmailStatusBadge
                      emailSentAt={app.emailSentAt}
                      emailLastError={app.emailLastError}
                      status={app.status}
                    />
                    {app.emailSendAttempts > 0 && (
                      <div className="text-[10px] text-slate-400 mt-0.5">
                        المحاولات: {app.emailSendAttempts}
                      </div>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="py-3.5 px-4 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      
                      {/* View Button */}
                      <Link
                        href={`/admin/applications/${app.id}`}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-kemix-blue hover:text-white text-slate-600 transition-colors"
                        title="عرض التفاصيل الكاملة"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </Link>

                      {/* Accept Button */}
                      {app.status !== 'ACCEPTED' && (
                        <button
                          disabled={actionLoadingId === app.id}
                          onClick={() => handleAction(app.id, () => onStatusUpdate(app.id, 'ACCEPTED'))}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-600 hover:text-white text-emerald-600 border border-emerald-200 transition-colors"
                          title="قبول الطلب"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Reject Button */}
                      {app.status !== 'REJECTED' && (
                        <button
                          disabled={actionLoadingId === app.id}
                          onClick={() => handleAction(app.id, () => onStatusUpdate(app.id, 'REJECTED'))}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 border border-rose-200 transition-colors"
                          title="رفض الطلب"
                        >
                          <XCircle className="w-3.5 h-3.5" />
                        </button>
                      )}

                      {/* Send / Resend Email Button */}
                      <button
                        disabled={actionLoadingId === app.id}
                        onClick={() => handleAction(app.id, () => onSendEmail(app.id))}
                        className={`p-1.5 rounded-lg border transition-colors ${
                          app.emailSentAt
                            ? 'bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border-blue-200'
                            : 'bg-indigo-50 text-indigo-600 hover:bg-indigo-600 hover:text-white border-indigo-200'
                        }`}
                        title={app.emailSentAt ? 'إعادة إرسال بريد القبول' : 'إرسال بريد القبول الآن'}
                      >
                        <Mail className="w-3.5 h-3.5" />
                      </button>

                      {/* Delete Button */}
                      <button
                        disabled={actionLoadingId === app.id}
                        onClick={() => {
                          if (confirm(`هل أنت متأكد من حذف طلب ${app.fullName}؟`)) {
                            handleAction(app.id, () => onDelete(app.id));
                          }
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-red-600 hover:text-white text-slate-400 transition-colors"
                        title="حذف الطلب"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>

                    </div>
                  </td>

                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Card List View */}
      <div className="block md:hidden divide-y divide-slate-100">
        {applicants.map((app) => (
          <div key={app.id} className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-mono font-bold text-xs text-kemix-navy bg-slate-100 px-2 py-0.5 rounded" dir="ltr">
                {app.applicationId}
              </span>
              <StatusBadge status={app.status} size="sm" />
            </div>

            <div>
              <Link href={`/admin/applications/${app.id}`} className="font-bold text-slate-900 text-sm">
                {app.fullName}
              </Link>
              <div className="text-xs text-slate-500" dir="ltr">{app.email}</div>
              <div className="text-xs text-slate-500" dir="ltr">{app.phone}</div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>{app.governorate} • {app.age} سنة</span>
              <EmailStatusBadge emailSentAt={app.emailSentAt} emailLastError={app.emailLastError} status={app.status} />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <Link
                href={`/admin/applications/${app.id}`}
                className="text-xs font-semibold bg-slate-100 px-3 py-1.5 rounded-lg text-slate-700"
              >
                التفاصيل
              </Link>
              {app.status !== 'ACCEPTED' && (
                <button
                  onClick={() => handleAction(app.id, () => onStatusUpdate(app.id, 'ACCEPTED'))}
                  className="text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 px-3 py-1.5 rounded-lg"
                >
                  قبول
                </button>
              )}
              <button
                onClick={() => handleAction(app.id, () => onSendEmail(app.id))}
                className="text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-lg"
              >
                إرسال الإيميل
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Footer */}
      <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div>
          عرض <strong>{applicants.length}</strong> من إجمالي <strong>{total}</strong> طلب
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
          <span className="px-3 py-1 bg-white border border-slate-200 rounded-lg font-bold text-slate-700">
            {page} / {totalPages || 1}
          </span>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="p-2 rounded-lg bg-white border border-slate-200 text-slate-700 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-100"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
};

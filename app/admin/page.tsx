'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';
import { StatsCards } from '@/components/admin/StatsCards';
import { ApplicationsTable } from '@/components/admin/ApplicationsTable';
import { AutomationTriggerModal } from '@/components/admin/AutomationTriggerModal';
import { Sparkles, CheckCircle, AlertCircle, Zap } from 'lucide-react';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    accepted: 0,
    rejected: 0,
    emailsSent: 0,
    emailsPending: 0,
  });

  const [applicants, setApplicants] = useState<any[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [emailStatusFilter, setEmailStatusFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('registeredAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
  const [isAutomationModalOpen, setIsAutomationModalOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchApplicants = useCallback(async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams();
      params.set('page', String(page));
      params.set('limit', '15');
      if (search.trim()) params.set('search', search.trim());
      if (statusFilter !== 'ALL') params.set('status', statusFilter);
      if (emailStatusFilter !== 'ALL') params.set('emailStatus', emailStatusFilter);
      params.set('sortBy', sortBy);
      params.set('sortOrder', sortOrder);

      const res = await fetch(`/api/applications?${params.toString()}`);
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }

      const data = await res.json();
      if (data.success) {
        setApplicants(data.data.applicants);
        setTotal(data.data.pagination.total);
        setTotalPages(data.data.pagination.totalPages);
        setStats(data.data.stats);
      }
    } catch (err) {
      console.error('Fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  }, [page, search, statusFilter, emailStatusFilter, sortBy, sortOrder, router]);

  useEffect(() => {
    fetchApplicants();
  }, [fetchApplicants]);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'تم تحديث الحالة بنجاح');
        fetchApplicants();
      } else {
        showToast(data.message || 'فشل التحديث', 'error');
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error');
    }
  };

  const handleSendEmail = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}/email`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('تم إرسال بريد القبول بنجاح');
        fetchApplicants();
      } else {
        showToast(data.message || 'فشل إرسال البريد', 'error');
      }
    } catch (e) {
      showToast('خطأ في إرسال البريد', 'error');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('تم حذف الطلب بنجاح');
        fetchApplicants();
      } else {
        showToast(data.message || 'فشل الحذف', 'error');
      }
    } catch (e) {
      showToast('خطأ في الحذف', 'error');
    }
  };

  const handleSortChange = (col: string) => {
    if (sortBy === col) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(col);
      setSortOrder('desc');
    }
  };

  const handleFilterChangeFromStats = (status: string, emailStatus: string = 'ALL') => {
    setStatusFilter(status);
    setEmailStatusFilter(emailStatus);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <AdminNav onRunAutomation={() => setIsAutomationModalOpen(true)} />

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 left-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold text-white transition-all animate-in slide-in-from-bottom-5 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      {/* Main Admin Dashboard Content */}
      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Page Top Banner */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-kemix-blue mb-1">
              <Sparkles className="w-4 h-4" />
              <span>مبادرة Future Foundation • Kemix Acadmey</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-kemix-navy">
              إدارة طلبات المتقدمين
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              متابعة التسجيلات الجديدة، معالجة حالات القبول، إرسال خطابات التهنئة، وتصدير التقارير.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsAutomationModalOpen(true)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold px-4 py-3 rounded-2xl shadow-md shadow-emerald-600/20 flex items-center gap-2 transition-transform active:scale-95"
            >
              <Zap className="w-4 h-4" />
              <span>أتمتة القبول الفوري</span>
            </button>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsCards
          stats={stats}
          onFilterChange={handleFilterChangeFromStats}
          activeStatus={statusFilter}
          activeEmailStatus={emailStatusFilter}
        />

        {/* Applications Table */}
        <ApplicationsTable
          applicants={applicants}
          total={total}
          page={page}
          totalPages={totalPages}
          onPageChange={(p) => setPage(p)}
          search={search}
          onSearchChange={(s) => {
            setSearch(s);
            setPage(1);
          }}
          statusFilter={statusFilter}
          onStatusFilterChange={(st) => {
            setStatusFilter(st);
            setPage(1);
          }}
          emailStatusFilter={emailStatusFilter}
          onEmailStatusFilterChange={(em) => {
            setEmailStatusFilter(em);
            setPage(1);
          }}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
          onStatusUpdate={handleStatusUpdate}
          onSendEmail={handleSendEmail}
          onDelete={handleDelete}
          isLoading={isLoading}
          onRefresh={fetchApplicants}
        />

      </main>

      {/* Automation Trigger Modal */}
      <AutomationTriggerModal
        isOpen={isAutomationModalOpen}
        onClose={() => setIsAutomationModalOpen(false)}
        onSuccess={fetchApplicants}
      />
    </div>
  );
}

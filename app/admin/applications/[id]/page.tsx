'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { AdminNav } from '@/components/admin/AdminNav';
import { StatusBadge, EmailStatusBadge } from '@/components/ui/Badge';
import { generateLinkedInShareUrl } from '@/lib/linkedin/share';
import {
  ArrowRight,
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  GraduationCap,
  Briefcase,
  Layers,
  HeartHandshake,
  Linkedin,
  CheckCircle2,
  XCircle,
  Clock,
  Send,
  Trash2,
  ExternalLink,
  Share2,
  Copy,
  Check,
  AlertCircle,
  FileCheck,
} from 'lucide-react';

export default function ApplicantDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [applicant, setApplicant] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchApplicant = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/applications/${id}`);
      if (res.status === 401) {
        router.push('/admin/login');
        return;
      }
      const data = await res.json();
      if (data.success) {
        setApplicant(data.data);
      } else {
        showToast(data.message || 'المتقدم غير موجود', 'error');
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchApplicant();
  }, [id]);

  const handleUpdateStatus = async (newStatus: string) => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (res.ok) {
        showToast(data.message || 'تم تحديث الحالة بنجاح');
        fetchApplicant();
      } else {
        showToast(data.message || 'فشل التحديث', 'error');
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleSendEmail = async () => {
    setActionLoading(true);
    try {
      const res = await fetch(`/api/applications/${id}/email`, {
        method: 'POST',
      });
      const data = await res.json();
      if (res.ok) {
        showToast('تم إرسال بريد القبول الرسمي بنجاح');
        fetchApplicant();
      } else {
        showToast(data.message || 'فشل إرسال البريد', 'error');
      }
    } catch (e) {
      showToast('خطأ في إرسال البريد', 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('هل أنت متأكد من رغبتك في حذف هذا الطلب نهائياً؟')) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/applications/${id}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (res.ok) {
        router.push('/admin');
      } else {
        showToast(data.message || 'فشل حذف الطلب', 'error');
        setActionLoading(false);
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error');
      setActionLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <AdminNav />
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="text-slate-500 text-sm">جاري تحميل بيانات المتقدم...</div>
        </div>
      </div>
    );
  }

  if (!applicant) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <AdminNav />
        <div className="flex-1 flex items-center justify-center p-8 text-center">
          <div>
            <h2 className="text-xl font-bold text-slate-800 mb-2">المتقدم غير موجود</h2>
            <Link href="/admin" className="text-kemix-blue hover:underline text-sm font-semibold">
              ← العودة لجدول المتقدمين
            </Link>
          </div>
        </div>
      </div>
    );
  }

  let parsedInterests: string[] = [];
  try {
    const p = JSON.parse(applicant.interests);
    parsedInterests = Array.isArray(p) ? p : [applicant.interests];
  } catch (e) {
    parsedInterests = [applicant.interests];
  }

  const { shareUrl, postText } = generateLinkedInShareUrl({
    fullName: applicant.fullName,
    applicationId: applicant.applicationId,
  });

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans">
      <AdminNav />

      {/* Toast Alert */}
      {toast && (
        <div
          className={`fixed bottom-6 left-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 text-sm font-bold text-white transition-all animate-in slide-in-from-bottom-5 ${
            toast.type === 'success' ? 'bg-emerald-600' : 'bg-red-600'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
          <span>{toast.message}</span>
        </div>
      )}

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Top Header & Breadcrumb */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link
              href="/admin"
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:text-kemix-blue hover:border-kemix-blue transition-colors shadow-xs"
              title="العودة للجدول"
            >
              <ArrowRight className="w-5 h-5" />
            </Link>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs font-bold text-kemix-navy bg-blue-50 border border-blue-100 px-2.5 py-0.5 rounded-md" dir="ltr">
                  {applicant.applicationId}
                </span>
                <StatusBadge status={applicant.status} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 mt-1">
                {applicant.fullName}
              </h1>
            </div>
          </div>

          {/* Top Quick Actions */}
          <div className="flex flex-wrap items-center gap-2.5">
            {applicant.status !== 'ACCEPTED' && (
              <button
                disabled={actionLoading}
                onClick={() => handleUpdateStatus('ACCEPTED')}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>قبول الطلب</span>
              </button>
            )}

            {applicant.status !== 'REJECTED' && (
              <button
                disabled={actionLoading}
                onClick={() => handleUpdateStatus('REJECTED')}
                className="bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
              >
                <XCircle className="w-4 h-4" />
                <span>رفض الطلب</span>
              </button>
            )}

            <button
              disabled={actionLoading}
              onClick={handleSendEmail}
              className="bg-kemix-blue hover:bg-blue-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Send className="w-4 h-4" />
              <span>{applicant.emailSentAt ? 'إعادة إرسال الإيميل' : 'إرسال بريد القبول'}</span>
            </button>

            <button
              disabled={actionLoading}
              onClick={handleDelete}
              className="p-2.5 bg-slate-100 hover:bg-red-50 text-slate-500 hover:text-red-600 rounded-xl transition-colors"
              title="حذف الطلب"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 2-Column Grid Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left / Main Details (2 Cols) */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* 1. Personal & Contact Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              <h3 className="text-base font-extrabold text-kemix-navy pb-3 border-b border-slate-100 mb-5 flex items-center gap-2">
                <User className="w-5 h-5 text-kemix-blue" />
                <span>البيانات الشخصية وبيانات الاتصال</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">الاسم الكامل</span>
                  <span className="font-bold text-slate-800 text-base">{applicant.fullName}</span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">البريد الإلكتروني</span>
                  <a
                    href={`mailto:${applicant.email}`}
                    dir="ltr"
                    className="text-kemix-blue font-semibold hover:underline block text-left"
                  >
                    {applicant.email}
                  </a>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">رقم الهاتف / واتساب</span>
                  <a
                    href={`https://wa.me/${applicant.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    dir="ltr"
                    className="text-slate-800 font-semibold hover:text-kemix-blue block text-left"
                  >
                    {applicant.phone}
                  </a>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">المحافظة / محل الإقامة</span>
                  <span className="font-semibold text-slate-800">{applicant.governorate}</span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">العمر</span>
                  <span className="font-semibold text-slate-800">{applicant.age} عاماً</span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">مصدر المعرفة بالمبادرة</span>
                  <span className="font-semibold text-slate-800">{applicant.referralSource}</span>
                </div>
              </div>
            </div>

            {/* 2. Education & Occupation */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              <h3 className="text-base font-extrabold text-kemix-navy pb-3 border-b border-slate-100 mb-5 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-kemix-blue" />
                <span>التعليم والمسار المهني</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm mb-6">
                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">المستوى التعليمي</span>
                  <span className="font-semibold text-slate-800">{applicant.educationLevel}</span>
                </div>

                <div>
                  <span className="text-xs font-bold text-slate-400 block mb-1">الوظيفة / الحالة المهنية</span>
                  <span className="font-semibold text-slate-800">{applicant.occupation}</span>
                </div>
              </div>

              {applicant.linkedinUrl && (
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-xs font-bold text-slate-400 block mb-1">رابط LinkedIn</span>
                  <a
                    href={applicant.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-kemix-blue hover:underline inline-flex items-center gap-1.5 font-semibold text-xs"
                    dir="ltr"
                  >
                    <Linkedin className="w-4 h-4 text-[#0A66C2]" />
                    <span>{applicant.linkedinUrl}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
            </div>

            {/* 3. Interests & Motivation */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              <h3 className="text-base font-extrabold text-kemix-navy pb-3 border-b border-slate-100 mb-5 flex items-center gap-2">
                <Layers className="w-5 h-5 text-kemix-blue" />
                <span>مجالات الاهتمام ودافع الانضمام</span>
              </h3>

              <div className="mb-6">
                <span className="text-xs font-bold text-slate-400 block mb-2">مجالات الاهتمام المختارة:</span>
                <div className="flex flex-wrap gap-2">
                  {parsedInterests.map((interest, i) => (
                    <span
                      key={i}
                      className="bg-blue-50 text-kemix-navy border border-blue-200/80 text-xs font-semibold px-3 py-1.5 rounded-xl"
                    >
                      {interest}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <span className="text-xs font-bold text-slate-400 block mb-2">لماذا يرغب في الانضمام (الدافع):</span>
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-slate-700 text-sm leading-relaxed">
                  {applicant.motivation}
                </div>
              </div>
            </div>

            {/* 4. LinkedIn Sharing Generator Preview */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-extrabold text-kemix-navy flex items-center gap-2">
                  <Share2 className="w-5 h-5 text-[#0A66C2]" />
                  <span>منشور مشاركة الإنجاز على LinkedIn</span>
                </h3>
                <a
                  href={shareUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-[#0A66C2] hover:bg-[#084e96] text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-sm transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>فتح في LinkedIn</span>
                </a>
              </div>

              <div className="bg-slate-900 text-slate-100 p-4 rounded-2xl text-xs font-sans whitespace-pre-line leading-relaxed mb-3">
                {postText}
              </div>
              <p className="text-[11px] text-slate-500">
                * يتم تضمين هذا الرابط في بريد القبول المرسل للمتقدم ليتمكن من نشر إنجازه بضغطة زر.
              </p>
            </div>

          </div>

          {/* Right Column / Timeline & Status (1 Col) */}
          <div className="space-y-6">
            
            {/* Timeline Card */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              <h3 className="text-base font-extrabold text-kemix-navy pb-3 border-b border-slate-100 mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-kemix-blue" />
                <span>المخطط الزمني للطلب (Timeline)</span>
              </h3>

              <div className="relative border-r-2 border-slate-200 space-y-8 pr-6 mr-3">
                
                {/* Step 1: Registered */}
                <div className="relative">
                  <div className="absolute -right-[31px] top-0 w-4 h-4 rounded-full bg-kemix-blue ring-4 ring-blue-100" />
                  <div className="font-bold text-slate-900 text-sm">تم تقديم طلب التسجيل</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {new Date(applicant.registeredAt).toLocaleString('ar-EG')}
                  </div>
                </div>

                {/* Step 2: Pending Review */}
                <div className="relative">
                  <div
                    className={`absolute -right-[31px] top-0 w-4 h-4 rounded-full ${
                      applicant.status !== 'PENDING' ? 'bg-kemix-blue ring-4 ring-blue-100' : 'bg-amber-500 ring-4 ring-amber-100'
                    }`}
                  />
                  <div className="font-bold text-slate-900 text-sm">مراجعة الطلب</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {applicant.status === 'PENDING' ? 'قيد المراجعة حالياً' : 'تمت المراجعة'}
                  </div>
                </div>

                {/* Step 3: Acceptance Decision */}
                <div className="relative">
                  <div
                    className={`absolute -right-[31px] top-0 w-4 h-4 rounded-full ${
                      applicant.status === 'ACCEPTED'
                        ? 'bg-emerald-500 ring-4 ring-emerald-100'
                        : applicant.status === 'REJECTED'
                        ? 'bg-rose-500 ring-4 ring-rose-100'
                        : 'bg-slate-300 ring-4 ring-slate-100'
                    }`}
                  />
                  <div className="font-bold text-slate-900 text-sm">
                    {applicant.status === 'ACCEPTED'
                      ? 'تم قبول الطلب (Accepted)'
                      : applicant.status === 'REJECTED'
                      ? 'تم رفض الطلب (Rejected)'
                      : 'قرار القبول'}
                  </div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {applicant.acceptedAt
                      ? new Date(applicant.acceptedAt).toLocaleString('ar-EG')
                      : 'بانتظار القرار'}
                  </div>
                </div>

                {/* Step 4: Email Notification */}
                <div className="relative">
                  <div
                    className={`absolute -right-[31px] top-0 w-4 h-4 rounded-full ${
                      applicant.emailSentAt
                        ? 'bg-blue-600 ring-4 ring-blue-100'
                        : applicant.emailLastError
                        ? 'bg-red-500 ring-4 ring-red-100'
                        : 'bg-slate-300 ring-4 ring-slate-100'
                    }`}
                  />
                  <div className="font-bold text-slate-900 text-sm">إرسال بريد القبول الرسمي</div>
                  <div className="text-xs text-slate-500 mt-0.5">
                    {applicant.emailSentAt ? (
                      <span className="text-emerald-600 font-semibold">
                        تم الإرسال: {new Date(applicant.emailSentAt).toLocaleString('ar-EG')}
                      </span>
                    ) : applicant.emailLastError ? (
                      <span className="text-red-600 font-semibold">فشل: {applicant.emailLastError}</span>
                    ) : (
                      'لم يتم الإرسال بعد'
                    )}
                  </div>
                </div>

              </div>
            </div>

            {/* Email Logs History */}
            <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-8">
              <h3 className="text-base font-extrabold text-kemix-navy pb-3 border-b border-slate-100 mb-4 flex items-center gap-2">
                <Mail className="w-5 h-5 text-kemix-blue" />
                <span>سجل البريد الإلكتروني ({applicant.emailLogs?.length || 0})</span>
              </h3>

              {(!applicant.emailLogs || applicant.emailLogs.length === 0) ? (
                <div className="text-xs text-slate-400 text-center py-4">
                  لم يتم إرسال أي رسائل بريد إلكتروني لهذا المتقدم بعد.
                </div>
              ) : (
                <div className="space-y-3">
                  {applicant.emailLogs.map((log: any) => (
                    <div
                      key={log.id}
                      className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span
                          className={`font-bold ${
                            log.status === 'SUCCESS' ? 'text-emerald-600' : 'text-rose-600'
                          }`}
                        >
                          {log.status === 'SUCCESS' ? '✓ تم الإرسال بنجاح' : '✗ فشل الإرسال'}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          {new Date(log.sentAt).toLocaleString('ar-EG')}
                        </span>
                      </div>
                      <div className="text-slate-600 truncate">{log.subject}</div>
                      {log.error && <div className="text-red-600 text-[10px]">{log.error}</div>}
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}

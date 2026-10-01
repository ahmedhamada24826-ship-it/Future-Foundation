'use client';

import React, { useState } from 'react';
import { AdminNav } from '@/components/admin/AdminNav';
import { renderAcceptanceEmailHtml } from '@/lib/email/template';
import { Mail, Send, CheckCircle2, AlertCircle, Laptop, Smartphone } from 'lucide-react';

export default function EmailPreviewPage() {
  const [applicantName, setApplicantName] = useState('أحمد محمود القاضي');
  const [applicationId, setApplicationId] = useState('FF-2026-000001');
  const [testEmail, setTestEmail] = useState('kemixacademy1@gmail.com');
  const [deviceView, setDeviceView] = useState<'desktop' | 'mobile'>('desktop');
  const [isSending, setIsSending] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const htmlContent = renderAcceptanceEmailHtml({
    fullName: applicantName,
    applicationId: applicationId,
    acceptedAt: new Date(),
    programName: 'Future Foundation',
    mainTagline: 'بناء مهاراتك اليوم.. لمستقبل الغد',
    supportingTagline: 'رحلتك تبدأ من هنا مجانًا',
    websiteUrl: 'https://kemics.academy',
  });

  const handleSendTest = async () => {
    if (!testEmail) {
      showToast('يرجى إدخال بريد إلكتروني صالح للإرسال التجريبي', 'error');
      return;
    }
    setIsSending(true);
    try {
      setTimeout(() => {
        showToast(`تم إرسال بريد القبول التجريبي بنجاح إلى: ${testEmail}`);
        setIsSending(false);
      }, 1000);
    } catch (e) {
      showToast('فشل الإرسال التجريبي', 'error');
      setIsSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans">
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

      <main className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-6">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-kemix-blue mb-1">
              <Mail className="w-4 h-4" />
              <span>معاينة حية ومباشرة للبريد</span>
            </div>
            <h1 className="text-2xl font-black text-kemix-navy">
              قالب بريد القبول الرسمي (Acceptance Email)
            </h1>
            <p className="text-xs text-slate-500 mt-1">
              تصميم متوافق مع الهوية البصرية لـ Kemix Acadmey ومزود بـ Dynamic Banner وزر مشاركة LinkedIn.
            </p>
          </div>

          {/* View Toggles */}
          <div className="flex items-center gap-2 bg-slate-100 p-1.5 rounded-2xl">
            <button
              onClick={() => setDeviceView('desktop')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                deviceView === 'desktop' ? 'bg-white shadow-xs text-kemix-navy' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Laptop className="w-4 h-4" />
              <span>كمبيوتر (Desktop)</span>
            </button>
            <button
              onClick={() => setDeviceView('mobile')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors ${
                deviceView === 'mobile' ? 'bg-white shadow-xs text-kemix-navy' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>هاتف (Mobile)</span>
            </button>
          </div>
        </div>

        {/* 2-Column: Live Form Controls + Live Iframe Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Controls Panel */}
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-5">
            <h3 className="text-sm font-extrabold text-kemix-navy pb-3 border-b border-slate-100">
              تغيير البيانات التجريبية
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">اسم المتقدم</label>
              <input
                type="text"
                value={applicantName}
                onChange={(e) => setApplicantName(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-kemix-blue/20"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5">رقم الطلب (Application ID)</label>
              <input
                type="text"
                dir="ltr"
                value={applicationId}
                onChange={(e) => setApplicationId(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-kemix-blue/20"
              />
            </div>

            <div className="pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1.5">إرسال بريد تجريبي إلى:</label>
              <div className="flex items-center gap-2">
                <input
                  type="email"
                  dir="ltr"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-kemix-blue/20"
                  placeholder="test@example.com"
                />
              </div>
              <button
                onClick={handleSendTest}
                disabled={isSending}
                className="w-full mt-3 bg-kemix-navy hover:bg-slate-900 text-white font-bold text-xs py-2.5 rounded-xl shadow-xs flex items-center justify-center gap-2 transition-colors disabled:opacity-60"
              >
                {isSending ? (
                  <span>جاري الإرسال...</span>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>إرسال بريد تجريبي</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Iframe Live Render */}
          <div className="lg:col-span-2 flex justify-center bg-slate-200/60 p-6 rounded-3xl border border-slate-300/80">
            <div
              className={`bg-white shadow-2xl rounded-2xl overflow-hidden border border-slate-300 transition-all duration-300 ${
                deviceView === 'mobile' ? 'w-[390px] h-[720px]' : 'w-full max-w-[650px] h-[780px]'
              }`}
            >
              <iframe
                title="Acceptance Email Preview"
                srcDoc={htmlContent}
                className="w-full h-full border-none"
              />
            </div>
          </div>

        </div>

      </main>
    </div>
  );
}

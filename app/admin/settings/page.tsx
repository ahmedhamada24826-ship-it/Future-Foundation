'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminNav } from '@/components/admin/AdminNav';
import {
  Settings,
  Save,
  Clock,
  Mail,
  Share2,
  CheckCircle2,
  AlertCircle,
  Zap,
  Tag,
} from 'lucide-react';

export default function AdminSettingsPage() {
  const router = useRouter();
  const [settings, setSettings] = useState({
    program_name: 'Future Foundation',
    main_tagline: 'بناء مهاراتك اليوم.. لمستقبل الغد',
    supporting_tagline: 'رحلتك تبدأ من هنا مجانًا',
    acceptance_delay_hours: 24,
    auto_acceptance_enabled: true,
    auto_email_enabled: true,
    email_delay_seconds: 60,
    email_sender_name: 'Kemix Acadmey',
    email_sender_address: 'kemixacademy1@gmail.com',
    linkedin_share_text: '',
    program_website_url: 'https://kemics.academy',
  });

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (res.status === 401) {
          router.push('/admin/login');
          return;
        }
        const data = await res.json();
        if (data.success) {
          setSettings(data.data);
        }
      } catch (err) {
        showToast('فشل تحميل الإعدادات', 'error');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      const data = await res.json();
      if (res.ok) {
        showToast('تم حفظ الإعدادات بنجاح');
        setSettings(data.data);
      } else {
        showToast(data.message || 'فشل حفظ الإعدادات', 'error');
      }
    } catch (e) {
      showToast('خطأ في الاتصال بالخادم', 'error');
    } finally {
      setIsSaving(false);
    }
  };

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

      <main className="max-w-5xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 space-y-8">
        
        {/* Header */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-kemix-blue mb-1">
              <Settings className="w-4 h-4" />
              <span>إعدادات المنصة والأتمتة</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-kemix-navy">
              إعدادات النظام والقبول الآلي
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              تخصيص قواعد معالجة الطلبات، رسائل البريد، ونصوص مشاركة LinkedIn.
            </p>
          </div>
        </div>

        {/* Settings Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Card 1: Branding & Taglines */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-extrabold text-kemix-navy pb-3 border-b border-slate-100 flex items-center gap-2">
              <Tag className="w-5 h-5 text-kemix-blue" />
              <span>معلومات وهوية المبادرة</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">اسم المبادرة / البرنامج</label>
                <input
                  type="text"
                  value={settings.program_name}
                  onChange={(e) => setSettings({ ...settings, program_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">رابط الموقع التعريفي</label>
                <input
                  type="url"
                  dir="ltr"
                  value={settings.program_website_url}
                  onChange={(e) => setSettings({ ...settings, program_website_url: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue text-left"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">الشعار الرئيسي (Main Tagline)</label>
                <input
                  type="text"
                  value={settings.main_tagline}
                  onChange={(e) => setSettings({ ...settings, main_tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">الشعار الفرعي (Supporting Tagline)</label>
                <input
                  type="text"
                  value={settings.supporting_tagline}
                  onChange={(e) => setSettings({ ...settings, supporting_tagline: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                />
              </div>
            </div>
          </div>

          {/* Card 2: Automatic Acceptance Rules */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-extrabold text-kemix-navy pb-3 border-b border-slate-100 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-600" />
              <span>قواعد الأتمتة والقبول التلقائي</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
              
              {/* Acceptance Delay (Hours) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  مدة الانتظار قبل القبول الآلي (بالساعات)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="720"
                    value={settings.acceptance_delay_hours}
                    onChange={(e) => setSettings({ ...settings, acceptance_delay_hours: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">افتراضياً: 24 ساعة بعد التسجيل</p>
              </div>

              {/* Email Interval Delay (Seconds) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                  الفاصل الزمني بين كل إيميل والآخر (بالثواني)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="3600"
                    value={settings.email_delay_seconds}
                    onChange={(e) => setSettings({ ...settings, email_delay_seconds: Number(e.target.value) })}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                  />
                  <Clock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                </div>
                <p className="text-[11px] text-slate-400 mt-1">افتراضياً: 60 ثانية (دقيقة واحدة)</p>
              </div>

              {/* Toggle 1: Auto Acceptance */}
              <div className="flex flex-col justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-800">تفعيل القبول التلقائي</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">تحويل الطلبات المؤهلة إلى ACCEPTED تلقائياً</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-3">
                  <input
                    type="checkbox"
                    checked={settings.auto_acceptance_enabled}
                    onChange={(e) => setSettings({ ...settings, auto_acceptance_enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-600"></div>
                </label>
              </div>

              {/* Toggle 2: Auto Email Sending */}
              <div className="flex flex-col justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
                <div>
                  <div className="text-xs font-bold text-slate-800">إرسال البريد آلياً</div>
                  <div className="text-[11px] text-slate-500 mt-0.5">إرسال خطاب القبول بفارق زمني بين كل إيميل</div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer mt-3">
                  <input
                    type="checkbox"
                    checked={settings.auto_email_enabled}
                    onChange={(e) => setSettings({ ...settings, auto_email_enabled: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-kemix-blue"></div>
                </label>
              </div>

            </div>
          </div>

          {/* Card 3: Email Sender Details */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-extrabold text-kemix-navy pb-3 border-b border-slate-100 flex items-center gap-2">
              <Mail className="w-5 h-5 text-kemix-blue" />
              <span>بيانات مرسل البريد الإلكتروني</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">اسم المرسل (Sender Name)</label>
                <input
                  type="text"
                  value={settings.email_sender_name}
                  onChange={(e) => setSettings({ ...settings, email_sender_name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">البريد الإلكتروني للمرسل (From Email)</label>
                <input
                  type="email"
                  dir="ltr"
                  value={settings.email_sender_address}
                  onChange={(e) => setSettings({ ...settings, email_sender_address: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue text-left"
                />
              </div>
            </div>
          </div>

          {/* Card 4: LinkedIn Share Template */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-8 space-y-5">
            <h3 className="text-base font-extrabold text-kemix-navy pb-3 border-b border-slate-100 flex items-center gap-2">
              <Share2 className="w-5 h-5 text-[#0A66C2]" />
              <span>قالب منشور المشاركة على LinkedIn</span>
            </h3>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">نص المنشور التلقائي للمقبولين</label>
              <textarea
                rows={5}
                dir="ltr"
                value={settings.linkedin_share_text}
                onChange={(e) => setSettings({ ...settings, linkedin_share_text: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue text-left"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-kemix-blue hover:bg-blue-700 text-white font-bold px-8 py-3.5 rounded-2xl shadow-lg shadow-blue-500/25 flex items-center gap-2 transition-all disabled:opacity-60"
            >
              {isSaving ? (
                <span>جاري حفظ التعديلات...</span>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>حفظ كافة الإعدادات</span>
                </>
              )}
            </button>
          </div>

        </form>

      </main>
    </div>
  );
}

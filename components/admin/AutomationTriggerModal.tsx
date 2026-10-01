'use client';

import React, { useState } from 'react';
import { Zap, CheckCircle2, AlertCircle, X, Loader2, ArrowRight } from 'lucide-react';

interface AutomationTriggerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AutomationTriggerModal: React.FC<AutomationTriggerModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [isRunning, setIsRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRun = async () => {
    setIsRunning(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/applications/automation', {
        method: 'POST',
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'فشلت معالجة الأتمتة');
      } else {
        setResult(data.data);
        onSuccess();
      }
    } catch (err: any) {
      setError('حدث خطأ أثناء تشغيل الأتمتة');
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-200 animate-in fade-in">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-kemix-navy text-lg">تشغيل أتمتة القبول الفوري</h3>
              <p className="text-xs text-slate-500">معالجة الطلبات المستوفية لمدة الانتظار وإرسال البريد</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-slate-400 hover:bg-slate-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="py-6 space-y-4">
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {result ? (
            <div className="space-y-4">
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl">
                <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm mb-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>اكتملت المعالجة التلقائية بنجاح!</span>
                </div>
                <div className="grid grid-cols-3 gap-2 text-center text-xs mt-3 pt-3 border-t border-emerald-200/60">
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-slate-400">تم فحصهم</div>
                    <div className="text-base font-bold text-slate-800">{result.processedCount}</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-slate-400">تم قبولهم</div>
                    <div className="text-base font-bold text-emerald-600">{result.acceptedCount}</div>
                  </div>
                  <div className="bg-white p-2 rounded-lg">
                    <div className="text-slate-400">إيميلات أرسلت</div>
                    <div className="text-base font-bold text-blue-600">{result.emailsSentCount}</div>
                  </div>
                </div>
              </div>

              {result.details && result.details.length > 0 && (
                <div className="max-h-40 overflow-y-auto space-y-1.5 text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-slate-200">
                  <div className="font-bold text-slate-700 mb-1">تفاصيل المعالجة:</div>
                  {result.details.map((d: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-1 border-b border-slate-200/50">
                      <span>{d.fullName} ({d.applicationId})</span>
                      <span className={d.emailSent ? 'text-emerald-600 font-semibold' : 'text-slate-500'}>
                        {d.emailSent ? '✓ تم إرسال الإيميل' : 'تم القبول'}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <p className="text-slate-600 text-sm leading-relaxed">
              سيقوم هذا الإجراء بالبحث عن جميع طلبات التسجيل المعلقة (PENDING) التي تجاوزت فترة الانتظار المحددة في الإعدادات، وتحويل حالتها إلى <strong>ACCEPTED</strong>، ثم إرسال بريد القبول الرسمي تلقائيًا لمن لم يُرسل لهم بعد.
            </p>
          )}

        </div>

        {/* Modal Footer */}
        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
          >
            إغلاق
          </button>
          {!result && (
            <button
              onClick={handleRun}
              disabled={isRunning}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-6 py-2.5 rounded-xl shadow-md flex items-center gap-2 disabled:opacity-60"
            >
              {isRunning ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>جاري التشغيل...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>بدء المعالجة الآن</span>
                </>
              )}
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

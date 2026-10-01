'use client';

import React from 'react';
import { CheckCircle2, Copy, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  applicantData: {
    applicationId: string;
    fullName: string;
    email: string;
    registeredAt?: string | Date;
  } | null;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({ isOpen, onClose, applicantData }) => {
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#0B2D5B', '#2563EB', '#60A5FA', '#38BDF8'],
        });
      } catch (e) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen || !applicantData) return null;

  const handleCopyId = () => {
    if (applicantData?.applicationId) {
      navigator.clipboard.writeText(applicantData.applicationId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-8 md:p-10 shadow-2xl border border-slate-100 text-center relative animate-in fade-in zoom-in-95 duration-200">
        
        {/* Success Icon */}
        <div className="w-20 h-20 bg-emerald-50 rounded-full border border-emerald-200 flex items-center justify-center mx-auto mb-6 text-emerald-600 shadow-sm">
          <CheckCircle2 className="w-10 h-10 animate-bounce" />
        </div>

        {/* Brand Tag */}
        <div className="inline-block bg-blue-50 text-kemix-blue text-xs font-bold px-3 py-1 rounded-full mb-3">
          FUTURE FOUNDATION • Kemix Acadmey
        </div>

        {/* Title */}
        <h3 className="text-2xl sm:text-3xl font-black text-kemix-navy mb-2">
          تم استلام طلبك بنجاح!
        </h3>

        <p className="text-slate-600 text-sm sm:text-base leading-relaxed mb-6">
          شكرًا لتسجيلك في <strong>Future Foundation</strong> يا <strong>{applicantData.fullName}</strong>.
          <br />
          سيتم مراجعة بياناتك وإرسال حالة طلبك عبر البريد الإلكتروني.
        </p>

        {/* Application ID Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6 text-right">
          <div className="text-xs font-bold text-slate-500 mb-1">رقم الطلب الخاص بك (Application ID):</div>
          <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-slate-300">
            <span className="font-mono font-bold text-lg text-kemix-navy tracking-wider" dir="ltr">
              {applicantData.applicationId}
            </span>
            <button
              onClick={handleCopyId}
              className="text-xs font-semibold text-kemix-blue hover:text-blue-700 flex items-center gap-1 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600">تم النسخ</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>نسخ الرقم</span>
                </>
              )}
            </button>
          </div>
          <p className="text-[11px] text-slate-500 mt-2 text-right">
            * احتفظ برقم الطلب للرجوع إليه عند مراجعة حالة تسجيلك.
          </p>
        </div>

        {/* What happens next note */}
        <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-4 text-xs text-blue-900 leading-relaxed text-right mb-6">
          <strong>💡 ماذا بعد؟</strong>
          <br />
          سيتم مراجعة طلبك، وستصلك رسالة تأكيد القبول على بريدك: <span className="font-semibold">{applicantData.email}</span>.
        </div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="w-full bg-kemix-navy hover:bg-slate-900 text-white font-bold py-3.5 rounded-xl shadow-md transition-all duration-200"
        >
          تم، فهمت ذلك
        </button>

      </div>
    </div>
  );
};

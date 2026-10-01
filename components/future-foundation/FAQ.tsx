'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    q: 'هل الانضمام لمبادرة Future Foundation مجاني بالفعل؟',
    a: 'نعم، المبادرة مجانية بالكامل 100% برعاية Kemix Acadmey ضمن رؤيتنا التعليمية لتطوير المهارات الشخصية والتقنية واكتشاف قدرات الشباب وتنميتها.',
  },
  {
    q: 'كيف يتم قبول المتقدمين، وما هي مدة مراجعة الطلب؟',
    a: 'يتم مراجعة الطلبات المسجلة آلياً وبشكل دوري ومباشر (خلال 24 ساعة كحد أقصى). وبمجرد استيفاء الشروط يتم قبولك وإرسال رسالة القبول الرسمية عبر بريدك الإلكتروني.',
  },
  {
    q: 'كيف تقدم المحاضرات والورش التدريبية؟',
    a: 'يقدم البرنامج تجربة تعليمية متكاملة وتفاعلية عبر الإنترنت (Online Interactive Sessions) تجمع بين المحاضرات والمصادر المعرفية والتطبيقات الإبداعية.',
  },
  {
    q: 'هل سأحصل على شهادة إتمام بعد انتهاء البرنامج؟',
    a: 'نعم، يحصل كل مشارك يكمل متطلبات المسار على شهادة إتمام معتمدة من Kemix Acadmey توثق مهاراته ومسيرته التعليمية، مع إمكانية مشاركة الإنجاز على LinkedIn.',
  },
  {
    q: 'ماذا أفعل إذا واجهت مشكلة أثناء التسجيل أو لم يصلني بريد القبول؟',
    a: 'يمكنك التواصل المباشر مع فريق الدعم التعليمي للأكاديمية عبر البريد الإلكتروني: kemixacademy1@gmail.com.',
  },
];

export const FAQ: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold tracking-wider text-kemix-blue uppercase bg-blue-50 px-3.5 py-1.5 rounded-full border border-blue-100">
            الأسئلة الشائعة
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-kemix-navy mt-3 mb-3">
            كل ما تود معرفته عن المبادرة
          </h2>
          <p className="text-slate-600 text-sm sm:text-base">
            إليك الإجابات على أكثر الاستفسارات شيوعاً حول Future Foundation والتجربة التعليمية.
          </p>
        </div>

        <div className="space-y-4">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all duration-200 shadow-sm"
              >
                <button
                  onClick={() => toggle(index)}
                  className="w-full px-6 py-5 text-right flex items-center justify-between gap-4 font-bold text-kemix-navy hover:text-kemix-blue transition-colors"
                >
                  <span className="text-base sm:text-lg">{faq.q}</span>
                  <ChevronDown
                    className={`w-5 h-5 text-slate-400 shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180 text-kemix-blue' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-600 text-sm leading-relaxed border-t border-slate-100 animate-in fade-in duration-200">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
};

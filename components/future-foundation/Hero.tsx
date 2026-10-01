'use client';

import React from 'react';
import { ArrowLeft, Sparkles, BookOpen, Compass, Award, Lightbulb } from 'lucide-react';

export const Hero: React.FC = () => {
  const scrollToRegister = () => {
    const el = document.getElementById('registration-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden bg-gradient-to-b from-slate-50 via-white to-blue-50/30">
      {/* Background Subtle Tech Shapes */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-radial from-blue-400/15 to-transparent blur-3xl" />
        <div className="absolute top-20 right-10 w-72 h-72 bg-kemix-cyan/10 rounded-full blur-2xl" />
        <div className="absolute bottom-10 left-10 w-80 h-80 bg-kemix-blue/10 rounded-full blur-2xl" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(#0B2D5B 1px, transparent 1px)`,
            backgroundSize: '24px 24px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-3xl mx-auto">
          {/* Official Initiative Pill */}
          <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200/80 px-4 py-1.5 rounded-full mb-6 shadow-sm">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-kemix-blue"></span>
            </span>
            <span className="text-xs sm:text-sm font-bold text-kemix-navy tracking-wide">
              Kemix Acadmey • مبادرة مستقبل الغد
            </span>
          </div>

          {/* Program Big Title */}
          <h1 className="text-4xl sm:text-6xl font-black text-kemix-navy tracking-tight leading-[1.15] mb-6">
            FUTURE FOUNDATION
            <span className="block text-2xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-kemix-blue to-kemix-navy mt-3">
              بناء مهاراتك اليوم.. لمستقبل الغد
            </span>
          </h1>

          {/* Supporting Tagline */}
          <p className="text-lg sm:text-2xl font-bold text-kemix-blue mb-4">
            رحلتك تبدأ من هنا مجانًا
          </p>

          <p className="text-base sm:text-lg text-slate-600 leading-relaxed mb-8 max-w-2xl mx-auto">
            تجربة تعليمية متكاملة ومتنوعة مصممة لاكتشاف قدراتك وتنميتها، وبناء أساس معرفي قوي، وتطوير المهارات الشخصية والتقنية لتحقيق التعلم والتطور المستمر والاستعداد الواثق للمستقبل.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button
              onClick={scrollToRegister}
              className="w-full sm:w-auto bg-kemix-blue hover:bg-blue-700 text-white font-bold text-lg px-8 py-4 rounded-xl shadow-lg shadow-blue-500/25 hover:shadow-xl hover:shadow-blue-500/35 transition-all duration-200 flex items-center justify-center gap-3 group"
            >
              <span>سجّل الآن في المبادرة</span>
              <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
            </button>
            <a
              href="#tracks"
              className="w-full sm:w-auto bg-white hover:bg-slate-50 text-slate-700 font-semibold text-base px-7 py-4 rounded-xl border border-slate-300 shadow-sm transition-all duration-200 flex items-center justify-center gap-2"
            >
              <span>استكشف المجالات المعرفية</span>
            </a>
          </div>

          {/* Highlights / Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-200/80">
            <div className="flex flex-col items-center p-3 rounded-xl bg-white/70 border border-slate-100 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-kemix-navy">100%</span>
              <span className="text-xs text-slate-600 font-medium mt-1">مجاني بالكامل</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-white/70 border border-slate-100 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-kemix-blue">+4</span>
              <span className="text-xs text-slate-600 font-medium mt-1">مسارات تطويرية</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-white/70 border border-slate-100 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-kemix-navy">شامل</span>
              <span className="text-xs text-slate-600 font-medium mt-1">مهارات شخصية وتقنية</span>
            </div>
            <div className="flex flex-col items-center p-3 rounded-xl bg-white/70 border border-slate-100 shadow-sm">
              <span className="text-2xl sm:text-3xl font-black text-kemix-blue">شهادة</span>
              <span className="text-xs text-slate-600 font-medium mt-1">إتمام وتكريم</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

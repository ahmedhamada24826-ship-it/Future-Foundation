'use client';

import React, { useState, useEffect } from 'react';
import { Handshake } from 'lucide-react';
import { INITIAL_PARTNERS } from '@/lib/db/seed-partners';

interface PartnerItem {
  id?: string;
  name: string;
  category: string;
  logoUrl: string;
  darkCard?: boolean;
}

interface SectionData {
  title: string;
  subtitle: string;
  badge: string;
}

export const Partners: React.FC = () => {
  const [partners, setPartners] = useState<PartnerItem[]>(INITIAL_PARTNERS);
  const [sectionData, setSectionData] = useState<SectionData>({
    title: 'شركاء النجاح',
    subtitle:
      'نعتز بالتعاون والشراكة مع نخبة من المؤسسات والكيانات والمجتمعات الرائدة لدعم الشباب وبناء مهارات المستقبل.',
    badge: 'شركاء المسيرة والنجاح',
  });

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const res = await fetch('/api/partners');
        if (res.ok) {
          const data = await res.json();
          if (data.success && Array.isArray(data.data) && data.data.length > 0) {
            setPartners(data.data);
          }
          if (data.section) {
            setSectionData(data.section);
          }
        }
      } catch (e) {
        // Fallback gracefully to initial partners
      }
    };
    fetchPartners();
  }, []);

  if (!partners || partners.length === 0) return null;

  return (
    <section id="partners" className="py-16 sm:py-20 bg-slate-50/70 border-y border-slate-200/80 relative overflow-hidden">
      {/* Background Decorative Accents */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-cyan-100/30 rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 bg-blue-50 text-kemix-blue border border-blue-200/60 px-4 py-1.5 rounded-full text-xs sm:text-sm font-bold mb-4 shadow-sm">
            <Handshake className="w-4 h-4 text-kemix-blue" />
            <span>{sectionData.badge}</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-extrabold text-kemix-navy tracking-tight mb-4">
            {sectionData.title}
          </h2>

          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            {sectionData.subtitle}
          </p>
        </div>

        {/* Partners Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 sm:gap-6 items-stretch justify-center">
          {partners.map((partner, index) => (
            <div
              key={partner.id || index}
              className={`group relative rounded-2xl p-5 sm:p-6 transition-all duration-300 flex flex-col items-center justify-between border ${
                partner.darkCard
                  ? 'bg-slate-950 border-slate-800 hover:border-blue-500/50 hover:shadow-xl hover:shadow-blue-950/20'
                  : 'bg-white border-slate-200/80 hover:border-kemix-blue/40 hover:shadow-lg hover:shadow-blue-500/5'
              } hover:-translate-y-1`}
            >
              {/* Logo Area */}
              <div className="w-full h-28 sm:h-32 flex items-center justify-center p-2">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                  loading="lazy"
                />
              </div>

              {/* Partner Label */}
              <div className="text-center mt-3 pt-3 border-t w-full border-slate-100 dark:border-slate-800/80">
                <h3
                  className={`text-xs sm:text-sm font-bold truncate ${
                    partner.darkCard ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  {partner.name}
                </h3>
                {partner.category && (
                  <span className="text-[10px] sm:text-xs text-slate-400 block mt-0.5 truncate">
                    {partner.category}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

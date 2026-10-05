'use client';

import React, { useState, useEffect } from 'react';
import { Handshake } from 'lucide-react';
import { PartnerLogo } from '@/components/ui/PartnerLogo';
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
    <section id="partners" className="relative overflow-hidden border-y border-slate-200/80 bg-slate-50/70 py-16 sm:py-20">
      <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-blue-100/60 blur-3xl" />
      <div className="absolute -left-16 bottom-5 h-72 w-72 rounded-full bg-cyan-100/60 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-12 max-w-3xl text-center sm:mb-16">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50 px-4 py-1.5 text-xs font-bold text-kemix-blue shadow-sm sm:text-sm">
            <Handshake className="h-4 w-4 text-kemix-blue" />
            <span>{sectionData.badge}</span>
          </div>

          <h2 className="mb-4 text-2xl font-extrabold tracking-tight text-kemix-navy sm:text-4xl">
            {sectionData.title}
          </h2>

          <p className="text-sm leading-relaxed text-slate-600 sm:text-base">
            {sectionData.subtitle}
          </p>
        </div>

        <div
          className={
            partners.length === 1
              ? 'flex justify-center'
              : 'grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-5'
          }
        >
          {partners.map((partner, index) => (
            <div
              key={partner.id || index}
              className={`group relative w-full overflow-hidden rounded-[28px] border p-0 transition-all duration-300 hover:-translate-y-1 ${
                partners.length === 1 ? 'max-w-sm' : ''
              } ${
                partner.darkCard
                  ? 'border-slate-800 bg-[#071827] text-white shadow-[0_18px_40px_rgba(15,23,42,0.35)] hover:border-blue-400/70 hover:shadow-[0_24px_55px_rgba(37,99,235,0.2)]'
                  : 'border-slate-200/80 bg-white text-slate-800 shadow-[0_14px_30px_rgba(15,23,42,0.06)] hover:border-kemix-blue/40 hover:shadow-[0_18px_35px_rgba(59,130,246,0.12)]'
              }`}
            >
              <div
                className={`flex h-52 items-center justify-center border-b p-5 sm:h-56 ${
                  partner.darkCard ? 'border-slate-800 bg-slate-950/40' : 'border-slate-100 bg-slate-50/70'
                }`}
              >
                <div
                  className={`flex h-full w-full items-center justify-center rounded-2xl border p-4 backdrop-blur-sm transition-all duration-300 group-hover:scale-[1.02] ${
                    partner.darkCard
                      ? 'border-slate-800 bg-[#071827]'
                      : 'border-dashed border-slate-300/70 bg-white/60'
                  }`}
                >
                  <PartnerLogo
                    src={partner.logoUrl}
                    alt={partner.name}
                    name={partner.name}
                    darkCard={Boolean(partner.darkCard)}
                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                    fallbackClassName="h-full w-full"
                  />
                </div>
              </div>

              <div className="space-y-3 p-4 sm:p-5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2 py-1 text-[10px] font-bold ${
                      partner.darkCard ? 'bg-white/10 text-slate-200' : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    Partner
                  </span>
                  <span className={`h-2.5 w-2.5 rounded-full ${partner.darkCard ? 'bg-emerald-400' : 'bg-emerald-500'}`} />
                </div>

                <div className="min-h-[52px]">
                  <h3
                    className={`text-base font-black leading-snug ${
                      partner.darkCard ? 'text-white' : 'text-kemix-navy'
                    }`}
                  >
                    {partner.name}
                  </h3>
                  {partner.category && (
                    <p
                      className={`mt-1 text-xs leading-relaxed ${
                        partner.darkCard ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {partner.category}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

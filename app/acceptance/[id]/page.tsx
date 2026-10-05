import React from 'react';
import { Metadata } from 'next';
import Link from 'next/link';
import { prisma } from '@/lib/db/prisma';
import { getSystemSettings } from '@/lib/settings/settings';
import { KemixLogo } from '@/components/ui/Logo';
import { generateLinkedInShareUrl } from '@/lib/linkedin/share';
import { LinkedInShareActions } from '@/components/future-foundation/LinkedInShareActions';
import { getPublicAppUrl } from '@/lib/public-url';
import { CheckCircle2, ExternalLink, ShieldCheck } from 'lucide-react';

interface PageProps {
  params: { id: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = params;
  const baseUrl = getPublicAppUrl();

  const applicant = await prisma.applicant.findFirst({
    where: { OR: [{ id: id }, { applicationId: id }] },
    select: { fullName: true, applicationId: true, status: true },
  });

  const applicantName = applicant?.fullName || 'أحد المتميزين';
  const appId = applicant?.applicationId || id;

  const title = `🎉 تم قبول ${applicantName} في مبادرة Future Foundation — Kemix Acadmey`;
  const description = `إشعار القبول الرسمي لرقم الطلب (${appId}) في مبادرة Future Foundation من Kemix Acadmey. بناء مهاراتك اليوم.. لمستقبل الغد.`;
  const bannerUrl = `${baseUrl}/images/acceptance-banner.png`;

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${baseUrl}/acceptance/${appId}`,
      siteName: 'Kemix Acadmey',
      images: [
        {
          url: bannerUrl,
          width: 1024,
          height: 384,
          alt: `Official Acceptance Banner - Future Foundation - ${applicantName}`,
        },
      ],
      type: 'website',
      locale: 'ar_EG',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [bannerUrl],
    },
  };
}

export default async function AcceptanceCelebrationPage({ params }: PageProps) {
  const { id } = params;
  const baseUrl = getPublicAppUrl();
  const [applicant, settings] = await Promise.all([
    prisma.applicant.findFirst({
      where: { OR: [{ id: id }, { applicationId: id }] },
    }),
    getSystemSettings(),
  ]);

  const applicantName = applicant?.fullName || 'أحمد محمود القاضي';
  const appId = applicant?.applicationId || id;
  const acceptedDate = applicant?.acceptedAt
    ? new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }).format(applicant.acceptedAt)
    : new Intl.DateTimeFormat('ar-EG', { year: 'numeric', month: 'long', day: 'numeric' }).format(new Date());

  const currentUrl = `${baseUrl}/acceptance/${encodeURIComponent(appId)}`;
  const { shareUrl, postText } = generateLinkedInShareUrl({
    fullName: applicantName,
    applicationId: appId,
    targetUrl: currentUrl,
    customText: settings.linkedin_share_text,
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-[#0B2D5B] to-slate-950 text-white flex flex-col justify-between p-4 sm:p-8 font-sans" dir="rtl">
      
      {/* Top Header */}
      <header className="max-w-4xl w-full mx-auto flex items-center justify-between py-4 border-b border-white/10">
        <KemixLogo size="md" variant="white" href="/future-foundation" showSubtitle={true} />
        <Link
          href="/future-foundation"
          className="text-xs sm:text-sm font-semibold text-blue-200 hover:text-white bg-white/10 hover:bg-white/20 px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5"
        >
          <span>عن المبادرة</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </header>

      {/* Main Card */}
      <main className="max-w-3xl w-full mx-auto my-8 animate-in fade-in zoom-in-95 duration-300">
        <div className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-white/20 text-slate-900">
          
          {/* 1. Official Acceptance Banner */}
          <div className="relative w-full bg-slate-100 border-b border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/acceptance-banner.png"
              alt="Future Foundation Acceptance Banner - Kemix Acadmey"
              className="w-full h-auto object-cover block"
            />
          </div>

          {/* 2. Personalized Card Body */}
          <div className="p-6 sm:p-10 text-center space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-1.5 rounded-full text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>إشعار قبول رسمي موثق • VERIFIED ACCEPTANCE</span>
            </div>

            <div>
              <h1 className="text-2xl sm:text-4xl font-black text-kemix-navy mb-2">
                تهانينا، <span className="text-kemix-blue">{applicantName}</span>! 🎉
              </h1>
              <p className="text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
                يسعدنا تأكيد قبولك رسميًا في مبادرة <strong>FUTURE FOUNDATION</strong> برعاية <strong>Kemix Acadmey</strong> لبناء المهارات وتطوير القدرات والاستعداد للمستقبل.
              </p>
            </div>

            {/* Application Data Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs sm:text-sm text-right">
              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">رقم الطلب الرسمي:</span>
                <span className="font-mono font-bold text-kemix-navy text-base" dir="ltr">
                  {appId}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block font-semibold mb-0.5">تاريخ القبول:</span>
                <span className="font-semibold text-slate-800">{acceptedDate}</span>
              </div>
            </div>

            <LinkedInShareActions shareUrl={shareUrl} postText={postText} />

          </div>

          {/* 3. Footer of Card */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Kemix Acadmey • Future Foundation</span>
            <span className="text-emerald-600 font-bold flex items-center gap-1">
              <ShieldCheck className="w-4 h-4" />
              <span>طلب معتمد وموثق</span>
            </span>
          </div>

        </div>
      </main>

      {/* Page Bottom Footer */}
      <footer className="max-w-4xl w-full mx-auto text-center text-xs text-blue-200/60 py-4 border-t border-white/10">
        © {new Date().getFullYear()} Kemix Acadmey — جميع الحقوق محفوظة.
      </footer>

    </div>
  );
}

import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'FUTURE FOUNDATION — Kemix Acadmey | بناء مهاراتك اليوم.. لمستقبل الغد',
  description: 'المبادرة الرسمية لتطوير المهارات واكتشاف القدرات وبناء المعرفة من Kemix Acadmey - رحلتك تبدأ من هنا مجانًا.',
  icons: {
    icon: '/images/logo.png',
    apple: '/images/logo.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@300;400;500;600;700;800;900&family=Inter:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-sans antialiased bg-[#FAFCFF] text-slate-900 min-h-screen flex flex-col selection:bg-kemix-blue selection:text-white" style={{ fontFamily: "'Cairo', sans-serif" }}>
        {children}
      </body>
    </html>
  );
}

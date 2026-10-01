import React from 'react';
import Link from 'next/link';
import { Mail, Globe, Shield } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-kemix-dark text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <Link href="/future-foundation" className="inline-block">
              <div className="bg-white rounded-xl px-5 py-3 inline-flex items-center shadow-sm border border-slate-700/30">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/images/brand-header.png"
                  alt="Future Foundation | Kemix Academy"
                  className="h-10 w-auto object-contain"
                  style={{ mixBlendMode: 'multiply' }}
                />
              </div>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed max-w-md mt-3">
              <strong>Kemix Acadmey</strong> — أكاديمية تعليمية رائدة تهدف إلى بناء مهارات الشباب واكتشاف قدراتهم وتنميتها، وتقديم تجارب تعليمية متكاملة تدعم التطور المستمر والاستعداد للمستقبل.
            </p>
            <div className="text-xs text-blue-400 font-semibold">
              بناء مهاراتك اليوم.. لمستقبل الغد
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-base mb-4">روابط سريعة</h4>
            <ul className="space-y-2.5">
              <li>
                <a href="#about" className="hover:text-white transition-colors">عن المبادرة</a>
              </li>
              <li>
                <a href="#partners" className="hover:text-white transition-colors">شركاء النجاح</a>
              </li>
              <li>
                <a href="#registration-section" className="hover:text-white transition-colors">استمارة التسجيل</a>
              </li>
              <li>
                <a href="#faq" className="hover:text-white transition-colors">الأسئلة المتكررة</a>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-white transition-colors flex items-center gap-1.5 text-slate-400">
                  <Shield className="w-3.5 h-3.5" />
                  <span>لوحة تحكم المشرفين</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-bold text-base mb-4">تواصل معنا</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-slate-300">
                <Mail className="w-4 h-4 text-kemix-cyan" />
                <a href="mailto:kemixacademy1@gmail.com" className="hover:text-white transition-colors" dir="ltr">
                  kemixacademy1@gmail.com
                </a>
              </li>
              <li className="flex items-center gap-2 text-slate-300">
                <Globe className="w-4 h-4 text-kemix-cyan" />
                <span dir="ltr">kemix.academy</span>
              </li>
            </ul>
            <div className="mt-6 pt-4 border-t border-slate-800 text-xs text-slate-500">
              مبادرة تعليمية مجانية مقدمة لبناء المعرفة وتطوير القدرات.
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            © {new Date().getFullYear()} Kemix Acadmey — FUTURE FOUNDATION. جميع الحقوق محفوظة.
          </div>
          <div className="flex items-center gap-6">
            <span>Learn • Build • Grow</span>
            <Link href="/admin/login" className="text-slate-500 hover:text-slate-300">
              Admin Portal
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

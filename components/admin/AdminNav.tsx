'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { KemixLogo } from '@/components/ui/Logo';
import {
  Users,
  Settings,
  Mail,
  LogOut,
  ExternalLink,
  ShieldCheck,
  Zap,
  Handshake,
} from 'lucide-react';

interface AdminNavProps {
  onRunAutomation?: () => void;
}

export const AdminNav: React.FC<AdminNavProps> = ({ onRunAutomation }) => {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/admin/login');
      router.refresh();
    } catch (e) {
      router.push('/admin/login');
    }
  };

  const navLinks = [
    { href: '/admin', label: 'المتقدمون والطلبات', icon: Users },
    { href: '/admin/partners', label: 'شركاء النجاح', icon: Handshake },
    { href: '/admin/email-preview', label: 'معاينة بريد القبول', icon: Mail },
    { href: '/admin/settings', label: 'إعدادات النظام', icon: Settings },
  ];

  return (
    <header className="bg-kemix-dark text-white border-b border-slate-800 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Brand Logo & Tag */}
          <div className="flex items-center gap-6">
            <KemixLogo size="sm" variant="dark" href="/admin" showSubtitle={true} />
            <span className="hidden lg:inline-flex items-center gap-1.5 bg-blue-500/10 text-kemix-cyan border border-blue-500/20 text-xs font-semibold px-2.5 py-1 rounded-md">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>لوحة الإدارة المركزية</span>
            </span>
          </div>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-colors ${
                    isActive
                      ? 'bg-kemix-blue text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-3">
            
            {onRunAutomation && (
              <button
                onClick={onRunAutomation}
                className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold px-3 py-2 rounded-xl shadow-sm transition-all flex items-center gap-1.5"
                title="تشغيل المعالجة التلقائية الآن"
              >
                <Zap className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">تشغيل الأتمتة الآن</span>
              </button>
            )}

            <Link
              href="/future-foundation"
              target="_blank"
              className="text-xs text-slate-300 hover:text-white flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-800 transition-colors"
            >
              <span>صفحة التسجيل</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </Link>

            <button
              onClick={handleLogout}
              className="text-xs text-red-400 hover:text-red-300 hover:bg-red-950/40 px-3 py-2 rounded-lg transition-colors flex items-center gap-1.5"
              title="تسجيل الخروج"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">خروج</span>
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};

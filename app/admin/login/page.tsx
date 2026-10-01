'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { KemixLogo } from '@/components/ui/Logo';
import { Mail, Lock, ArrowLeft, AlertCircle, ShieldCheck } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || 'فشل تسجيل الدخول. يرجى التأكد من صحة البيانات.');
        setIsLoading(false);
        return;
      }

      router.push('/admin');
      router.refresh();
    } catch (err: any) {
      setError('حدث خطأ في الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-kemix-navy to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        
        {/* Logo Card Top */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/10 shadow-2xl mb-4">
            <KemixLogo size="lg" variant="dark" href="/" showSubtitle={true} />
          </div>
          <h1 className="text-2xl font-black text-white">
            بوابة الإدارة المركزية
          </h1>
          <p className="text-sm text-blue-200/80 mt-1">
            Future Foundation • Management & Operations Portal
          </p>
        </div>

        {/* Login Box */}
        <div className="bg-white rounded-3xl p-8 shadow-2xl border border-slate-100">
          
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3 text-red-700 text-sm animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                البريد الإلكتروني للمسؤول
              </label>
              <div className="relative">
                <input
                  type="email"
                  dir="ltr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="admin@kemics.academy"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="password"
                  dir="ltr"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-kemix-blue/20 focus:border-kemix-blue"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-kemix-navy hover:bg-slate-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg shadow-slate-900/20 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {isLoading ? (
                  <span>جاري التحقق من بيانات الدخول...</span>
                ) : (
                  <>
                    <span>تسجيل الدخول للوحة التحكم</span>
                    <ArrowLeft className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-center gap-1.5 text-xs text-slate-400">
            <ShieldCheck className="w-4 h-4 text-slate-400" />
            <span>نظام تسجيل دخول مشفر ومحمي ببروتوكولات الأمان</span>
          </div>
        </div>

        {/* Back Link */}
        <div className="text-center mt-6">
          <a
            href="/future-foundation"
            className="text-xs text-blue-200/80 hover:text-white transition-colors"
          >
            ← العودة لصفحة التسجيل العامة
          </a>
        </div>

      </div>
    </div>
  );
}

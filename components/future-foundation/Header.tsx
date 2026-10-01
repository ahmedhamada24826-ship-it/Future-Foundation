'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { KemixLogo } from '@/components/ui/Logo';
import { ArrowLeft, Menu, X, ShieldCheck } from 'lucide-react';

export const Header: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToRegister = () => {
    const el = document.getElementById('registration-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 backdrop-blur-md shadow-sm border-b border-slate-200/80 py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          {/* Brand Lockup (Future Foundation | Kemix Academy) */}
          <Link href="/future-foundation" className="flex items-center select-none group">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/images/brand-header.png"
              alt="Future Foundation | Kemix Academy"
              className="h-9 sm:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.02]"
              style={{ mixBlendMode: 'multiply' }}
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-kemix-blue transition-colors">
              عن المبادرة
            </a>
            <a href="#partners" className="hover:text-kemix-blue transition-colors">
              شركاء النجاح
            </a>
            <a href="#faq" className="hover:text-kemix-blue transition-colors">
              الأسئلة الشائعة
            </a>
          </nav>

          {/* Action CTAs */}
          <div className="flex items-center gap-3">
            <Link
              href="/admin/login"
              className="text-xs font-medium text-slate-500 hover:text-kemix-navy px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>بوابة الإدارة</span>
            </Link>
            <button
              onClick={scrollToRegister}
              className="bg-kemix-blue hover:bg-blue-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-200 flex items-center gap-2 group"
            >
              <span>سجّل الآن</span>
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-3 shadow-xl">
          <nav className="flex flex-col space-y-3 text-base font-medium text-slate-700">
            <a
              href="#about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-kemix-blue"
            >
              عن المبادرة
            </a>
            <a
              href="#partners"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-kemix-blue"
            >
              شركاء النجاح
            </a>
            <a
              href="#faq"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 hover:text-kemix-blue"
            >
              الأسئلة الشائعة
            </a>
            <Link
              href="/admin/login"
              onClick={() => setMobileMenuOpen(false)}
              className="px-2 py-1.5 text-xs text-slate-500 flex items-center gap-1"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>دخول الإدارة</span>
            </Link>
          </nav>
          <div className="pt-2">
            <button
              onClick={scrollToRegister}
              className="w-full bg-kemix-blue text-white text-center py-3 rounded-xl font-bold shadow-md"
            >
              سجّل الآن مجانًا
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

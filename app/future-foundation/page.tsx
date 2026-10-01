import React from 'react';
import { Header } from '@/components/future-foundation/Header';
import { Hero } from '@/components/future-foundation/Hero';
import { Overview } from '@/components/future-foundation/Overview';
import { Partners } from '@/components/future-foundation/Partners';
import { RegistrationForm } from '@/components/future-foundation/RegistrationForm';
import { FAQ } from '@/components/future-foundation/FAQ';
import { Footer } from '@/components/future-foundation/Footer';

export default function FutureFoundationPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">
      <Header />
      <Hero />
      <Overview />
      <Partners />
      <RegistrationForm />
      <FAQ />
      <Footer />
    </main>
  );
}

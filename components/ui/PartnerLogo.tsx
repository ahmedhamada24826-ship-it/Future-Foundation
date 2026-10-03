'use client';

import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';

interface PartnerLogoProps {
  src?: string | null;
  alt: string;
  name?: string;
  darkCard?: boolean;
  className?: string;
  fallbackClassName?: string;
}

export function PartnerLogo({
  src,
  alt,
  name,
  darkCard = false,
  className = '',
  fallbackClassName = '',
}: PartnerLogoProps) {
  const [hasError, setHasError] = useState(false);

  const fallbackText = (name || alt || 'Partner')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || '')
    .join('') || 'P';

  if (!src || hasError) {
    return (
      <div
        className={[
          'flex h-full w-full items-center justify-center rounded-xl border text-center',
          darkCard ? 'border-slate-700 bg-slate-900 text-white' : 'border-slate-200 bg-slate-100 text-slate-600',
          fallbackClassName,
        ].join(' ')}
        aria-label={`${alt} logo unavailable`}
        title={`${alt} logo unavailable`}
      >
        <div className="flex flex-col items-center justify-center gap-1.5">
          <ImageOff className="h-5 w-5 opacity-80" />
          <span className="text-[10px] font-black tracking-[0.25em] opacity-80">{fallbackText}</span>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setHasError(true)}
    />
  );
}

import React from 'react';
import Link from 'next/link';

interface LogoProps {
  variant?: 'light' | 'dark' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showSubtitle?: boolean;
  showTagline?: boolean;
  href?: string;
  className?: string;
}

export const KemixLogo: React.FC<LogoProps> = ({
  variant = 'light',
  size = 'md',
  showSubtitle = true,
  showTagline = false,
  href = '/',
  className = '',
}) => {
  const isDark = variant === 'dark' || variant === 'white';

  const sizeClasses = {
    sm: 'h-8 sm:h-9 w-auto',
    md: 'h-10 sm:h-12 w-auto',
    lg: 'h-14 sm:h-16 w-auto',
    xl: 'h-20 sm:h-24 w-auto',
  }[size];

  const content = (
    <div className={`inline-flex items-center gap-2 select-none ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/logo.png"
        alt="Kemix Academy - Learn • Build • Grow"
        className={`${sizeClasses} object-contain transition-transform duration-300 hover:scale-105`}
        style={{ mixBlendMode: 'multiply' }}
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex items-center focus:outline-none">
        {content}
      </Link>
    );
  }

  return content;
};

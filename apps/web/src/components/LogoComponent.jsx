import React from 'react';

export default function LogoComponent({ variant = 'full', theme = 'light', className = '' }) {
  if (variant === 'icon') {
    return (
      <img
        src="/memoria-logo-icon.png"
        alt="MemorIAmobile"
        className={`block h-10 w-auto object-contain ${className}`}
      />
    );
  }

  const source = variant === 'header' ? '/memoria-logo-header.png' : '/memoria-logo.png';

  return (
    <span className={`inline-flex items-center ${theme === 'dark' ? 'rounded-lg bg-background px-3 py-2' : ''} ${className}`}>
      <img
        src={source}
        alt="MemorIAmobile — Tu memoria, potenciada por IA"
        className="block h-full w-auto object-contain"
        draggable="false"
      />
    </span>
  );
}

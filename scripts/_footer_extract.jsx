import React from 'react';

export const LOGO_SRC = '/logo.png';

const sizeClasses = {
  sm: 'h-8',
  md: 'h-10 md:h-11',
  lg: 'h-16 md:h-20',
};

/**
 * Brand logo — full wordmark (M icon + MemorIAmobile + tagline).
 */
export default function LogoComponent({ size = 'md', className = '' }) {
  return (
    <img
      src={LOGO_SRC}
      alt="MemorIAmobile — Tu memoria, potenciada por IA"
      className={`w-auto max-w-[min(100%,300px)] object-contain object-left ${sizeClasses[size] ?? sizeClasses.md} ${className}`}
    />
  );
}

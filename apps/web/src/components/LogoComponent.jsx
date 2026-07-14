import React from 'react';

export default function LogoComponent({ variant = 'full', theme = 'light', className = '' }) {
  const isLight = theme === 'light';
  const textColor = isLight ? 'text-foreground' : 'text-white';

  const svgIcon = (
    <svg viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full z-10 p-1">
      {/* M Shape */}
      <path d="M8 32V14C8 10 11 8 15 8C17.5 8 19 9.5 20 12C21 9.5 22.5 8 25 8C29 8 32 10 32 14V32" stroke="url(#logo-grad)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
      
      {/* Brain (left) */}
      <path d="M12 18C10 18 9 20 9 22C9 24 11 25 13 25C14 25 15 24 15 22" stroke="#7B3FF2" strokeWidth="1.5" strokeLinecap="round"/>
      <path d="M15 22C16 22 17 20 17 18C17 16 15 15 13 15C11 15 10 16 10 18" stroke="#7B3FF2" strokeWidth="1.5" strokeLinecap="round"/>
      
      {/* Circuit (right) */}
      <path d="M28 18H25V21H28" stroke="#2D8CFF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      <circle cx="28" cy="18" r="1" fill="#2D8CFF"/>
      <circle cx="25" cy="21" r="1" fill="#2D8CFF"/>
      <path d="M25 15V18" stroke="#2D8CFF" strokeWidth="1.5" strokeLinecap="round"/>
      
      <defs>
        <linearGradient id="logo-grad" x1="8" y1="8" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7B3FF2"/>
          <stop offset="1" stopColor="#2D8CFF"/>
        </linearGradient>
      </defs>
    </svg>
  );

  if (variant === 'icon') {
    return (
      <div className={`relative flex items-center justify-center w-10 h-10 rounded-xl bg-background border border-border shadow-sm overflow-hidden shrink-0 ${className}`}>
        {svgIcon}
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-background border border-border shadow-sm overflow-hidden shrink-0">
        {svgIcon}
      </div>
      <span className={`text-xl font-bold tracking-tight font-sans ${textColor}`}>
        MemorIAmobile
      </span>
    </div>
  );
}

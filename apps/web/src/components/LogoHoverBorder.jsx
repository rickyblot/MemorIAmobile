import React, { useId } from 'react';

export default function LogoHoverBorder() {
  const gradientId = `logo-border-${useId().replace(/:/g, '')}`;

  return (
    <svg
      className="logo-hover-border-svg"
      viewBox="0 0 100 40"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{
        position: 'absolute',
        inset: '-1px',
        width: 'calc(100% + 2px)',
        height: 'calc(100% + 2px)',
        overflow: 'visible',
        pointerEvents: 'none',
      }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b735ec" />
          <stop offset="48%" stopColor="#7652f4" />
          <stop offset="100%" stopColor="#27a9f6" />
        </linearGradient>
      </defs>
      <path
        className="logo-hover-border-path"
        d="M50 .75 H80 A19.25 19.25 0 0 1 99.25 20 A19.25 19.25 0 0 1 80 39.25 H20 A19.25 19.25 0 0 1 .75 20 A19.25 19.25 0 0 1 20 .75 H50"
        pathLength="1"
        stroke={`url(#${gradientId})`}
      />
    </svg>
  );
}

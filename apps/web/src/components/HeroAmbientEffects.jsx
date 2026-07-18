import React, { useEffect, useRef } from 'react';

const fragments = [
  { left: '54%', top: '16%', width: 21, height: 28, delay: '-2s', duration: '10s' },
  { left: '72%', top: '10%', width: 16, height: 22, delay: '-6s', duration: '12s' },
  { left: '86%', top: '34%', width: 20, height: 26, delay: '-4s', duration: '11s' },
  { left: '62%', top: '68%', width: 17, height: 23, delay: '-8s', duration: '13s' },
  { left: '91%', top: '74%', width: 14, height: 19, delay: '-1s', duration: '9s' },
  { left: '79%', top: '58%', width: 12, height: 17, delay: '-5s', duration: '11s' },
];

export default function HeroAmbientEffects() {
  const canvasRef = useRef(null);
  const shimmerRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const shimmer = shimmerRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !shimmer || !container) return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    const precisePointer = window.matchMedia('(hover: hover) and (pointer: fine)');
    if (reducedMotion.matches || !precisePointer.matches) return undefined;

    const context = canvas.getContext('2d');
    if (!context) return undefined;

    let ripples = [];
    let frame = null;
    let pixelRatio = 1;

    const resize = () => {
      const rect = container.getBoundingClientRect();
      pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * pixelRatio);
      canvas.height = Math.round(rect.height * pixelRatio);
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      context.clearRect(0, 0, rect.width, rect.height);

      ripples = ripples
        .map((ripple) => ({
          ...ripple,
          radius: ripple.radius + 3,
          opacity: ripple.opacity - 0.016,
        }))
        .filter((ripple) => ripple.opacity > 0);

      ripples.forEach((ripple) => {
        const outerGradient = context.createLinearGradient(
          ripple.x - ripple.radius,
          ripple.y - ripple.radius,
          ripple.x + ripple.radius,
          ripple.y + ripple.radius,
        );
        outerGradient.addColorStop(0, `rgba(183, 53, 236, ${ripple.opacity})`);
        outerGradient.addColorStop(0.48, `rgba(118, 82, 244, ${ripple.opacity})`);
        outerGradient.addColorStop(1, `rgba(39, 169, 246, ${ripple.opacity})`);

        context.beginPath();
        context.arc(ripple.x, ripple.y, ripple.radius, 0, Math.PI * 2);
        context.strokeStyle = outerGradient;
        context.lineWidth = 2.2;
        context.stroke();

        const innerRadius = ripple.radius * 0.62;
        const innerGradient = context.createLinearGradient(
          ripple.x - innerRadius,
          ripple.y - innerRadius,
          ripple.x + innerRadius,
          ripple.y + innerRadius,
        );
        innerGradient.addColorStop(0, `rgba(183, 53, 236, ${ripple.opacity * 0.65})`);
        innerGradient.addColorStop(0.48, `rgba(118, 82, 244, ${ripple.opacity * 0.65})`);
        innerGradient.addColorStop(1, `rgba(39, 169, 246, ${ripple.opacity * 0.65})`);

        context.beginPath();
        context.arc(ripple.x, ripple.y, innerRadius, 0, Math.PI * 2);
        context.strokeStyle = innerGradient;
        context.lineWidth = 1.25;
        context.stroke();
      });

      if (ripples.length > 0) {
        frame = window.requestAnimationFrame(draw);
      } else {
        frame = null;
      }
    };

    const handlePointerMove = (event) => {
      const rect = container.getBoundingClientRect();
      shimmer.style.setProperty('--shimmer-x', `${event.clientX - rect.left}px`);
      shimmer.style.setProperty('--shimmer-y', `${event.clientY - rect.top}px`);
      shimmer.dataset.visible = 'true';
    };

    const handlePointerLeave = () => {
      shimmer.dataset.visible = 'false';
    };

    const handlePointerDown = (event) => {
      const rect = container.getBoundingClientRect();
      ripples.push({
        x: event.clientX - rect.left,
        y: event.clientY - rect.top,
        radius: 5,
        opacity: 0.82,
      });
      if (ripples.length > 3) ripples.shift();
      if (frame === null) frame = window.requestAnimationFrame(draw);
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);
    container.addEventListener('pointermove', handlePointerMove, { passive: true });
    container.addEventListener('pointerleave', handlePointerLeave);
    container.addEventListener('pointerdown', handlePointerDown, { passive: true });

    return () => {
      resizeObserver.disconnect();
      container.removeEventListener('pointermove', handlePointerMove);
      container.removeEventListener('pointerleave', handlePointerLeave);
      container.removeEventListener('pointerdown', handlePointerDown);
      if (frame !== null) window.cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <>
      <div
        ref={shimmerRef}
        className="photo-shimmer pointer-events-none absolute inset-0 z-[1] hidden md:block"
        data-visible="false"
        aria-hidden="true"
      />
      <canvas
        ref={canvasRef}
        className="pointer-events-none absolute inset-0 z-[2] hidden md:block"
        aria-hidden="true"
      />
      <div className="pointer-events-none absolute inset-0 z-[1] hidden overflow-hidden md:block" aria-hidden="true">
        {fragments.map((fragment, index) => (
          <span
            key={index}
            className="memory-paper-fragment absolute"
            style={{
              left: fragment.left,
              top: fragment.top,
              width: `${fragment.width}px`,
              height: `${fragment.height}px`,
              animationDelay: fragment.delay,
              animationDuration: fragment.duration,
            }}
          />
        ))}
      </div>
    </>
  );
}

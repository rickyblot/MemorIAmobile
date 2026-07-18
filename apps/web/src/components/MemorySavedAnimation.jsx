import React, { useEffect } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { Check } from 'lucide-react';

export default function MemorySavedAnimation({ count, onComplete }) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (!count) return undefined;
    const timeout = window.setTimeout(() => onComplete?.(), 2200);
    return () => window.clearTimeout(timeout);
  }, [count, onComplete]);

  return (
    <AnimatePresence>
      {count > 0 && (
        <motion.div
          className="pointer-events-none fixed inset-x-0 bottom-8 z-[120] flex justify-center px-4"
          initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 12, scale: 0.98 }}
          transition={{ duration: reduceMotion ? 0.15 : 0.42, ease: [0.22, 1, 0.36, 1] }}
          role="status"
          aria-live="polite"
        >
          <div className="flex items-center gap-4 rounded-full border border-accent/45 bg-primary px-5 py-3 text-primary-foreground shadow-2xl shadow-primary/25">
            <motion.span
              className="flex h-9 w-9 items-center justify-center rounded-full bg-accent text-accent-foreground"
              initial={reduceMotion ? false : { scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ delay: 0.12, type: 'spring', stiffness: 280, damping: 18 }}
            >
              <Check className="h-5 w-5" strokeWidth={2.5} />
            </motion.span>
            <span>
              <strong className="block font-heading text-base font-medium">
                {count === 1 ? 'Recuerdo guardado' : `${count} recuerdos guardados`}
              </strong>
              <span className="block text-xs text-primary-foreground/60">Ya forma parte de tu historia.</span>
            </span>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

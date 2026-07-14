import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const HERO_IMAGE = '/hero-memoriamobile.png';

export default function HeroSection({ onOpenDemo }) {
  return (
    <section className="hero-banner-container" aria-label="MemorIAmobile hero">
      <div className="hero-banner-shell">
        <img
          src={HERO_IMAGE}
          alt="MemorIAmobile — laptop y móvil con tu vida organizada por IA"
          className="hero-banner-image"
          draggable="false"
          fetchPriority="high"
        />

        <div className="hero-banner-overlay" aria-hidden="true" />

        <div className="hero-banner-content">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="hero-banner-copy"
          >
            <p className="hero-banner-eyebrow">TU MEMORIA. POTENCIADA POR IA.</p>
            <h1 className="hero-banner-title">
              Nunca pierdas un recuerdo.
              <span className="block text-accent mt-2">Tu vida, organizada por IA.</span>
            </h1>
            <p className="hero-banner-subtitle">
              Sincroniza fotos, documentos y chats. La inteligencia artificial los etiqueta,
              ordena y hace que sean fáciles de encontrar para siempre.
            </p>

            <div className="hero-banner-actions">
              <Button
                asChild
                size="lg"
                className="rounded-full bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-6 text-base sm:text-lg font-semibold"
              >
                <Link to="/signup">Empezar gratis</Link>
              </Button>
              {onOpenDemo && (
                <Button
                  type="button"
                  size="lg"
                  variant="outline"
                  onClick={onOpenDemo}
                  className="rounded-full border-white/30 bg-white/5 text-white hover:bg-white/10 px-8 py-6 text-base sm:text-lg font-semibold backdrop-blur-sm"
                >
                  Ver demostración
                </Button>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

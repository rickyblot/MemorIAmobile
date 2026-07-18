import React from 'react';
import { Link } from 'react-router-dom';
import LogoComponent from '@/components/LogoComponent.jsx';

export default function Footer() {
  return (
    <footer className="border-t border-primary/10 bg-secondary text-primary">
      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-12 lg:py-20">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-6">
            <Link to="/" className="mb-6 inline-flex" aria-label="MemorIAmobile — Inicio">
              <LogoComponent variant="header" className="h-12" />
            </Link>
            <p className="max-w-lg font-heading text-2xl leading-snug text-primary sm:text-3xl">
              Una vida está hecha de momentos. Nosotros te ayudamos a conservarlos.
            </p>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-foreground/70">
              Un lugar privado para guardar las fotos, voces e historias que merecen acompañarte siempre.
            </p>
          </div>

          <div className="md:col-span-3 md:col-start-8">
            <h4 className="eyebrow mb-5 text-accent">Explora</h4>
            <ul className="space-y-3 text-sm text-foreground/75">
              <li><Link to="/plans" className="transition-colors hover:text-accent">Planes</Link></li>
              <li><Link to="/blog" className="transition-colors hover:text-accent">Historias de una vida</Link></li>
              <li><Link to="/faq" className="transition-colors hover:text-accent">Preguntas frecuentes</Link></li>
              <li><Link to="/contact" className="transition-colors hover:text-accent">Contacto</Link></li>
            </ul>
          </div>

          <div className="md:col-span-2">
            <h4 className="eyebrow mb-5 text-accent">Confianza</h4>
            <ul className="space-y-3 text-sm text-foreground/75">
              <li><Link to="/privacy" className="transition-colors hover:text-accent">Privacidad</Link></li>
              <li><Link to="/terms" className="transition-colors hover:text-accent">Términos</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-16 flex flex-col gap-3 border-t border-primary/10 pt-8 text-xs text-foreground/55 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} MemorIAmobile. Todos los derechos reservados.</p>
          <p>Hecho para recordar lo que importa.</p>
        </div>
      </div>
    </footer>
  );
}

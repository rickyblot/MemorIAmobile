import React from 'react';
import { Link } from 'react-router-dom';
import { Brain, Twitter, Linkedin, Instagram, Facebook } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground border-t border-border pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 text-primary">
              <Brain className="w-6 h-6" />
              <span className="font-heading font-bold text-xl tracking-tight">MemorIA<span className="font-medium text-muted-foreground">mobile</span></span>
            </Link>
            <p className="text-sm text-secondary-foreground/80 mb-6 max-w-sm">
              Protegemos y organizamos tus recuerdos usando Inteligencia Artificial. Mantén tu vida digital segura y accesible en todo momento.
            </p>
            <div className="flex items-center gap-4 text-secondary-foreground/60">
              <a href="#" className="hover:text-accent transition-colors" aria-label="Twitter"><Twitter className="w-5 h-5" /></a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="LinkedIn"><Linkedin className="w-5 h-5" /></a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="Instagram"><Instagram className="w-5 h-5" /></a>
              <a href="#" className="hover:text-accent transition-colors" aria-label="Facebook"><Facebook className="w-5 h-5" /></a>
            </div>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-4 font-heading tracking-wide uppercase text-sm">Compañía</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/80">
              <li><Link to="/plans" className="hover:text-accent transition-colors">Planes y Precios</Link></li>
              <li><Link to="/blog" className="hover:text-accent transition-colors">Blog / Noticias</Link></li>
              <li><Link to="/faq" className="hover:text-accent transition-colors">Preguntas Frecuentes</Link></li>
              <li><Link to="/contact" className="hover:text-accent transition-colors">Contacto</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-semibold text-primary mb-4 font-heading tracking-wide uppercase text-sm">Legal</h4>
            <ul className="space-y-3 text-sm text-secondary-foreground/80">
              <li><Link to="/privacy" className="hover:text-accent transition-colors">Política de Privacidad</Link></li>
              <li><Link to="/terms" className="hover:text-accent transition-colors">Términos de Servicio</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-border/50 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-secondary-foreground/60">
          <p>© {new Date().getFullYear()} MemorIAmobile. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}
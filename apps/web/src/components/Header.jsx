import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import LogoComponent from '@/components/LogoComponent.jsx';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === '/';

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Planes', path: '/plans' },
    { name: 'Blog', path: '/blog' },
    { name: 'Preguntas', path: '/faq' },
    { name: 'Contacto', path: '/contact' },
  ];

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  useEffect(() => {
    const onScroll = () => {
      setIsScrolled(window.scrollY > 12);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
    <header
      className={`fixed top-0 z-50 w-full border-transparent ${
        isScrolled ? 'header-scrolled' : ''
      }`}
    >
      <div className="relative z-10 mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8 lg:px-12">
        <Link
          to="/"
          aria-label="MemorIAmobile — Inicio"
          className="header-reveal-left"
          style={{ '--header-delay': '40ms' }}
        >
          <LogoComponent variant="header" className="h-12" />
        </Link>

        <nav
          className="logo-gradient-outline header-reveal-left hidden items-center gap-7 rounded-full bg-transparent px-5 py-1 md:flex"
          style={{ '--header-delay': '100ms' }}
          aria-label="Navegación principal"
        >
          {navLinks.map((link, index) => (
            <Link
              key={link.path}
              to={link.path}
              className={`header-link header-reveal-left py-2 text-sm ${
                isActivePath(link.path)
                  ? 'is-active text-primary'
                  : 'text-foreground/70 hover:text-primary'
              }`}
              style={{ '--header-delay': `${160 + index * 70}ms` }}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div
          className="logo-gradient-outline header-reveal-right hidden items-center gap-1 rounded-full bg-transparent p-1 md:flex"
          style={{ '--header-delay': '100ms' }}
        >
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" className="header-action-link header-reveal-right rounded-full hover:bg-transparent" style={{ '--header-delay': '170ms' }}>
                <Link to="/dashboard">Tu línea de tiempo</Link>
              </Button>
              <Button asChild variant="ghost" className="header-action-link header-reveal-right rounded-full hover:bg-transparent" style={{ '--header-delay': '250ms' }}>
                <Link to="/profile">Perfil</Link>
              </Button>
              <Button onClick={logout} variant="ghost" className="header-action-link header-reveal-right rounded-full hover:bg-transparent" style={{ '--header-delay': '330ms' }}>
                Salir
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="header-action-link header-reveal-right rounded-full hover:bg-transparent" style={{ '--header-delay': '180ms' }}>
                <Link to="/login">Iniciar sesión</Link>
              </Button>
              <Button asChild variant="ghost" className="header-action-link header-reveal-right rounded-full px-6 hover:bg-transparent" style={{ '--header-delay': '300ms' }}>
                <Link to="/signup">Comenzar mi historia</Link>
              </Button>
            </>
          )}
        </div>

        <button
          type="button"
          className="rounded-full p-2 text-primary transition-colors hover:bg-secondary md:hidden"
          onClick={() => setIsMobileMenuOpen((open) => !open)}
          aria-label={isMobileMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMobileMenuOpen}
        >
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="absolute w-full border-t border-border bg-background px-5 py-5 shadow-xl md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`rounded-lg px-4 py-3 text-base ${isActivePath(link.path) ? 'bg-secondary text-primary' : 'text-foreground hover:bg-muted'}`}
              >
                {link.name}
              </Link>
            ))}
            <div className="my-3 h-px bg-border" />
            {isAuthenticated ? (
              <>
                <Button asChild className="mb-2 w-full"><Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Tu línea de tiempo</Link></Button>
                <Button asChild variant="outline" className="mb-2 w-full"><Link to="/profile" onClick={() => setIsMobileMenuOpen(false)}>Perfil</Link></Button>
                <Button variant="ghost" onClick={() => { logout(); setIsMobileMenuOpen(false); }}>Cerrar sesión</Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline" className="mb-2 w-full"><Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Iniciar sesión</Link></Button>
                <Button asChild className="w-full"><Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>Comenzar mi historia</Link></Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
    {!isHome && <div className="h-[72px]" aria-hidden="true" />}
    </>
  );
}

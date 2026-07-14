import React, { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Brain, Menu, ShoppingCart, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useCart } from '@/hooks/useCart.jsx';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const { cartItems = [] } = useCart() || {};
  const location = useLocation();

  const itemCount = useMemo(
    () => cartItems.reduce((total, item) => total + (item.quantity || 0), 0),
    [cartItems]
  );

  const navLinks = [
    { name: 'Inicio', path: '/' },
    { name: 'Planes', path: '/plans' },
    { name: 'Blog', path: '/blog' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contacto', path: '/contact' },
  ];

  const isActivePath = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const CartLink = ({ className = '' }) => (
    <Link
      to="/cart"
      className={`relative inline-flex items-center justify-center rounded-full p-2 text-foreground transition-colors hover:bg-secondary hover:text-accent ${className}`}
      aria-label={`Carrito de compra${itemCount > 0 ? `, ${itemCount} artículos` : ''}`}
    >
      <ShoppingCart className="w-5 h-5" />
      {itemCount > 0 && (
        <span className="absolute -top-0.5 -right-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold leading-none text-white shadow-sm">
          {itemCount > 99 ? '99+' : itemCount}
        </span>
      )}
    </Link>
  );

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary text-primary-foreground p-2 rounded-xl">
            <Brain className="w-5 h-5" />
          </div>
          <span className="font-heading font-bold text-xl tracking-tight text-primary">MemorIA<span className="font-medium text-muted-foreground">mobile</span></span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-medium transition-colors hover:text-accent ${
                isActivePath(link.path) ? 'text-accent' : 'text-foreground'
              }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-3">
          <CartLink />
          {isAuthenticated ? (
            <>
              <Button asChild variant="ghost" className="font-medium">
                <Link to="/dashboard">Dashboard</Link>
              </Button>
              <Button onClick={logout} variant="outline" className="font-medium">
                Cerrar Sesión
              </Button>
            </>
          ) : (
            <>
              <Button asChild variant="ghost" className="font-medium text-foreground hover:bg-secondary">
                <Link to="/login">Iniciar Sesión</Link>
              </Button>
              <Button asChild className="font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-full px-6 transition-all duration-300">
                <Link to="/signup">Empezar Gratis</Link>
              </Button>
            </>
          )}
        </div>

        {/* Mobile: cart + menu */}
        <div className="flex md:hidden items-center gap-1">
          <CartLink />
          <button 
            className="p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Menú"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border bg-background p-4 absolute w-full shadow-lg">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`text-base font-medium p-3 rounded-xl transition-colors ${
                  isActivePath(link.path) ? 'bg-secondary text-primary' : 'text-foreground hover:bg-muted'
                }`}
              >
                {link.name}
              </Link>
            ))}
            <Link
              to="/cart"
              onClick={() => setIsMobileMenuOpen(false)}
              className={`text-base font-medium p-3 rounded-xl transition-colors flex items-center justify-between ${
                isActivePath('/cart') ? 'bg-secondary text-primary' : 'text-foreground hover:bg-muted'
              }`}
            >
              <span className="inline-flex items-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Carrito
              </span>
              {itemCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-600 px-1.5 text-[10px] font-bold text-white">
                  {itemCount > 99 ? '99+' : itemCount}
                </span>
              )}
            </Link>
            <div className="h-px bg-border my-2" />
            {isAuthenticated ? (
              <div className="flex flex-col gap-3">
                <Button asChild className="w-full justify-center">
                  <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</Link>
                </Button>
                <Button onClick={() => { logout(); setIsMobileMenuOpen(false); }} variant="outline" className="w-full justify-center">
                  Cerrar Sesión
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <Button asChild variant="outline" className="w-full justify-center">
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)}>Iniciar Sesión</Link>
                </Button>
                <Button asChild className="w-full justify-center bg-primary rounded-full">
                  <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>Empezar Gratis</Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

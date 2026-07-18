import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import SocialAuthButtons from '@/components/SocialAuthButtons.jsx';
import LogoComponent from '@/components/LogoComponent.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useDocumentTitle } from '@/hooks/useDocumentTitle.js';
import { toast } from 'sonner';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [error, setError] = useState('');
  const { login, loginWithOAuth, oauthProviders } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  useDocumentTitle('Iniciar Sesión - MemorIAmobile');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Por favor completa todos los campos.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await login(email, password, { remember: rememberMe });
      setTimeout(() => {
        navigate(from, { replace: true });
        toast.success('Bienvenido de nuevo');
      }, 0);
    } catch (err) {
      setError(err.message || 'Correo o contraseña incorrectos.');
      toast.error('Fallo de autenticación');
      setLoading(false);
    }
  };

  const handleOAuth = async (provider) => {
    setOauthLoading(provider);
    setError('');
    try {
      const result = await loginWithOAuth(provider);
      if (result?.cancelled || result?.redirected) return;
      setTimeout(() => {
        navigate(from, { replace: true });
        toast.success('Bienvenido de nuevo');
      }, 0);
    } catch (err) {
      const message = err.message || `No se pudo iniciar sesión con ${provider}.`;
      setError(message);
      toast.error('Fallo de autenticación social');
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center py-12 sm:px-6 lg:px-8">

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="mb-8 flex justify-center" aria-label="MemorIAmobile — Inicio">
          <LogoComponent variant="header" className="h-16 max-w-full" />
        </Link>
        <h2 className="text-center font-heading text-3xl font-semibold text-foreground mb-2">
          Bienvenido de nuevo
        </h2>
        <p className="text-center text-sm text-muted-foreground">
          ¿No tienes cuenta?{' '}
          <Link to="/signup" className="font-semibold text-accent hover:text-accent/80 transition-colors">
            Crea una gratis
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-xl border border-border sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Correo Electrónico
              </label>
              <Input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full text-foreground bg-background"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Contraseña
              </label>
              <Input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full text-foreground bg-background"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember-me"
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked === true)}
                disabled={loading || Boolean(oauthLoading)}
              />
              <label
                htmlFor="remember-me"
                className="text-sm font-medium text-foreground cursor-pointer select-none"
              >
                Remember me
              </label>
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button 
              type="submit" 
              className="h-12 w-full rounded-xl border-0 bg-gradient-to-r from-[#b735ec] via-[#7652f4] to-[#27a9f6] text-base font-semibold text-white shadow-lg shadow-[#7652f4]/20 hover:brightness-110"
              disabled={loading || Boolean(oauthLoading)}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Iniciar Sesión <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="mt-6">
            <SocialAuthButtons
              providers={oauthProviders}
              loadingProvider={oauthLoading}
              disabled={loading}
              googleLabel="Continuar con Google"
              onGoogle={() => handleOAuth('google')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

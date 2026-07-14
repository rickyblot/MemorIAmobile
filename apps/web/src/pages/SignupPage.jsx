import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, ArrowRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import SocialAuthButtons from '@/components/SocialAuthButtons.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useDocumentTitle } from '@/hooks/useDocumentTitle.js';
import { toast } from 'sonner';

export default function SignupPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(null);
  const [error, setError] = useState('');
  const { signup, loginWithOAuth, oauthProviders } = useAuth();
  const navigate = useNavigate();
  useDocumentTitle('Crear Cuenta - MemorIAmobile');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) {
      setError('Por favor completa todos los campos.');
      return;
    }

    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await signup(email, password, name);
      // Defer navigation so title/toast unmounts don’t race React’s DOM tree.
      setTimeout(() => {
        navigate('/dashboard', { replace: true });
        toast.success('Cuenta creada exitosamente');
      }, 0);
    } catch (err) {
      setError(err.message || 'Error al crear la cuenta. Intenta de nuevo.');
      toast.error('Fallo al registrarse');
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
        navigate('/dashboard', { replace: true });
        toast.success('Cuenta lista');
      }, 0);
    } catch (err) {
      const message = err.message || `No se pudo continuar con ${provider}.`;
      setError(message);
      toast.error('Fallo de autenticación social');
      setOauthLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex justify-center items-center gap-2 mb-8">
          <Brain className="w-10 h-10 text-primary" />
          <span className="font-heading font-bold text-3xl text-primary tracking-tight">MemorIA<span className="font-medium text-muted-foreground">mobile</span></span>
        </Link>
        <h2 className="text-center text-3xl font-extrabold text-foreground mb-2">
          Comienza tu bóveda
        </h2>
        <p className="text-center text-sm text-muted-foreground">
          ¿Ya tienes cuenta?{' '}
          <Link to="/login" className="font-semibold text-accent hover:text-accent/80 transition-colors">
            Inicia sesión
          </Link>
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow-xl border border-border sm:rounded-2xl sm:px-10">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1">
                Nombre Completo
              </label>
              <Input
                type="text"
                autoComplete="name"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Juan Pérez"
                className="w-full text-foreground bg-background"
              />
            </div>

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
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Mínimo 8 caracteres"
                className="w-full text-foreground bg-background"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive">{error}</p>
            )}

            <Button
              type="submit"
              className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground h-12 text-base font-semibold"
              disabled={loading || Boolean(oauthLoading)}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Crear Cuenta <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </Button>

            <p className="text-xs text-center text-muted-foreground mt-4">
              Al registrarte, aceptas nuestros <Link to="/terms" className="underline">Términos</Link> y <Link to="/privacy" className="underline">Privacidad</Link>.
            </p>
          </form>

          <div className="mt-6">
            <SocialAuthButtons
              providers={oauthProviders}
              loadingProvider={oauthLoading}
              disabled={loading}
              googleLabel="Continuar con Google"
              appleLabel="Continuar con Apple"
              onGoogle={() => handleOAuth('google')}
              onApple={() => handleOAuth('apple')}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

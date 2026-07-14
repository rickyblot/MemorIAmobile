import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'sonner';
import {
  apiFetch,
  authStore,
  setAuthSession,
  clearAuthSession,
  getStoredUser,
  getStoredToken,
  API_SERVER_URL,
} from '@/lib/apiServerClient';

const AuthContext = createContext();

function getAuthErrorMessage(error, fallback) {
  if (!error) return fallback;
  const raw = error?.message || error?.data?.error || error?.data?.message || '';
  if (typeof raw === 'string' && (raw.includes('<!doctype') || raw.includes('<html') || raw.length > 300)) {
    return fallback;
  }
  return raw || fallback;
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [initialLoading, setInitialLoading] = useState(true);
  const [oauthProviders, setOauthProviders] = useState([]);

  useEffect(() => {
    const unsubscribe = authStore.onChange((_token, model) => {
      setCurrentUser(model);
    });

    (async () => {
      try {
        // Drop inconsistent storage (user without token) so ProtectedRoute cannot open.
        if (getStoredUser() && !getStoredToken()) {
          clearAuthSession();
          setCurrentUser(null);
        } else if (authStore.isValid) {
          const data = await apiFetch('/auth/me');
          // Keep the same storage preference (local vs session) from login.
          setAuthSession(authStore.token, data.user);
          setCurrentUser(data.user);
        } else {
          clearAuthSession();
          setCurrentUser(null);
        }
      } catch {
        clearAuthSession();
        setCurrentUser(null);
      } finally {
        setInitialLoading(false);
      }
    })();

    // Complete OAuth redirect: /login?token=...
    const params = new URLSearchParams(window.location.search);
    const oauthToken = params.get('token');
    const oauthError = params.get('oauth_error');
    if (oauthError) {
      toast.error(decodeURIComponent(oauthError));
      window.history.replaceState({}, '', window.location.pathname);
    }
    if (oauthToken) {
      (async () => {
        try {
          // Seed token so /auth/me can authorize, then persist with remember=true.
          sessionStorage.setItem('mm_auth_token', oauthToken);
          authStore.save(oauthToken, null);
          const data = await apiFetch('/auth/me');
          setAuthSession(oauthToken, data.user, { remember: true });
          setCurrentUser(data.user);
          toast.success('Sesión iniciada');
          window.location.replace('/dashboard');
          return;
        } catch {
          clearAuthSession();
          toast.error('No se pudo completar el inicio de sesión social');
          window.history.replaceState({}, '', window.location.pathname);
        } finally {
          setInitialLoading(false);
        }
      })();
    }

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    let cancelled = false;
    apiFetch('/auth/providers')
      .then((data) => {
        if (!cancelled) setOauthProviders(data.providers || []);
      })
      .catch(() => {
        if (!cancelled) setOauthProviders([]);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = async (email, password, options = {}) => {
    try {
      const data = await apiFetch('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setAuthSession(data.token, data.user, { remember: options.remember !== false });
      setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Login error:', error?.status, error?.message);
      throw new Error(getAuthErrorMessage(error, 'Credenciales inválidas o servidor de autenticación no disponible.'));
    }
  };

  const signup = async (email, password, name) => {
    try {
      const data = await apiFetch('/auth/signup', {
        method: 'POST',
        body: { email, password, name: name || '' },
      });
      setAuthSession(data.token, data.user);
      setCurrentUser(data.user);
      return { success: true, user: data.user };
    } catch (error) {
      console.error('Signup error:', error?.status, error?.message);
      throw new Error(getAuthErrorMessage(error, 'Error al crear la cuenta. Intenta de nuevo.'));
    }
  };

  const loginWithOAuth = async (provider) => {
    if (!oauthProviders.includes(provider)) {
      const data = await apiFetch('/auth/providers').catch(() => ({ providers: [] }));
      const providers = data.providers || [];
      setOauthProviders(providers);
      if (!providers.includes(provider)) {
        throw new Error(
          `El inicio de sesión con ${provider === 'apple' ? 'Apple' : 'Google'} no está configurado. Usa correo y contraseña, o configura las variables OAuth en el API.`,
        );
      }
    }
    // Full-page redirect to API OAuth start
    window.location.href = `${API_SERVER_URL}/auth/oauth/${provider}`;
    return { success: true, redirected: true };
  };

  const logout = async () => {
    try {
      await apiFetch('/auth/logout', { method: 'POST' });
    } catch {
      // ignore
    }
    clearAuthSession();
    setCurrentUser(null);
    toast.success('Sesión cerrada exitosamente');
  };

  const isAuthenticated = Boolean(currentUser && getStoredToken());

  const value = {
    currentUser,
    isAuthenticated,
    login,
    logout,
    signup,
    loginWithOAuth,
    oauthProviders,
    initialLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

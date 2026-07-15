import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Save, Loader2, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useDocumentTitle } from '@/hooks/useDocumentTitle.js';
import { apiFetch, setAuthSession, getStoredToken } from '@/lib/apiServerClient';

export default function ProfilePage() {
  const { currentUser, setCurrentUser } = useAuth();
  useDocumentTitle('Perfil - MemorIAmobile');

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [savingPassword, setSavingPassword] = useState(false);

  useEffect(() => {
    setName(currentUser?.name || '');
    setEmail(currentUser?.email || '');
  }, [currentUser]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const data = await apiFetch('/auth/me', {
        method: 'PATCH',
        body: { name: name.trim() },
      });
      const token = getStoredToken();
      if (token && data.user) {
        setAuthSession(token, data.user);
        setCurrentUser(data.user);
      }
      toast.success('Perfil actualizado');
    } catch (error) {
      toast.error(error.message || 'No se pudo guardar el perfil');
    } finally {
      setSavingProfile(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword.length < 8) {
      toast.error('La nueva contraseña debe tener al menos 8 caracteres');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('La confirmación no coincide');
      return;
    }

    setSavingPassword(true);
    try {
      await apiFetch('/auth/change-password', {
        method: 'POST',
        body: {
          currentPassword,
          newPassword,
          newPasswordConfirm: confirmPassword,
        },
      });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      toast.success('Contraseña actualizada');
    } catch (error) {
      toast.error(error.message || 'No se pudo cambiar la contraseña');
    } finally {
      setSavingPassword(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver al dashboard
          </Link>

          <header className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <User className="w-9 h-9 text-primary" />
              <h1 className="text-3xl md:text-4xl font-extrabold text-primary font-heading tracking-tight">
                Ajustes de perfil
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Gestiona tu nombre y la seguridad de tu cuenta.
            </p>
          </header>

          <div className="space-y-6">
            <form
              onSubmit={handleSaveProfile}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
            >
              <h2 className="text-lg font-bold text-foreground">Información personal</h2>

              <div className="space-y-2">
                <label htmlFor="profile-name" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  Nombre completo
                </label>
                <Input
                  id="profile-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Tu nombre"
                  className="h-12"
                  disabled={savingProfile}
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="profile-email" className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-primary" />
                  Correo electrónico
                </label>
                <Input
                  id="profile-email"
                  type="email"
                  value={email}
                  disabled
                  className="h-12 opacity-70"
                />
                <p className="text-xs text-muted-foreground">
                  El correo no se puede cambiar desde aquí.
                </p>
              </div>

              <Button type="submit" disabled={savingProfile} className="w-full h-12 font-bold">
                {savingProfile ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Guardando…
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5 mr-2" />
                    Guardar cambios
                  </>
                )}
              </Button>
            </form>

            <form
              onSubmit={handleChangePassword}
              className="bg-card border border-border rounded-2xl p-6 sm:p-8 space-y-6 shadow-sm"
            >
              <div className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-accent" />
                <h2 className="text-lg font-bold text-foreground">Cambiar contraseña</h2>
              </div>

              <div className="space-y-2">
                <label htmlFor="current-password" className="text-sm font-semibold">
                  Contraseña actual
                </label>
                <Input
                  id="current-password"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-12"
                  disabled={savingPassword}
                  required
                  autoComplete="current-password"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="new-password" className="text-sm font-semibold">
                  Nueva contraseña
                </label>
                <Input
                  id="new-password"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-12"
                  disabled={savingPassword}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirm-password" className="text-sm font-semibold">
                  Confirmar nueva contraseña
                </label>
                <Input
                  id="confirm-password"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-12"
                  disabled={savingPassword}
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
              </div>

              <Button type="submit" variant="outline" disabled={savingPassword} className="w-full h-12 font-bold">
                {savingPassword ? (
                  <>
                    <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                    Actualizando…
                  </>
                ) : (
                  'Actualizar contraseña'
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                ¿Olvidaste tu contraseña? Usa{' '}
                <Link to="/login" className="text-primary underline-offset-2 hover:underline">
                  recuperación desde el login
                </Link>
                .
              </p>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

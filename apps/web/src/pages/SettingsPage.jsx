import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { Shield, Smartphone, Bell, Moon, Sun, Trash2, Key, Database } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SettingsPage() {
  const { currentUser } = useAuth();
  const [theme, setTheme] = useState('dark'); // In a real app, bind to next-themes or raw DOM manipulation

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(newTheme);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet><title>Ajustes - MemorIA</title></Helmet>
      <Header />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-3xl font-heading font-bold mb-8">Ajustes y Privacidad</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
            {/* Sidebar nav for settings - simple static version */}
            <div className="md:col-span-4 lg:col-span-3 space-y-1">
              <button className="w-full text-left px-4 py-3 rounded-xl bg-primary/10 text-primary font-medium flex items-center gap-3">
                <Shield className="w-5 h-5" /> Privacidad
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium flex items-center gap-3 transition-colors">
                <Smartphone className="w-5 h-5" /> Dispositivos
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium flex items-center gap-3 transition-colors">
                <Database className="w-5 h-5" /> Almacenamiento
              </button>
              <button className="w-full text-left px-4 py-3 rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground font-medium flex items-center gap-3 transition-colors">
                <Bell className="w-5 h-5" /> Notificaciones
              </button>
            </div>

            {/* Settings Content */}
            <div className="md:col-span-8 lg:col-span-9 space-y-8">
              
              <section className="glass-panel p-6 rounded-2xl space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Perfil de Usuario</h2>
                  <p className="text-sm text-muted-foreground">Gestiona tu información básica.</p>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Nombre</label>
                    <input type="text" defaultValue={currentUser?.name} className="w-full bg-input border border-border rounded-lg px-4 py-2.5 outline-none focus:border-primary" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-foreground mb-1 block">Email</label>
                    <input type="email" defaultValue={currentUser?.email} disabled className="w-full bg-background border border-border text-muted-foreground rounded-lg px-4 py-2.5 opacity-70 cursor-not-allowed" />
                  </div>
                  <Button>Guardar Cambios</Button>
                </div>
              </section>

              <section className="glass-panel p-6 rounded-2xl space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Seguridad y Encriptación</h2>
                    <p className="text-sm text-muted-foreground">Tu bóveda utiliza AES-256 por defecto.</p>
                  </div>
                  <Shield className="w-8 h-8 text-success" />
                </div>
                
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Autenticación de Dos Factores (2FA)</p>
                    <p className="text-sm text-muted-foreground">Capa extra de seguridad para tu cuenta.</p>
                  </div>
                  <Button variant="outline">Configurar</Button>
                </div>

                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Cambiar Contraseña</p>
                    <p className="text-sm text-muted-foreground">Actualiza tu contraseña maestra.</p>
                  </div>
                  <Button variant="outline"><Key className="w-4 h-4 mr-2"/> Cambiar</Button>
                </div>
              </section>

              <section className="glass-panel p-6 rounded-2xl space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-foreground mb-1">Preferencias</h2>
                  <p className="text-sm text-muted-foreground">Personaliza tu experiencia en MemorIA.</p>
                </div>
                
                <div className="flex items-center justify-between bg-muted/50 p-4 rounded-xl border border-border">
                  <div>
                    <p className="font-medium text-foreground">Tema de la aplicación</p>
                    <p className="text-sm text-muted-foreground">Cambia entre modo claro y oscuro.</p>
                  </div>
                  <Button variant="outline" onClick={toggleTheme} className="w-12 h-12 p-0 rounded-xl">
                    {theme === 'dark' ? <Moon className="w-5 h-5 text-primary" /> : <Sun className="w-5 h-5 text-warning" />}
                  </Button>
                </div>
              </section>

              <section className="glass-panel p-6 rounded-2xl border-destructive/20 bg-destructive/5 space-y-6">
                <div>
                  <h2 className="text-xl font-heading font-semibold text-destructive mb-1">Zona de Peligro</h2>
                  <p className="text-sm text-muted-foreground">Acciones irreversibles sobre tus datos.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button variant="outline" className="border-border bg-card">Exportar todos mis datos</Button>
                  <Button variant="destructive" className="bg-destructive hover:bg-destructive/90 text-destructive-foreground">
                    <Trash2 className="w-4 h-4 mr-2" /> Eliminar Cuenta
                  </Button>
                </div>
              </section>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
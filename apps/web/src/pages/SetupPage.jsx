import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Smartphone, QrCode, Shield, CheckCircle2, ChevronRight, Lock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext.jsx';

export default function SetupPage() {
  const [step, setStep] = useState(1);
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center items-center p-4">
      <Helmet><title>Configuración de Dispositivo - MemorIA</title></Helmet>

      <div className="w-full max-w-2xl bg-card border border-border rounded-3xl p-8 shadow-2xl relative overflow-hidden">
        {/* Progress bar */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-muted">
          <div className="h-full bg-primary transition-all duration-500 ease-out" style={{ width: `${(step / 3) * 100}%` }}></div>
        </div>

        <div className="text-center mb-10 mt-4">
          <div className="inline-flex items-center justify-center p-3 bg-primary/10 text-primary rounded-2xl mb-6">
            <Smartphone className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-heading font-bold text-foreground mb-2">Conecta tu teléfono</h1>
          <p className="text-muted-foreground text-lg">Para que la magia suceda, necesitamos emparejar tu dispositivo.</p>
        </div>

        <div className="min-h-[250px] flex items-center justify-center">
          {step === 1 && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-48 h-48 bg-white p-4 rounded-2xl mx-auto border-4 border-muted flex items-center justify-center shadow-lg">
                <QrCode className="w-32 h-32 text-black" />
              </div>
              <div className="max-w-sm mx-auto">
                <h3 className="font-semibold text-lg text-foreground mb-2">1. Descarga la App</h3>
                <p className="text-muted-foreground text-sm">Escanea este código QR con la cámara de tu teléfono para descargar MemorIA Mobile de tu App Store o Play Store.</p>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-24 h-24 bg-warning/10 rounded-full mx-auto flex items-center justify-center border-4 border-warning/20">
                <Shield className="w-10 h-10 text-warning" />
              </div>
              <div className="max-w-sm mx-auto">
                <h3 className="font-semibold text-lg text-foreground mb-2">2. Permisos Locales</h3>
                <p className="text-muted-foreground text-sm">Abre la app e inicia sesión. Te pedirá permisos para acceder a tus fotos. <strong>Solo procesamos lo que tú elijas sincronizar.</strong></p>
              </div>
              <div className="bg-muted p-4 rounded-xl text-left border border-border">
                <div className="flex items-center gap-3 mb-2 text-sm text-foreground font-medium"><Lock className="w-4 h-4 text-success"/> Privacidad garantizada</div>
                <p className="text-xs text-muted-foreground">La IA inicial de análisis facial y clasificación se ejecuta on-device (en tu propio teléfono) para máxima privacidad.</p>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-6 animate-in fade-in slide-in-from-bottom-4">
              <div className="w-24 h-24 bg-success/10 rounded-full mx-auto flex items-center justify-center border-4 border-success/20">
                <CheckCircle2 className="w-12 h-12 text-success" />
              </div>
              <div className="max-w-sm mx-auto">
                <h3 className="font-semibold text-xl text-foreground mb-2">¡Todo listo, {currentUser?.name?.split(' ')[0] || 'Usuario'}!</h3>
                <p className="text-muted-foreground">Tu bóveda está preparada. La primera sincronización puede tardar unos minutos en segundo plano.</p>
              </div>
            </div>
          )}
        </div>

        <div className="mt-12 flex items-center justify-between">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)}>Atrás</Button>
          ) : (
            <Link to="/dashboard" className="text-sm font-medium text-muted-foreground hover:text-foreground">Saltar por ahora</Link>
          )}
          
          <Button onClick={handleNext} className="px-8 font-semibold">
            {step === 3 ? 'Ir a mi Bóveda' : 'Siguiente Paso'} <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      </div>
    </div>
  );
}
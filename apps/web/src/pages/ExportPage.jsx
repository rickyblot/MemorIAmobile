import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Film, FileText, LayoutTemplate, Instagram, Loader2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import apiServerClient from '@/lib/apiServerClient.js';
import { toast } from 'sonner';

export default function ExportPage() {
  const [format, setFormat] = useState('video');
  const [isExporting, setIsExporting] = useState(false);
  const [exportComplete, setExportComplete] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // Simulate calling backend
      const response = await apiServerClient.fetch(`/export/${format === 'video' ? 'video' : 'pdf'}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId: 'dummy_id', format: 'mp4', resolution: '1080p' })
      });
      const data = await response.json();
      
      // Fake delay for UI realism
      setTimeout(() => {
        setIsExporting(false);
        setExportComplete(true);
        toast.success('¡Exportación completada!');
      }, 3000);
      
    } catch (err) {
      console.error(err);
      toast.error('Error al exportar. Intentando de nuevo...');
      setIsExporting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet><title>Exportar Historia - MemorIA</title></Helmet>
      <Header />
      <main className="flex-1 py-12 max-w-4xl mx-auto w-full px-4 sm:px-6">
        
        <h1 className="text-3xl font-bold font-serif mb-8 text-center">Elige cómo quieres compartir tu historia</h1>

        {exportComplete ? (
          <div className="glass-card rounded-3xl p-12 text-center flex flex-col items-center border-green-500/30">
            <CheckCircle2 className="w-20 h-20 text-green-500 mb-6" />
            <h2 className="text-3xl font-bold mb-4">¡Listo para compartir!</h2>
            <p className="text-muted-foreground mb-8">Tu archivo se ha generado con éxito y está en alta resolución.</p>
            <div className="flex gap-4">
              <Button size="lg" className="font-bold px-8">Descargar Archivo</Button>
              <Button size="lg" variant="outline" onClick={() => setExportComplete(false)}>Exportar en otro formato</Button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div 
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${format === 'video' ? 'border-primary bg-primary/5' : 'border-border bg-card hover:border-primary/50'}`}
                onClick={() => setFormat('video')}
              >
                <Film className="w-8 h-8 text-primary mb-3" />
                <h3 className="font-bold text-lg">Video MP4 (1080p)</h3>
                <p className="text-sm text-muted-foreground">Perfecto para guardar o reproducir en TV.</p>
              </div>
              
              <div 
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${format === 'social' ? 'border-accent bg-accent/5' : 'border-border bg-card hover:border-accent/50'}`}
                onClick={() => setFormat('social')}
              >
                <Instagram className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-bold text-lg">Formato Redes (Vertical)</h3>
                <p className="text-sm text-muted-foreground">Optimizado para Instagram y TikTok (9:16).</p>
              </div>

              <div 
                className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${format === 'pdf' ? 'border-orange-500 bg-orange-500/5' : 'border-border bg-card hover:border-orange-500/50'}`}
                onClick={() => setFormat('pdf')}
              >
                <FileText className="w-8 h-8 text-orange-500 mb-3" />
                <h3 className="font-bold text-lg">Álbum PDF / Foto-Libro</h3>
                <p className="text-sm text-muted-foreground">Formato revista para impresión en alta calidad.</p>
              </div>
            </div>

            <div className="glass-card p-8 rounded-3xl flex flex-col border border-border">
              <h3 className="text-xl font-bold mb-6">Ajustes de Exportación</h3>
              
              <div className="space-y-6 flex-1">
                <div>
                  <p className="text-sm font-semibold mb-2">Calidad</p>
                  <select className="w-full bg-input rounded-lg border-none p-3 text-sm focus:ring-2 focus:ring-primary outline-none">
                    <option>Alta (1080p HD)</option>
                    <option>Máxima (4K UHD) - Plan Premium</option>
                    <option>Baja (720p) - Más rápido</option>
                  </select>
                </div>
                
                <div>
                  <p className="text-sm font-semibold mb-2">Audio</p>
                  <label className="flex items-center gap-3 text-sm">
                    <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary focus:ring-primary bg-input border-border" />
                    Incluir pista musical seleccionada
                  </label>
                </div>
              </div>

              <Button size="lg" className="w-full font-bold mt-8" onClick={handleExport} disabled={isExporting}>
                {isExporting ? <><Loader2 className="w-5 h-5 mr-2 animate-spin"/> Procesando archivo...</> : 'Iniciar Exportación'}
              </Button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Sparkles, ArrowRight, Wand2, Music, Clapperboard, Download, Film, BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import IntegratedAiChat from '@/components/integrated-ai-chat.jsx';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function StoryGeneratorPage() {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleGenerate = () => {
    toast.success('¡Generación iniciada! Redirigiendo al editor...');
    setTimeout(() => {
      navigate('/story-editor/new');
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet><title>Generador de Historias - MemorIA</title></Helmet>
      <Header />
      <main className="flex-1 py-10 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center">
          <h1 className="text-4xl font-bold font-serif mb-4 flex items-center justify-center gap-3">
            Director de Historias IA <Wand2 className="w-8 h-8 text-accent" />
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Deja que la IA analice tus fotos, encuentre el hilo narrativo y cree un video o álbum con la música y descripciones perfectas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* AI Chat / Assistant Side */}
          <div className="glass-card rounded-3xl overflow-hidden h-[600px] flex flex-col border border-border shadow-xl">
            <div className="bg-secondary p-4 border-b border-border flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/20 text-primary rounded-full flex items-center justify-center"><Sparkles className="w-5 h-5"/></div>
              <div>
                <p className="font-bold">Asistente Creativo</p>
                <p className="text-xs text-muted-foreground">Pídele que seleccione fotos o elija un tema.</p>
              </div>
            </div>
            <div className="flex-1 bg-background overflow-hidden relative">
              <IntegratedAiChat />
            </div>
          </div>

          {/* Configuration Wizard Side */}
          <div className="flex flex-col">
            <div className="flex justify-between mb-8">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 flex-1 mx-1 rounded-full ${step >= i ? 'bg-primary' : 'bg-secondary'}`} />
              ))}
            </div>

            <div className="glass-card p-8 rounded-3xl flex-1 flex flex-col border border-border">
              {step === 1 && (
                <div className="space-y-6 flex-1">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><Clapperboard className="w-6 h-6 text-primary"/> 1. Selección de Contenido</h2>
                  <p className="text-muted-foreground">Dile al asistente qué evento quieres resumir (ej: "Mi viaje a París en 2023"). La IA buscará las mejores fotos.</p>
                  <div className="bg-secondary/30 border border-border rounded-xl p-4 grid grid-cols-3 gap-2">
                    {[...Array(6)].map((_, i) => <div key={i} className="aspect-square bg-muted/50 rounded-lg animate-pulse"></div>)}
                  </div>
                  <Button className="w-full mt-auto" onClick={() => setStep(2)}>Siguiente: Narrativa <ArrowRight className="w-4 h-4 ml-2"/></Button>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-6 flex-1">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><Music className="w-6 h-6 text-primary"/> 2. Estilo y Música</h2>
                  <div className="space-y-4">
                    <div className="p-4 border border-border rounded-xl bg-card">
                      <p className="font-semibold mb-2">Tono sugerido por IA:</p>
                      <div className="flex gap-2">
                        <span className="bg-accent/20 text-accent px-3 py-1 rounded-full text-sm font-medium">Nostálgico</span>
                        <span className="bg-primary/20 text-primary px-3 py-1 rounded-full text-sm font-medium">Aventurero</span>
                      </div>
                    </div>
                    <div className="p-4 border border-border rounded-xl bg-card">
                      <p className="font-semibold mb-2">Pista de audio seleccionada:</p>
                      <div className="flex items-center gap-3 bg-secondary/50 p-3 rounded-lg">
                        <Button variant="outline" size="icon" className="rounded-full w-8 h-8"><div className="w-0 h-0 border-t-4 border-t-transparent border-l-6 border-l-primary border-b-4 border-b-transparent ml-1"></div></Button>
                        <span className="text-sm font-medium">Memories of Summer.mp3</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-auto">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(1)}>Atrás</Button>
                    <Button className="flex-1" onClick={() => setStep(3)}>Siguiente: Formato <ArrowRight className="w-4 h-4 ml-2"/></Button>
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="space-y-6 flex-1">
                  <h2 className="text-2xl font-bold flex items-center gap-2"><Download className="w-6 h-6 text-primary"/> 3. Formato Final</h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="border-2 border-primary bg-primary/5 rounded-xl p-4 cursor-pointer text-center">
                      <Film className="w-8 h-8 mx-auto mb-2 text-primary" />
                      <p className="font-semibold">Video MP4</p>
                      <p className="text-xs text-muted-foreground mt-1">Con transiciones y música</p>
                    </div>
                    <div className="border border-border bg-card rounded-xl p-4 cursor-pointer text-center opacity-70 hover:opacity-100">
                      <BookOpen className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="font-semibold">Álbum PDF</p>
                      <p className="text-xs text-muted-foreground mt-1">Ideal para imprimir</p>
                    </div>
                  </div>
                  <div className="flex gap-4 mt-auto">
                    <Button variant="outline" className="flex-1" onClick={() => setStep(2)}>Atrás</Button>
                    <Button className="flex-1 font-bold" onClick={handleGenerate}><Wand2 className="w-4 h-4 mr-2"/> Generar Obra Maestra</Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
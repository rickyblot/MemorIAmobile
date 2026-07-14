import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Brain, Focus, Users, MapPin, Tag, Search, FileText, Smile } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

export default function AnalysisResultsPage() {
  const { currentUser } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAnalysis() {
      if (!currentUser) return;
      try {
        const data = await pb.collection('analysisResults').getList(1, 10, {
          filter: `userId="${currentUser.id}"`,
          sort: '-created',
          expand: 'fileId',
          $autoCancel: false
        });
        setResults(data.items);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAnalysis();
  }, [currentUser]);

  const mockData = [
    { id: 1, file: { filename: 'IMG_2024.jpg' }, detectedObjects: { items: ['Montaña: 98%', 'Playa: 95%', 'Cielo: 99%'] }, detectedPeople: { persons: ['Mamá: 90%', 'Hermano: 85%'] }, location: 'Málaga, España', detectedEmotions: { emotion: 'Alegría (95%)' }, eventType: 'Vacaciones' },
    { id: 2, file: { filename: 'Recibo_Luz.pdf' }, ocrText: 'Total a pagar: 45.20 EUR. Fecha: 01/05/2024', eventType: 'Documento Financiero', tags: ['Factura', 'Hogar'] }
  ];

  const displayData = results.length > 0 ? results : mockData;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet><title>Resultados de IA - MemorIA</title></Helmet>
      <Header />
      <main className="flex-1 py-10 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="text-center max-w-2xl mx-auto mb-12">
          <Brain className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-4xl font-bold font-serif mb-4">Cerebro MemorIA</h1>
          <p className="text-lg text-muted-foreground">Mira cómo nuestra inteligencia artificial ha clasificado, etiquetado y analizado tus últimos archivos.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {displayData.map((item) => (
            <Card key={item.id} className="bg-card/50 backdrop-blur-sm border-border overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-6 border-b border-border pb-4">
                  <div>
                    <h3 className="text-xl font-bold text-foreground">{item.file?.filename || item.expand?.fileId?.filename || 'Archivo'}</h3>
                    <p className="text-sm text-muted-foreground flex items-center mt-1"><Tag className="w-3 h-3 mr-1"/> {item.eventType || 'Evento general'}</p>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">Análisis Completado</Badge>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {item.detectedObjects?.items && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold flex items-center text-muted-foreground"><Search className="w-4 h-4 mr-2"/> Objetos Detectados</p>
                      <ul className="text-sm space-y-1 text-foreground">
                        {item.detectedObjects.items.map((obj, i) => <li key={i}>• {obj}</li>)}
                      </ul>
                    </div>
                  )}
                  
                  {item.detectedPeople?.persons && (
                    <div className="space-y-2">
                      <p className="text-sm font-semibold flex items-center text-muted-foreground"><Users className="w-4 h-4 mr-2"/> Personas Reconocidas</p>
                      <ul className="text-sm space-y-1 text-foreground">
                        {item.detectedPeople.persons.map((p, i) => <li key={i}>• {p}</li>)}
                      </ul>
                    </div>
                  )}

                  {item.location && (
                    <div className="space-y-2 col-span-2">
                      <p className="text-sm font-semibold flex items-center text-muted-foreground"><MapPin className="w-4 h-4 mr-2"/> Ubicación (GPS/Visual)</p>
                      <p className="text-sm text-foreground">{item.location}</p>
                    </div>
                  )}

                  {item.ocrText && (
                    <div className="space-y-2 col-span-2 bg-secondary/30 p-3 rounded-lg border border-border">
                      <p className="text-sm font-semibold flex items-center text-muted-foreground"><FileText className="w-4 h-4 mr-2"/> Texto Extraído (OCR)</p>
                      <p className="text-sm font-mono text-foreground">{item.ocrText}</p>
                    </div>
                  )}

                  {item.detectedEmotions && (
                    <div className="space-y-2 col-span-2">
                      <p className="text-sm font-semibold flex items-center text-muted-foreground"><Smile className="w-4 h-4 mr-2"/> Emociones</p>
                      <p className="text-sm text-foreground">{item.detectedEmotions.emotion}</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
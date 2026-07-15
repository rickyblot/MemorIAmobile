
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  HardDrive, Search, Mic, Calendar, Image as ImageIcon, 
  DownloadCloud, Star, FileText, ArrowRight, ShieldCheck,
  Video, MapPin, Users, UploadCloud
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useDocumentTitle } from '@/hooks/useDocumentTitle.js';
import { toast } from 'sonner';

export default function DashboardPage() {
  const { currentUser } = useAuth();
  useDocumentTitle('Mi Bóveda - MemorIAmobile');
  
  const storageUsed = 0.0;
  const storageTotal = 5.0;
  const storagePercentage = (storageUsed / storageTotal) * 100;

  // Empty timeline to demonstrate the empty state
  const mockTimeline = [];

  const smartAlbums = [
    { name: 'Fotos', type: 'photos', icon: <ImageIcon className="w-6 h-6" /> },
    { name: 'Vídeos', type: 'videos', icon: <Video className="w-6 h-6" /> },
    { name: 'Documentos', type: 'documents', icon: <FileText className="w-6 h-6" /> },
    { name: 'Notas de voz', type: 'voice-notes', icon: <Mic className="w-6 h-6" /> },
    { name: 'Lugares', type: 'places', icon: <MapPin className="w-6 h-6" /> },
    { name: 'Personas', type: 'people', icon: <Users className="w-6 h-6" /> },
  ];

  const handleVoiceSearch = () => {
    toast('Funcionalidad próximamente', {
      description: 'La búsqueda por voz se activará en la próxima actualización.',
    });
  };

  const handleDownloadBackup = () => {
    toast('Preparando descarga...', {
      description: 'Te notificaremos cuando tu archivo ZIP esté listo.',
    });
  };

  const handleUpload = () => {
    toast('Funcionalidad próximamente', {
      description: 'El módulo de subida de archivos estará disponible pronto.',
    });
  };

  return (
    <div className="min-h-screen bg-secondary flex flex-col">
      <Header />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-extrabold text-primary font-heading">
              Hola, {currentUser?.name || 'Usuario'}
            </h1>
            <p className="text-muted-foreground mt-1 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-accent" /> 
              Tus recuerdos están cifrados y seguros.
            </p>
          </div>
          <Button asChild variant="outline" className="font-semibold">
            <Link to="/profile">Ajustes de perfil</Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-4 space-y-8">
            
            {/* Storage Summary Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-card rounded-3xl p-6 border border-border shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-2">
                  <HardDrive className="w-5 h-5 text-accent" />
                  <h3 className="font-semibold text-foreground text-lg">Almacenamiento</h3>
                </div>
                <span className="text-sm font-medium text-muted-foreground">{storagePercentage.toFixed(0)}%</span>
              </div>
              
              <div className="mb-2 flex justify-between text-sm">
                <span className="font-bold text-primary">{storageUsed} GB usados</span>
                <span className="text-muted-foreground">{storageTotal} GB total</span>
              </div>
              
              <Progress value={storagePercentage} className="h-3 bg-secondary mb-6 [&>div]:bg-accent" />
              
              <div className="flex gap-4 mt-6 pt-6 border-t border-border">
                <Button variant="outline" onClick={handleDownloadBackup} className="w-full text-sm">
                  <DownloadCloud className="w-4 h-4 mr-2" />
                  Descargar Copia
                </Button>
              </div>
            </motion.div>

            {/* Subscription Card */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-primary text-primary-foreground rounded-3xl p-6 shadow-md"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-primary-foreground/70 text-sm font-medium uppercase tracking-wider mb-1">Plan Actual</p>
                  <h3 className="font-bold text-2xl">Gratis</h3>
                </div>
                <Star className="w-8 h-8 text-accent opacity-50" />
              </div>
              <p className="text-primary-foreground/80 text-sm mb-6">
                Mejora a Premium para obtener 500GB y organizar caras y lugares con IA avanzada.
              </p>
              <Button asChild className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                <Link to="/plans">Mejorar Plan</Link>
              </Button>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-8 space-y-8">
            
            {/* Search Bar */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-card rounded-2xl p-4 border border-border shadow-sm flex items-center gap-3"
            >
              <Search className="w-5 h-5 text-muted-foreground shrink-0 ml-2" />
              <Input 
                placeholder="Busca 'Factura del taller' o 'Fotos de la playa en agosto'..." 
                className="border-0 shadow-none focus-visible:ring-0 text-base bg-transparent text-foreground"
              />
              <Button 
                variant="secondary" 
                size="icon" 
                className="shrink-0 rounded-xl"
                onClick={handleVoiceSearch}
                aria-label="Búsqueda por voz"
              >
                <Mic className="w-5 h-5 text-primary" />
              </Button>
            </motion.div>

            {/* Smart Albums */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-xl text-primary">Álbumes Inteligentes</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {smartAlbums.map((album, i) => (
                  <Link 
                    to={`/dashboard/albums/${album.type}`}
                    key={i} 
                    className="bg-card border border-border p-5 rounded-2xl cursor-pointer hover:border-accent hover:shadow-md hover:-translate-y-1 transition-all duration-300 group block"
                  >
                    <div className="w-12 h-12 bg-secondary rounded-xl flex items-center justify-center text-primary mb-3 group-hover:bg-accent group-hover:text-accent-foreground transition-colors">
                      {album.icon}
                    </div>
                    <p className="font-bold text-foreground text-base mb-1">{album.name}</p>
                    <p className="text-xs text-muted-foreground font-medium">0 elementos</p>
                  </Link>
                ))}
              </div>
            </motion.div>

            {/* Timeline */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-card rounded-3xl p-6 border border-border shadow-sm"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-primary flex items-center gap-2">
                  <Calendar className="w-5 h-5" /> Línea de Tiempo
                </h3>
              </div>
              
              {mockTimeline.length > 0 ? (
                <div className="space-y-6">
                  {mockTimeline.map((item) => (
                    <div key={item.id} className="flex gap-4 relative">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full bg-accent z-10"></div>
                        <div className="w-px h-full bg-border -mt-1 -mb-6 absolute top-3 bottom-0"></div>
                      </div>
                      <div className="pb-6">
                        <p className="text-sm font-semibold text-foreground">{item.date}</p>
                        <div className="mt-2 bg-secondary p-4 rounded-2xl flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center text-primary shrink-0">
                              {item.type === 'photo' ? <ImageIcon className="w-5 h-5" /> : 
                               item.type === 'document' ? <FileText className="w-5 h-5" /> : 
                               <Search className="w-5 h-5" />}
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm sm:text-base">{item.desc}</p>
                              <p className="text-xs text-muted-foreground">{item.items} elementos organizados</p>
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-accent transition-colors">
                            <ArrowRight className="w-5 h-5" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* End of line indicator */}
                  <div className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-3 h-3 rounded-full bg-border"></div>
                    </div>
                    <p className="text-sm text-muted-foreground italic">Fin de los registros recientes</p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-border rounded-2xl bg-secondary/30">
                  <div className="w-16 h-16 bg-secondary text-muted-foreground rounded-2xl flex items-center justify-center mb-4 shadow-sm">
                    <Calendar className="w-8 h-8" />
                  </div>
                  <span className="bg-secondary text-secondary-foreground px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4">
                    0 elementos
                  </span>
                  <h4 className="text-xl font-bold text-foreground mb-2">Tu línea de tiempo está vacía</h4>
                  <p className="text-sm text-muted-foreground mb-8 max-w-md text-balance">
                    Sube tus primeras fotos, vídeos o documentos para que nuestra IA comience a organizar tu historia automáticamente.
                  </p>
                  <Button 
                    onClick={handleUpload}
                    className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl px-6 font-semibold"
                  >
                    <UploadCloud className="w-5 h-5 mr-2" />
                    Subir recuerdos
                  </Button>
                </div>
              )}
            </motion.div>

          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

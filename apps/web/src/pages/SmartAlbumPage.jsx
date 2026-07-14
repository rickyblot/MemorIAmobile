
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { ArrowLeft, Image as ImageIcon, Video, FileText, Mic, MapPin, Users, FolderOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

const ALBUM_CONFIG = {
  'photos': { title: 'Fotos', icon: <ImageIcon className="w-16 h-16 text-muted-foreground/50 mb-4" /> },
  'videos': { title: 'Vídeos', icon: <Video className="w-16 h-16 text-muted-foreground/50 mb-4" /> },
  'documents': { title: 'Documentos', icon: <FileText className="w-16 h-16 text-muted-foreground/50 mb-4" /> },
  'voice-notes': { title: 'Notas de voz', icon: <Mic className="w-16 h-16 text-muted-foreground/50 mb-4" /> },
  'places': { title: 'Lugares', icon: <MapPin className="w-16 h-16 text-muted-foreground/50 mb-4" /> },
  'people': { title: 'Personas', icon: <Users className="w-16 h-16 text-muted-foreground/50 mb-4" /> },
};

export default function SmartAlbumPage() {
  const { albumType } = useParams();
  const navigate = useNavigate();
  
  const config = ALBUM_CONFIG[albumType] || { title: 'Álbum', icon: <FolderOpen className="w-16 h-16 text-muted-foreground/50 mb-4" /> };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>{`${config.title} - MemorIAmobile`}</title>
      </Helmet>
      
      <Header />

      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            className="mb-4 text-muted-foreground hover:text-foreground -ml-4"
            onClick={() => navigate('/dashboard')}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al Dashboard
          </Button>
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-baseline gap-4">
            <h1 className="text-3xl font-extrabold text-primary font-heading tracking-tight">
              {config.title}
            </h1>
            <span className="bg-secondary text-secondary-foreground font-medium px-4 py-1.5 rounded-full text-sm shadow-sm">
              0 elementos
            </span>
          </div>
        </div>

        {/* Empty State */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-card border border-dashed border-border rounded-3xl p-12 mt-8 flex flex-col items-center justify-center min-h-[400px] text-center shadow-sm"
        >
          {config.icon}
          <h2 className="text-xl font-bold text-foreground mb-2">No hay elementos en este álbum</h2>
          <p className="text-muted-foreground max-w-md mx-auto mb-8 text-balance">
            La Inteligencia Artificial organizará automáticamente tus archivos aquí cuando subas contenido nuevo que coincida con esta categoría.
          </p>
          <Button 
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl px-8"
            onClick={() => navigate('/dashboard')}
          >
            Subir archivos
          </Button>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

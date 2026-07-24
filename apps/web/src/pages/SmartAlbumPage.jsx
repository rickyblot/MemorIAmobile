import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Image as ImageIcon, Video, FileText, Mic, MapPin, Users, FolderOpen, Loader2, UploadCloud,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import MemoryUpload from '@/components/MemoryUpload.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const ALBUM_CONFIG = {
  photos: {
    title: 'Fotos',
    icon: ImageIcon,
    match: (m) => m.event_category === 'photo' || String(m.fileType || '').startsWith('image/'),
  },
  videos: {
    title: 'Vídeos',
    icon: Video,
    match: (m) => m.event_category === 'video' || String(m.fileType || '').startsWith('video/'),
  },
  documents: {
    title: 'Documentos',
    icon: FileText,
    match: (m) => m.event_category === 'document' || String(m.fileType || '').includes('pdf'),
  },
  'voice-notes': {
    title: 'Notas de voz',
    icon: Mic,
    match: (m) => m.event_category === 'voice' || String(m.fileType || '').startsWith('audio/'),
  },
  places: {
    title: 'Lugares',
    icon: MapPin,
    match: (m) => Boolean(m.location),
  },
  people: {
    title: 'Personas',
    icon: Users,
    match: (m) => Boolean(m.people && String(m.people).trim()),
  },
};

function formatDate(value) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function SmartAlbumPage() {
  const { albumType } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);

  const config = ALBUM_CONFIG[albumType] || {
    title: 'Álbum',
    icon: FolderOpen,
    match: () => true,
  };
  const Icon = config.icon;

  const fetchMemories = useCallback(async () => {
    if (!currentUser?.id) {
      setMemories([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const records = await pb.collection('memories').getFullList({
        sort: '-date',
        $autoCancel: false,
      });
      setMemories(records);
    } catch (error) {
      console.error(error);
      toast.error('No se pudieron cargar los archivos de este álbum.');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const items = useMemo(
    () => memories.filter(config.match || (() => true)),
    [memories, config],
  );

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

          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h1 className="text-3xl font-extrabold text-primary font-heading tracking-tight">
              {config.title}
            </h1>
            <div className="flex items-center gap-3">
              <span className="bg-secondary text-secondary-foreground font-medium px-4 py-1.5 rounded-full text-sm shadow-sm">
                {loading ? '…' : `${items.length} elemento${items.length === 1 ? '' : 's'}`}
              </span>
              <Button
                className="rounded-full border-0 bg-gradient-to-r from-[#b735ec] via-[#7652f4] to-[#27a9f6] text-white hover:brightness-110"
                onClick={() => setShowUpload(true)}
              >
                <UploadCloud className="w-4 h-4 mr-2" />
                Subir archivos
              </Button>
            </div>
          </div>
        </div>

        {showUpload && (
          <div className="mb-10">
            <MemoryUpload
              onUploadComplete={() => {
                setShowUpload(false);
                fetchMemories();
              }}
            />
          </div>
        )}

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-accent" />
          </div>
        ) : items.length > 0 ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((item) => (
              <article key={item.id} className="memory-lift rounded-2xl border border-border bg-card p-5">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary text-accent">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="text-xs text-foreground/50">{formatDate(item.date)}</p>
                <h2 className="mt-2 font-heading text-xl text-primary">{item.title || 'Sin título'}</h2>
                {item.description ? (
                  <p className="mt-2 line-clamp-3 text-sm text-foreground/65">{item.description}</p>
                ) : null}
                {item.file ? (
                  <a
                    href={pb.files.getURL(item)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-4 inline-flex text-sm font-semibold text-accent hover:underline"
                  >
                    Abrir archivo
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
            className="bg-card border border-dashed border-border rounded-3xl p-12 mt-8 flex flex-col items-center justify-center min-h-[400px] text-center shadow-sm"
          >
            <Icon className="w-16 h-16 text-muted-foreground/50 mb-4" />
            <h2 className="text-xl font-bold text-foreground mb-2">No hay elementos en este álbum</h2>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-balance">
              Sube un archivo para empezar a llenar esta colección.
            </p>
            <Button
              className="rounded-full border-0 bg-gradient-to-r from-[#b735ec] via-[#7652f4] to-[#27a9f6] px-8 text-white hover:brightness-110"
              onClick={() => setShowUpload(true)}
            >
              Subir archivos
            </Button>
            <Button asChild variant="ghost" className="mt-3">
              <Link to="/dashboard">Volver al dashboard</Link>
            </Button>
          </motion.div>
        )}
      </main>

      <Footer />
    </div>
  );
}

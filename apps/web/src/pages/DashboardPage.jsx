import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HardDrive, Search, Mic, Calendar, Image as ImageIcon,
  DownloadCloud, FileText, ArrowRight, ShieldCheck,
  Video, MapPin, Users, UploadCloud, Loader2, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import MemoryUpload from '@/components/MemoryUpload.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useDocumentTitle } from '@/hooks/useDocumentTitle.js';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

const enter = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55 },
};

const STORAGE_TOTAL_GB = 5;

const ALBUMS = [
  { name: 'Fotografías', type: 'photos', icon: ImageIcon, match: (m) => m.event_category === 'photo' || String(m.fileType || '').startsWith('image/') },
  { name: 'Vídeos', type: 'videos', icon: Video, match: (m) => m.event_category === 'video' || String(m.fileType || '').startsWith('video/') },
  { name: 'Documentos', type: 'documents', icon: FileText, match: (m) => m.event_category === 'document' || String(m.fileType || '').includes('pdf') },
  { name: 'Voces', type: 'voice-notes', icon: Mic, match: (m) => m.event_category === 'voice' || String(m.fileType || '').startsWith('audio/') },
  { name: 'Lugares', type: 'places', icon: MapPin, match: (m) => Boolean(m.location) },
  { name: 'Personas', type: 'people', icon: Users, match: (m) => Boolean(m.people && String(m.people).trim()) },
];

function formatTimelineDate(value) {
  if (!value) return 'Sin fecha';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' });
}

export default function DashboardPage() {
  const { currentUser } = useAuth();
  useDocumentTitle('Mi línea de tiempo - MemorIAmobile');

  const [memories, setMemories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showUpload, setShowUpload] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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
      toast.error('No se pudieron cargar tus recuerdos.');
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  const filteredTimeline = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const list = [...memories].sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
    if (!query) return list;
    return list.filter((memory) => {
      const haystack = [memory.title, memory.description, memory.location, memory.people]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(query);
    });
  }, [memories, searchQuery]);

  const storageUsedGb = useMemo(() => {
    const bytes = memories.reduce((sum, memory) => sum + Number(memory.file_size_bytes || 0), 0);
    return bytes / (1024 * 1024 * 1024);
  }, [memories]);

  const storagePercentage = Math.min(100, (storageUsedGb / STORAGE_TOTAL_GB) * 100);

  const albumCounts = useMemo(() => {
    const counts = {};
    for (const album of ALBUMS) {
      counts[album.type] = memories.filter(album.match).length;
    }
    return counts;
  }, [memories]);

  const handleUploadComplete = () => {
    setShowUpload(false);
    fetchMemories();
  };

  const handleDownloadBackup = () => toast('Preparando tu copia...', {
    description: 'Te avisaremos cuando tu archivo esté listo.',
  });

  const handleVoiceSearch = () => toast('Búsqueda por voz próximamente', {
    description: 'Puedes usar el buscador de texto mientras tanto.',
  });

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="paper-texture mx-auto max-w-7xl px-6 py-12 sm:px-8 lg:px-12 lg:py-16">
        <motion.header {...enter} className="mb-12 border-b border-primary/15 pb-10">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow mb-4 text-accent">Tu espacio privado</p>
              <h1 className="text-4xl font-semibold text-primary sm:text-5xl">
                Bienvenido de nuevo, {currentUser?.name || 'Usuario'}.
              </h1>
              <p className="mt-4 flex items-center gap-2 text-foreground/60">
                <ShieldCheck className="h-4 w-4 text-accent" /> Tus recuerdos están guardados y seguros.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button
                className="rounded-full border-0 bg-gradient-to-r from-[#b735ec] via-[#7652f4] to-[#27a9f6] px-6 text-white shadow-lg shadow-[#7652f4]/20 hover:brightness-110"
                onClick={() => setShowUpload(true)}
              >
                <UploadCloud className="h-4 w-4" /> Añadir recuerdo
              </Button>
              <Button asChild variant="outline" className="rounded-full bg-transparent">
                <Link to="/profile">Ajustes de perfil</Link>
              </Button>
            </div>
          </div>
        </motion.header>

        {showUpload && (
          <motion.section
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative mb-12"
          >
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="eyebrow mb-2 text-accent">Nuevo recuerdo</p>
                <h2 className="text-2xl font-semibold text-primary">Sube fotos, vídeos o documentos</h2>
              </div>
              <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setShowUpload(false)} aria-label="Cerrar subida">
                <X className="h-5 w-5" />
              </Button>
            </div>
            <MemoryUpload onUploadComplete={handleUploadComplete} />
          </motion.section>
        )}

        <motion.div {...enter} transition={{ duration: 0.55, delay: 0.08 }} className="mb-12 flex items-center gap-3 border-b border-primary/20 bg-card px-5 py-3 shadow-sm">
          <Search className="h-5 w-5 shrink-0 text-accent" />
          <Input
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Busca una persona, un lugar o un momento..."
            className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0"
          />
          <Button variant="ghost" size="icon" onClick={handleVoiceSearch} aria-label="Buscar por voz" className="rounded-full">
            <Mic className="h-5 w-5" />
          </Button>
        </motion.div>

        <div className="grid gap-10 lg:grid-cols-12">
          <motion.section {...enter} transition={{ duration: 0.55, delay: 0.14 }} className="lg:col-span-8">
            <div className="mb-6 flex items-end justify-between">
              <div>
                <p className="eyebrow mb-3 text-accent">Tu historia</p>
                <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Línea de tiempo</h2>
              </div>
              <span className="text-sm text-foreground/50">
                {loading ? '…' : `${filteredTimeline.length} recuerdo${filteredTimeline.length === 1 ? '' : 's'}`}
              </span>
            </div>

            {loading ? (
              <div className="flex min-h-[320px] items-center justify-center border border-dashed border-accent/40 bg-card/60">
                <Loader2 className="h-8 w-8 animate-spin text-accent" />
              </div>
            ) : filteredTimeline.length > 0 ? (
              <div className="border-l border-accent/50 pl-8">
                {filteredTimeline.map((item) => (
                  <article key={item.id} className="relative mb-10">
                    <span className="absolute -left-[2.28rem] top-2 h-3 w-3 rounded-full bg-accent" />
                    <p className="font-heading text-xl text-primary">{formatTimelineDate(item.date)}</p>
                    <p className="mt-2 font-medium text-foreground">{item.title || 'Recuerdo sin título'}</p>
                    {item.description ? (
                      <p className="mt-1 text-foreground/65">{item.description}</p>
                    ) : null}
                  </article>
                ))}
              </div>
            ) : (
              <div className="flex min-h-[440px] flex-col items-center justify-center border border-dashed border-accent/60 bg-card/60 px-6 py-16 text-center">
                <div className="mb-7 flex h-16 w-16 items-center justify-center rounded-full bg-secondary text-accent">
                  <Calendar className="h-7 w-7" />
                </div>
                <p className="eyebrow mb-4 text-accent">La primera página está en blanco</p>
                <h3 className="max-w-md text-3xl font-medium text-primary">Tu historia empieza con un solo recuerdo.</h3>
                <p className="mt-4 max-w-md leading-relaxed text-foreground/60">
                  Añade una fotografía, un vídeo o una voz que no quieras perder. A partir de ahí construiremos tu línea de tiempo.
                </p>
                <Button onClick={() => setShowUpload(true)} className="mt-8 rounded-full px-7">
                  <UploadCloud className="h-4 w-4" /> Añadir mi primer recuerdo
                </Button>
              </div>
            )}
          </motion.section>

          <aside className="space-y-8 lg:col-span-4">
            <motion.div {...enter} transition={{ duration: 0.55, delay: 0.2 }} className="border-t-2 border-accent bg-card p-7 shadow-sm">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HardDrive className="h-5 w-5 text-accent" />
                  <h3 className="font-heading text-2xl text-primary">Tu espacio</h3>
                </div>
                <span className="text-sm text-foreground/50">{storagePercentage.toFixed(0)}%</span>
              </div>
              <div className="mb-3 flex justify-between text-sm">
                <span>{storageUsedGb < 0.01 ? `${(storageUsedGb * 1024).toFixed(1)} MB` : `${storageUsedGb.toFixed(2)} GB`} guardados</span>
                <span className="text-foreground/50">{STORAGE_TOTAL_GB} GB</span>
              </div>
              <Progress value={storagePercentage} className="mb-6 h-2 bg-secondary [&>div]:bg-accent" />
              <Button variant="ghost" onClick={handleDownloadBackup} className="w-full justify-between border-t border-border pt-6 text-sm">
                Descargar una copia <DownloadCloud className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div {...enter} transition={{ duration: 0.55, delay: 0.26 }} className="bg-secondary p-7 text-primary">
              <p className="eyebrow mb-3 text-accent">Plan actual</p>
              <h3 className="text-3xl font-medium">Inicio</h3>
              <p className="mt-4 text-sm leading-relaxed text-foreground/70">Tu espacio para comenzar. Cuando tu historia crezca, podrás ampliar su capacidad.</p>
              <Button asChild className="mt-7 w-full rounded-full border-0 bg-gradient-to-r from-[#b735ec] via-[#7652f4] to-[#27a9f6] text-white hover:brightness-110">
                <Link to="/plans">Ver planes <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </motion.div>
          </aside>
        </div>

        <motion.section {...enter} transition={{ duration: 0.55, delay: 0.3 }} className="mt-20">
          <div className="mb-8">
            <p className="eyebrow mb-3 text-accent">Colecciones</p>
            <h2 className="text-3xl font-semibold text-primary sm:text-4xl">Explora tus recuerdos</h2>
          </div>
          <div className="grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 lg:grid-cols-6">
            {ALBUMS.map(({ name, type, icon: Icon }) => (
              <Link
                to={`/dashboard/albums/${type}`}
                key={type}
                className="memory-lift group border-b border-r border-border bg-card p-6 transition-colors hover:bg-secondary/70"
              >
                <Icon className="mb-8 h-5 w-5 text-accent" />
                <p className="font-heading text-xl text-primary">{name}</p>
                <p className="mt-1 text-xs text-foreground/45">
                  {albumCounts[type] || 0} elemento{(albumCounts[type] || 0) === 1 ? '' : 's'}
                </p>
              </Link>
            ))}
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

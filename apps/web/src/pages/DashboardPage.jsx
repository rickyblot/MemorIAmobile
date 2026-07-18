import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  HardDrive, Search, Mic, Calendar, Image as ImageIcon,
  DownloadCloud, FileText, ArrowRight, ShieldCheck,
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

const enter = {
  initial: { opacity: 0, y: 18 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.55 },
};

export default function DashboardPage() {
  const { currentUser } = useAuth();
  useDocumentTitle('Mi línea de tiempo - MemorIAmobile');

  const storageUsed = 0.0;
  const storageTotal = 5.0;
  const storagePercentage = (storageUsed / storageTotal) * 100;
  const mockTimeline = [];

  const albums = [
    { name: 'Fotografías', type: 'photos', icon: ImageIcon },
    { name: 'Vídeos', type: 'videos', icon: Video },
    { name: 'Documentos', type: 'documents', icon: FileText },
    { name: 'Voces', type: 'voice-notes', icon: Mic },
    { name: 'Lugares', type: 'places', icon: MapPin },
    { name: 'Personas', type: 'people', icon: Users },
  ];

  const handleVoiceSearch = () => toast('Búsqueda por voz próximamente', {
    description: 'Estamos preparando una forma más natural de volver a tus recuerdos.',
  });

  const handleDownloadBackup = () => toast('Preparando tu copia...', {
    description: 'Te avisaremos cuando tu archivo esté listo.',
  });

  const handleUpload = () => toast('Subida de recuerdos próximamente', {
    description: 'Este espacio estará disponible muy pronto.',
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
            <Button asChild variant="outline" className="rounded-full bg-transparent">
              <Link to="/profile">Ajustes de perfil</Link>
            </Button>
          </div>
        </motion.header>

        <motion.div {...enter} transition={{ duration: 0.55, delay: 0.08 }} className="mb-12 flex items-center gap-3 border-b border-primary/20 bg-card px-5 py-3 shadow-sm">
          <Search className="h-5 w-5 shrink-0 text-accent" />
          <Input
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
              <span className="text-sm text-foreground/50">0 recuerdos</span>
            </div>

            {mockTimeline.length > 0 ? (
              <div className="border-l border-accent/50 pl-8">
                {mockTimeline.map((item) => (
                  <article key={item.id} className="relative mb-10">
                    <span className="absolute -left-[2.28rem] top-2 h-3 w-3 rounded-full bg-accent" />
                    <p className="font-heading text-xl text-primary">{item.date}</p>
                    <p className="mt-2 text-foreground/65">{item.desc}</p>
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
                <Button onClick={handleUpload} className="mt-8 rounded-full px-7">
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
                <span>{storageUsed} GB guardados</span>
                <span className="text-foreground/50">{storageTotal} GB</span>
              </div>
              <Progress value={storagePercentage} className="mb-6 h-2 bg-secondary [&>div]:bg-accent" />
              <Button variant="ghost" onClick={handleDownloadBackup} className="w-full justify-between border-t border-border pt-6 text-sm">
                Descargar una copia <DownloadCloud className="h-4 w-4" />
              </Button>
            </motion.div>

            <motion.div {...enter} transition={{ duration: 0.55, delay: 0.26 }} className="bg-primary p-7 text-primary-foreground">
              <p className="eyebrow mb-3 text-accent">Plan actual</p>
              <h3 className="text-3xl font-medium">Inicio</h3>
              <p className="mt-4 text-sm leading-relaxed text-primary-foreground/65">Tu espacio para comenzar. Cuando tu historia crezca, podrás ampliar su capacidad.</p>
              <Button asChild variant="secondary" className="mt-7 w-full rounded-full">
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
            {albums.map(({ name, type, icon: Icon }) => (
              <Link
                to={`/dashboard/albums/${type}`}
                key={type}
                className="memory-lift group border-b border-r border-border bg-card p-6 transition-colors hover:bg-secondary/70"
              >
                <Icon className="mb-8 h-5 w-5 text-accent" />
                <p className="font-heading text-xl text-primary">{name}</p>
                <p className="mt-1 text-xs text-foreground/45">0 elementos</p>
              </Link>
            ))}
          </div>
        </motion.section>
      </main>

      <Footer />
    </div>
  );
}

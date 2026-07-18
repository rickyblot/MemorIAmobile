import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Check, LockKeyhole, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import DemoVideoModal from '@/components/DemoVideoModal.jsx';
import HeroAmbientEffects from '@/components/HeroAmbientEffects.jsx';
import LogoHoverBorder from '@/components/LogoHoverBorder.jsx';

export default function HomePage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const reveal = reduceMotion
    ? {
        initial: { opacity: 0 },
        whileInView: { opacity: 1 },
        viewport: { once: true, margin: '-40px' },
        transition: { duration: 0.2 },
      }
    : {
        initial: { opacity: 0, y: 24, filter: 'blur(5px) sepia(0.2)' },
        whileInView: { opacity: 1, y: 0, filter: 'blur(0px) sepia(0)' },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
      };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>MemorIAmobile — Conserva los momentos que importan</title>
        <meta name="description" content="Un lugar privado para guardar, organizar y volver a vivir las fotos, voces e historias que cuentan tu vida." />
      </Helmet>

      <Header />

      <main>
        <section
          className="relative min-h-dvh overflow-hidden bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/memoria-hero.jpg')" }}
        >
          <HeroAmbientEffects />
          <div className="relative z-10 mx-auto flex min-h-dvh max-w-7xl items-center px-6 pb-16 pt-28 sm:px-8 lg:px-12">
            <motion.div
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="max-w-xl text-left"
            >
              <p className="eyebrow logo-gradient-text mb-7">Tu historia, siempre contigo</p>
              <h1 className="mb-7 text-5xl font-semibold leading-[1.02] text-primary sm:text-6xl lg:text-7xl">
                Los momentos que el tiempo no debería borrar.
              </h1>
              <p className="mb-10 max-w-lg text-lg leading-relaxed text-foreground/75 md:text-xl">
                Guarda las fotos, voces y recuerdos que cuentan tu vida. Nosotros los cuidamos y organizamos para que puedas volver a ellos, incluso dentro de muchos años.
              </p>

              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Button asChild size="lg" className="clockwise-logo-border w-full rounded-full px-8 py-6 text-base sm:w-auto">
                  <Link to="/signup">Empieza tu línea de tiempo <ArrowRight className="h-4 w-4" /><LogoHoverBorder /></Link>
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  onClick={() => setIsVideoModalOpen(true)}
                  className="clockwise-logo-border w-full rounded-full px-7 py-6 text-base text-primary sm:w-auto"
                >
                  <Play
                    className="h-4 w-4"
                    fill="url(#logo-play-gradient)"
                    stroke="url(#logo-play-gradient)"
                  />{' '}
                  Ver cómo funciona <LogoHoverBorder />
                </Button>
                <svg width="0" height="0" aria-hidden="true" className="absolute">
                  <defs>
                    <linearGradient id="logo-play-gradient" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#b735ec" />
                      <stop offset="48%" stopColor="#7652f4" />
                      <stop offset="100%" stopColor="#27a9f6" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <p className="mt-8 flex items-center gap-2 text-sm text-foreground/55">
                <LockKeyhole className="h-4 w-4 text-accent" /> Privado por diseño. Tú decides quién puede verlo.
              </p>
            </motion.div>
          </div>

        </section>

        <section className="border-y border-border bg-card py-20 sm:py-28">
          <motion.div {...reveal} className="mx-auto max-w-4xl px-6 text-center sm:px-8">
            <p className="eyebrow mb-6 text-accent">Más que archivos</p>
            <h2 className="text-4xl font-medium leading-tight text-primary sm:text-5xl">
              Una fotografía no es solo una imagen. Es una voz, un lugar y una parte de ti.
            </h2>
            <p className="mx-auto mt-7 max-w-2xl text-lg leading-relaxed text-foreground/65">
              MemorIAmobile convierte una colección dispersa de fotos y medios en una historia a la que siempre puedes regresar.
            </p>
          </motion.div>
        </section>

        <section id="how-it-works" className="paper-texture py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <motion.div {...reveal} className="mb-16 grid gap-6 md:grid-cols-2 md:items-end">
              <div>
                <p className="eyebrow mb-5 text-accent">Un proceso sencillo</p>
                <h2 className="max-w-xl text-4xl font-semibold text-primary sm:text-5xl">Tu historia encuentra su lugar.</h2>
              </div>
              <p className="max-w-lg text-lg leading-relaxed text-foreground/65 md:justify-self-end">
                Sin carpetas interminables ni nombres imposibles. Solo tus momentos, ordenados con cuidado.
              </p>
            </motion.div>

            <div className="border-t border-primary/20">
              {[
                ['01', 'Guarda', 'Añade fotografías, vídeos, notas de voz y documentos desde cualquier dispositivo.'],
                ['02', 'Recuerda', 'Cada momento se organiza por fecha, lugar y personas para que tenga contexto.'],
                ['03', 'Vuelve', 'Busca con palabras naturales y regresa a una época, una persona o un instante.'],
              ].map(([number, title, text], index) => (
                <motion.div
                  key={number}
                  {...reveal}
                  transition={{ ...reveal.transition, delay: index * 0.08 }}
                  className="grid gap-4 border-b border-primary/20 py-9 md:grid-cols-12 md:items-center"
                >
                  <span className="font-heading text-2xl text-accent md:col-span-2">{number}</span>
                  <h3 className="text-3xl font-medium text-primary md:col-span-4">{title}</h3>
                  <p className="max-w-xl leading-relaxed text-foreground/65 md:col-span-6">{text}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="overflow-hidden bg-secondary py-24 text-primary sm:py-32">
          <div className="mx-auto grid max-w-7xl gap-14 px-6 sm:px-8 lg:grid-cols-12 lg:items-center lg:px-12">
            <motion.div {...reveal} className="lg:col-span-5">
              <p className="eyebrow mb-5 text-accent">Tu archivo personal</p>
              <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">Una línea de tiempo que crece contigo.</h2>
              <p className="mt-7 text-lg leading-relaxed text-foreground/70">
                Explora años de recuerdos sin sentir que navegas por un disco duro. Cada fotografía conserva su fecha, su lugar y la historia que la hace importante.
              </p>
              <Button asChild className="mt-9 rounded-full border-0 bg-gradient-to-r from-[#b735ec] via-[#7652f4] to-[#27a9f6] px-7 text-white shadow-lg shadow-[#7652f4]/20 hover:brightness-110">
                <Link to="/signup">Crear mi espacio <ArrowRight className="h-4 w-4" /></Link>
              </Button>
            </motion.div>

            <motion.div {...reveal} className="lg:col-span-7">
              <div className="rounded-[2rem] border border-primary/10 bg-card p-3 shadow-2xl shadow-primary/15 sm:p-6">
                <img src="/memoria-hero.jpg" alt="Vista de la línea de tiempo de MemorIAmobile" className="w-full rounded-2xl" loading="lazy" decoding="async" />
              </div>
            </motion.div>
          </div>
        </section>

        <section className="bg-background py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 sm:px-8 lg:px-12">
            <motion.div {...reveal} className="mx-auto mb-16 max-w-3xl text-center">
              <p className="eyebrow mb-5 text-accent">Pensado para lo importante</p>
              <h2 className="text-4xl font-semibold text-primary sm:text-5xl">Tecnología que se queda en segundo plano.</h2>
            </motion.div>

            <div className="grid gap-10 md:grid-cols-3">
              {[
                ['Conservar', 'Tus recuerdos permanecen juntos, respaldados y accesibles cuando los necesites.'],
                ['Comprender', 'Las fechas, lugares y personas dan sentido a cada momento sin trabajo manual.'],
                ['Compartir', 'Tú eliges qué historias permanecen privadas y cuáles acercan a tu familia.'],
              ].map(([title, text], index) => (
                <motion.article key={title} {...reveal} transition={{ ...reveal.transition, delay: index * 0.1 }} className="border-t border-accent pt-7">
                  <span className="mb-5 block font-heading text-sm text-accent">0{index + 1}</span>
                  <h3 className="mb-4 text-3xl font-medium text-primary">{title}</h3>
                  <p className="leading-relaxed text-foreground/65">{text}</p>
                </motion.article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-y border-border bg-secondary py-16">
          <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 sm:px-8 md:flex-row md:items-center md:justify-between lg:px-12">
            <p className="max-w-2xl font-heading text-2xl leading-snug text-primary sm:text-3xl">Tus recuerdos son personales. Su protección también debería serlo.</p>
            <div className="flex flex-col gap-3 text-sm text-foreground/70 sm:flex-row sm:gap-6">
              {['Acceso privado', 'Almacenamiento seguro', 'Control en tus manos'].map((item) => (
                <span key={item} className="flex items-center gap-2"><Check className="h-4 w-4 text-accent" />{item}</span>
              ))}
            </div>
          </div>
        </section>

        <section className="bg-card py-24 sm:py-32">
          <div className="mx-auto max-w-3xl px-6 sm:px-8">
            <motion.div {...reveal} className="mb-12 text-center">
              <p className="eyebrow mb-5 text-accent">Preguntas frecuentes</p>
              <h2 className="text-4xl font-semibold text-primary sm:text-5xl">Antes de confiar tus recuerdos.</h2>
            </motion.div>
            <Accordion type="single" collapsible className="w-full border-t border-border">
              <AccordionItem value="privacy">
                <AccordionTrigger className="py-6 text-left font-heading text-xl text-primary hover:text-accent">¿Quién puede ver mis recuerdos?</AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-foreground/65">Tu espacio es privado. Tú controlas el acceso y decides qué recuerdos quieres compartir.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="cancel">
                <AccordionTrigger className="py-6 text-left font-heading text-xl text-primary hover:text-accent">¿Puedo cancelar cuando quiera?</AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-foreground/65">Sí. Puedes gestionar tu suscripción y descargar tus archivos antes de realizar cualquier cambio.</AccordionContent>
              </AccordionItem>
              <AccordionItem value="devices">
                <AccordionTrigger className="py-6 text-left font-heading text-xl text-primary hover:text-accent">¿Puedo acceder desde distintos dispositivos?</AccordionTrigger>
                <AccordionContent className="pb-6 text-base leading-relaxed text-foreground/65">Sí. Tu espacio está disponible desde el navegador en ordenador, tableta y móvil.</AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>

        <section className="paper-texture bg-secondary py-24 sm:py-28">
          <motion.div {...reveal} className="mx-auto max-w-4xl px-6 text-center sm:px-8">
            <p className="eyebrow mb-5 text-primary/60">Tu primera página</p>
            <h2 className="text-4xl font-semibold text-primary sm:text-6xl">Empieza hoy la historia que querrás recordar mañana.</h2>
            <p className="mx-auto mt-7 max-w-xl text-lg text-foreground/65">Crea tu espacio y guarda tu primer recuerdo. Sin compromiso.</p>
            <Button asChild size="lg" className="mt-9 rounded-full border-0 bg-gradient-to-r from-[#b735ec] via-[#7652f4] to-[#27a9f6] px-9 py-6 text-base text-white shadow-lg shadow-[#7652f4]/20 hover:brightness-110">
              <Link to="/signup">Comenzar mi historia <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </motion.div>
        </section>
      </main>

      <Footer />
      <DemoVideoModal isOpen={isVideoModalOpen} onClose={() => setIsVideoModalOpen(false)} />
    </div>
  );
}

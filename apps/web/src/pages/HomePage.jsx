
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Smartphone, Brain, Search, Image as ImageIcon, MessageSquare, 
  FileText, Mic, MapPin, Users, Cloud, CheckCircle2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import DemoVideoModal from '@/components/DemoVideoModal.jsx';

export default function HomePage() {
  const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);

  const features = [
    { icon: <ImageIcon className="w-6 h-6" />, title: "Fotos y vídeos", desc: "Clasificación automática por eventos y calidad." },
    { icon: <MessageSquare className="w-6 h-6" />, title: "WhatsApp y mensajes", desc: "Guarda chats importantes y audios de tus seres queridos." },
    { icon: <FileText className="w-6 h-6" />, title: "Documentos", desc: "Facturas, contratos y papeles importantes al alcance." },
    { icon: <Mic className="w-6 h-6" />, title: "Notas de voz", desc: "Transcripción de audios para búsqueda de texto." },
    { icon: <MapPin className="w-6 h-6" />, title: "Lugares visitados", desc: "Mapa interactivo de todos tus viajes y recuerdos." },
    { icon: <Users className="w-6 h-6" />, title: "Personas", desc: "Reconocimiento facial para agrupar a familiares y amigos." },
    { icon: <Brain className="w-6 h-6" />, title: "Búsqueda mediante IA", desc: "Encuentra la foto del 'perro en la playa en 2021'." },
    { icon: <Cloud className="w-6 h-6" />, title: "Copias automáticas", desc: "Sincronización en la nube cifrada y segura." }
  ];

  const testimonials = [
    {
      name: "Lucia Torres",
      role: "Madre de familia",
      quote: "Por fin encontré una app que organiza las fotos de mis hijos sin tener que hacer álbumes manualmente. Es magia pura.",
      avatar: "bg-blue-100 text-blue-700"
    },
    {
      name: "Carlos Mendoza",
      role: "Emprendedor",
      quote: "Guardo facturas, audios de clientes y fotos de proyectos. El buscador con IA me salva horas de trabajo cada semana.",
      avatar: "bg-green-100 text-green-700"
    },
    {
      name: "Ana Bergström",
      role: "Estudiante",
      quote: "Poder buscar apuntes o fotos de la pizarra simplemente describiendo lo que había es increíble. La recomiendo 100%.",
      avatar: "bg-purple-100 text-purple-700"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>MemorIAmobile - Nunca pierdas un recuerdo</title>
        <meta name="description" content="Tu vida, organizada por IA. Fotos, documentos y mensajes guardados de forma segura." />
      </Helmet>
      
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="relative min-h-[90dvh] flex items-center justify-center overflow-hidden bg-primary">
          <div className="absolute inset-0 z-0">
            <img 
              src="https://images.unsplash.com/photo-1615946093435-eaafc8241554?q=80&w=2000&auto=format&fit=crop" 
              alt="Person using smartphone reflecting memories" 
              className="w-full h-full object-cover opacity-30 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/90 to-background"></div>
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 pb-16">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-4xl mx-auto"
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-primary-foreground mb-6 text-balance leading-tight">
                Nunca pierdas un recuerdo. <br/>
                <span className="text-accent">Tu vida, organizada por IA.</span>
              </h1>
              <p className="text-lg md:text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto text-balance">
                Sincroniza tus fotos, documentos y chats. Nuestra Inteligencia Artificial los etiqueta, ordena y hace que sean fáciles de encontrar para siempre.
              </p>
              
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="w-full sm:w-auto text-lg px-8 py-6 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground">
                  <Link to="/signup">Empezar gratis</Link>
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  onClick={() => setIsVideoModalOpen(true)} 
                  className="w-full sm:w-auto text-lg px-8 py-6 rounded-full border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 bg-transparent"
                >
                  Ver demostración
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section id="how-it-works" className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">¿Cómo funciona MemorIAmobile?</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">Tres simples pasos para asegurar tu legado digital.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              <div className="hidden md:block absolute top-1/2 left-1/6 right-1/6 h-0.5 bg-border -z-10 -translate-y-1/2"></div>
              
              {[
                { icon: <Smartphone className="w-10 h-10" />, title: "1. Conecta tu móvil", desc: "Instala la app y selecciona qué carpetas o apps quieres respaldar." },
                { icon: <Brain className="w-10 h-10" />, title: "2. La IA organiza", desc: "Nuestros algoritmos analizan, transcriben y etiquetan todo automáticamente." },
                { icon: <Search className="w-10 h-10" />, title: "3. Encuentra todo", desc: "Busca con lenguaje natural. 'El ticket del restaurante italiano de 2022'." }
              ].map((step, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.2, duration: 0.5 }}
                  className="bg-card border border-border p-8 rounded-3xl text-center relative shadow-sm"
                >
                  <div className="w-20 h-20 mx-auto bg-secondary text-primary rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                    {step.icon}
                  </div>
                  <h3 className="text-xl font-bold text-primary mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURES GRID */}
        <section className="py-24 bg-secondary/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold text-primary mb-4">Todo lo que necesitas en un solo lugar</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">MemorIAmobile entiende el contexto de tus archivos mejor que cualquier otra nube.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.4 }}
                  className="bg-card p-6 rounded-2xl border border-border hover:shadow-lg transition-all duration-300 group"
                >
                  <div className="w-12 h-12 bg-secondary text-primary rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-bold text-primary mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl md:text-4xl font-bold text-primary mb-16 text-center">Lo que dicen nuestros usuarios</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {testimonials.map((test, i) => (
                <div key={i} className="bg-card border border-border p-8 rounded-3xl flex flex-col h-full shadow-sm">
                  <div className="flex-1 mb-6">
                    <p className="text-lg text-foreground/80 italic leading-relaxed">"{test.quote}"</p>
                  </div>
                  <div className="flex items-center gap-4 mt-auto">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg ${test.avatar}`}>
                      {test.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-primary">{test.name}</p>
                      <p className="text-sm text-muted-foreground">{test.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRICING PREVIEW */}
        <section className="py-24 bg-primary text-primary-foreground">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Planes diseñados para ti</h2>
              <p className="text-lg text-primary-foreground/80 max-w-2xl mx-auto">Comienza gratis, mejora cuando lo necesites.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {/* Free */}
              <div className="bg-background text-foreground p-8 rounded-3xl flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Gratis</h3>
                <p className="text-4xl font-extrabold mb-6">€0<span className="text-lg font-normal text-muted-foreground">/mes</span></p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-accent shrink-0"/> 5GB de almacenamiento</li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-accent shrink-0"/> IA de búsqueda básica</li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-accent shrink-0"/> Sincronización manual</li>
                </ul>
                <Button asChild variant="outline" className="w-full rounded-full border-border">
                  <Link to="/signup">Empezar gratis</Link>
                </Button>
              </div>

              {/* Premium */}
              <div className="bg-accent text-accent-foreground p-8 rounded-3xl flex flex-col scale-105 shadow-xl relative">
                <div className="absolute top-0 right-8 -translate-y-1/2 bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Recomendado
                </div>
                <h3 className="text-2xl font-bold mb-2">Premium</h3>
                <p className="text-4xl font-extrabold mb-6">€9.99<span className="text-lg font-normal text-accent-foreground/80">/mes</span></p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 shrink-0"/> 500GB de almacenamiento</li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 shrink-0"/> IA avanzada (rostros, lugares)</li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 shrink-0"/> Copias de seguridad automáticas</li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 shrink-0"/> Sin publicidad</li>
                </ul>
                <Button asChild className="w-full rounded-full bg-background text-foreground hover:bg-background/90">
                  <Link to="/signup">Probar Premium</Link>
                </Button>
              </div>

              {/* Lifetime */}
              <div className="bg-background text-foreground p-8 rounded-3xl flex flex-col">
                <h3 className="text-2xl font-bold mb-2">Lifetime</h3>
                <p className="text-4xl font-extrabold mb-6">€299<span className="text-lg font-normal text-muted-foreground">/único</span></p>
                <ul className="space-y-4 mb-8 flex-1">
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-accent shrink-0"/> 1TB de almacenamiento</li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-accent shrink-0"/> Todas las funciones Premium</li>
                  <li className="flex gap-3"><CheckCircle2 className="w-5 h-5 text-accent shrink-0"/> Actualizaciones de por vida</li>
                </ul>
                <Button asChild variant="outline" className="w-full rounded-full border-border">
                  <Link to="/signup">Obtener Lifetime</Link>
                </Button>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Link to="/plans" className="text-primary-foreground underline hover:text-accent transition-colors font-medium">
                Ver comparación detallada de planes
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 bg-background">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-primary mb-12 text-center">Preguntas Frecuentes</h2>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="item-1" className="border-border">
                <AccordionTrigger className="text-lg font-semibold hover:text-accent text-left">¿Mis datos están cifrados?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Sí. Utilizamos encriptación de extremo a extremo para asegurar que solo tú tengas acceso a tus recuerdos. Ni siquiera nuestro equipo puede ver tus fotos o leer tus documentos.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2" className="border-border">
                <AccordionTrigger className="text-lg font-semibold hover:text-accent text-left">¿Puedo cancelar cuando quiera?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Totalmente. Si decides cancelar tu suscripción Premium, mantendrás el acceso a tu cuenta en la versión gratuita y podrás descargar todos tus archivos sin restricciones.
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-3" className="border-border">
                <AccordionTrigger className="text-lg font-semibold hover:text-accent text-left">¿Es compatible con Android e iPhone?</AccordionTrigger>
                <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                  Sí, MemorIAmobile está disponible para iOS y Android, y puedes acceder a tu cuenta desde cualquier navegador web en tu ordenador.
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </section>
      </main>

      <Footer />

      {/* Demo Video Modal */}
      <DemoVideoModal 
        isOpen={isVideoModalOpen} 
        onClose={() => setIsVideoModalOpen(false)} 
      />
    </div>
  );
}

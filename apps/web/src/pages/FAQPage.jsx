import React from 'react';
import { Helmet } from 'react-helmet';
import { HelpCircle } from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function FAQPage() {
  const faqs = [
    {
      q: "¿Mis datos están cifrados?",
      a: "Sí. Utilizamos encriptación de extremo a extremo para asegurar que solo tú tengas acceso a tus recuerdos. Ni siquiera nuestro equipo puede ver tus fotos o leer tus documentos."
    },
    {
      q: "¿Puedo cancelar cuando quiera?",
      a: "Totalmente. Si decides cancelar tu suscripción Premium, mantendrás el acceso a tu cuenta en la versión gratuita y podrás descargar todos tus archivos sin restricciones."
    },
    {
      q: "¿Es compatible con Android e iPhone?",
      a: "Sí, MemorIAmobile está disponible para iOS y Android, y puedes acceder a tu cuenta desde cualquier navegador web en tu ordenador."
    },
    {
      q: "¿Qué sucede con mis archivos si pierdo mi teléfono?",
      a: "No pasa nada. Si tienes activada la copia de seguridad (disponible en todos los planes, de forma automática en Premium), tus archivos están seguros en nuestra bóveda en la nube. Simplemente inicia sesión en un nuevo dispositivo y todo estará ahí."
    },
    {
      q: "¿Cómo funciona la IA de búsqueda?",
      a: "Nuestra IA analiza el contenido de tus imágenes (rostros, objetos, paisajes) y transcribe tus notas de voz y documentos. De este modo, puedes buscar en lenguaje natural, como 'ticket de gasolina' o 'perro en la nieve', y la IA encontrará los archivos al instante."
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Preguntas Frecuentes - MemorIAmobile</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-16">
          <div className="w-16 h-16 bg-secondary text-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
            <HelpCircle className="w-8 h-8" />
          </div>
          <h1 className="text-4xl font-extrabold text-primary mb-4">Preguntas Frecuentes</h1>
          <p className="text-lg text-muted-foreground">Resolvemos todas tus dudas sobre nuestra bóveda inteligente.</p>
        </div>

        <Accordion type="single" collapsible className="w-full bg-card rounded-3xl p-6 sm:p-10 shadow-sm border border-border">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`} className="border-border">
              <AccordionTrigger className="text-left text-lg font-semibold text-foreground hover:text-accent">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>

      <Footer />
    </div>
  );
}
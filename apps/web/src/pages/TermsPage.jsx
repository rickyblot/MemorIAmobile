
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Términos de Servicio - MemorIAmobile</title>
      </Helmet>

      <Header />

      <main className="flex-1 py-20 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full prose prose-slate">
        <h1 className="text-4xl font-extrabold text-primary mb-8">Términos de Servicio</h1>
        
        <p className="text-muted-foreground text-lg mb-8">
          Última actualización: {new Date().toLocaleDateString()}
        </p>

        <section className="space-y-6 text-foreground/80">
          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">1. Aceptación de los Términos</h2>
          <p>
            Al acceder o utilizar MemorIAmobile, aceptas estar sujeto a estos Términos de Servicio. 
            Si no estás de acuerdo con alguna parte de los términos, no podrás acceder al servicio.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">2. Uso de la Bóveda</h2>
          <p>
            Nuestra bóveda está diseñada para el almacenamiento legal y legítimo de archivos personales. 
            Queda estrictamente prohibido utilizar el servicio para almacenar material ilícito, malware o contenido que infrinja derechos de autor.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">3. Planes y Pagos</h2>
          <p>
            Los planes Premium y Lifetime están sujetos a los precios vigentes al momento de la contratación. 
            Las suscripciones Premium se renuevan automáticamente salvo que las canceles desde tu panel de control antes de la fecha de facturación.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">4. Disponibilidad del Servicio</h2>
          <p>
            Nos esforzamos por mantener una disponibilidad del 99.9% de los servidores, pero no garantizamos 
            que el servicio no sufra interrupciones por mantenimiento o causas de fuerza mayor. Te recomendamos 
            mantener copias locales de tus archivos críticos.
          </p>

          <h2 className="text-2xl font-bold text-primary mt-12 mb-4">5. Cancelación y Terminación</h2>
          <p>
            Puedes cancelar tu cuenta en cualquier momento. Nos reservamos el derecho de suspender o terminar 
            cuentas que violen sistemáticamente estos términos o utilicen el almacenamiento con fines de abuso de red.
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
}

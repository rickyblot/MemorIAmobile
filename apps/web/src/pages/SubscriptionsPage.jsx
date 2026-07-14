
import React from 'react';
import { Helmet } from 'react-helmet';
import SubscriptionAccountSection from '@/components/SubscriptionAccountSection.jsx';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function SubscriptionsPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Mi Suscripción - MemorIAmobile</title>
        <meta name="description" content="Gestiona tu plan y detalles de facturación." />
      </Helmet>

      <Header />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="mx-auto max-w-3xl">
          <header className="mb-8">
            <h1 className="text-3xl font-extrabold sm:text-4xl text-primary font-heading tracking-tight mb-2">
              Suscripción y Facturación
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Gestiona tu plan actual, métodos de pago y descarga facturas.
            </p>
          </header>
          
          <SubscriptionAccountSection />
        </div>
      </main>

      <Footer />
    </div>
  );
}

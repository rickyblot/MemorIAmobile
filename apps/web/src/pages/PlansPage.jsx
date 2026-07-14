
import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PlansList from '@/components/PlansList.jsx';

export default function PlansPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet>
        <title>Planes y Precios - MemorIAmobile</title>
        <meta name="description" content="Elige el mejor plan para asegurar y organizar tus recuerdos digitales." />
      </Helmet>

      <Header />

      <main className="flex-1 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-extrabold text-primary mb-6 text-balance">
              Planes transparentes, sin sorpresas
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance">
              Protege tus fotos, documentos y mensajes con nuestra bóveda inteligente. Empieza gratis y mejora cuando lo necesites.
            </p>
          </div>
          
          <PlansList />
        </div>
      </main>

      <Footer />
    </div>
  );
}

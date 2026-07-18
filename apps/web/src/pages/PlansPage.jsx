
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

      <main className="paper-texture flex-1 px-6 py-20 sm:px-8 sm:py-24 lg:px-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="eyebrow mb-5 text-accent">El espacio que tu historia necesita</p>
            <h1 className="mx-auto mb-6 max-w-4xl text-5xl font-semibold leading-tight text-primary text-balance md:text-6xl">
              Conserva lo que importa.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto text-balance leading-relaxed">
              Empieza con tus primeros recuerdos y amplía tu espacio cuando tu historia crezca. Sin sorpresas y siempre bajo tu control.
            </p>
          </div>
          
          <PlansList />
        </div>
      </main>

      <Footer />
    </div>
  );
}

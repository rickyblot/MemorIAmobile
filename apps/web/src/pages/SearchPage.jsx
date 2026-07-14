import React from 'react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';

export default function SearchPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 p-8 text-center pt-24">
        <h1 className="text-4xl font-bold mb-4">Buscar</h1>
        <p className="text-muted-foreground">Busca con lenguaje natural.</p>
      </main>
      <Footer />
    </div>
  );
}
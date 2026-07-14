import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import MemoryCard from '@/components/MemoryCard.jsx';
import { Calendar, Filter, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TimelinePage() {
  const years = [
    {
      year: '2025',
      months: [
        {
          name: 'Agosto',
          memories: [
            { id: 11, title: 'Concierto Rock', date: '2025-08-05', location: 'Estadio Nacional', peopleCount: 3, thumbnail: 'https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=600&fit=crop', encrypted: true },
            { id: 12, title: 'Día de Parque', date: '2025-08-12', location: 'Central Park', peopleCount: 2, thumbnail: 'https://images.unsplash.com/photo-1519331379826-f10be5486c6f?w=600&fit=crop', encrypted: true }
          ]
        },
        {
          name: 'Junio',
          memories: [
            { id: 1, title: 'Viaje a Roma', date: '2025-06-12', location: 'Roma, Italia', peopleCount: 2, thumbnail: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&fit=crop', encrypted: true },
          ]
        }
      ]
    },
    {
      year: '2024',
      months: [
        {
          name: 'Mayo',
          memories: [
            { id: 2, title: 'Graduación', date: '2024-05-20', location: 'Universidad', peopleCount: 5, thumbnail: 'https://images.unsplash.com/photo-1523580494863-6f3031224c94?w=600&fit=crop', encrypted: true },
            { id: 5, title: 'Celebración', date: '2024-05-21', location: 'Restaurante El Faro', peopleCount: 6, thumbnail: 'https://images.unsplash.com/photo-1530103862676-de88b6b139a0?w=600&fit=crop', encrypted: true }
          ]
        }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet><title>Línea de Tiempo - MemorIA</title></Helmet>
      <Header />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="flex justify-between items-end mb-12 sticky top-20 z-40 bg-background/80 backdrop-blur-xl py-4 border-b border-border">
            <div>
              <h1 className="text-4xl font-heading font-bold">Línea de Tiempo</h1>
              <p className="text-muted-foreground text-sm mt-1">Navega por tu historia visualmente.</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="bg-card hidden sm:flex"><Calendar className="w-4 h-4 mr-2" /> Ir a fecha</Button>
              <Button variant="outline" className="bg-card"><Filter className="w-4 h-4 mr-2" /> Filtros</Button>
            </div>
          </div>

          <div className="space-y-16">
            {years.map(yearBlock => (
              <div key={yearBlock.year} className="relative">
                <div className="sticky top-40 z-30 inline-block mb-8">
                  <h2 className="text-6xl font-heading font-extrabold text-muted/50 -ml-2">{yearBlock.year}</h2>
                </div>
                
                <div className="space-y-12 pl-4 sm:pl-8 border-l-2 border-border ml-4 sm:ml-8 relative">
                  {yearBlock.months.map((month, idx) => (
                    <div key={idx} className="relative">
                      <div className="absolute -left-[21px] sm:-left-[37px] top-1.5 w-3 h-3 rounded-full bg-primary ring-4 ring-background" />
                      <h3 className="text-2xl font-heading font-bold mb-6 flex items-center gap-3">
                        {month.name}
                        <div className="h-px bg-border flex-1" />
                        <span className="text-sm font-medium text-muted-foreground">{month.memories.length} memorias</span>
                      </h3>
                      
                      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
                        {month.memories.map(memory => (
                          <MemoryCard key={memory.id} memory={memory} variant="small" />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-16 pb-8">
            <Button variant="ghost" className="text-muted-foreground hover:text-foreground">
              Cargar años anteriores <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
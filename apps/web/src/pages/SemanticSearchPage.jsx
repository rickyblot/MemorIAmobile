import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Search, Sparkles, Filter, X, Calendar, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import FileCard from '@/components/FileCard.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export default function SemanticSearchPage() {
  const { currentUser } = useAuth();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [activeFilters, setActiveFilters] = useState([]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    setIsSearching(true);
    
    // Simulate AI search latency & response
    setTimeout(() => {
      setResults([
        { id: 1, name: 'DSC_0023.jpg', type: 'image/jpeg', date: '2023-08-15', size: '4.2 MB', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop' },
        { id: 2, name: 'IMG_4451.png', type: 'image/png', date: '2023-08-16', size: '2.1 MB', thumbnail: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=200&h=200&fit=crop' }
      ]);
      setIsSearching(false);
    }, 1500);
  };

  const addFilter = (filter) => {
    if (!activeFilters.includes(filter)) setActiveFilters([...activeFilters, filter]);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet><title>Búsqueda Inteligente - MemorIA</title></Helmet>
      <Header />
      <main className="flex-1 py-10 max-w-6xl mx-auto w-full px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold font-serif mb-4 flex justify-center items-center gap-3">
            Búsqueda Semántica <Sparkles className="w-8 h-8 text-primary" />
          </h1>
          <p className="text-muted-foreground text-lg">Busca como piensas. Ej: "Fotos de mi viaje a Italia donde salgo sonriendo"</p>
        </div>

        <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-10 relative">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input 
              type="text" 
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="¿Qué quieres recordar hoy?" 
              className="w-full pl-14 pr-32 py-8 text-lg rounded-2xl bg-card border-2 border-border focus-visible:ring-primary shadow-lg"
            />
            <Button type="submit" disabled={isSearching} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-xl h-12 px-6">
              {isSearching ? 'Buscando...' : 'Buscar'}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-4 justify-center">
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setQuery("Documentos importantes de este año")}>📝 Documentos del año</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setQuery("Fotos con mi perro")}>🐕 Fotos con mi perro</Badge>
            <Badge variant="outline" className="cursor-pointer hover:bg-secondary" onClick={() => setQuery("Facturas y recibos")}>🧾 Facturas</Badge>
          </div>
        </form>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="glass-card p-6 rounded-2xl h-fit sticky top-24">
            <div className="flex items-center gap-2 mb-6 font-bold text-lg border-b border-border pb-4">
              <Filter className="w-5 h-5" /> Filtros Avanzados
            </div>
            
            <div className="space-y-6">
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2"><Calendar className="w-4 h-4"/> Fecha</label>
                <div className="flex flex-col gap-2">
                  <Badge variant="secondary" className="justify-start py-1.5 cursor-pointer" onClick={() => addFilter('Último mes')}>Último mes</Badge>
                  <Badge variant="secondary" className="justify-start py-1.5 cursor-pointer" onClick={() => addFilter('Este año')}>Este año</Badge>
                  <Badge variant="secondary" className="justify-start py-1.5 cursor-pointer" onClick={() => addFilter('Hace más de 1 año')}>Hace más de 1 año</Badge>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2"><MapPin className="w-4 h-4"/> Ubicación</label>
                <Input placeholder="Ciudad o país..." className="bg-input" />
              </div>

              <div>
                <label className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2"><Tag className="w-4 h-4"/> Tipo de Archivo</label>
                <div className="flex gap-2 flex-wrap">
                  <Badge variant="outline" onClick={() => addFilter('Solo Fotos')} className="cursor-pointer">Fotos</Badge>
                  <Badge variant="outline" onClick={() => addFilter('Solo Videos')} className="cursor-pointer">Videos</Badge>
                  <Badge variant="outline" onClick={() => addFilter('Documentos')} className="cursor-pointer">Docs</Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-3">
            {activeFilters.length > 0 && (
              <div className="flex items-center gap-2 mb-6 flex-wrap">
                <span className="text-sm text-muted-foreground">Filtros activos:</span>
                {activeFilters.map(f => (
                  <Badge key={f} className="bg-primary/20 text-primary hover:bg-primary/30 flex items-center gap-1">
                    {f} <X className="w-3 h-3 cursor-pointer" onClick={() => setActiveFilters(activeFilters.filter(fl => fl !== f))} />
                  </Badge>
                ))}
                <Button variant="ghost" size="sm" className="h-6 text-xs" onClick={() => setActiveFilters([])}>Limpiar</Button>
              </div>
            )}

            {isSearching ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="aspect-square bg-secondary/50 rounded-xl animate-pulse"></div>
                ))}
              </div>
            ) : results.length > 0 ? (
              <div>
                <p className="text-sm text-muted-foreground mb-4">{results.length} resultados encontrados.</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {results.map(file => <FileCard key={file.id} file={file} />)}
                </div>
              </div>
            ) : (
              <div className="text-center py-20 bg-secondary/20 rounded-2xl border border-border border-dashed">
                <Search className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                <h3 className="text-xl font-semibold mb-2">No hay resultados</h3>
                <p className="text-muted-foreground">Realiza una búsqueda para ver tus recuerdos aquí.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Search, Plus, Image as ImageIcon, Users, Plane, Briefcase, Heart, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AlbumsPage() {
  const albums = [
    { id: 1, title: 'Familia', type: 'Family', count: 4205, icon: <Users />, image: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&q=80' },
    { id: 2, title: 'Viajes Internacionales', type: 'Travel', count: 1832, icon: <Plane />, image: 'https://images.unsplash.com/photo-1502602898657-3e907600bb8e?w=600&q=80' },
    { id: 3, title: 'Mascotas', type: 'Pets', count: 541, icon: <Heart />, image: 'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=600&q=80' },
    { id: 4, title: 'Trabajo y Docs', type: 'Work', count: 120, icon: <Briefcase />, image: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80' },
    { id: 5, title: 'Eventos 2024', type: 'Events', count: 856, icon: <Calendar />, image: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=600&q=80' },
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet><title>Álbumes Inteligentes - MemorIA</title></Helmet>
      <Header />
      
      <main className="flex-1 py-10">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
            <div>
              <h1 className="text-4xl font-heading font-bold mb-2">Tus Álbumes</h1>
              <p className="text-muted-foreground">La IA agrupa tus memorias sin que muevas un dedo.</p>
            </div>
            <div className="flex items-center gap-3 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input 
                  type="text" 
                  placeholder="Filtrar álbumes..." 
                  className="w-full bg-input border border-border rounded-lg pl-9 pr-4 py-2 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                />
              </div>
              <Button className="shrink-0"><Plus className="w-4 h-4 mr-2" /> Nuevo</Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {albums.map((album) => (
              <Link 
                key={album.id} 
                to={`/albums/${album.id}`}
                className="group glass-panel rounded-2xl overflow-hidden hover:-translate-y-1 transition-smooth flex flex-col"
              >
                <div className="relative h-48 overflow-hidden">
                  <img src={album.image} alt={album.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 to-transparent opacity-80" />
                  <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center text-foreground">
                    {React.cloneElement(album.icon, { className: 'w-4 h-4' })}
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-heading font-semibold text-xl text-foreground mb-1">{album.title}</h3>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span className="flex items-center gap-1.5"><ImageIcon className="w-4 h-4" /> {album.count.toLocaleString()} elementos</span>
                    <span className="bg-muted px-2 py-1 rounded-md text-xs font-medium">{album.type}</span>
                  </div>
                </div>
              </Link>
            ))}
            
            <button className="glass-panel border-dashed border-2 border-border rounded-2xl h-[280px] flex flex-col items-center justify-center text-muted-foreground hover:text-primary hover:border-primary hover:bg-primary/5 transition-smooth cursor-pointer">
              <Plus className="w-10 h-10 mb-3" />
              <span className="font-heading font-semibold">Crear Álbum Manual</span>
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { Folder, Users, MapPin, Calendar, LayoutGrid, CheckSquare, Trash2, FolderPlus, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import FileCard from '@/components/FileCard.jsx';
import { Badge } from '@/components/ui/badge';

export default function FileOrganizationPage() {
  const [activeTab, setActiveTab] = useState('date');
  const [selectedFiles, setSelectedFiles] = useState([]);

  const mockFiles = [
    { id: 1, name: 'Playa_2023.jpg', type: 'image/jpeg', date: '2023-08-15', size: '4.2 MB', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=200&h=200&fit=crop' },
    { id: 2, name: 'Paris_1.png', type: 'image/png', date: '2023-08-16', size: '2.1 MB', thumbnail: 'https://images.unsplash.com/photo-1502602898657-3e907600bb8e?w=200&h=200&fit=crop' },
    { id: 3, name: 'Cena_Familia.jpg', type: 'image/jpeg', date: '2023-09-01', size: '3.5 MB', thumbnail: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?w=200&h=200&fit=crop' },
    { id: 4, name: 'Video_Gato.mp4', type: 'video/mp4', date: '2023-09-05', size: '15.4 MB' }
  ];

  const toggleSelect = (id) => {
    if (selectedFiles.includes(id)) setSelectedFiles(selectedFiles.filter(fid => fid !== id));
    else setSelectedFiles([...selectedFiles, id]);
  };

  const tabs = [
    { id: 'date', label: 'Por Fecha', icon: <Calendar className="w-4 h-4"/> },
    { id: 'location', label: 'Por Ubicación', icon: <MapPin className="w-4 h-4"/> },
    { id: 'people', label: 'Personas', icon: <Users className="w-4 h-4"/> },
    { id: 'folders', label: 'Mis Carpetas', icon: <Folder className="w-4 h-4"/> }
  ];

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Helmet><title>Organización - MemorIA</title></Helmet>
      <Header />
      
      {/* Utility Toolbar for Bulk Actions */}
      {selectedFiles.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 bg-primary text-primary-foreground px-6 py-3 rounded-full shadow-2xl flex items-center gap-6 animate-in slide-in-from-bottom-5">
          <span className="font-bold">{selectedFiles.length} seleccionados</span>
          <div className="flex gap-2 border-l border-primary-foreground/30 pl-6">
            <Button variant="ghost" size="sm" className="hover:bg-primary-foreground/20 text-white"><FolderPlus className="w-4 h-4 mr-2"/> Mover</Button>
            <Button variant="ghost" size="sm" className="hover:bg-primary-foreground/20 text-white"><Trash2 className="w-4 h-4 mr-2"/> Eliminar</Button>
          </div>
        </div>
      )}

      <main className="flex-1 py-8 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 flex flex-col">
        <h1 className="text-3xl font-bold font-serif mb-8">Organización de Biblioteca</h1>

        <div className="flex gap-2 overflow-x-auto pb-4 mb-4 border-b border-border hide-scrollbar">
          {tabs.map(tab => (
            <Button 
              key={tab.id} 
              variant={activeTab === tab.id ? 'default' : 'ghost'} 
              className={`rounded-full ${activeTab === tab.id ? 'bg-foreground text-background hover:bg-foreground/90' : 'bg-secondary text-foreground'}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.icon} <span className="ml-2">{tab.label}</span>
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 flex-1">
          {/* Sidebar / Smart Collections */}
          <div className="md:col-span-1 space-y-6">
            <div className="glass-card rounded-2xl p-5 border border-border">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Sparkles className="w-4 h-4 text-accent"/> Colecciones Inteligentes</h3>
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start font-normal">📸 Fotos Borrosas <Badge className="ml-auto bg-destructive">24</Badge></Button>
                <Button variant="ghost" className="w-full justify-start font-normal">📋 Duplicados <Badge className="ml-auto bg-muted text-muted-foreground">12</Badge></Button>
                <Button variant="ghost" className="w-full justify-start font-normal">📱 Capturas de Pantalla</Button>
                <Button variant="ghost" className="w-full justify-start font-normal">⭐ Favoritos</Button>
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border border-border">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Folder className="w-4 h-4 text-primary"/> Etiquetas Auto.</h3>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline">Paisajes</Badge>
                <Badge variant="outline">Comida</Badge>
                <Badge variant="outline">Documentos</Badge>
                <Badge variant="outline">Mascotas</Badge>
                <Badge variant="outline">Atardecer</Badge>
              </div>
            </div>
          </div>

          {/* Grid View */}
          <div className="md:col-span-3">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Agosto 2023</h2>
              <div className="flex gap-2">
                <Button variant="outline" size="sm"><CheckSquare className="w-4 h-4 mr-2"/> Seleccionar todos</Button>
                <Button variant="outline" size="icon"><LayoutGrid className="w-4 h-4"/></Button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {mockFiles.map(file => (
                <div key={file.id} className="relative group cursor-pointer" onClick={() => toggleSelect(file.id)}>
                  <div className={`absolute top-2 left-2 z-10 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${selectedFiles.includes(file.id) ? 'bg-primary border-primary' : 'border-white/50 group-hover:border-white opacity-0 group-hover:opacity-100'}`}>
                    {selectedFiles.includes(file.id) && <CheckSquare className="w-3 h-3 text-white" />}
                  </div>
                  <div className={`transition-all duration-200 ${selectedFiles.includes(file.id) ? 'ring-2 ring-primary ring-offset-2 ring-offset-background scale-95 rounded-xl' : ''}`}>
                    <FileCard file={file} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>
      <Footer />
    </div>
  );
}
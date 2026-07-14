import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import { Save, Play, Download, Image as ImageIcon, Music, Type, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function StoryEditorPage() {
  const [title, setTitle] = useState("Viaje a París - Verano 2023");
  const navigate = useNavigate();

  const handleExport = () => {
    navigate('/export/new');
  };

  const handleSave = () => {
    toast.success('Historia guardada como borrador.');
  };

  return (
    <div className="h-screen bg-background flex flex-col overflow-hidden">
      <Helmet><title>Editor de Historias - MemorIA</title></Helmet>
      
      {/* Topbar */}
      <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 sm:px-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" asChild><Link to="/dashboard"><ArrowLeft className="w-5 h-5"/></Link></Button>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="w-64 font-bold bg-transparent border-transparent hover:border-border focus:border-primary text-lg" />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground mr-2">Guardado automático hace 1 min</span>
          <Button variant="outline" onClick={handleSave}><Save className="w-4 h-4 mr-2"/> Guardar</Button>
          <Button onClick={handleExport}><Download className="w-4 h-4 mr-2"/> Exportar</Button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Sidebar Tools */}
        <aside className="w-20 border-r border-border bg-card flex flex-col items-center py-6 gap-6">
          <Button variant="ghost" size="icon" className="rounded-xl w-12 h-12 bg-secondary"><ImageIcon className="w-6 h-6 text-foreground"/></Button>
          <Button variant="ghost" size="icon" className="rounded-xl w-12 h-12 hover:bg-secondary"><Type className="w-6 h-6 text-muted-foreground hover:text-foreground"/></Button>
          <Button variant="ghost" size="icon" className="rounded-xl w-12 h-12 hover:bg-secondary"><Music className="w-6 h-6 text-muted-foreground hover:text-foreground"/></Button>
        </aside>

        {/* Main Canvas (Timeline/Preview) */}
        <main className="flex-1 bg-muted/20 p-8 overflow-y-auto relative">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="aspect-[16/9] bg-black rounded-2xl overflow-hidden shadow-2xl relative border border-border group">
              <img src="https://images.unsplash.com/photo-1502602898657-3e907600bb8e?w=1000&q=80" alt="Paris" className="w-full h-full object-cover opacity-80" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Button size="icon" className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/40 border border-white/40 shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                  <Play className="w-8 h-8 text-white ml-1" />
                </Button>
              </div>
              <div className="absolute bottom-10 left-0 right-0 text-center">
                <h2 className="text-white text-4xl font-serif font-bold drop-shadow-lg">{title}</h2>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="aspect-video bg-card rounded-lg border-2 border-transparent hover:border-primary cursor-pointer overflow-hidden relative">
                  <img src={`https://images.unsplash.com/photo-1502602898657-3e907600bb8e?w=300&q=60&random=${i}`} className="w-full h-full object-cover" alt="thumb"/>
                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 rounded">3.0s</span>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
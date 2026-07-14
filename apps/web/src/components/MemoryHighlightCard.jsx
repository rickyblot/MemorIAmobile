import React from 'react';
import { Sparkles } from 'lucide-react';

export default function MemoryHighlightCard({ title, description, imageUrl, date }) {
  return (
    <div className="relative rounded-2xl overflow-hidden aspect-[4/5] group cursor-pointer">
      <img src={imageUrl} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
      <div className="absolute top-4 left-4 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold text-white flex items-center gap-1.5 border border-white/10">
        <Sparkles className="w-3 h-3 text-primary" /> Recuerdo Destacado
      </div>
      <div className="absolute bottom-0 left-0 right-0 p-6 pointer-events-none">
        <p className="text-white/80 text-sm font-medium mb-1">{date}</p>
        <h3 className="text-xl font-bold text-white mb-2 leading-tight">{title}</h3>
        <p className="text-white/90 text-sm line-clamp-2">{description}</p>
      </div>
    </div>
  );
}
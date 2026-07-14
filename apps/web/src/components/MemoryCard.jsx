import React from 'react';
import { MapPin, Users, Calendar, MoreHorizontal, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function MemoryCard({ memory, variant = 'medium' }) {
  const isSmall = variant === 'small';
  const isLarge = variant === 'large';

  return (
    <Link 
      to={`/memory/${memory.id}`} 
      className={`group relative block rounded-2xl overflow-hidden bg-card border border-border shadow-sm hover:shadow-xl transition-smooth hover:-translate-y-1 ${
        isLarge ? 'aspect-[16/9]' : isSmall ? 'aspect-square' : 'aspect-[4/5]'
      }`}
    >
      {/* Background Image */}
      <img 
        src={memory.thumbnail || "https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=600&fit=crop"} 
        alt={memory.title} 
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      
      {/* Overlay Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-80 group-hover:opacity-100 transition-smooth" />

      {/* Top badges */}
      <div className="absolute top-3 right-3 flex gap-2">
        {memory.encrypted && (
          <div className="bg-success/90 text-white p-1.5 rounded-full backdrop-blur-md">
            <ShieldCheck className="w-3.5 h-3.5" />
          </div>
        )}
      </div>

      {/* Content */}
      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col justify-end">
        <h3 className={`font-heading font-semibold text-foreground truncate mb-1.5 ${isLarge ? 'text-2xl' : 'text-lg'}`}>
          {memory.title}
        </h3>
        
        {!isSmall && (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-text-secondary">
            <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md backdrop-blur-sm">
              <Calendar className="w-3.5 h-3.5 text-primary" />
              <span>{memory.date ? new Date(memory.date).toLocaleDateString() : 'Desconocido'}</span>
            </div>
            {memory.location && (
              <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md backdrop-blur-sm truncate max-w-[120px]">
                <MapPin className="w-3.5 h-3.5 text-secondary" />
                <span className="truncate">{memory.location}</span>
              </div>
            )}
            {memory.peopleCount > 0 && (
              <div className="flex items-center gap-1.5 bg-background/50 px-2 py-1 rounded-md backdrop-blur-sm">
                <Users className="w-3.5 h-3.5 text-accent" />
                <span>{memory.peopleCount}</span>
              </div>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
import React, { useState } from 'react';
import { Search, Sparkles, X, Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function AISearchBar({ className = '' }) {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
      setIsFocused(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
  };

  const suggestions = [
    "Viaje a la playa el año pasado",
    "Fotos de cumpleaños donde salgo sonriendo",
    "Recibos de luz del 2023",
  ];

  return (
    <div className={`relative w-full max-w-2xl mx-auto ${className}`}>
      <form onSubmit={handleSearch} className="relative z-20">
        <div className={`flex items-center w-full bg-input border ${isFocused ? 'border-primary ring-4 ring-primary/20' : 'border-border'} rounded-xl transition-smooth shadow-sm overflow-hidden`}>
          <div className="pl-4 pr-2 text-muted-foreground">
            <Sparkles className={`w-5 h-5 ${isFocused ? 'text-primary' : ''} transition-colors`} />
          </div>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            placeholder="Busca como piensas..."
            className="flex-1 bg-transparent border-none outline-none py-4 text-foreground placeholder:text-muted-foreground text-lg"
          />
          {query && (
            <button type="button" onClick={clearSearch} className="p-2 text-muted-foreground hover:text-foreground transition-colors mr-2">
              <X className="w-5 h-5" />
            </button>
          )}
          <button type="submit" className="bg-primary text-primary-foreground font-semibold px-6 py-4 hover:bg-primary/90 transition-colors">
            Buscar
          </button>
        </div>
      </form>

      {/* Dropdown Suggestions */}
      {isFocused && !query && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-xl shadow-xl z-10 p-2 overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Búsquedas sugeridas por IA
          </div>
          {suggestions.map((suggestion, idx) => (
            <button
              key={idx}
              className="w-full text-left px-4 py-3 text-sm text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-3"
              onMouseDown={() => {
                setQuery(suggestion);
                navigate(`/search?q=${encodeURIComponent(suggestion)}`);
              }}
            >
              <Search className="w-4 h-4 text-muted-foreground" />
              <span>{suggestion}</span>
            </button>
          ))}
          <div className="mt-2 pt-2 border-t border-border">
            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Recientes
            </div>
            <button className="w-full text-left px-4 py-3 text-sm text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors flex items-center gap-3">
              <Clock className="w-4 h-4" />
              <span>Documentos importantes 2024</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
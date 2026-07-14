import React from 'react';
import { History, ArrowRight } from 'lucide-react';

export default function SearchHistoryList({ searches, onSelect }) {
  if (!searches || searches.length === 0) return null;

  return (
    <div className="mt-12 max-w-3xl mx-auto">
      <h3 className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-4 flex items-center">
        <History className="w-4 h-4 mr-2" /> Recent Searches
      </h3>
      <div className="flex flex-wrap gap-2">
        {searches.map((search, i) => (
          <button
            key={i}
            onClick={() => onSelect(search)}
            className="flex items-center text-sm px-4 py-2 bg-card border rounded-full text-foreground hover:border-primary hover:text-primary transition-colors"
          >
            {search}
            <ArrowRight className="w-3 h-3 ml-2 opacity-50" />
          </button>
        ))}
      </div>
    </div>
  );
}
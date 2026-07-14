import React from 'react';
import MemoryCard from './MemoryCard.jsx';
import { Skeleton } from '@/components/ui/skeleton';

export default function MemoryGrid({ memories, loading, onDelete, onView }) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
          <div key={n} className="flex flex-col rounded-2xl overflow-hidden border bg-card">
            <Skeleton className="aspect-[4/3] w-full" />
            <div className="p-5 space-y-3">
              <Skeleton className="h-5 w-2/3" />
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!memories || memories.length === 0) {
    return (
      <div className="text-center py-20 bg-muted/30 rounded-3xl border border-dashed border-border">
        <h3 className="text-xl font-semibold text-foreground mb-2 font-sans">No memories found</h3>
        <p className="text-muted-foreground">Upload your first memory to start building your legacy.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {memories.map((memory) => (
        <MemoryCard 
          key={memory.id} 
          memory={memory} 
          onDelete={onDelete}
          onView={onView}
        />
      ))}
    </div>
  );
}
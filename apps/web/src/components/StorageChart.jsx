import React from 'react';

export default function StorageChart({ total, used }) {
  const percentage = Math.min(100, Math.max(0, (used / total) * 100));
  
  return (
    <div className="w-full">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-muted-foreground font-medium">Almacenamiento</span>
        <span className="text-foreground font-bold">{used} GB / {total} GB</span>
      </div>
      <div className="w-full h-3 bg-secondary rounded-full overflow-hidden">
        <div 
          className="h-full bg-primary rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
import React from 'react';
import { X, PlayCircle, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export default function ImagePreviewStrip({ files, onRemove, className }) {
  if (!files || files.length === 0) return null;

  const formatSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={cn("w-full overflow-hidden", className)}>
      <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
        Selected Media ({files.length})
      </h3>
      <div className="flex overflow-x-auto gap-4 pb-4 snap-x scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent">
        {files.map((fileObj) => (
          <div 
            key={fileObj.id} 
            className="group relative shrink-0 w-36 snap-start flex flex-col gap-2"
          >
            <div className="relative w-full aspect-square rounded-xl overflow-hidden bg-muted border border-border shadow-sm transition-transform duration-300 group-hover:shadow-md">
              {fileObj.isVideo ? (
                <div className="w-full h-full relative">
                  <video 
                    src={fileObj.url} 
                    className="w-full h-full object-cover"
                    preload="metadata"
                  />
                  <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                    <PlayCircle className="w-10 h-10 text-white opacity-80" />
                  </div>
                </div>
              ) : (
                <img 
                  src={fileObj.url} 
                  alt={fileObj.name} 
                  className="w-full h-full object-cover"
                />
              )}
              
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 w-7 h-7 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md scale-90 hover:scale-100"
                onClick={() => onRemove(fileObj.id)}
                aria-label={`Remove ${fileObj.name}`}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="px-1">
              <p className="text-xs font-semibold text-foreground truncate" title={fileObj.name}>
                {fileObj.name}
              </p>
              <p className="text-[10px] text-muted-foreground font-medium flex items-center justify-between">
                <span>{formatSize(fileObj.size)}</span>
                <span className="uppercase text-[9px] px-1.5 py-0.5 rounded-sm bg-muted">
                  {fileObj.isVideo ? 'VIDEO' : 'IMG'}
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
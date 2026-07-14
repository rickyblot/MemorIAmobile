import React from 'react';
import { X, Image as ImageIcon, Film } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';
import { Button } from '@/components/ui/button';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

export default function FilePreviewSection({ files = [], onRemove }) {
  if (!files || files.length === 0) return null;

  return (
    <div className="w-full">
      <h3 className="text-sm font-semibold text-muted-foreground mb-3 uppercase tracking-wider">
        Selected Media ({files.length})
      </h3>
      <ScrollArea className="w-full whitespace-nowrap pb-4">
        <div className="flex w-max space-x-4">
          {files.map((file) => {
            const isVideo = file.event_category === 'video' || !!file.video_file;
            const fileName = Array.isArray(file.file) ? file.file[0] : file.file;
            const thumbUrl = (file.event_category === 'photo' && fileName)
              ? pb.files.getURL(file, fileName, { thumb: '100x100' })
              : null;

            return (
              <div 
                key={file.id} 
                className="relative group w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden border border-border bg-card shadow-sm shrink-0"
              >
                {thumbUrl ? (
                  <img 
                    src={thumbUrl} 
                    alt={file.title || 'Selected memory'} 
                    className="w-full h-full object-cover"
                  />
                ) : isVideo ? (
                  <div className="w-full h-full flex flex-col items-center justify-center bg-secondary/20 text-muted-foreground">
                    <Film className="w-8 h-8 mb-1 opacity-50" />
                  </div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-secondary/20 text-muted-foreground">
                    <ImageIcon className="w-8 h-8 opacity-50" />
                  </div>
                )}
                
                {isVideo && (
                  <div className="absolute bottom-1 right-1 bg-black/60 text-white p-1 rounded">
                    <Film className="w-3 h-3" />
                  </div>
                )}

                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <Button 
                    variant="destructive" 
                    size="icon" 
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(file.id);
                    }}
                    aria-label={`Remove ${file.title}`}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-xs text-white truncate pointer-events-none">
                  {file.title || 'Untitled'}
                </div>
              </div>
            );
          })}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
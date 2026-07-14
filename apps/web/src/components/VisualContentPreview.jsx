import React from 'react';
import { Loader2, Image as ImageIcon, Film, AlertCircle, CheckCircle2, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function VisualContentPreview({ memories, processingState, onRetry }) {
  if (!memories || memories.length === 0) return null;

  const total = memories.length;
  const processedCount = memories.filter(m => processingState[m.id]?.status === 'success').length;
  const isAllDone = processedCount === total;
  const anyErrors = memories.some(m => processingState[m.id]?.status === 'error');

  return (
    <div className="bg-muted/30 border border-border rounded-xl p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          {isAllDone && !anyErrors ? (
            <CheckCircle2 className="w-4 h-4 text-primary" />
          ) : (
            <Loader2 className="w-4 h-4 text-primary animate-spin" />
          )}
          {isAllDone && !anyErrors 
            ? 'Media ready for analysis' 
            : `Analyzing visual content... (${processedCount}/${total})`}
        </h3>
        
        {anyErrors && (
          <Button variant="outline" size="sm" onClick={onRetry} className="h-8">
            <RotateCcw className="w-3.5 h-3.5 mr-2" /> Retry Failed
          </Button>
        )}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 max-h-[300px] overflow-y-auto pr-2">
        {memories.map(memory => {
          const state = processingState[memory.id];
          const isVideo = memory.event_category === 'video' || !!memory.video_file;
          
          return (
            <div 
              key={memory.id} 
              className={`relative rounded-lg border flex flex-col items-center justify-center p-3 text-center transition-colors ${
                state?.status === 'error' ? 'bg-destructive/5 border-destructive/30' : 
                state?.status === 'success' ? 'bg-card border-border' : 
                'bg-muted/50 border-transparent animate-pulse'
              }`}
            >
              {state?.status === 'error' ? (
                <AlertCircle className="w-6 h-6 text-destructive mb-2" />
              ) : isVideo ? (
                <Film className={`w-6 h-6 mb-2 ${state?.status === 'success' ? 'text-primary' : 'text-muted-foreground'}`} />
              ) : (
                <ImageIcon className={`w-6 h-6 mb-2 ${state?.status === 'success' ? 'text-primary' : 'text-muted-foreground'}`} />
              )}
              
              <span className="text-xs font-medium truncate w-full px-1" title={memory.title}>
                {memory.title || 'Untitled'}
              </span>
              
              {state?.status === 'success' && isVideo && (
                <span className="text-[10px] text-muted-foreground mt-1">
                  {state.frameCount || 0} frames extracted
                </span>
              )}
              
              {state?.status === 'error' && (
                <span className="text-[10px] text-destructive mt-1 font-medium leading-tight">
                  Failed
                </span>
              )}

              {state?.status === 'pending' && (
                <span className="text-[10px] text-muted-foreground mt-1">Waiting...</span>
              )}
              
              {state?.status === 'loading' && (
                <span className="text-[10px] text-primary mt-1 flex items-center gap-1">
                  <Loader2 className="w-3 h-3 animate-spin" /> Processing
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
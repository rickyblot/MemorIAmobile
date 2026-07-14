import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Image as ImageIcon, FileText, Video, File } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

export default function FilePreviewCard({ file, isSelected, onToggle }) {
  const isImage = file.event_category === 'photo' || (!file.video_file && file.file_type_extracted?.includes('image'));
  const isVideo = file.event_category === 'video' || !!file.video_file;
  const isDoc = file.event_category === 'document' || file.event_category === 'note';

  const fileName = Array.isArray(file.file) && file.file.length > 0 ? file.file[0] : file.file;
  
  const thumbUrl = isImage && fileName 
    ? pb.files.getURL(file, fileName, { thumb: '100x100' }) 
    : null;

  const formatDuration = (seconds) => {
    if (!seconds) return '';
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div 
      className={`story-preview-card relative flex items-center p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
        isSelected 
          ? 'ring-2 ring-[hsl(var(--story-selection-ring))] bg-primary/5 shadow-sm border-transparent' 
          : 'hover:border-primary/40'
      }`}
      onClick={onToggle}
    >
      <div className="mr-4 shrink-0" onClick={(e) => e.stopPropagation()}>
         <Checkbox checked={isSelected} onCheckedChange={onToggle} />
      </div>
      
      <div className="w-14 h-14 rounded-lg overflow-hidden bg-muted/80 flex items-center justify-center shrink-0 mr-4 border border-border/50 relative">
         {thumbUrl ? (
           <img src={thumbUrl} alt={file.title || 'Memory thumbnail'} className="w-full h-full object-cover" />
         ) : isImage ? (
           <ImageIcon className="w-6 h-6 text-muted-foreground" />
         ) : isVideo ? (
           <>
             <Video className="w-6 h-6 text-primary" />
             {file.video_duration && (
               <div className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-mono px-1 rounded">
                 {formatDuration(file.video_duration)}
               </div>
             )}
           </>
         ) : isDoc ? (
           <FileText className="w-6 h-6 text-muted-foreground" />
         ) : (
           <File className="w-6 h-6 text-muted-foreground" />
         )}
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-semibold text-foreground truncate mb-1">
          {file.title || 'Untitled Memory'}
        </h4>
        <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground truncate">
          <span>
            {new Date(file.date || file.created).toLocaleDateString(undefined, {
              year: 'numeric', month: 'short', day: 'numeric'
            })}
          </span>
          {isVideo && file.video_duration && (
            <>
              <span>•</span>
              <span>{formatDuration(file.video_duration)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
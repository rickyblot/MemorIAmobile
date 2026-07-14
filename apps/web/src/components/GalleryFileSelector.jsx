import React from 'react';
import { Image as ImageIcon, Film, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import pb from '@/lib/pocketbaseClient';

export default function GalleryFileSelector({ files, selectedIds, onSelectionChange }) {
  
  const toggleSelection = (id) => {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    onSelectionChange(newSelection);
  };

  const handleSelectAll = () => {
    if (selectedIds.size === files.length) {
      onSelectionChange(new Set());
    } else {
      onSelectionChange(new Set(files.map(f => f.id)));
    }
  };

  if (!files || files.length === 0) return null;

  const allSelected = selectedIds.size === files.length && files.length > 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Select Files for Story</h3>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={handleSelectAll}
          className="font-medium"
        >
          {allSelected ? 'Deselect All' : 'Use All Files'}
        </Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {files.map((file) => {
          const isSelected = selectedIds.has(file.id);
          const isImage = file.fileType?.startsWith('image');
          const isVideo = file.fileType?.startsWith('video');
          const thumbUrl = isImage ? pb.files.getURL(file, file.file, { thumb: '200x200' }) : null;

          return (
            <div 
              key={file.id}
              onClick={() => toggleSelection(file.id)}
              className={`relative group cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-200 aspect-square ${
                isSelected ? 'border-primary shadow-md' : 'border-border hover:border-primary/50'
              }`}
            >
              {thumbUrl ? (
                <img 
                  src={thumbUrl} 
                  alt={file.filename} 
                  className={`w-full h-full object-cover transition-transform duration-300 ${!isSelected && 'group-hover:scale-105'}`}
                />
              ) : (
                <div className="w-full h-full bg-secondary/30 flex flex-col items-center justify-center text-muted-foreground">
                  {isVideo ? <Film className="w-10 h-10 mb-2 opacity-60" /> : <ImageIcon className="w-10 h-10 mb-2 opacity-60" />}
                </div>
              )}

              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />

              <div className="absolute top-2 left-2 z-10">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
                  isSelected ? 'bg-primary border-primary text-primary-foreground' : 'bg-background/80 border-muted-foreground/50'
                }`}>
                  {isSelected && <CheckCircle2 className="w-4 h-4" />}
                </div>
              </div>
              
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-2 text-xs text-white truncate">
                {file.filename}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
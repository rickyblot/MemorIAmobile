import React, { useState, useRef, useCallback } from 'react';
import { UploadCloud, FileVideo, Image as ImageIcon, X, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ACCEPTED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp', 'image/gif', 
  'video/mp4', 'video/webm', 'video/quicktime'
];
const MAX_SIZE = 20 * 1024 * 1024; // 20MB

export default function FileSelector({ onFilesSelected, selectedFiles = [], className }) {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleFiles = useCallback((files) => {
    setError(null);
    const validFiles = [];
    let hasError = false;

    Array.from(files).forEach((file) => {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        setError(`Invalid file type: ${file.name}. Accepted: JPG, PNG, WebP, GIF, MP4, WebM, MOV`);
        hasError = true;
        return;
      }
      if (file.size > MAX_SIZE) {
        setError(`File too large: ${file.name}. Max size is 20MB`);
        hasError = true;
        return;
      }
      
      // Prevent duplicates by checking name and size
      const isDuplicate = selectedFiles.some(
        sf => sf.file.name === file.name && sf.file.size === file.size
      );
      
      if (!isDuplicate) {
        validFiles.push({
          id: Math.random().toString(36).substring(7),
          file,
          url: URL.createObjectURL(file),
          name: file.name,
          size: file.size,
          type: file.type,
          isVideo: file.type.startsWith('video/')
        });
      }
    });

    if (validFiles.length > 0) {
      onFilesSelected([...selectedFiles, ...validFiles]);
    }
  }, [selectedFiles, onFilesSelected]);

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const onDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const onDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  }, [handleFiles]);

  const onFileInputChange = useCallback((e) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
    // Reset input so same file can be selected again if removed
    if (fileInputRef.current) fileInputRef.current.value = '';
  }, [handleFiles]);

  return (
    <div className={cn("space-y-4", className)}>
      <div 
        className={cn(
          "relative flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-2xl transition-all duration-200 ease-in-out cursor-pointer text-center",
          isDragging 
            ? "border-primary bg-primary/5 scale-[1.01]" 
            : "border-border bg-card hover:bg-muted/50 hover:border-primary/50"
        )}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={onFileInputChange} 
          className="hidden" 
          multiple 
          accept={ACCEPTED_TYPES.join(',')}
        />
        
        <div className="w-16 h-16 mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary shadow-sm">
          <UploadCloud className="w-8 h-8" />
        </div>
        
        <h3 className="text-xl font-bold text-foreground font-sans mb-2">
          Drag & Drop Media Here
        </h3>
        <p className="text-sm text-muted-foreground mb-6 max-w-sm">
          Select photos or videos to generate your story. 
          <br/>Supports JPG, PNG, WebP, GIF, MP4, MOV (Max 20MB)
        </p>
        
        <Button type="button" variant="secondary" className="font-semibold pointer-events-none">
          Browse Files
        </Button>
      </div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-destructive/10 text-destructive border border-destructive/20 animate-in fade-in slide-in-from-bottom-2">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <p className="text-sm font-medium">{error}</p>
          <button onClick={() => setError(null)} className="ml-auto" aria-label="Dismiss error">
            <X className="w-4 h-4 opacity-70 hover:opacity-100" />
          </button>
        </div>
      )}
    </div>
  );
}
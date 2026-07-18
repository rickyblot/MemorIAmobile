import React, { useCallback, useState, useRef } from 'react';
import { UploadCloud, File, Image as ImageIcon, Video, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';
import MemorySavedAnimation from '@/components/MemorySavedAnimation.jsx';

export default function MemoryUpload({ onUploadComplete }) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [savedCount, setSavedCount] = useState(0);
  
  const inputRef = useRef(null);
  const { currentUser } = useAuth();
  const dismissSavedAnimation = useCallback(() => setSavedCount(0), []);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files) {
      addFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const addFiles = (newFiles) => {
    const validFiles = newFiles.filter(f => f.size <= 100 * 1024 * 1024); // 100MB limit
    if (validFiles.length < newFiles.length) toast.warning('Some files were skipped (over 100MB limit).');
    
    const mapped = validFiles.map(file => ({
      file,
      title: file.name.split('.')[0],
      type: file.type.startsWith('image/') ? 'photo' : file.type.startsWith('video/') ? 'video' : file.type.includes('pdf') ? 'document' : 'other',
      date: new Date(file.lastModified).toISOString(), // extracted date
      size: file.size
    }));
    setFiles(prev => [...prev, ...mapped]);
  };

  const removeFile = (idx) => {
    setFiles(prev => prev.filter((_, i) => i !== idx));
  };

  const handleCancel = () => {
    setFiles([]);
    if (onUploadComplete) onUploadComplete();
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setUploading(true);
    setProgress(0);
    
    let successCount = 0;
    try {
      for (let i = 0; i < files.length; i++) {
        const item = files[i];
        const formData = new FormData();
        formData.append('file', item.file);
        formData.append('title', item.title);
        formData.append('date', item.date);
        formData.append('userId', currentUser.id);
        formData.append('event_category', item.type);
        formData.append('file_size_bytes', item.size);

        await pb.collection('memories').create(formData, { $autoCancel: false });
        successCount++;
        setProgress(((i + 1) / files.length) * 100);
      }
      setSavedCount(successCount);
      setFiles([]);
      if (onUploadComplete) onUploadComplete();
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload memory. ' + err.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  return (
    <>
      <div className="bg-card rounded-3xl p-6 md:p-8 shadow-sm border border-border">
      <div 
        className={`upload-zone ${dragActive ? 'active' : ''}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <div className="flex flex-col items-center justify-center space-y-4 pointer-events-none">
          <UploadCloud className="w-14 h-14 text-primary" />
          <div>
            <p className="text-xl font-bold font-sans text-foreground">Drag & Drop files here</p>
            <p className="text-sm text-muted-foreground mt-2">Images, Videos, PDFs, Docs up to 100MB</p>
          </div>
        </div>
        <input 
          type="file" 
          ref={inputRef} 
          className="hidden" 
          onChange={handleChange}
          multiple
          accept="image/*,video/*,application/pdf,.doc,.docx,.txt" 
        />
      </div>

      {files.length > 0 && (
        <div className="mt-8 space-y-4">
          <h4 className="font-semibold text-foreground font-sans">Ready to preserve ({files.length})</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-60 overflow-y-auto pr-2">
            {files.map((item, idx) => (
              <div key={idx} className="memory-lift flex items-center gap-3 bg-muted/50 p-3 rounded-xl border border-border">
                {item.type === 'photo' ? <ImageIcon className="w-8 h-8 text-[hsl(var(--file-image))]" /> : 
                 item.type === 'video' ? <Video className="w-8 h-8 text-[hsl(var(--file-video))]" /> : 
                 <File className="w-8 h-8 text-muted-foreground" />}
                <div className="flex-1 overflow-hidden">
                  <input 
                    type="text" 
                    value={item.title} 
                    onChange={e => {
                      const newFiles = [...files];
                      newFiles[idx].title = e.target.value;
                      setFiles(newFiles);
                    }}
                    className="w-full bg-transparent border-b border-transparent hover:border-border focus:border-primary outline-none font-medium text-sm text-foreground truncate"
                  />
                  <p className="text-xs text-muted-foreground">{(item.size / 1024 / 1024).toFixed(1)} MB</p>
                </div>
                <button onClick={() => removeFile(idx)} className="p-1.5 hover:bg-destructive/10 text-muted-foreground hover:text-destructive rounded-md transition-colors" disabled={uploading}>
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>

          {uploading && (
            <div className="space-y-2 py-4">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-center text-muted-foreground">Uploading... {Math.round(progress)}%</p>
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button className="flex-1 font-bold font-sans shadow-sm" size="lg" onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Preserving...' : 'Preserve Memories'}
            </Button>
            <Button variant="outline" size="lg" onClick={handleCancel} disabled={uploading} className="font-semibold">
              Cancel
            </Button>
          </div>
        </div>
      )}
      </div>
      <MemorySavedAnimation count={savedCount} onComplete={dismissSavedAnimation} />
    </>
  );
}
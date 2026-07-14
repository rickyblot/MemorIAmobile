import React, { useState, useCallback } from 'react';
import { Upload, X, Image as ImageIcon, FileText, Film, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient';
import { extractVideoMetadata } from '@/lib/videoMetadataExtractor';

const MAX_VIDEO_SIZE = 500 * 1024 * 1024; // 500MB

const MemoryUploadComponent = ({ onUploadComplete }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [validationError, setValidationError] = useState('');
  const { toast } = useToast();

  const validateFiles = (fileList) => {
    setValidationError('');
    const validFiles = [];
    
    for (const file of fileList) {
      if (file.type === 'video/mp4') {
        if (file.size > MAX_VIDEO_SIZE) {
          toast({
            title: 'File too large',
            description: `${file.name} exceeds the 500MB limit for videos.`,
            variant: 'destructive',
          });
          continue;
        }
      }
      validFiles.push(file);
    }
    return validFiles;
  };

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const droppedFiles = Array.from(e.dataTransfer.files);
    const valid = validateFiles(droppedFiles);
    setFiles(prev => [...prev, ...valid]);
  }, []);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const valid = validateFiles(selectedFiles);
    setFiles(prev => [...prev, ...valid]);
  };

  const removeFile = (index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUpload = async () => {
    if (files.length === 0) return;

    setUploading(true);
    setProgress(0);

    try {
      const userId = pb.authStore.model?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      const totalFiles = files.length;
      let completed = 0;

      for (const file of files) {
        const formData = new FormData();
        formData.append('userId', userId);
        formData.append('title', file.name.split('.')[0]);
        formData.append('description', `Uploaded on ${new Date().toLocaleDateString()}`);
        formData.append('date', new Date().toISOString().split('T')[0]);

        if (file.type === 'video/mp4') {
          formData.append('video_file', file);
          formData.append('event_category', 'video');
          
          const metadata = await extractVideoMetadata(file);
          if (metadata) {
            formData.append('video_duration', metadata.duration);
            formData.append('video_metadata', JSON.stringify(metadata));
          }
        } else {
          formData.append('file', file);
          formData.append('event_category', 'photo');
        }

        await pb.collection('memories').create(formData, { $autoCancel: false });

        completed++;
        setProgress((completed / totalFiles) * 100);
      }

      toast({
        title: 'Upload successful',
        description: `${totalFiles} ${totalFiles === 1 ? 'file' : 'files'} uploaded successfully`,
      });

      setFiles([]);
      if (onUploadComplete) onUploadComplete();
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: 'Upload failed',
        description: error.message || 'An error occurred during upload',
        variant: 'destructive',
      });
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <ImageIcon className="w-8 h-8 text-primary" />;
    if (type.startsWith('video/')) return <Film className="w-8 h-8 text-[hsl(var(--file-video))]" />;
    return <FileText className="w-8 h-8 text-accent" />;
  };

  return (
    <div className="space-y-6">
      <div
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        className="upload-zone group"
      >
        <Upload className="w-16 h-16 mx-auto mb-4 text-primary group-hover:scale-110 transition-transform duration-300" />
        <h3 className="text-xl font-bold mb-2 text-foreground font-sans">Drop files here</h3>
        <p className="text-muted-foreground mb-4">Supports Images and MP4 Videos (Max 500MB)</p>
        <input
          type="file"
          multiple
          onChange={handleFileSelect}
          className="hidden"
          id="file-upload"
          accept="image/*,video/mp4,.mp4"
        />
        <Button asChild variant="outline" className="font-semibold shadow-sm">
          <label htmlFor="file-upload" className="cursor-pointer">
            Select Files
          </label>
        </Button>
      </div>

      {validationError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-xl flex items-center gap-3">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{validationError}</span>
        </div>
      )}

      {files.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <h4 className="font-semibold text-foreground font-sans">Selected files ({files.length})</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {files.map((file, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3 shadow-sm">
                {getFileIcon(file.type)}
                <div className="flex-1 min-w-0 pt-1">
                  <p className="font-medium text-sm truncate text-card-foreground">{file.name}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className="text-destructive hover:text-destructive/80 transition-colors p-1"
                  disabled={uploading}
                  aria-label="Remove file"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          {uploading && (
            <div className="space-y-2 bg-muted/30 p-4 rounded-xl border border-border">
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-foreground">Uploading...</span>
                <span className="text-primary">{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          )}

          <Button
            onClick={handleUpload}
            disabled={uploading}
            size="lg"
            className="w-full font-bold font-sans shadow-md"
          >
            {uploading ? 'Uploading...' : `Upload ${files.length} ${files.length === 1 ? 'file' : 'files'}`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MemoryUploadComponent;
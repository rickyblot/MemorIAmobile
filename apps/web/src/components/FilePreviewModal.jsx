import React, { useState } from 'react';
import { Download, FileText, AlertTriangle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import pb from '@/lib/pocketbaseClient.js';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import VideoPreviewModal from './VideoPreviewModal.jsx';

export default function FilePreviewModal({ memory, isOpen, onClose }) {
  const { t } = useLanguage();
  const [imageError, setImageError] = useState(false);

  if (!memory) return null;

  // Delegate video playback to the specialized VideoPreviewModal
  if (memory.video_file || memory.event_category === 'video') {
    return <VideoPreviewModal memory={memory} isOpen={isOpen} onClose={onClose} />;
  }

  const fileName = Array.isArray(memory.file) && memory.file.length > 0 
    ? memory.file[0] 
    : (typeof memory.file === 'string' ? memory.file : null);

  const fileUrl = fileName ? pb.files.getURL(memory, fileName) : null;
  const type = memory.event_category || 'other';

  const renderContent = () => {
    if (!fileUrl) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-xl p-6 text-center">
          <FileText className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
          <p className="text-muted-foreground font-sans font-medium">
            {t('memories.noFileAttached') || 'No file attached to this memory.'}
          </p>
        </div>
      );
    }

    if (imageError) {
      return (
        <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-xl p-6 text-center">
          <AlertTriangle className="w-16 h-16 text-destructive mb-4 opacity-70" />
          <p className="text-muted-foreground font-sans font-medium mb-4">
            {t('memories.fileLoadError') || 'Failed to load the file preview.'}
          </p>
          <Button asChild variant="outline">
            <a href={fileUrl} target="_blank" rel="noopener noreferrer" download>
              <Download className="w-4 h-4 mr-2" /> {t('memories.downloadFile') || 'Download File'}
            </a>
          </Button>
        </div>
      );
    }

    switch (type) {
      case 'photo':
        return (
          <div className="flex justify-center items-center bg-black/5 rounded-xl overflow-hidden min-h-[300px]">
            <img 
              src={fileUrl} 
              alt={memory.title} 
              className="max-w-full max-h-[70vh] object-contain" 
              onError={() => setImageError(true)}
            />
          </div>
        );
      case 'document':
        if (fileName.toLowerCase().endsWith('.pdf') || memory.file_type_extracted === 'application/pdf') {
          return (
            <iframe 
              src={fileUrl} 
              className="w-full h-[70vh] rounded-xl border bg-white" 
              title="PDF Preview"
            />
          );
        }
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-xl">
            <FileText className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <Button asChild>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" download>
                <Download className="w-4 h-4 mr-2" /> {t('memories.downloadDocument') || 'Download Document'}
              </a>
            </Button>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center justify-center h-64 bg-muted rounded-xl">
            <FileText className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
            <Button asChild>
              <a href={fileUrl} target="_blank" rel="noopener noreferrer" download>
                <Download className="w-4 h-4 mr-2" /> {t('memories.downloadFile') || 'Download File'}
              </a>
            </Button>
          </div>
        );
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        setImageError(false);
        onClose();
      }
    }}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-sans">
            {memory.title || t('memories.untitled') || 'Untitled'}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground flex items-center gap-2">
            <span>{memory.date ? new Date(memory.date).toLocaleDateString() : (t('memories.unknownDate') || 'Unknown date')}</span>
            {memory.location && <span>• {memory.location}</span>}
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          {renderContent()}
        </div>
        
        {memory.description && (
          <div className="mt-6 p-4 bg-muted/50 rounded-xl border border-border">
            <p className="text-sm leading-relaxed">{memory.description}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
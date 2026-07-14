import React, { useState } from 'react';
import { Image as ImageIcon, Film, Calendar, MapPin, MoreVertical, Trash2, Edit2, Share2, Download, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Skeleton } from '@/components/ui/skeleton';
import { Checkbox } from '@/components/ui/checkbox';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';

export function MemoryCardSkeleton() {
  return (
    <div className="bg-card rounded-2xl overflow-hidden border border-border shadow-sm">
      <Skeleton className="w-full aspect-square" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export default function EnhancedMemoryCard({ 
  memory, 
  onPreview, 
  onEdit, 
  onDelete, 
  onShare,
  selectionMode = false,
  isSelected = false,
  onSelectToggle
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const isVideo = memory.event_category === 'video' || !!memory.video_file;
  const fileName = Array.isArray(memory.file) ? memory.file[0] : memory.file;
  const thumbUrl = (memory.event_category === 'photo' && fileName)
    ? pb.files.getURL(memory, fileName, { thumb: '400x400' })
    : null;

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(memory);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const fileToDownload = isVideo ? memory.video_file : fileName;
      if (!fileToDownload) throw new Error("No file available");
      
      const url = pb.files.getURL(memory, fileToDownload);
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = fileToDownload;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
      toast.success("Download started");
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("Failed to download file");
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const fileToShare = isVideo ? memory.video_file : fileName;
      const url = pb.files.getURL(memory, fileToShare);
      await navigator.clipboard.writeText(url);
      if (onShare) onShare(memory);
      else toast.success("Link copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleCardClick = (e) => {
    if (selectionMode) {
      e.preventDefault();
      e.stopPropagation();
      onSelectToggle && onSelectToggle(memory.id);
    } else if (onPreview) {
      onPreview(memory);
    }
  };

  return (
    <>
      <div 
        className={`group bg-card rounded-2xl overflow-hidden border transition-all duration-300 flex flex-col h-full relative ${
          isSelected ? 'border-primary ring-2 ring-primary/20 shadow-md' : 'border-border shadow-sm hover:shadow-md'
        }`}
      >
        {selectionMode && (
          <div className="absolute top-3 left-3 z-10 bg-background/80 backdrop-blur-sm rounded-md p-1">
            <Checkbox 
              checked={isSelected} 
              onCheckedChange={() => onSelectToggle && onSelectToggle(memory.id)}
              className="w-5 h-5"
            />
          </div>
        )}

        <div 
          className="relative aspect-square bg-muted cursor-pointer overflow-hidden"
          onClick={handleCardClick}
          role="button"
          tabIndex={0}
          aria-label={selectionMode ? `Toggle selection for ${memory.title}` : `Preview ${memory.title}`}
          onKeyDown={(e) => e.key === 'Enter' && handleCardClick(e)}
        >
          {thumbUrl ? (
            <img 
              src={thumbUrl} 
              alt={memory.title || 'Memory thumbnail'} 
              className={`w-full h-full object-cover transition-transform duration-500 ${!selectionMode && 'group-hover:scale-105'}`}
              loading="lazy"
            />
          ) : isVideo ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground bg-secondary/20">
              <Film className="w-12 h-12 mb-3 opacity-50" />
              <span className="text-sm font-medium">Video</span>
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-secondary/20">
              <ImageIcon className="w-12 h-12 text-muted-foreground opacity-50" />
            </div>
          )}

          {isVideo && (
            <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md text-white p-1.5 rounded-lg shadow-sm">
              <Film className="w-4 h-4" />
            </div>
          )}
          
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        </div>

        <div className="p-4 flex flex-col flex-grow">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-bold text-foreground font-sans line-clamp-1" title={memory.title}>
              {memory.title || 'Untitled Memory'}
            </h3>
            {!selectionMode && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8 -mr-2 -mt-1 text-muted-foreground hover:text-foreground" aria-label="Memory options">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => onEdit && onEdit(memory)} className="cursor-pointer">
                    <Edit2 className="w-4 h-4 mr-2" /> Edit Details
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                    <Share2 className="w-4 h-4 mr-2" /> Share Link
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleDownload} disabled={isDownloading} className="cursor-pointer">
                    {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />} 
                    Download
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive">
                    <Trash2 className="w-4 h-4 mr-2" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <div className="space-y-1.5 mt-auto pt-2">
            {memory.date && (
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                <span className="truncate">{new Date(memory.date).toLocaleDateString()}</span>
              </div>
            )}
            {memory.location && (
              <div className="flex items-center text-xs text-muted-foreground">
                <MapPin className="w-3.5 h-3.5 mr-1.5 shrink-0" />
                <span className="truncate">{memory.location}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Memory?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "{memory.title || 'this memory'}" and remove its files from our servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} disabled={isDeleting} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              {isDeleting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
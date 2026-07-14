import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Calendar, MoreVertical, Trash2, Edit2, Share2, Download, Loader2, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

export default function StoryCard({ story, onDelete }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteConfirm = async () => {
    setIsDeleting(true);
    try {
      await onDelete(story.id);
    } finally {
      setIsDeleting(false);
      setShowDeleteDialog(false);
    }
  };

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const element = document.createElement("a");
      const file = new Blob([`${story.title}\n\n${story.content}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${story.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'story'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Story downloaded successfully');
    } catch (err) {
      toast.error('Failed to download story');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleShare = async () => {
    try {
      const url = `${window.location.origin}/stories/${story.id}`;
      await navigator.clipboard.writeText(url);
      toast.success("Story link copied to clipboard");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  return (
    <>
      <div className="group bg-card rounded-2xl p-6 border border-border shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
            <BookOpen className="w-6 h-6 text-primary" />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground" aria-label="Story options">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={() => navigate(`/stories/${story.id}`)} className="cursor-pointer">
                <Eye className="w-4 h-4 mr-2" /> View Story
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => navigate(`/stories/${story.id}/edit`)} className="cursor-pointer">
                <Edit2 className="w-4 h-4 mr-2" /> Edit Story
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleShare} className="cursor-pointer">
                <Share2 className="w-4 h-4 mr-2" /> Share Link
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDownload} disabled={isDownloading} className="cursor-pointer">
                {isDownloading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />} 
                Download Text
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setShowDeleteDialog(true)} className="cursor-pointer text-destructive focus:text-destructive">
                <Trash2 className="w-4 h-4 mr-2" /> Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="text-xl font-bold text-foreground font-sans mb-2 line-clamp-2" title={story.title}>
          {story.title || 'Untitled Story'}
        </h3>
        
        <p className="text-muted-foreground text-sm line-clamp-3 mb-6 flex-grow">
          {story.content}
        </p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-border">
          <div className="flex items-center text-xs text-muted-foreground font-medium">
            <Calendar className="w-3.5 h-3.5 mr-1.5" />
            {new Date(story.created).toLocaleDateString()}
          </div>
          <Button asChild variant="secondary" size="sm" className="font-semibold text-xs">
            <Link to={`/stories/${story.id}`}>Read Story</Link>
          </Button>
        </div>
      </div>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Story?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete "{story.title || 'this story'}" from your library.
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
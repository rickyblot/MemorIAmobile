import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Edit2, Save, Copy, Download, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function StoryActions({ 
  onRegenerate, 
  onEditToggle, 
  isEditing, 
  onSave, 
  content, 
  title,
  isStreaming 
}) {
  const [isSaving, setIsSaving] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${title}\n\n${content}`);
      toast.success('Story copied to clipboard');
    } catch (err) {
      toast.error('Failed to copy text');
    }
  };

  const handleDownload = () => {
    try {
      const element = document.createElement("a");
      const file = new Blob([`${title}\n\n${content}`], { type: 'text/plain' });
      element.href = URL.createObjectURL(file);
      element.download = `${title.replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'story'}.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
      toast.success('Story downloaded successfully');
    } catch (err) {
      toast.error('Failed to download story');
    }
  };

  const handleSaveClick = async () => {
    setIsSaving(true);
    try {
      await onSave();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-border mt-8">
      <Button 
        variant="outline" 
        onClick={onRegenerate}
        disabled={isStreaming || isSaving}
        className="font-medium bg-card hover:bg-muted"
      >
        <RotateCcw className="w-4 h-4 mr-2" />
        Regenerate
      </Button>

      <Button 
        variant="outline" 
        onClick={onEditToggle}
        disabled={isStreaming || isSaving}
        className={`font-medium ${isEditing ? 'bg-secondary text-secondary-foreground border-secondary' : 'bg-card hover:bg-muted'}`}
      >
        <Edit2 className="w-4 h-4 mr-2" />
        {isEditing ? 'Done Editing' : 'Edit'}
      </Button>

      <Button 
        variant="outline" 
        onClick={handleCopy}
        disabled={isStreaming || !content.trim()}
        className="font-medium bg-card hover:bg-muted"
      >
        <Copy className="w-4 h-4 mr-2" />
        Copy
      </Button>

      <Button 
        variant="outline" 
        onClick={handleDownload}
        disabled={isStreaming || !content.trim()}
        className="font-medium bg-card hover:bg-muted"
      >
        <Download className="w-4 h-4 mr-2" />
        Download
      </Button>

      <div className="flex-1" />

      <Button 
        onClick={handleSaveClick}
        disabled={isStreaming || isSaving || !content.trim()}
        className="font-semibold shadow-md bg-primary text-primary-foreground hover:brightness-110 active:scale-[0.98] transition-all"
      >
        {isSaving ? (
          <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</>
        ) : (
          <><Save className="w-4 h-4 mr-2" /> Save Story</>
        )}
      </Button>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Tag, Users, FileText } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import pb from '@/lib/pocketbaseClient.js';
import { toast } from 'sonner';

export default function MemoryMetadataEditor({ memory, isOpen, onClose, onSaved }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    event_category: 'other',
    user_notes: ''
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (memory && isOpen) {
      setFormData({
        title: memory.title || '',
        description: memory.description || '',
        date: memory.date ? memory.date.split('T')[0] : '',
        location: memory.location || '',
        event_category: memory.event_category || 'other',
        user_notes: memory.user_notes || ''
      });
    }
  }, [memory, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!memory?.id) return;
    setLoading(true);
    try {
      const updated = await pb.collection('memories').update(memory.id, {
        ...formData,
        date: formData.date ? new Date(formData.date).toISOString() : null,
      }, { $autoCancel: false });
      toast.success('Metadata updated successfully');
      onSaved(updated);
      onClose();
    } catch (error) {
      toast.error('Failed to update metadata: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!memory) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-card text-card-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold font-sans">Edit Memory Metadata</DialogTitle>
          <DialogDescription>Enrich your memory with context so it's easier to find later.</DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-1 block flex items-center gap-2"><FileText className="w-4 h-4"/> Title</label>
              <Input value={formData.title} onChange={e => handleChange('title', e.target.value)} className="bg-background text-foreground" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block flex items-center gap-2"><Calendar className="w-4 h-4"/> Date</label>
              <Input type="date" value={formData.date} onChange={e => handleChange('date', e.target.value)} className="bg-background text-foreground" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block flex items-center gap-2"><MapPin className="w-4 h-4"/> Location</label>
              <Input value={formData.location} onChange={e => handleChange('location', e.target.value)} placeholder="e.g. Paris, France" className="bg-background text-foreground" />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block flex items-center gap-2"><Tag className="w-4 h-4"/> Category</label>
              <Select value={formData.event_category} onValueChange={val => handleChange('event_category', val)}>
                <SelectTrigger className="bg-background text-foreground"><SelectValue placeholder="Select type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="photo">Photo</SelectItem>
                  <SelectItem value="video">Video</SelectItem>
                  <SelectItem value="document">Document</SelectItem>
                  <SelectItem value="note">Note</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-4 flex flex-col">
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea 
                className="w-full flex-1 min-h-[100px] p-3 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                value={formData.description}
                onChange={e => handleChange('description', e.target.value)}
                placeholder="Story behind this memory..."
              />
            </div>
            <div className="flex-1 flex flex-col">
              <label className="text-sm font-medium mb-1 block">Private Notes</label>
              <textarea 
                className="w-full flex-1 min-h-[100px] p-3 rounded-md border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                value={formData.user_notes}
                onChange={e => handleChange('user_notes', e.target.value)}
                placeholder="Personal annotations..."
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t border-border">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Changes'}</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
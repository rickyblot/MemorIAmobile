import React, { useState } from 'react';
import { Mail, Send } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient';

const InvitationForm = ({ onInviteSent }) => {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) throw new Error('User not authenticated');

      await pb.collection('familyMembers').create({
        userId,
        email,
        role,
        status: 'pending',
        joinedDate: new Date().toISOString(),
      }, { $autoCancel: false });

      toast({
        title: t('sharing.inviteSent'),
        description: t('sharing.inviteDesc', { email }),
      });

      setEmail('');
      setRole('viewer');
      if (onInviteSent) onInviteSent();
    } catch (error) {
      console.error('Invitation error:', error);
      toast({
        title: t('common.error'),
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg text-card-foreground font-sans">{t('sharing.inviteMember')}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium text-card-foreground mb-2 block">{t('sharing.emailAddress')}</label>
          <Input
            type="email"
            placeholder="family@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="text-foreground"
          />
        </div>

        <div>
          <label className="text-sm font-medium text-card-foreground mb-2 block">{t('sharing.permissionLevel')}</label>
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="viewer">{t('sharing.viewer')}</SelectItem>
              <SelectItem value="commenter">{t('sharing.commenter')}</SelectItem>
              <SelectItem value="editor">{t('sharing.editor')}</SelectItem>
              <SelectItem value="owner">{t('sharing.owner')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" disabled={loading} className="w-full font-semibold">
          <Send className="w-4 h-4 mr-2" />
          {loading ? t('sharing.sending') : t('sharing.sendInvite')}
        </Button>
      </div>
    </form>
  );
};

export default InvitationForm;
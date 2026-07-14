import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Users } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FamilyMemberCard from '@/components/FamilyMemberCard.jsx';
import InvitationForm from '@/components/InvitationForm.jsx';
import pb from '@/lib/pocketbaseClient';
import { useToast } from '@/hooks/use-toast';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

const FamilySharingPage = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { t } = useLanguage();

  const fetchMembers = async () => {
    try {
      const userId = pb.authStore.model?.id;
      if (!userId) return;

      const records = await pb.collection('familyMembers').getFullList({
        filter: `userId = "${userId}"`,
        sort: '-created',
        $autoCancel: false,
      });

      setMembers(records);
    } catch (error) {
      console.error('Failed to fetch family members:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleEdit = (member) => {
    toast({
      title: t('sharing.editPermissions'),
      description: `${t('sharing.editPermissions')} - ${member.email}`,
    });
  };

  const handleRemove = async (member) => {
    if (!window.confirm(t('sharing.removeConfirm', { email: member.email }))) return;

    try {
      await pb.collection('familyMembers').delete(member.id, { $autoCancel: false });
      toast({
        title: t('sharing.memberRemoved'),
        description: t('sharing.memberRemovedDesc', { email: member.email }),
      });
      fetchMembers();
    } catch (error) {
      toast({
        title: t('sharing.updateFailed'),
        description: error.message,
        variant: 'destructive',
      });
    }
  };

  const handleInviteSent = () => {
    fetchMembers();
  };

  return (
    <>
      <Helmet>
        <title>{t('sharing.pageTitle')}</title>
      </Helmet>

      <Header />

      <main className="min-h-[calc(100vh-4rem)] bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Users className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-sans tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                {t('sharing.title')}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('sharing.subtitle')}
            </p>
          </header>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <InvitationForm onInviteSent={handleInviteSent} />
            </div>

            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold text-foreground mb-6 font-sans">{t('dashboard.stats.family')}</h2>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">{t('sharing.loading')}</p>
                </div>
              ) : members.length === 0 ? (
                <div className="text-center py-12 bg-card border border-border rounded-2xl">
                  <Users className="w-16 h-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-xl font-bold text-foreground mb-2 font-sans">{t('sharing.noMembers')}</h3>
                  <p className="text-muted-foreground">{t('sharing.inviteToStart')}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {members.map((member) => (
                    <FamilyMemberCard
                      key={member.id}
                      member={member}
                      onEdit={handleEdit}
                      onRemove={handleRemove}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default FamilySharingPage;
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { User, Mail, Lock, Save, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useToast } from '@/hooks/use-toast';
import pb from '@/lib/pocketbaseClient';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const { t } = useLanguage();
  const navigate = useNavigate();

  useEffect(() => {
    const user = pb.authStore.model;
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
    }
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userId = pb.authStore.model?.id;
      if (!userId) throw new Error('User not authenticated');

      await pb.collection('users').update(userId, {
        name,
      }, { $autoCancel: false });

      toast({
        title: t('profile.profileUpdated') || 'Profile Updated',
        description: t('profile.profileDesc') || 'Your profile information has been saved successfully.',
      });
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: t('profile.updateFailed') || 'Update Failed',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('profile.pageTitle') || 'Profile Settings'}</title>
        <meta name="description" content={t('profile.subtitle') || 'Manage your account'} />
      </Helmet>

      <Header />

      <main className="min-h-[calc(100vh-4rem)] bg-background py-12">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12">
            <div className="flex items-center gap-3 mb-4">
              <User className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-sans tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                {t('profile.title') || 'Profile Settings'}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed">
              {t('profile.subtitle') || 'Manage your account details and preferences.'}
            </p>
          </header>

          <div className="space-y-6">
            <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-8 space-y-6 shadow-sm">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <User className="w-4 h-4 text-primary" />
                  {t('profile.fullName') || 'Full Name'}
                </label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder={t('profile.fullName') || 'Full Name'}
                  className="text-foreground h-12"
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-semibold text-card-foreground flex items-center gap-2">
                  <Mail className="w-4 h-4 text-secondary" />
                  {t('profile.emailAddress') || 'Email Address'}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  disabled
                  className="text-foreground opacity-60 h-12"
                />
                <p className="text-xs text-muted-foreground">{t('profile.emailCannotChange') || 'Email address cannot be changed.'}</p>
              </div>

              <Button type="submit" disabled={loading} className="w-full font-bold h-12 text-base">
                {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> {t('profile.saving') || 'Saving...'}</> : <><Save className="w-5 h-5 mr-2" /> {t('profile.saveChanges') || 'Save Changes'}</>}
              </Button>
            </form>

            <div className="bg-card border border-border rounded-2xl p-8 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                <div className="flex items-center gap-3">
                  <Lock className="w-6 h-6 text-accent" />
                  <h3 className="font-bold text-xl text-card-foreground font-sans">{t('profile.password') || 'Password'}</h3>
                </div>
                <Button type="button" onClick={() => navigate('/reset-password')} variant="outline" className="font-semibold h-11">
                  Change Password
                </Button>
              </div>
              <p className="text-muted-foreground">
                {t('profile.changePasswordInfo') || 'Update your password to keep your account secure.'}
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default ProfilePage;
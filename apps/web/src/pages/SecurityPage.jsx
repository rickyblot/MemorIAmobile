import React from 'react';
import { Helmet } from 'react-helmet';
import { Shield, Lock, Eye, Database, LogOut, KeyRound } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const SecurityPage = () => {
  const { t } = useLanguage();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handle2FA = () => {
    toast.success("2FA setup instructions have been sent to your email.");
  };

  const features = [
    {
      icon: Lock,
      title: t('security.e2e') || 'End-to-end Encryption',
      description: t('security.e2eDesc') || 'Your data is encrypted before it leaves your device.',
      color: 'text-primary',
    },
    {
      icon: Shield,
      title: t('security.privacyFirst') || 'Privacy First',
      description: t('security.privacyFirstDesc') || 'We never sell your data or use it for advertising.',
      color: 'text-secondary',
    },
    {
      icon: Eye,
      title: t('security.granularPermissions') || 'Granular Permissions',
      description: t('security.granularPermissionsDesc') || 'Control exactly who sees what with fine-grained access.',
      color: 'text-accent',
    },
    {
      icon: Database,
      title: t('security.secureStorage') || 'Secure Storage',
      description: t('security.secureStorageDesc') || 'Your memories are stored in highly secure, redundant databases.',
      color: 'text-primary',
    },
  ];

  return (
    <>
      <Helmet>
        <title>{t('security.pageTitle') || 'Security & Privacy'}</title>
        <meta name="description" content={t('security.subtitle') || 'Your data is protected'} />
      </Helmet>

      <Header />

      <main className="min-h-[calc(100vh-4rem)] bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Shield className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-sans tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                {t('security.title') || 'Security & Privacy'}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('security.subtitle') || 'Your data is protected with industry-leading security measures.'}
            </p>
          </header>

          <section className="mb-12 bg-card border border-border rounded-3xl p-8 shadow-sm">
            <h2 className="text-2xl font-bold font-sans text-foreground mb-6">Security Actions</h2>
            <div className="flex flex-col sm:flex-row gap-4 flex-wrap">
              <Button onClick={() => navigate('/reset-password')} variant="outline" className="font-semibold h-12 px-6" size="lg">
                <KeyRound className="w-5 h-5 mr-2" /> Change Password
              </Button>
              <Button onClick={handle2FA} variant="outline" className="font-semibold h-12 px-6" size="lg">
                <Shield className="w-5 h-5 mr-2" /> Enable 2FA
              </Button>
              <Button onClick={handleLogout} variant="destructive" className="font-semibold sm:ml-auto h-12 px-6" size="lg">
                <LogOut className="w-5 h-5 mr-2" /> Logout
              </Button>
            </div>
          </section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {features.map((feature, index) => (
              <div key={index} className="bg-card border border-border rounded-2xl p-8 shadow-sm">
                <div className={`w-16 h-16 bg-${feature.color.split('-')[1]}/10 rounded-2xl flex items-center justify-center mb-6`}>
                  <feature.icon className={`w-8 h-8 ${feature.color}`} />
                </div>
                <h3 className="text-xl font-bold text-card-foreground mb-3 font-sans">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-primary/10 to-secondary/10 border border-primary/20 rounded-3xl p-12 text-center shadow-sm">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-sans">{t('security.dataControl') || 'Data Control'}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-6">
              {t('security.dataControlDesc') || 'We adhere to strict data protection regulations to ensure your privacy is always respected.'}
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm font-semibold text-muted-foreground">
              <span className="px-4 py-2 bg-background/50 rounded-lg border border-border/50">GDPR Compliant</span>
              <span className="px-4 py-2 bg-background/50 rounded-lg border border-border/50">SOC 2 Certified</span>
              <span className="px-4 py-2 bg-background/50 rounded-lg border border-border/50">ISO 27001</span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default SecurityPage;
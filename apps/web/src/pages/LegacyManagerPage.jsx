import React from 'react';
import { Helmet } from 'react-helmet';
import { BookHeart, Users, Link as LinkIcon } from 'lucide-react';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

const LegacyManagerPage = () => {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('legacy.pageTitle')}</title>
        <meta name="description" content={t('legacy.subtitle')} />
      </Helmet>

      <Header />

      <main className="min-h-[calc(100vh-4rem)] bg-background py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-12 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <BookHeart className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-sans tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                {t('legacy.title')}
              </h1>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              {t('legacy.subtitle')}
            </p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <BookHeart className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-3 font-sans">{t('legacy.historyTitle')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('legacy.historyDesc')}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-secondary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <LinkIcon className="w-8 h-8 text-secondary" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-3 font-sans">{t('legacy.linkingTitle')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('legacy.linkingDesc')}
              </p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-8 text-center">
              <div className="w-16 h-16 bg-accent/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-accent" />
              </div>
              <h3 className="text-xl font-bold text-card-foreground mb-3 font-sans">{t('legacy.mappingTitle')}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t('legacy.mappingDesc')}
              </p>
            </div>
          </div>

          <div className="mt-12 bg-muted/30 border border-border rounded-2xl p-12 text-center">
            <h2 className="text-2xl font-bold text-foreground mb-4 font-sans">{t('legacy.comingSoon')}</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              {t('legacy.comingSoonDesc')}
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
};

export default LegacyManagerPage;
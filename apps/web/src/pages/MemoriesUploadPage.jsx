import React from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import MemoryUpload from '@/components/MemoryUpload.jsx';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function MemoriesUploadPage() {
  const { t } = useLanguage();

  return (
    <>
      <Helmet>
        <title>{t('memories.uploadTitle')} - MemorIA</title>
      </Helmet>
      <Header />
      <main className="min-h-screen bg-muted/20 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <Link to="/memories" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> {t('memories.backToVault')}
          </Link>
          
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-foreground font-sans tracking-tight mb-4">{t('memories.uploadTitle')}</h1>
            <p className="text-lg text-muted-foreground">{t('memories.uploadDesc')}</p>
          </div>

          <MemoryUpload />

          <div className="mt-12 bg-accent/5 border border-accent/20 rounded-2xl p-6 text-center max-w-2xl mx-auto">
            <h3 className="font-sans font-bold text-accent mb-2">{t('memories.uploadTips')}</h3>
            <p className="text-sm text-foreground/80 leading-relaxed">
              {t('memories.uploadTipsDesc')}
            </p>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Sparkles, FileText, Image as ImageIcon, Share2, PenTool, LayoutTemplate } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FeaturePageNavigation from '@/components/FeaturePageNavigation.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { PLANS_PATH } from '@/config/subscriptionRoutes.js';

export default function StoryGenerationPage() {
  const { t } = useLanguage();
  const pageId = 'storyGen';

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{t(`featurePages.${pageId}.title`)} - MemorIAmobile</title>
        <meta name="description" content={t(`featurePages.${pageId}.subtitle`)} />
      </Helmet>

      <Header />
      
      <main className="flex-grow">
        <FeaturePageNavigation currentId={pageId} />

        <section className="relative pt-12 pb-24 overflow-hidden">
          <div className="absolute inset-0 bg-secondary/5 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative animate-scale-in opacity-0" style={{ animationDelay: '0.2s' }}>
                <img 
                  src="https://images.unsplash.com/photo-1694074160470-2384aee39669?auto=format&fit=crop&q=80&w=800" 
                  alt={t(`featurePages.${pageId}.alt1`)} 
                  className="rounded-3xl shadow-xl border border-border object-cover aspect-[4/3] w-full"
                />
              </div>
              <div className="order-1 lg:order-2 animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 text-secondary font-bold text-sm mb-6 uppercase tracking-wider font-sans">
                  <Sparkles className="w-4 h-4" /> {t(`featurePages.${pageId}.heroTag`)}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-foreground mb-6 text-balance leading-tight font-sans text-gradient-primary">
                  {t(`featurePages.${pageId}.title`)}
                </h1>
                <p className="text-xl text-muted-foreground mb-10 text-balance leading-relaxed">
                  {t(`featurePages.${pageId}.subtitle`)}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="font-bold">
                    <Link to="/signup">{t('common.tryIt')} {t(`featurePages.${pageId}.title`)}</Link>
                  </Button>
                  <Button asChild size="lg" variant="secondary" className="font-bold">
                    <Link to={PLANS_PATH}>{t('common.viewPlans')}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-24 bg-card border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-extrabold text-foreground mb-4 font-sans tracking-tight">{t(`featurePages.${pageId}.features.title`)}</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Sparkles, color: 'text-primary' },
                { icon: LayoutTemplate, color: 'text-secondary' },
                { icon: FileText, color: 'text-primary' },
                { icon: PenTool, color: 'text-secondary' },
                { icon: ImageIcon, color: 'text-primary' },
                { icon: Share2, color: 'text-secondary' }
              ].map((item, index) => (
                <div key={index} className="flex flex-col items-center text-center p-8 bg-background rounded-3xl border border-border shadow-subtle hover:shadow-md transition-all hover:border-secondary/40">
                  <div className={`w-16 h-16 rounded-2xl bg-card border border-border flex items-center justify-center mb-6 ${item.color}`}>
                    <item.icon className="w-8 h-8" />
                  </div>
                  <h3 className="font-bold text-2xl text-foreground mb-3 font-sans">{t(`featurePages.${pageId}.features.items.${index}.title`)}</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">{t(`featurePages.${pageId}.features.items.${index}.desc`)}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Search, BrainCircuit, Filter, History, Zap, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FeaturePageNavigation from '@/components/FeaturePageNavigation.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { PLANS_PATH } from '@/config/subscriptionRoutes.js';

export default function IntelligentSearchPage() {
  const { t } = useLanguage();
  const pageId = 'intelSearch';

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
          <div className="absolute inset-0 gradient-primary opacity-10 blur-3xl pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="order-2 lg:order-1 relative animate-scale-in opacity-0" style={{ animationDelay: '0.2s' }}>
                <div className="absolute inset-0 gradient-primary opacity-20 rounded-3xl blur-2xl -z-10 mix-blend-screen"></div>
                <img 
                  src="https://images.unsplash.com/photo-1699259770610-204f58cc4bf8?auto=format&fit=crop&q=80&w=800" 
                  alt={t(`featurePages.${pageId}.alt1`)} 
                  className="rounded-3xl shadow-2xl border border-border/50 object-cover aspect-[4/3] w-full mix-blend-luminosity hover:mix-blend-normal transition-all duration-700"
                />
              </div>
              <div className="order-1 lg:order-2 animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary/10 border border-secondary/20 text-secondary font-bold text-sm mb-6 uppercase tracking-wider font-sans">
                  <Search className="w-4 h-4" /> {t(`featurePages.${pageId}.heroTag`)}
                </div>
                <h1 className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-foreground mb-6 text-balance leading-tight font-sans text-gradient-primary">
                  {t(`featurePages.${pageId}.title`)}
                </h1>
                <p className="text-xl text-muted-foreground mb-10 text-balance leading-relaxed">
                  {t(`featurePages.${pageId}.subtitle`)}
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button asChild size="lg" className="bg-secondary text-secondary-foreground hover:bg-primary font-bold h-14 px-10 shadow-lg shadow-secondary/25 border border-secondary/50 font-sans transition-colors">
                    <Link to="/signup">{t('common.tryIt')} {t(`featurePages.${pageId}.title`)}</Link>
                  </Button>
                  <Button asChild size="lg" variant="outline" className="bg-card text-foreground hover:text-primary hover:border-primary border-2 border-border font-bold h-14 px-10 font-sans">
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
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Sparkles, color: 'text-primary' },
                { icon: BrainCircuit, color: 'text-secondary' },
                { icon: Zap, color: 'text-primary' },
                { icon: History, color: 'text-secondary' },
                { icon: Filter, color: 'text-primary' }
              ].map((item, index) => (
                <div key={index} className="flex gap-5 items-start p-6 bg-background rounded-3xl border border-border shadow-sm hover:shadow-lg transition-all group hover:border-secondary/50">
                  <div className={`w-14 h-14 rounded-2xl bg-card border border-border shrink-0 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2 font-sans">{t(`featurePages.${pageId}.features.items.${index}.title`)}</h3>
                    <p className="text-muted-foreground leading-relaxed">{t(`featurePages.${pageId}.features.items.${index}.desc`)}</p>
                  </div>
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
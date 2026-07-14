import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Clock, MapPin, CalendarDays, Activity, ZoomIn, Edit3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import FeaturePageNavigation from '@/components/FeaturePageNavigation.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { PLANS_PATH } from '@/config/subscriptionRoutes.js';

export default function LifeTimelinePage() {
  const { t } = useLanguage();
  const pageId = 'lifeTimeline';

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
          <div className="absolute inset-0 bg-primary/5 pointer-events-none"></div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="animate-slide-up">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary font-bold text-sm mb-6 uppercase tracking-wider font-sans">
                  <Clock className="w-4 h-4" /> {t(`featurePages.${pageId}.heroTag`)}
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
              <div className="relative animate-scale-in opacity-0" style={{ animationDelay: '0.2s' }}>
                <img 
                  src="https://images.unsplash.com/photo-1616261167032-b16d2df8333b?auto=format&fit=crop&q=80&w=800" 
                  alt={t(`featurePages.${pageId}.alt1`)} 
                  className="rounded-3xl shadow-xl border border-border object-cover aspect-[4/3] w-full"
                />
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
                { icon: CalendarDays, color: 'text-primary' },
                { icon: Activity, color: 'text-secondary' },
                { icon: MapPin, color: 'text-primary' },
                { icon: ZoomIn, color: 'text-secondary' },
                { icon: Clock, color: 'text-primary' },
                { icon: Edit3, color: 'text-secondary' }
              ].map((item, index) => (
                <div key={index} className="bg-background rounded-3xl p-8 border border-border shadow-subtle hover:shadow-lg hover:border-primary/40 hover:-translate-y-1 transition-all">
                  <div className={`w-14 h-14 rounded-2xl bg-card border border-border flex items-center justify-center mb-6 ${item.color}`}>
                    <item.icon className="w-7 h-7" />
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
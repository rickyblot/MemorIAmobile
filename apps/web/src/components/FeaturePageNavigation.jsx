import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ChevronRight, Home } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

const FEATURE_PAGES = [
  { id: 'autoOrg', path: '/automatic-organization' },
  { id: 'intelSearch', path: '/intelligent-search' },
  { id: 'lifeTimeline', path: '/life-timeline' },
  { id: 'storyGen', path: '/story-generation' },
  { id: 'privateAi', path: '/private-ai' },
  { id: 'shareLegacy', path: '/share-legacy' },
];

export default function FeaturePageNavigation({ currentId }) {
  const { t } = useLanguage();
  const navigate = useNavigate();

  const currentIndex = FEATURE_PAGES.findIndex(p => p.id === currentId);
  const prevPage = currentIndex > 0 ? FEATURE_PAGES[currentIndex - 1] : null;
  const nextPage = currentIndex < FEATURE_PAGES.length - 1 ? FEATURE_PAGES[currentIndex + 1] : null;
  
  const relatedFeatures = FEATURE_PAGES.filter(p => p.id !== currentId).slice(0, 3);

  return (
    <div className="w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <nav className="flex items-center text-sm font-sans font-medium text-muted-foreground" aria-label={t('common.breadcrumb')}>
          <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
            <Home className="w-4 h-4" />
            <span className="sr-only">{t('header.home')}</span>
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 rtl:rotate-180" />
          <Link to="/features" className="hover:text-primary transition-colors">
            {t('header.features')}
          </Link>
          <ChevronRight className="w-4 h-4 mx-2 rtl:rotate-180" />
          <span className="text-foreground font-semibold" aria-current="page">
            {t(`featurePages.${currentId}.title`)}
          </span>
        </nav>
      </div>

      <div className="bg-card border-t border-border mt-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-muted/30 to-transparent pointer-events-none"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="mb-16">
            <h3 className="text-3xl font-extrabold text-foreground mb-8 font-sans">{t('common.relatedFeatures')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedFeatures.map(feature => (
                <Link 
                  key={feature.id} 
                  to={feature.path}
                  className="bg-background border border-border rounded-3xl p-8 hover:-translate-y-1 hover:border-primary/50 hover:shadow-md transition-all duration-300 group shadow-subtle"
                >
                  <h4 className="font-bold text-xl text-foreground group-hover:text-primary transition-colors font-sans mb-3">
                    {t(`featurePages.${feature.id}.title`)}
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {t(`featurePages.${feature.id}.subtitle`)}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pt-10 border-t border-border">
            {prevPage ? (
              <button 
                onClick={() => navigate(prevPage.path)}
                className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors py-3 px-6 rounded-2xl hover:bg-muted font-sans font-medium w-full sm:w-auto justify-center sm:justify-start"
              >
                <ArrowLeft className="w-5 h-5 rtl:rotate-180" />
                <div className="text-left rtl:text-right">
                  <span className="block text-xs font-bold uppercase tracking-widest opacity-70 mb-1">{t('common.prev')}</span>
                  <span className="block text-lg">{t(`featurePages.${prevPage.id}.title`)}</span>
                </div>
              </button>
            ) : <div className="w-[250px] hidden sm:block"></div>}

            {nextPage && (
              <button 
                onClick={() => navigate(nextPage.path)}
                className="flex items-center gap-3 text-foreground hover:text-primary transition-colors py-3 px-6 rounded-2xl hover:bg-muted font-sans font-medium w-full sm:w-auto justify-center sm:justify-end"
              >
                <div className="text-right rtl:text-left">
                  <span className="block text-xs font-bold uppercase tracking-widest opacity-70 mb-1 text-muted-foreground">{t('common.next')}</span>
                  <span className="block text-lg">{t(`featurePages.${nextPage.id}.title`)}</span>
                </div>
                <ArrowRight className="w-5 h-5 rtl:rotate-180" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
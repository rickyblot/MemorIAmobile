import React from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Brain, Folder, MessageCircle, Calendar, Heart, BookOpen, Lock, Users, ChevronRight, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { PLANS_PATH } from '@/config/subscriptionRoutes.js';

export default function ServicesPage() {
  const { t } = useLanguage();

  const services = [
    { icon: Brain, id: 0, bg: 'bg-primary/10', color: 'text-primary', borderHover: 'hover:border-primary/50', span: 'md:col-span-2 lg:col-span-2' },
    { icon: Folder, id: 1, bg: 'bg-secondary/10', color: 'text-secondary', borderHover: 'hover:border-secondary/50', span: 'col-span-1' },
    { icon: MessageCircle, id: 2, bg: 'bg-primary/10', color: 'text-primary', borderHover: 'hover:border-primary/50', span: 'col-span-1' },
    { icon: Calendar, id: 3, bg: 'bg-secondary/10', color: 'text-secondary', borderHover: 'hover:border-secondary/50', span: 'col-span-1' },
    { icon: Heart, id: 4, bg: 'bg-primary/10', color: 'text-primary', borderHover: 'hover:border-primary/50', span: 'col-span-1' },
    { icon: BookOpen, id: 5, bg: 'bg-secondary/10', color: 'text-secondary', borderHover: 'hover:border-secondary/50', span: 'md:col-span-2 lg:col-span-2' },
    { icon: Lock, id: 6, bg: 'bg-primary/10', color: 'text-primary', borderHover: 'hover:border-primary/50', span: 'col-span-1' },
    { icon: Users, id: 7, bg: 'bg-secondary/10', color: 'text-secondary', borderHover: 'hover:border-secondary/50', span: 'md:col-span-2 lg:col-span-2' }
  ];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Helmet>
        <title>{t('servicesPage.title') || 'Services'} - MemorIAmobile</title>
        <meta name="description" content={t('servicesPage.subtitle')} />
      </Helmet>

      <Header />

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <nav className="flex items-center text-sm font-sans font-medium text-muted-foreground" aria-label={t('common.breadcrumb')}>
            <Link to="/" className="hover:text-primary transition-colors flex items-center gap-1">
              <Home className="w-4 h-4" />
              <span className="sr-only">{t('header.home')}</span>
            </Link>
            <ChevronRight className="w-4 h-4 mx-2 rtl:rotate-180" />
            <span className="text-foreground font-semibold" aria-current="page">
              {t('header.services') || 'Services'}
            </span>
          </nav>
        </div>

        <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden bg-background">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none"></div>
          
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl md:text-5xl lg:text-7xl font-extrabold text-foreground mb-6 tracking-tight text-balance font-sans text-gradient-primary"
            >
              {t('servicesPage.title') || 'What Services We Offer'}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed mb-10 text-balance"
            >
              {t('servicesPage.subtitle') || 'Discover how our advanced AI transforms your memories into an organized, searchable, and interactive legacy.'}
            </motion.p>
          </div>
        </section>

        <section className="py-20 bg-muted/30 border-y border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {services.map((service, idx) => (
                <motion.div
                  key={service.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.05 }}
                  className={`bg-card rounded-3xl p-8 border border-border shadow-subtle hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${service.borderHover} flex flex-col group ${service.span}`}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 border border-border bg-background transition-transform duration-300 group-hover:scale-110 ${service.bg} ${service.color}`}>
                    <service.icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-foreground font-sans tracking-tight mb-3">
                    {t(`servicesPage.items.${service.id}.title`)}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed flex-grow text-base">
                    {t(`servicesPage.items.${service.id}.desc`)}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-24 bg-background relative overflow-hidden">
          <div className="absolute -left-40 top-0 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-balance tracking-tight font-sans text-foreground">
              {t('servicesPage.cta.title') || 'Ready to elevate your memories?'}
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground mb-10 text-balance leading-relaxed max-w-2xl mx-auto">
              {t('servicesPage.cta.subtitle') || 'Join thousands of users who are preserving their legacy with our intelligent services.'}
            </p>
            <Button asChild size="lg" className="w-full sm:w-auto font-bold font-sans text-lg px-8 py-6 h-auto shadow-md">
              <Link to={PLANS_PATH}>{t('servicesPage.cta.button') || 'View Plans'}</Link>
            </Button>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
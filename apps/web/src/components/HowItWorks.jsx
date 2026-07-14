import React from 'react';
import { motion } from 'framer-motion';
import { Cloud, Brain, Search, BookOpen } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

export default function HowItWorks() {
  const { t } = useLanguage();

  const steps = [
    {
      id: '1',
      icon: Cloud,
      colorClass: 'text-primary',
      bgClass: 'bg-primary/10',
      borderHover: 'hover:border-primary',
    },
    {
      id: '2',
      icon: Brain,
      colorClass: 'text-secondary',
      bgClass: 'bg-secondary/10',
      borderHover: 'hover:border-primary',
    },
    {
      id: '3',
      icon: Search,
      colorClass: 'text-primary',
      bgClass: 'bg-primary/10',
      borderHover: 'hover:border-primary',
    },
    {
      id: '4',
      icon: BookOpen,
      colorClass: 'text-secondary',
      bgClass: 'bg-secondary/10',
      borderHover: 'hover:border-primary',
    }
  ];

  return (
    <section id="how-it-works" className="py-24 bg-muted/30 border-y border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-foreground font-sans tracking-tight text-balance">
            {t('homePage.howItWorks.title') || 'How It Works'}
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed text-balance">
            {t('homePage.howItWorks.subtitle') || 'Four simple steps to preserve your memories'}
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon;
            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`bg-[#F8F9FA] dark:bg-card rounded-3xl p-8 border border-border shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 ${step.borderHover} flex flex-col h-full group`}
              >
                <div className="flex items-start justify-between mb-8">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110 bg-background border border-border ${step.colorClass}`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <span className={`text-6xl font-black ${step.colorClass} tracking-tighter`}>
                    {step.id}
                  </span>
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] dark:text-foreground font-sans tracking-tight mb-3">
                  {t(`homePage.howItWorks.steps.${index}.title`)}
                </h3>
                <p className="text-[#666666] dark:text-muted-foreground leading-relaxed flex-grow text-base font-medium">
                  {t(`homePage.howItWorks.steps.${index}.description`)}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
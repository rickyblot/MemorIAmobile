import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

const PlanCard = ({ name, price, features, onSubscribe, recommended = false, index = 0 }) => {
  const { t } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative p-8 rounded-3xl border transition-all duration-300 flex flex-col h-full overflow-hidden group ${
        recommended
          ? 'bg-card border-primary shadow-lg scale-105 z-10'
          : 'bg-card border-border hover:border-primary/50 shadow-sm hover:shadow-md'
      }`}
    >
      {recommended && (
        <div className="absolute top-0 left-1/2 -translate-x-1/2 px-4 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-b-lg font-sans uppercase tracking-wider z-20">
          {t('common.mostPopular')}
        </div>
      )}
      
      <div className="mb-6 relative z-10 mt-4">
        <h3 className={`text-2xl font-bold mb-2 font-sans ${recommended ? 'text-primary' : 'text-foreground'}`}>{name}</h3>
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-extrabold text-foreground font-sans">{price}</span>
          {price !== t('common.free') && price !== 'Free' && price !== 'Gratis' && <span className="text-muted-foreground font-medium">{t('common.monthShort')}</span>}
        </div>
      </div>
      <ul className="space-y-4 mb-8 flex-grow relative z-10">
        {features.map((feature, idx) => (
          <li key={idx} className="flex items-start gap-3">
            <div className={`mt-0.5 rounded-full p-1 ${recommended ? 'bg-primary/10' : 'bg-secondary/10'}`}>
              <Check className={`w-3.5 h-3.5 ${recommended ? 'text-primary' : 'text-secondary'}`} />
            </div>
            <span className="text-muted-foreground font-medium">{feature}</span>
          </li>
        ))}
      </ul>
      <Button
        onClick={onSubscribe}
        variant={recommended ? 'default' : 'outline'}
        className={`w-full font-bold h-12 text-lg relative z-10 font-sans`}
      >
        {t('common.subscribe')}
      </Button>
    </motion.div>
  );
};

export default PlanCard;
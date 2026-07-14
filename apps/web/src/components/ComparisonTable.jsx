import React from 'react';
import { Check, Minus } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext.jsx';

const renderValue = (value, isPremium = false) => {
  if (typeof value === 'boolean') {
    return value ? (
      <Check className={`w-5 h-5 mx-auto ${isPremium ? 'text-accent' : 'text-primary'}`} />
    ) : (
      <Minus className="w-5 h-5 mx-auto text-muted-foreground/40" />
    );
  }
  return <span className={`text-sm font-medium ${isPremium ? 'text-foreground' : 'text-muted-foreground'}`}>{value}</span>;
};

const ComparisonTable = () => {
  const { t } = useLanguage();
  
  const features = [0, 1, 2, 3, 4, 5, 6].map(i => ({
    name: t(`comparisonTable.rows.${i}.name`),
    free: t(`comparisonTable.rows.${i}.free`),
    basico: t(`comparisonTable.rows.${i}.basico`),
    pro: t(`comparisonTable.rows.${i}.pro`),
    premium: t(`comparisonTable.rows.${i}.premium`),
  }));

  const parseValue = (val) => {
    if (val === true || val === 'true') return true;
    if (val === false || val === 'false') return false;
    return val;
  };

  return (
    <div className="w-full overflow-x-auto pb-6">
      <div className="min-w-[1000px] bg-card rounded-3xl border border-border overflow-hidden shadow-sm">
        <div className="grid grid-cols-5 bg-muted/50 border-b border-border">
          <div className="p-6 flex items-center">
            <span className="font-semibold text-foreground">{t('comparisonTable.features')}</span>
          </div>
          <div className="p-6 text-center border-l border-border/50 bg-[hsl(var(--tier-free-bg))]">
            <span className="block font-bold text-lg text-foreground">{t('comparisonTable.free')}</span>
            <span className="block text-sm text-muted-foreground mt-1">{t('comparisonTable.priceFree')} {t('common.monthShort')}</span>
          </div>
          <div className="p-6 text-center border-l border-border/50 bg-[hsl(var(--tier-basico-bg))]">
            <span className="block font-bold text-lg text-foreground">{t('comparisonTable.basico')}</span>
            <span className="block text-sm text-muted-foreground mt-1">{t('comparisonTable.priceBasico')} {t('common.monthShort')}</span>
          </div>
          <div className="p-6 text-center border-l border-border/50 bg-[hsl(var(--tier-pro-bg))] relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary"></div>
            <span className="block font-bold text-lg text-primary">{t('comparisonTable.pro')}</span>
            <span className="block text-sm text-primary/80 mt-1">{t('comparisonTable.pricePro')} {t('common.monthShort')}</span>
          </div>
          <div className="p-6 text-center border-l border-border/50 bg-[hsl(var(--tier-premium-bg))] relative">
            <div className="absolute top-0 left-0 right-0 h-1 bg-accent"></div>
            <span className="block font-bold text-lg text-accent">{t('comparisonTable.premium')}</span>
            <span className="block text-sm text-accent/80 mt-1">{t('comparisonTable.pricePremium')} {t('common.monthShort')}</span>
          </div>
        </div>

        <div className="divide-y divide-border/50">
          {features.map((feature, idx) => (
            <div key={idx} className="grid grid-cols-5 hover:bg-muted/20 transition-colors">
              <div className="p-6 flex items-center">
                <span className="text-sm font-medium text-foreground">{feature.name}</span>
              </div>
              <div className="p-6 text-center flex items-center justify-center border-l border-border/50 bg-[hsl(var(--tier-free-bg))]/30">
                {renderValue(parseValue(feature.free))}
              </div>
              <div className="p-6 text-center flex items-center justify-center border-l border-border/50 bg-[hsl(var(--tier-basico-bg))]/30">
                {renderValue(parseValue(feature.basico))}
              </div>
              <div className="p-6 text-center flex items-center justify-center border-l border-border/50 bg-[hsl(var(--tier-pro-bg))]/30">
                {renderValue(parseValue(feature.pro))}
              </div>
              <div className="p-6 text-center flex items-center justify-center border-l border-border/50 bg-[hsl(var(--tier-premium-bg))]/30">
                {renderValue(parseValue(feature.premium), true)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ComparisonTable;
import React from 'react';
import { motion } from 'framer-motion';

const FeatureCard = ({ icon: Icon, title, description, index = 0, variant = 'primary' }) => {
  const variants = {
    primary: 'bg-primary/10 text-primary border-primary/20',
    secondary: 'bg-secondary/10 text-secondary border-secondary/20',
    accent: 'bg-accent/10 text-accent border-accent/20'
  };

  const iconStyle = variants[variant] || variants.primary;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="flex flex-col h-full p-8 bg-card rounded-2xl shadow-subtle hover:shadow-lg transition-all duration-300 border border-border hover:border-primary/30 group relative overflow-hidden"
    >
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 border ${iconStyle} relative z-10 bg-background`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-foreground tracking-tight font-sans relative z-10">{title}</h3>
      <p className="text-muted-foreground leading-relaxed flex-grow relative z-10">{description}</p>
    </motion.div>
  );
};

export default FeatureCard;
import React from 'react';
import { motion } from 'framer-motion';

const StepCard = ({ stepNumber, icon: Icon, title, description, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative flex items-start gap-6 group bg-card p-6 rounded-3xl border border-border hover:shadow-md hover:border-secondary/30 transition-all duration-300"
    >
      <div className="flex-shrink-0 text-6xl md:text-7xl font-extrabold text-primary/10 leading-none font-sans" style={{ letterSpacing: '-0.02em' }}>
        {stepNumber}
      </div>
      <div className="flex-1 pt-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
            <Icon className="w-5 h-5 text-secondary" />
          </div>
          <h3 className="text-xl font-bold text-foreground font-sans">{title}</h3>
        </div>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
};

export default StepCard;
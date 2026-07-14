import React from 'react';
import { motion } from 'framer-motion';

const DifferentiatorCard = ({ icon: Icon, title, description, index = 0, featured = false }) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className={`relative overflow-hidden p-8 rounded-3xl border transition-all duration-300 group ${
        featured
          ? 'bg-card border-primary/30 hover:border-primary col-span-1 md:col-span-2 shadow-md hover:shadow-lg'
          : 'bg-card border-border hover:border-secondary/40 shadow-sm hover:shadow-md'
      }`}
    >
      <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 relative z-10 border bg-background ${
        featured ? 'text-primary border-primary/20' : 'text-secondary border-secondary/20'
      }`}>
        <Icon className="w-7 h-7" />
      </div>
      <h3 className="text-xl font-bold mb-3 text-foreground font-sans relative z-10">{title}</h3>
      <p className="text-muted-foreground leading-relaxed relative z-10">{description}</p>
    </motion.div>
  );
};

export default DifferentiatorCard;
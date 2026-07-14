import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

const HeroSection = () => {
  return (
    <section className="hero-banner-container pt-16">
      <div className="w-full relative mx-auto max-w-[1920px]">
        {/* Responsive Banner Image */}
        <img 
          src="https://horizons-cdn.hostinger.com/5e6de265-9092-4886-9bdc-57b9b74c8d94/6fa4578e4365aa7b029845683fc285db.png" 
          alt="MemoriaMobile - Your Memory. Your Intelligence. Your Legacy." 
          className="hero-banner-image"
          draggable="false"
        />

        {/* CTA Button Overlaid */}
        <div className="absolute bottom-[4%] md:bottom-[8%] lg:bottom-[10%] left-1/2 -translate-x-1/2 z-10 w-full flex justify-center px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <Button 
              asChild 
              size="lg" 
              className="bg-zinc-950 hover:bg-zinc-800 text-white border border-white/20 shadow-2xl backdrop-blur-md text-sm sm:text-base md:text-lg font-bold px-8 sm:px-12 py-6 rounded-full transition-all duration-300 hover:scale-105 active:scale-[0.98] uppercase tracking-wider"
            >
              <Link to="/signup">
                JOIN THE BETA TODAY
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
export default HeroSection;

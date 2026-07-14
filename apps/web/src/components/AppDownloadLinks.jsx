import React from 'react';
import { Apple, Play, QrCode } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AppDownloadLinks() {
  return (
    <div className="flex flex-col items-center gap-8">
      <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
        <Button 
          size="lg" 
          className="h-16 px-6 bg-foreground text-background hover:bg-foreground/90 rounded-2xl flex items-center gap-3 touch-target transition-transform active:scale-95"
        >
          <Apple className="w-8 h-8" />
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] uppercase tracking-wider opacity-80 leading-none">Download on the</span>
            <span className="text-lg font-bold leading-none mt-1">App Store</span>
          </div>
        </Button>
        
        <Button 
          size="lg" 
          className="h-16 px-6 bg-foreground text-background hover:bg-foreground/90 rounded-2xl flex items-center gap-3 touch-target transition-transform active:scale-95"
        >
          <Play className="w-7 h-7" />
          <div className="flex flex-col items-start text-left">
            <span className="text-[10px] uppercase tracking-wider opacity-80 leading-none">GET IT ON</span>
            <span className="text-lg font-bold leading-none mt-1">Google Play</span>
          </div>
        </Button>
      </div>

      <div className="flex flex-col sm:flex-row gap-8 items-center justify-center mt-4">
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-border">
            <img 
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=150&h=150&fit=crop&q=80" 
              alt="iOS QR Code" 
              className="w-24 h-24 object-cover rounded-lg opacity-80 grayscale"
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <QrCode className="w-4 h-4" /> Scan for iOS
          </span>
        </div>
        
        <div className="flex flex-col items-center gap-3">
          <div className="bg-white p-3 rounded-2xl shadow-sm border border-border">
            <img 
              src="https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=150&h=150&fit=crop&q=80" 
              alt="Android QR Code" 
              className="w-24 h-24 object-cover rounded-lg opacity-80 grayscale"
            />
          </div>
          <span className="text-sm font-medium text-muted-foreground flex items-center gap-1.5">
            <QrCode className="w-4 h-4" /> Scan for Android
          </span>
        </div>
      </div>
    </div>
  );
}
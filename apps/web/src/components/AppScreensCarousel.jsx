import React from 'react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function AppScreensCarousel() {
  const screens = [
    { img: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=400&h=800&fit=crop&q=80", title: "Smart Dashboard", desc: "Your memories organized beautifully." },
    { img: "https://images.unsplash.com/photo-1551650975-87deedd944c3?w=400&h=800&fit=crop&q=80", title: "Story Creation", desc: "Generate narratives on the go." },
    { img: "https://images.unsplash.com/photo-1526498460520-4c246339dccb?w=400&h=800&fit=crop&q=80", title: "Media Gallery", desc: "Lightning fast photo browsing." },
    { img: "https://images.unsplash.com/photo-1555774698-0b77e0d5fac6?w=400&h=800&fit=crop&q=80", title: "Family Sharing", desc: "Connect with loved ones instantly." },
    { img: "https://images.unsplash.com/photo-1616469829581-73993eb86b02?w=400&h=800&fit=crop&q=80", title: "Secure Settings", desc: "Granular privacy controls." },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto px-12">
      <Carousel
        opts={{
          align: "start",
          loop: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {screens.map((screen, index) => (
            <CarouselItem key={index} className="pl-4 md:basis-1/2 lg:basis-1/3">
              <div className="flex flex-col items-center group">
                <div className="relative w-full max-w-[280px] aspect-[9/19] rounded-[2.5rem] border-[8px] border-foreground overflow-hidden shadow-xl bg-muted transition-transform duration-500 group-hover:-translate-y-2">
                  <img 
                    src={screen.img} 
                    alt={screen.title} 
                    className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                  />
                  {/* Notch simulation */}
                  <div className="absolute top-0 inset-x-0 h-6 bg-foreground rounded-b-3xl w-1/2 mx-auto"></div>
                </div>
                <div className="mt-6 text-center">
                  <h4 className="text-lg font-bold text-foreground font-sans">{screen.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{screen.desc}</p>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="hidden md:flex -left-12 w-12 h-12" />
        <CarouselNext className="hidden md:flex -right-12 w-12 h-12" />
      </Carousel>
    </div>
  );
}
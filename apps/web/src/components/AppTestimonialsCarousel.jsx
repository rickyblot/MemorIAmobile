import React from 'react';
import { Star } from 'lucide-react';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel';

export default function AppTestimonialsCarousel() {
  const testimonials = [
    { name: "Maya Chen", role: "iOS User", quote: "Having all my family stories available offline during our road trip was incredible. The app is so fast and intuitive.", rating: 5, avatar: "bg-blue-100 text-blue-700" },
    { name: "Raj Patel", role: "Android User", quote: "The native camera integration makes capturing and instantly generating a story seamless. Best app on my phone.", rating: 5, avatar: "bg-emerald-100 text-emerald-700" },
    { name: "Lucia Torres", role: "iOS User", quote: "Face ID integration gives me peace of mind knowing my private family memories are secure. Beautifully designed.", rating: 5, avatar: "bg-rose-100 text-rose-700" },
    { name: "Kwame Asante", role: "Android User", quote: "Push notifications keep me connected with my siblings across the globe whenever they add a new memory.", rating: 4, avatar: "bg-amber-100 text-amber-700" },
  ];

  return (
    <div className="w-full max-w-4xl mx-auto px-12">
      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-6">
          {testimonials.map((t, i) => (
            <CarouselItem key={i} className="pl-6 md:basis-1/2">
              <div className="bg-card border border-border rounded-3xl p-8 h-full flex flex-col shadow-sm">
                <div className="flex items-center gap-1 mb-6">
                  {[...Array(5)].map((_, idx) => (
                    <Star key={idx} className={`w-5 h-5 ${idx < t.rating ? 'text-amber-400 fill-amber-400' : 'text-muted'}`} />
                  ))}
                </div>
                <p className="text-lg text-foreground leading-relaxed mb-8 flex-grow">"{t.quote}"</p>
                <div className="flex items-center gap-4 mt-auto">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${t.avatar}`}>
                    {t.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-foreground font-sans">{t.name}</h4>
                    <p className="text-sm text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="-left-4 md:-left-12 w-12 h-12" />
        <CarouselNext className="-right-4 md:-right-12 w-12 h-12" />
      </Carousel>
    </div>
  );
}
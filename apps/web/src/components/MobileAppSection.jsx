import React from 'react';
import { Smartphone, Star } from 'lucide-react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import AppDownloadLinks from './AppDownloadLinks.jsx';
import AppFeaturesGrid from './AppFeaturesGrid.jsx';
import AppScreensCarousel from './AppScreensCarousel.jsx';
import AppTestimonialsCarousel from './AppTestimonialsCarousel.jsx';

export default function MobileAppSection() {
  const faqs = [
    { q: "Is the mobile app free to download?", a: "Yes, the app is completely free to download. Your existing web subscription carries over seamlessly." },
    { q: "Does it work offline?", a: "Absolutely. You can view your saved stories and cached memories without an internet connection." },
    { q: "Are my memories secure on my phone?", a: "We use end-to-end encryption and support native biometric authentication (Face ID/Fingerprint) to keep your data safe." },
    { q: "Can I generate AI stories directly from my phone?", a: "Yes! You can select photos directly from your camera roll and generate stories on the go." },
    { q: "Will it sync with my web account?", a: "Everything syncs instantly in real-time across all your devices." },
  ];

  return (
    <section className="py-24 bg-muted/30 border-t border-border overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Hero / Intro */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6">
            <Smartphone className="w-4 h-4" /> Available on iOS & Android
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold text-foreground mb-6 font-sans tracking-tight text-balance">
            Your memories, <br/>in your pocket.
          </h2>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Experience the full power of MemorIA on the go. Capture moments, generate stories, and share with family—all from our lightning-fast native mobile app.
          </p>
          
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="flex -space-x-2">
              {[1,2,3,4].map(i => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            <div className="flex flex-col items-start ml-3">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}
              </div>
              <span className="text-sm font-semibold text-foreground">4.8/5 from 12k+ reviews</span>
            </div>
          </div>
        </div>

        {/* App Screens Carousel */}
        <div className="mb-32">
          <AppScreensCarousel />
        </div>

        {/* Features Grid */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground font-sans mb-4">Built for Mobile</h3>
            <p className="text-lg text-muted-foreground">Native performance and exclusive features.</p>
          </div>
          <AppFeaturesGrid />
        </div>

        {/* Testimonials */}
        <div className="mb-32">
          <div className="text-center mb-12">
            <h3 className="text-3xl md:text-4xl font-bold text-foreground font-sans mb-4">Loved by Users</h3>
            <p className="text-lg text-muted-foreground">See what people are saying about the app.</p>
          </div>
          <AppTestimonialsCarousel />
        </div>

        {/* FAQ & Download */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center bg-card border border-border rounded-[3rem] p-8 md:p-16 shadow-sm">
          <div>
            <h3 className="text-3xl font-bold text-foreground font-sans mb-8">Frequently Asked Questions</h3>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, i) => (
                <AccordionItem key={i} value={`item-${i}`}>
                  <AccordionTrigger className="text-left font-semibold text-lg hover:text-primary">{faq.q}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground text-base leading-relaxed">{faq.a}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          
          <div className="flex flex-col items-center justify-center text-center lg:border-l lg:border-border lg:pl-16">
            <h3 className="text-3xl font-bold text-foreground font-sans mb-4">Get the App Today</h3>
            <p className="text-muted-foreground mb-10">Scan the QR code or click the buttons below to download MemorIA on your device.</p>
            <AppDownloadLinks />
          </div>
        </div>

      </div>
    </section>
  );
}
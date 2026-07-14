import React from 'react';
import { WifiOff, BellRing, Camera, Fingerprint, Cloud, Battery, Zap, Sparkles } from 'lucide-react';

export default function AppFeaturesGrid() {
  const features = [
    { icon: WifiOff, title: "Offline Access", desc: "View and edit your saved stories anywhere, even without an internet connection.", span: "col-span-1 md:col-span-2 lg:col-span-1" },
    { icon: BellRing, title: "Push Notifications", desc: "Get instant updates when family members share new memories or comment on your stories.", span: "col-span-1" },
    { icon: Camera, title: "Native Camera", desc: "Capture photos and videos directly within the app with optimized quality settings.", span: "col-span-1" },
    { icon: Fingerprint, title: "Biometric Auth", desc: "Secure your private memories with Face ID or Fingerprint authentication.", span: "col-span-1 md:col-span-2 lg:col-span-1" },
    { icon: Cloud, title: "Seamless Sync", desc: "Start a story on your phone and finish it on your desktop. Everything syncs instantly.", span: "col-span-1 md:col-span-2" },
    { icon: Battery, title: "Battery Optimized", desc: "Smart background processing ensures your battery lasts all day.", span: "col-span-1" },
    { icon: Zap, title: "Lightning Fast", desc: "Native performance means zero lag when scrolling through thousands of photos.", span: "col-span-1" },
    { icon: Sparkles, title: "Smooth Animations", desc: "Fluid transitions and gestures make navigating your memories a joy.", span: "col-span-1 md:col-span-2 lg:col-span-1" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {features.map((f, i) => (
        <div 
          key={i} 
          className={`bg-card border border-border rounded-3xl p-6 md:p-8 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col ${f.span}`}
        >
          <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-6 text-primary">
            <f.icon className="w-6 h-6" />
          </div>
          <h3 className="text-xl font-bold text-foreground mb-3 font-sans">{f.title}</h3>
          <p className="text-muted-foreground leading-relaxed mt-auto">{f.desc}</p>
        </div>
      ))}
    </div>
  );
}
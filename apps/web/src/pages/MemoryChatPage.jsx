import React from 'react';
import { Helmet } from 'react-helmet';
import { MessageSquare, Clock, BookOpen, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import IntegratedAiChat from '@/components/integrated-ai-chat.jsx';
import { useIntegratedAi } from '@/hooks/use-integrated-ai.jsx';

// Wrapper component to provide quick actions that use the hook context
function ChatWithActions() {
  const { sendMessage, isStreaming } = useIntegratedAi();

  const handleAction = (text) => {
    sendMessage(text);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center justify-center gap-2 bg-card hover:border-primary/50 transition-colors"
          onClick={() => handleAction("What did I do last summer?")}
          disabled={isStreaming}
        >
          <Clock className="w-5 h-5 text-primary" />
          <span className="font-semibold text-foreground">Recent timeline</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center justify-center gap-2 bg-card hover:border-secondary/50 transition-colors"
          onClick={() => handleAction("Where are my most photographed locations?")}
          disabled={isStreaming}
        >
          <MapPin className="w-5 h-5 text-secondary" />
          <span className="font-semibold text-foreground">Location summary</span>
        </Button>
        <Button 
          variant="outline" 
          className="h-auto py-4 flex flex-col items-center justify-center gap-2 bg-card hover:border-accent/50 transition-colors"
          onClick={() => handleAction("Generate a short story about my family")}
          disabled={isStreaming}
        >
          <BookOpen className="w-5 h-5 text-accent" />
          <span className="font-semibold text-foreground">Create a story</span>
        </Button>
      </div>

      <div className="bg-card border border-border rounded-3xl overflow-hidden h-[700px] shadow-xl">
        <IntegratedAiChat />
      </div>
    </div>
  );
}

export default function MemoryChatPage() {
  return (
    <>
      <Helmet>
        <title>Memory Chat Assistant - MemorIA</title>
        <meta name="description" content="Talk to your AI assistant about your memories." />
      </Helmet>

      <Header />

      <main className="min-h-[calc(100vh-4rem)] bg-background py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <MessageSquare className="w-10 h-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground font-sans tracking-tight" style={{ letterSpacing: '-0.02em' }}>
                Memory Assistant
              </h1>
            </div>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto text-balance">
              Chat naturally with your archive. The AI can find context, detect patterns, and create stories from your life events.
            </p>
          </header>

          {/* Render the wrapper that mounts the hook exactly once alongside the UI */}
          <ChatWithActions />
        </div>
      </main>

      <Footer />
    </>
  );
}
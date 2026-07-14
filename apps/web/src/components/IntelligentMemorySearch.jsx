import React, { useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import { useIntegratedAi } from '@/hooks/use-integrated-ai.jsx';
import IntegratedAiChat from '@/components/integrated-ai-chat.jsx';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default function IntelligentMemorySearch() {
  const { sendMessage, isStreaming } = useIntegratedAi();
  const [query, setQuery] = useState('');
  const [showChat, setShowChat] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setShowChat(true);
    sendMessage(`Search my memories for: ${query}. Please provide context and describe what you find based on the memory data you have access to.`);
    setQuery('');
  };

  return (
    <div className="w-full">
      <form onSubmit={handleSearch} className="relative mb-8 max-w-3xl mx-auto">
        <div className="relative flex items-center">
          <Sparkles className="absolute left-4 w-5 h-5 text-primary" />
          <Input 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask AI to find something... 'Where was I last summer?'"
            className="w-full pl-12 pr-24 py-6 rounded-2xl text-lg bg-card shadow-sm border-2 border-transparent focus:border-primary transition-all text-foreground"
          />
          <Button 
            type="submit" 
            disabled={!query.trim() || isStreaming}
            className="absolute right-2 rounded-xl"
          >
            Search
          </Button>
        </div>
      </form>

      {showChat && (
        <div className="bg-card border rounded-3xl overflow-hidden h-[600px] shadow-sm">
          <IntegratedAiChat />
        </div>
      )}
    </div>
  );
}
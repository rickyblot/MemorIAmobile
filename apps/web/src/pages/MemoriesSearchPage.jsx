import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import MemorySearch from '@/components/MemorySearch.jsx';
import SearchHistoryList from '@/components/SearchHistoryList.jsx';
import MemoryGrid from '@/components/MemoryGrid.jsx';
import pb from '@/lib/pocketbaseClient.js';
import { useAuth } from '@/contexts/AuthContext.jsx';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import { toast } from 'sonner';
import { Sparkles } from 'lucide-react';

export default function MemoriesSearchPage() {
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [history, setHistory] = useState(['Summer 2020', 'Family trip', 'Paris']);
  const { currentUser } = useAuth();
  const { t } = useLanguage();

  const handleSearch = async (query, filters) => {
    if (!query && !filters.location && !filters.startDate) return;
    
    setLoading(true);
    setSearched(true);
    
    let filterString = `userId="${currentUser.id}"`;
    if (query) filterString += ` && (title~"${query}" || description~"${query}" || location~"${query}")`;
    if (filters.location) filterString += ` && location~"${filters.location}"`;
    if (filters.startDate) filterString += ` && date>="${filters.startDate} 00:00:00"`;
    if (filters.endDate) filterString += ` && date<="${filters.endDate} 23:59:59"`;

    try {
      const records = await pb.collection('memories').getList(1, 50, {
        filter: filterString,
        sort: '-date',
        $autoCancel: false
      });
      setResults(records.items);
      
      if (query && !history.includes(query)) {
        setHistory(prev => [query, ...prev].slice(0, 5));
      }
    } catch (err) {
      console.error(err);
      toast.error(t('common.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>{t('search.intelligentSearch')} - MemorIA</title>
      </Helmet>
      <Header />
      <main className="min-h-screen bg-background">
        
        <div className="bg-muted/30 pt-16 pb-12 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-4xl font-extrabold text-foreground font-sans tracking-tight mb-6">{t('search.talkToArchive')}</h1>
            <MemorySearch onSearch={handleSearch} />
            {!searched && <SearchHistoryList searches={history} onSelect={(q) => handleSearch(q, {})} />}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {loading ? (
            <MemoryGrid loading={true} />
          ) : searched ? (
            results && results.length > 0 ? (
              <div>
                <h2 className="text-xl font-bold mb-6 font-sans">{t('search.foundMemories', { count: results.length })}</h2>
                <MemoryGrid memories={results} loading={false} />
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <Sparkles className="w-8 h-8 text-muted-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground font-sans mb-2">{t('search.noExactMatches')}</h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {t('search.noMatchesDesc')}
                </p>
              </div>
            )
          ) : null}
        </div>

      </main>
      <Footer />
    </>
  );
}
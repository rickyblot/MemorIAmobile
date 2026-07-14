import React, { useState } from 'react';
import { Search, Calendar, MapPin, Tag } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const MemorySearch = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('');
  const { t } = useLanguage();

  const handleSearch = () => {
    onSearch({
      searchTerm,
      dateFilter,
      locationFilter,
    });
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Search className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg text-card-foreground font-sans">{t('memories.searchTitle') || 'Search memories'}</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Input
            type="text"
            placeholder={t('memories.searchPlaceholder') || 'Search by title, description, or tags...'}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="text-foreground"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {t('memories.dateRange') || 'Date range'}
            </label>
            <Select value={dateFilter} onValueChange={setDateFilter}>
              <SelectTrigger className="text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('memories.allTime') || 'All time'}</SelectItem>
                <SelectItem value="today">{t('memories.today') || 'Today'}</SelectItem>
                <SelectItem value="week">{t('memories.thisWeek') || 'This week'}</SelectItem>
                <SelectItem value="month">{t('memories.thisMonth') || 'This month'}</SelectItem>
                <SelectItem value="year">{t('memories.thisYear') || 'This year'}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
              <MapPin className="w-4 h-4 text-secondary" />
              {t('memories.location') || 'Location'}
            </label>
            <Input
              type="text"
              placeholder={t('memories.location')}
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
              className="text-foreground"
            />
          </div>
        </div>

        <Button onClick={handleSearch} className="w-full font-semibold">
          Search
        </Button>
      </div>
    </div>
  );
};

export default MemorySearch;
import React, { useState } from 'react';
import { Filter, Calendar, MapPin, Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLanguage } from '@/contexts/LanguageContext.jsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const TimelineFilter = ({ onFilter }) => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [location, setLocation] = useState('');
  const [eventType, setEventType] = useState('all');
  const { t } = useLanguage();

  const handleApplyFilters = () => {
    onFilter({
      startDate,
      endDate,
      location,
      eventType,
    });
  };

  const handleReset = () => {
    setStartDate('');
    setEndDate('');
    setLocation('');
    setEventType('all');
    onFilter({});
  };

  return (
    <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="w-5 h-5 text-primary" />
        <h3 className="font-bold text-lg text-card-foreground font-sans">{t('timeline.filterTimeline')}</h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {t('timeline.startDate')}
            </label>
            <Input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="text-foreground"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {t('timeline.endDate')}
            </label>
            <Input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="text-foreground"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
            <MapPin className="w-4 h-4 text-secondary" />
            {t('timeline.location')}
          </label>
          <Input
            type="text"
            placeholder={t('timeline.location')}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="text-foreground"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-card-foreground flex items-center gap-2">
            <Tag className="w-4 h-4 text-accent" />
            {t('timeline.eventType')}
          </label>
          <Select value={eventType} onValueChange={setEventType}>
            <SelectTrigger className="text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t('timeline.allEvents')}</SelectItem>
              <SelectItem value="birthday">{t('timeline.birthdays')}</SelectItem>
              <SelectItem value="vacation">{t('timeline.vacations')}</SelectItem>
              <SelectItem value="milestone">{t('timeline.milestones')}</SelectItem>
              <SelectItem value="celebration">{t('timeline.celebrations')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleApplyFilters} className="flex-1 font-semibold">
            {t('timeline.applyFilters')}
          </Button>
          <Button onClick={handleReset} variant="outline" className="font-semibold">
            {t('timeline.reset')}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TimelineFilter;
import React from 'react';
import { Calendar, MapPin, Image as ImageIcon } from 'lucide-react';
import pb from '@/lib/pocketbaseClient';

const TimelineEvent = ({ event }) => {
  const getImageUrl = (record) => {
    if (!record.file) return null;
    return pb.files.getURL(record, record.file);
  };

  return (
    <div className="relative pl-8 pb-8 border-l-2 border-primary/30 last:border-l-0 last:pb-0">
      <div className="absolute left-0 top-0 -translate-x-1/2 w-4 h-4 rounded-full bg-primary border-4 border-background"></div>
      
      <div className="bg-card border border-border rounded-xl p-6 hover:shadow-lg transition-all duration-200">
        <div className="flex items-start justify-between mb-3">
          <div>
            <h3 className="font-bold text-lg text-card-foreground font-sans mb-2">{event.title}</h3>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <Calendar className="w-4 h-4" />
                {new Date(event.date).toLocaleDateString()}
              </span>
              {event.location && (
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {event.location}
                </span>
              )}
            </div>
          </div>
        </div>

        {event.description && (
          <p className="text-card-foreground leading-relaxed mb-4">{event.description}</p>
        )}

        {event.file && (
          <div className="mt-4">
            <img
              src={getImageUrl(event)}
              alt={event.title}
              className="w-full h-48 object-cover rounded-lg"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default TimelineEvent;
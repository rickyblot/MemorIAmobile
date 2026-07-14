import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import EnhancedMemoryCard from './EnhancedMemoryCard.jsx';

export default function InteractiveTimeline({ memories, onEdit, onPreview, onDelete }) {
  // Sort and group memories by Year and Month
  const groupedMemories = useMemo(() => {
    const sorted = [...memories].sort((a, b) => {
      const dateA = a.date ? new Date(a.date) : new Date(0);
      const dateB = b.date ? new Date(b.date) : new Date(0);
      return dateB - dateA; // Descending
    });

    const groups = {};
    sorted.forEach(mem => {
      const date = mem.date ? new Date(mem.date) : null;
      const key = date ? `${date.getFullYear()} - ${date.toLocaleString('default', { month: 'long' })}` : 'Unknown Time';
      if (!groups[key]) groups[key] = [];
      groups[key].push(mem);
    });

    return groups;
  }, [memories]);

  if (memories.length === 0) {
    return <div className="text-center py-20 text-muted-foreground">No memories found for the timeline.</div>;
  }

  return (
    <div className="relative pl-6 md:pl-8 py-8 max-w-5xl mx-auto">
      <div className="timeline-line"></div>
      
      <div className="space-y-16">
        {Object.entries(groupedMemories).map(([timeLabel, groupMems], idx) => (
          <motion.div 
            key={timeLabel}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: idx * 0.1 }}
            className="relative"
          >
            <div className="timeline-node top-2"></div>
            <div className="ml-8 md:ml-12">
              <h2 className="text-2xl font-bold font-sans text-primary mb-6 inline-block bg-primary/10 px-4 py-1.5 rounded-full">
                {timeLabel}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {groupMems.map(mem => (
                  <EnhancedMemoryCard 
                    key={mem.id}
                    memory={mem}
                    onEdit={onEdit}
                    onPreview={onPreview}
                    onDelete={onDelete}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
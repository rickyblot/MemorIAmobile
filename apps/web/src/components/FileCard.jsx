import React from 'react';
import { Image, Film, FileText, Music, File } from 'lucide-react';

export default function FileCard({ file }) {
  const getIcon = (type) => {
    if (type.startsWith('image')) return <Image className="w-8 h-8 text-blue-400" />;
    if (type.startsWith('video')) return <Film className="w-8 h-8 text-purple-400" />;
    if (type.startsWith('audio')) return <Music className="w-8 h-8 text-green-400" />;
    if (type.includes('pdf') || type.includes('document')) return <FileText className="w-8 h-8 text-orange-400" />;
    return <File className="w-8 h-8 text-muted-foreground" />;
  };

  return (
    <div className="bg-card border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-primary/50 transition-colors group cursor-pointer">
      <div className="w-full aspect-square bg-muted/50 rounded-lg flex items-center justify-center relative overflow-hidden">
        {file.thumbnail ? (
          <img src={file.thumbnail} alt={file.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
        ) : (
          getIcon(file.type)
        )}
      </div>
      <div>
        <p className="text-sm font-semibold text-foreground truncate">{file.name}</p>
        <div className="flex justify-between text-xs text-muted-foreground mt-1">
          <span>{file.date}</span>
          <span>{file.size}</span>
        </div>
      </div>
    </div>
  );
}
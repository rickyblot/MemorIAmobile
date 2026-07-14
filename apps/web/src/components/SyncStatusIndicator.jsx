import React from 'react';
import { Cloud, CloudOff, RefreshCw } from 'lucide-react';

export default function SyncStatusIndicator({ status = 'synced', lastSyncTime }) {
  const renderContent = () => {
    switch(status) {
      case 'syncing':
        return <><RefreshCw className="w-4 h-4 mr-2 animate-spin text-primary" /> Sincronizando...</>;
      case 'failed':
        return <><CloudOff className="w-4 h-4 mr-2 text-destructive" /> Error de sincronización</>;
      default:
        return <><Cloud className="w-4 h-4 mr-2 text-accent" /> Sincronizado {lastSyncTime}</>;
    }
  };

  return (
    <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-secondary/50 border border-border text-sm font-medium text-foreground">
      {renderContent()}
    </div>
  );
}
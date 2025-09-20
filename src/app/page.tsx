// src/app/page.tsx
'use client';

import { useState, useCallback } from 'react';
import AppLayout from '@/components/app-layout';
import MainPanel from '@/components/main-panel';
import HistoryPanel from '@/components/history-panel';
import { type HistoryItem } from '@/lib/types';

export type View = 'main' | 'history';

export default function Home() {
  const [view, setView] = useState<View>('main');
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<HistoryItem | null>(null);
  const [historyKey, setHistoryKey] = useState(Date.now());

  const handleSelectHistory = useCallback((item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setView('main');
  }, []);
  
  const handleSetView = (newView: View) => {
    if (newView === 'history') {
      setHistoryKey(Date.now()); // Force re-mount and re-fetch of history
    }
    setView(newView);
  }

  return (
    <AppLayout view={view} setView={handleSetView}>
      {view === 'main' && <MainPanel selectedHistoryItem={selectedHistoryItem} />}
      {view === 'history' && <HistoryPanel key={historyKey} onSelectHistory={handleSelectHistory} />}
    </AppLayout>
  );
}

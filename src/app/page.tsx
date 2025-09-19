// src/app/page.tsx
'use client';

import { useState } from 'react';
import AppLayout from '@/components/app-layout';
import MainPanel from '@/components/main-panel';
import HistoryPanel from '@/components/history-panel';
import { type HistoryItem } from '@/lib/types';

export type View = 'main' | 'history';

export default function Home() {
  const [view, setView] = useState<View>('main');
  const [selectedHistoryItem, setSelectedHistoryItem] =
    useState<HistoryItem | null>(null);

  const handleSelectHistory = (item: HistoryItem) => {
    setSelectedHistoryItem(item);
    setView('main');
  };

  return (
    <AppLayout view={view} setView={setView}>
      {view === 'main' && <MainPanel selectedHistoryItem={selectedHistoryItem} />}
      {view === 'history' && <HistoryPanel onSelectHistory={handleSelectHistory} />}
    </AppLayout>
  );
}

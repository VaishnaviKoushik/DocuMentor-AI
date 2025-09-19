// src/components/history-panel.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HistoryItem } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { Eye, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

type HistoryPanelProps = {
  onSelectHistory: (item: HistoryItem) => void;
};

export default function HistoryPanel({ onSelectHistory }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const storedHistory = JSON.parse(
      localStorage.getItem('analysisHistory') || '[]'
    );
    setHistory(storedHistory);
  }, []);

  const handleDelete = (id: string) => {
    const updatedHistory = history.filter((item) => item.id !== id);
    setHistory(updatedHistory);
    localStorage.setItem('analysisHistory', JSON.stringify(updatedHistory));
  };
  
  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem('analysisHistory');
  };

  return (
    <div className="flex h-full min-h-screen flex-col">
       <header className="flex items-center justify-between border-b p-4 sm:px-6">
        <div>
          <h1 className="font-headline text-2xl font-bold">Analysis History</h1>
          <p className="text-muted-foreground">
            Review your past analysis sessions.
          </p>
        </div>
        {history.length > 0 && (
          <Button variant="destructive" onClick={handleClearHistory}>
            <Trash2 className="mr-2" />
            Clear History
          </Button>
        )}
      </header>
      <main className="flex-1 p-4 sm:px-6">
        <Card>
          <CardHeader>
            <CardTitle>Saved Sessions</CardTitle>
            <CardDescription>
              Here are your previously saved analysis sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {history.length > 0 ? (
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {history.map((item) => (
                    <Card key={item.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-semibold">
                          Analysis from{' '}
                          {formatDistanceToNow(new Date(item.id), { addSuffix: true })}
                        </p>
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {item.code.split('\\n')[0]}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onSelectHistory(item)}
                        >
                          <Eye />
                          <span className="sr-only">View</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                <History className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold">No History Found</h3>
                <p className="mb-4 mt-2 text-sm text-muted-foreground">
                  Run an analysis to see your history here.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

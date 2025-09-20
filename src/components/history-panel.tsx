// src/components/history-panel.tsx
'use client';

import { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HistoryItem } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { Eye, History, LoaderCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { collection, getDocs, orderBy, query, deleteDoc, doc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';

type HistoryPanelProps = {
  onSelectHistory: (item: HistoryItem) => void;
};

export default function HistoryPanel({ onSelectHistory }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchHistory = async () => {
    setIsLoading(true);
    try {
      const historyCollection = collection(db, 'analysisHistory');
      const q = query(historyCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      const historyData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as HistoryItem));
      setHistory(historyData);
    } catch (error) {
      console.error("Error fetching history: ", error);
      toast({
        variant: 'destructive',
        title: 'Failed to fetch history',
        description: 'Could not retrieve analysis sessions from the database. Please make sure your Firestore security rules are set up correctly.',
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'analysisHistory', id));
      const updatedHistory = history.filter((item) => item.id !== id);
      setHistory(updatedHistory);
      toast({
        title: 'Session Deleted',
        description: 'The analysis session has been removed.',
      });
    } catch (error) {
      console.error("Error deleting document: ", error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: 'Could not delete the session from the database.',
      });
    }
  };
  
  const handleClearHistory = async () => {
    // This is a destructive operation, let's delete one by one
    // to show progress and allow for potential recovery/undo.
    // In a real app, you might want a backend function for this.
    try {
      for (const item of history) {
        await deleteDoc(doc(db, 'analysisHistory', item.id));
      }
      setHistory([]);
      toast({
        title: 'History Cleared',
        description: 'All analysis sessions have been removed.',
      });
    } catch (error) {
      console.error("Error clearing history: ", error);
       toast({
        variant: 'destructive',
        title: 'Clear History Failed',
        description: 'Could not clear all sessions from the database.',
      });
    }
  };

  return (
    <div className="flex h-full flex-col">
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
              Here are your previously saved analysis sessions from Firestore.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
               <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
                  <LoaderCircle className="mx-auto h-12 w-12 animate-spin text-muted-foreground" />
                  <h3 className="mt-4 text-lg font-semibold">Loading History...</h3>
                  <p className="mb-4 mt-2 text-sm text-muted-foreground">
                    Fetching your saved sessions from the cloud.
                  </p>
              </div>
            ) : history.length > 0 ? (
              <ScrollArea className="h-[60vh]">
                <div className="space-y-4">
                  {history.map((item) => (
                    <Card key={item.id} className="flex items-center justify-between p-4">
                      <div>
                        <p className="font-semibold">
                          Analysis from{' '}
                          {formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true })}
                           <span className="ml-2 rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">{item.language}</span>
                        </p>
                        <p className="text-sm text-muted-foreground truncate max-w-md">
                          {item.code.split('\n')[0]}
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

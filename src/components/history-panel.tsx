// src/components/history-panel.tsx
'use client';

import { useEffect, useState }from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { HistoryItem } from '@/lib/types';
import { ScrollArea } from './ui/scroll-area';
import { Eye, History, LoaderCircle, Trash2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { collection, getDocs, orderBy, query, deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

type HistoryPanelProps = {
  onSelectHistory: (item: HistoryItem) => void;
};

export default function HistoryPanel({ onSelectHistory }: HistoryPanelProps) {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isClearing, setIsClearing] = useState(false);
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
        description: 'Could not retrieve analysis sessions. Please check your Firestore security rules and network connection.',
      });
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDelete = async (id: string) => {
    // Optimistically update UI
    const originalHistory = [...history];
    setHistory(history.filter((item) => item.id !== id));
    
    try {
      await deleteDoc(doc(db, 'analysisHistory', id));
      toast({
        title: 'Session Deleted',
        description: 'The analysis session has been removed.',
      });
    } catch (error) {
      // Revert UI on error
      setHistory(originalHistory);
      console.error("Error deleting document: ", error);
      toast({
        variant: 'destructive',
        title: 'Delete Failed',
        description: 'Could not delete the session.',
      });
    }
  };
  
  const handleClearHistory = async () => {
    setIsClearing(true);
    try {
      const historyCollection = collection(db, 'analysisHistory');
      const querySnapshot = await getDocs(historyCollection);
      if (querySnapshot.empty) {
        toast({ title: 'History is already empty.' });
        setIsClearing(false);
        return;
      }
      
      const batch = writeBatch(db);
      querySnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
      });
      await batch.commit();

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
    setIsClearing(false);
  };

  return (
    <div className="flex h-full flex-col">
       <header className="flex items-center justify-between border-b p-4 sm:px-6">
        <div>
          <h1 className="font-headline text-2xl font-bold">Analysis History</h1>
          <p className="text-muted-foreground">
            Review your past analysis sessions saved in the cloud.
          </p>
        </div>
        {history.length > 0 && (
           <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={isClearing}>
                {isClearing ? (
                  <LoaderCircle className="mr-2 animate-spin" />
                ) : (
                  <Trash2 className="mr-2" />
                )}
                Clear History
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  your analysis history from the server.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={handleClearHistory}>
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
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
                          {item.createdAt ? formatDistanceToNow(item.createdAt.toDate(), { addSuffix: true }) : 'an unknown time'}
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
                         <AlertDialog>
                          <AlertDialogTrigger asChild>
                             <Button
                              variant="ghost"
                              size="icon"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 />
                              <span className="sr-only">Delete</span>
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This will permanently delete this analysis session.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
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

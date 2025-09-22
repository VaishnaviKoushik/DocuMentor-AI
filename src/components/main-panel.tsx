
'use client';

import { useState, useEffect, useRef } from 'react';
import {
  AlertTriangle,
  BookOpenText,
  Check,
  Clipboard,
  Code,
  Download,
  FileText,
  Github,
  Lightbulb,
  LoaderCircle,
  Upload,
  Wand2,
  Info
} from 'lucide-react';
import Link from 'next/link';
import { analyzeCode, type AnalysisResults } from '@/app/actions';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Input } from './ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { type HistoryItem } from '@/lib/types';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Alert, AlertDescription, AlertTitle } from './ui/alert';
import HowItWorks from './how-it-works';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { Skeleton } from './ui/skeleton';
import { cn } from '@/lib/utils';


const exampleCode = `def calculate_fibonacci(n):
    /**
     * Calculates the nth Fibonacci number.
     *
     * This function computes the nth number in the Fibonacci sequence
     * using a simple iterative approach.
     *
     * @param n: The position in the Fibonacci sequence.
     * @type n: int
     * @return: The nth Fibonacci number.
     * @rtype: int
     */
    if (n <= 0) {
        return 0
    } else if (n == 1) {
        return 1
    } else {
        a, b = 0, 1
        for _ in range(n - 1):
            a, b = b, a + b
        return b

class Greeter:
    def __init__(self, name):
        self.name = name

    def greet(self):
        // This function is missing a docstring.
        print(f"Hello, {self.name}!")
`;

type MainPanelProps = {
  selectedHistoryItem: HistoryItem | null;
};

export default function MainPanel({ selectedHistoryItem }: MainPanelProps) {
  const [code, setCode] = useState(exampleCode);
  const [language, setLanguage] = useState('python');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [editedDocstrings, setEditedDocstrings] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('paste');

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const docstringsTextareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = '0px';
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  }, [code]);

  useEffect(() => {
    if (docstringsTextareaRef.current) {
      docstringsTextareaRef.current.style.height = '0px';
      docstringsTextareaRef.current.style.height = `${docstringsTextareaRef.current.scrollHeight}px`;
    }
  }, [editedDocstrings, results]);


  useEffect(() => {
    if (selectedHistoryItem) {
      setCode(selectedHistoryItem.code);
      setResults(selectedHistoryItem.results);
      if (selectedHistoryItem.language) {
        setLanguage(selectedHistoryItem.language);
      }
    }
  }, [selectedHistoryItem]);

  useEffect(() => {
    if (results) {
      setEditedDocstrings(results.docstrings);
    }
  }, [results]);

  const handleAnalysis = async () => {
    if (!code.trim()) {
      toast({
        variant: 'destructive',
        title: 'Empty Code',
        description: 'Please enter some code to analyze.',
      });
      return;
    }
    
    setIsLoading(true);
    setResults(null);
    const response = await analyzeCode(code, language);
    setIsLoading(false);

    if ('error' in response) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: response.error,
      });
    } else {
      setResults(response);
      toast({
        title: 'Analysis Complete',
        description: 'Documentation and suggestions have been generated.',
      });
      // Save to history
      try {
        const historyCollection = collection(db, 'analysisHistory');
        await addDoc(historyCollection, {
          code,
          language,
          results: response,
          createdAt: serverTimestamp(),
        });
        
      } catch (error) {
        console.error('Error adding document: ', error);
        toast({
          variant: 'destructive',
          title: 'Failed to Save Session',
          description: 'Your analysis was successful, but it could not be saved to your history.',
        });
      }
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editedDocstrings);
    setIsCopied(true);
    toast({ title: 'Copied to clipboard!'})
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownload = (format: 'md' | 'html' | 'txt') => {
    let content = editedDocstrings;
    let mimeType = 'text/plain';
    let filename = `docstrings.${format}`;

    if (format === 'html') {
      content = `<html><head><title>Docstrings</title></head><body><pre>${editedDocstrings}</pre></body></html>`;
      mimeType = 'text/html';
    } else if (format === 'md') {
      mimeType = 'text/markdown';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setCode(text);
        // Switch back to the paste tab to show the content
        setActiveTab('paste');
      };
      reader.readAsText(file);
    }
  };

  const renderSkeletons = () => (
    <div className="space-y-4 p-6 pt-0">
      <Skeleton className="h-8 w-1/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
      <div className="space-y-2 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
      </div>
    </div>
  );

  const showResults = isLoading || results;

  return (
    <div className="flex flex-1 flex-col">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b p-4 sm:px-6">
        <div>
          <h1 className="font-headline text-2xl font-bold">Code Analyzer</h1>
          <p className="text-muted-foreground">
            Generate documentation and receive improvement suggestions for your code.
          </p>
        </div>
        <Button onClick={handleAnalysis} disabled={isLoading} size="lg">
          {isLoading ? (
            <LoaderCircle className="animate-spin" />
          ) : (
            <Wand2 />
          )}
          <span>{isLoading ? 'Analyzing...' : 'Generate Documentation'}</span>
        </Button>
      </header>
      <main className="flex-1 p-4 sm:p-6">
        <div className="mx-auto flex flex-col gap-6">
            <div className={cn(
              "grid grid-cols-1 gap-6",
              showResults && "lg:grid-cols-2"
            )}>
            <Card className="flex flex-col">
                <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                    <CardTitle>Code Input</CardTitle>
                    <CardDescription>
                    Paste code, upload a file, or connect to a GitHub repo.
                    </CardDescription>
                </div>
                <div className="w-36">
                    <Label htmlFor="language-select" className="sr-only">Language</Label>
                    <Select value={language} onValueChange={setLanguage} disabled={isLoading}>
                    <SelectTrigger id="language-select">
                        <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="python">Python</SelectItem>
                        <SelectItem value="javascript">JavaScript</SelectItem>
                        <SelectItem value="typescript">TypeScript</SelectItem>
                        <SelectItem value="java">Java</SelectItem>
                        <SelectItem value="cplusplus">C++</SelectItem>
                        <SelectItem value="go">Go</SelectItem>
                    </SelectContent>
                    </Select>
                </div>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col pt-0">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
                    <TabsList className="grid w-full grid-cols-3">
                        <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <TabsTrigger value="paste" disabled={isLoading}><Code /><span className="sr-only">Paste Code</span></TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Paste Code</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <TabsTrigger value="upload" disabled={isLoading}><Upload /><span className="sr-only">Upload Files</span></TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>Upload File</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                            <TabsTrigger value="github" disabled={true}><Github /><span className="sr-only">GitHub</span></TabsTrigger>
                            </TooltipTrigger>
                            <TooltipContent>GitHub (coming soon)</TooltipContent>
                        </Tooltip>
                        </TooltipProvider>
                    </TabsList>
                    <TabsContent value="paste" className="mt-4 flex-1">
                    <Textarea
                        ref={textareaRef}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="Paste your code here..."
                        className="min-h-[400px] flex-1 resize-none font-code text-sm"
                        disabled={isLoading}
                    />
                    </TabsContent>
                    <TabsContent value="upload" className="mt-4">
                    <div className="flex items-center justify-center w-full">
                        <label htmlFor="dropzone-file" className={`flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg  bg-card ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:bg-muted/50'}`}>
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                                <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                <p className="text-xs text-muted-foreground">.py, .js, .ts, .java, .cpp, .go</p>
                            </div>
                            <Input id="dropzone-file" type="file" className="hidden" onChange={handleFileChange} disabled={isLoading} />
                        </label>
                    </div> 
                    </TabsContent>
                    <TabsContent value="github" className="mt-4">
                    <div className="space-y-4">
                        <Alert>
                        <Info className="h-4 w-4" />
                        <AlertTitle>Feature Coming Soon</AlertTitle>
                        <AlertDescription>
                            GitHub integration is not yet fully implemented.
                        </AlertDescription>
                        </Alert>
                        <div className="space-y-2">
                        <Label htmlFor="github-repo">Repository URL</Label>
                        <Input id="github-repo" placeholder="https://github.com/user/repo" disabled />
                        </div>
                        <div className="space-y-2">
                        <Label htmlFor="github-token">Personal Access Token</Label>
                        <Input id="github-token" type="password" placeholder="ghp_..." disabled />
                        <p className="text-xs text-muted-foreground">
                            Create a{' '}
                            <Link href="https://github.com/settings/tokens" target="_blank" className="underline">
                            personal access token
                            </Link>{' '}
                            with repo access.
                        </p>
                        </div>
                        <Button disabled className="w-full">
                        <Github />
                        Connect to Repository
                        </Button>
                    </div>
                    </TabsContent>
                </Tabs>
                </CardContent>
            </Card>
            {showResults && (
              <div className="overflow-hidden">
                  {isLoading ? (
                  <Card>
                      <CardHeader>
                          <CardTitle>Analysis Results</CardTitle>
                          <CardDescription>Generating documentation and suggestions...</CardDescription>
                      </CardHeader>
                      {renderSkeletons()}
                  </Card>
                  ) : results ? (
                  <Card>
                      <CardHeader>
                      <CardTitle>Analysis Results</CardTitle>
                      <CardDescription>
                          Explore the generated documentation and suggestions.
                      </CardDescription>
                      </CardHeader>
                      <CardContent>
                      <Tabs defaultValue="docstrings" className="w-full">
                          <TabsList className="grid w-full grid-cols-3">
                          <TabsTrigger value="docstrings"><FileText />Docstrings</TabsTrigger>
                          <TabsTrigger value="improvements"><Lightbulb />Improvements</TabsTrigger>
                          <TabsTrigger value="undocumented"><AlertTriangle />Undocumented</TabsTrigger>
                          </TabsList>
                          <div className="mt-4">
                          <TabsContent value="docstrings" className="space-y-4">
                              <div className="flex justify-between items-center">
                                  <h3 className="text-lg font-semibold">Editable Docstrings</h3>
                                  <div className="flex items-center gap-2">
                                  <Button variant="ghost" size="sm" onClick={handleCopyToClipboard} disabled={!editedDocstrings}>
                                      {isCopied ? <Check /> : <Clipboard />}
                                      {isCopied ? 'Copied' : 'Copy'}
                                  </Button>
                                  <DropdownMenu>
                                      <DropdownMenuTrigger asChild>
                                      <Button variant="ghost" size="sm" disabled={!editedDocstrings}>
                                          <Download />
                                          Download
                                      </Button>
                                      </DropdownMenuTrigger>
                                      <DropdownMenuContent>
                                      <DropdownMenuItem onSelect={() => handleDownload('md')}>Markdown (.md)</DropdownMenuItem>
                                      <DropdownMenuItem onSelect={() => handleDownload('html')}>HTML (.html)</DropdownMenuItem>
                                      <DropdownMenuItem onSelect={() => handleDownload('txt')}>Text (.txt)</DropdownMenuItem>
                                      </DropdownMenuContent>
                                  </DropdownMenu>
                                  </div>
                              </div>
                              <Textarea
                                  ref={docstringsTextareaRef}
                                  value={editedDocstrings}
                                  onChange={(e) => setEditedDocstrings(e.target.value)}
                                  className="min-h-[400px] font-code text-sm resize-none"
                              />
                          </TabsContent>
                          <TabsContent value="improvements" className="space-y-4">
                              <h3 className="text-lg font-semibold">Improvement Suggestions</h3>
                              {results.improvements && results.improvements.length > 0 ? (
                                  <Accordion type="single" collapsible className="w-full">
                                  {results.improvements.map((item, index) => (
                                      <AccordionItem value={`item-${index}`} key={index}>
                                      <AccordionTrigger>Suggestion #{index + 1}</AccordionTrigger>
                                      <AccordionContent>{item}</AccordionContent>
                                      </AccordionItem>
                                  ))}
                                  </Accordion>
                              ) : (
                                  <p className="text-muted-foreground">No improvement suggestions found.</p>
                              )}
                          </TabsContent>
                          <TabsContent value="undocumented" className="space-y-4">
                              <h3 className="text-lg font-semibold">Undocumented Functions</h3>
                                  {results.undocumented && results.undocumented.length > 0 ? (
                                  <ul className="space-y-3">
                                  {results.undocumented.map((func, index) => (
                                      <li key={index} className="flex items-center gap-2 rounded-md border p-3">
                                      <AlertTriangle className="h-5 w-5 text-destructive" />
                                      <span className="font-code">{func}</span>
                                      </li>
                                  ))}
                                  </ul>
                              ) : (
                                  <p className="text-muted-foreground">All public functions seem to be documented. Great job!</p>
                              )}
                          </TabsContent>
                          </div>
                      </Tabs>
                      </CardContent>
                  </Card>
                  ) : null}
              </div>
            )}

            </div>
            {!showResults && <HowItWorks />}
        </div>
      </main>
    </div>
  );
}

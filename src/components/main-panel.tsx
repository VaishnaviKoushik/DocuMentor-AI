'use client';

import { useState, useEffect } from 'react';
import {
  AlertTriangle,
  BookOpenText,
  Check,
  Clipboard,
  Code,
  FileText,
  Github,
  Lightbulb,
  LoaderCircle,
  Upload,
  Wand2,
} from 'lucide-react';
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
import { Skeleton } from './ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from './ui/accordion';
import { Input } from './ui/input';

const exampleCode = `def calculate_fibonacci(n):
    """
    Calculates the nth Fibonacci number.

    This function computes the nth number in the Fibonacci sequence
    using a simple iterative approach.

    :param n: The position in the Fibonacci sequence.
    :type n: int
    :return: The nth Fibonacci number.
    :rtype: int
    """
    if n <= 0:
        return 0
    elif n == 1:
        return 1
    else:
        a, b = 0, 1
        for _ in range(n - 1):
            a, b = b, a + b
        return b

class Greeter:
    def __init__(self, name):
        self.name = name

    def greet(self):
        # This function is missing a docstring.
        print(f"Hello, {self.name}!")
`;

export default function MainPanel() {
  const [code, setCode] = useState(exampleCode);
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<AnalysisResults | null>(null);
  const [editedDocstrings, setEditedDocstrings] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (results) {
      setEditedDocstrings(results.docstrings);
    }
  }, [results]);

  const handleAnalysis = async () => {
    setIsLoading(true);
    setResults(null);
    const response = await analyzeCode(code);
    if ('error' in response) {
      toast({
        variant: 'destructive',
        title: 'Analysis Failed',
        description: response.error,
      });
    } else {
      setResults(response);
    }
    setIsLoading(false);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(editedDocstrings);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const renderSkeletons = () => (
    <div className="space-y-4">
      <Skeleton className="h-10 w-1/3" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
      </div>
    </div>
  );

  return (
    <div className="flex h-full flex-col">
      <header className="flex-shrink-0 border-b p-4">
        <h1 className="font-headline text-2xl font-bold">Code Analyzer</h1>
        <p className="text-muted-foreground">
          Paste your Python code below to generate documentation and receive improvement suggestions.
        </p>
      </header>
      <main className="flex-1 overflow-auto p-4">
        <div className="mx-auto max-w-4xl space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Code Input</CardTitle>
              <CardDescription>
                Choose one of the methods below to provide your Python code.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="paste">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="paste"><Code />Paste Code</TabsTrigger>
                  <TabsTrigger value="upload"><Upload />Upload Files</TabsTrigger>
                  <TabsTrigger value="github"><Github />GitHub</TabsTrigger>
                </TabsList>
                <TabsContent value="paste" className="mt-4">
                  <Textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your Python code here..."
                    className="min-h-[300px] font-code text-sm"
                  />
                </TabsContent>
                <TabsContent value="upload" className="mt-4">
                  <div className="flex items-center justify-center w-full">
                      <label htmlFor="dropzone-file" className="flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-lg cursor-pointer bg-muted/30 hover:bg-muted/50">
                          <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-4 text-muted-foreground" />
                              <p className="mb-2 text-sm text-muted-foreground"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                              <p className="text-xs text-muted-foreground">Python files (.py)</p>
                          </div>
                          <Input id="dropzone-file" type="file" className="hidden" multiple accept=".py" />
                      </label>
                  </div> 
                </TabsContent>
                <TabsContent value="github" className="mt-4">
                  <div className="space-y-4">
                    <p className="text-sm text-muted-foreground">Enter a GitHub repository URL to analyze its content.</p>
                    <div className="flex gap-2">
                      <Input placeholder="https://github.com/user/repo" />
                      <Button>Connect</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          <div className="flex justify-center">
            <Button onClick={handleAnalysis} disabled={isLoading} size="lg">
              {isLoading ? (
                <LoaderCircle className="animate-spin" />
              ) : (
                <Wand2 />
              )}
              <span>{isLoading ? 'Analyzing...' : 'Generate Documentation'}</span>
            </Button>
          </div>

          {(isLoading || results) && (
            <Card>
              <CardHeader>
                <CardTitle>Analysis Results</CardTitle>
                <CardDescription>
                  Explore the generated documentation and suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="docstrings" className="w-full">
                  <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4">
                    <TabsTrigger value="docstrings"><FileText />Docstrings</TabsTrigger>
                    <TabsTrigger value="improvements"><Lightbulb />Improvements</TabsTrigger>
                    <TabsTrigger value="undocumented"><AlertTriangle />Undocumented</TabsTrigger>
                    <TabsTrigger value="summary"><BookOpenText />Summary</TabsTrigger>
                  </TabsList>
                  <div className="mt-4">
                    <TabsContent value="docstrings">
                      {isLoading ? renderSkeletons() : (
                        <Card className="bg-muted/30">
                          <CardHeader>
                            <div className="flex justify-between items-center">
                              <CardTitle>Generated reST Docstrings</CardTitle>
                              <Button variant="ghost" size="sm" onClick={handleCopyToClipboard}>
                                {isCopied ? <Check /> : <Clipboard />}
                                {isCopied ? 'Copied!' : 'Copy'}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <Textarea
                              value={editedDocstrings}
                              onChange={(e) => setEditedDocstrings(e.target.value)}
                              className="min-h-[300px] font-code text-sm"
                            />
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                    <TabsContent value="improvements">
                      {isLoading ? renderSkeletons() : (
                         <Card className="bg-muted/30">
                          <CardHeader>
                            <CardTitle>Improvement Suggestions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {results?.improvements && results.improvements.length > 0 ? (
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
                          </CardContent>
                        </Card>
                      )}
                    </TabsContent>
                    <TabsContent value="undocumented">
                       {isLoading ? renderSkeletons() : (
                         <Card className="bg-muted/30">
                          <CardHeader>
                            <CardTitle>Undocumented Public Functions</CardTitle>
                          </CardHeader>
                          <CardContent>
                            {results?.undocumented && results.undocumented.length > 0 ? (
                              <ul className="list-inside list-disc space-y-2">
                                {results.undocumented.map((func, index) => (
                                  <li key={index} className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-destructive" />
                                    <span className="font-code">{func}</span>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <p className="text-muted-foreground">All public functions seem to be documented. Great job!</p>
                            )}
                          </CardContent>
                        </Card>
                       )}
                    </TabsContent>
                    <TabsContent value="summary">
                       {isLoading ? renderSkeletons() : (
                         <Card className="bg-muted/30">
                          <CardHeader>
                            <CardTitle>Codebase Summary</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="prose prose-sm dark:prose-invert max-w-none">
                              {results?.summary.split('\n').map((line, i) => {
                                if (line.startsWith('#')) {
                                  const level = line.match(/^#+/)?.[0].length || 1;
                                  const Tag = `h${level + 1}` as keyof JSX.IntrinsicElements;
                                  return <Tag key={i} className="font-headline">{line.replace(/^#+\s*/, '')}</Tag>;
                                }
                                return <p key={i}>{line}</p>;
                              })}
                            </div>
                          </CardContent>
                        </Card>
                       )}
                    </TabsContent>
                  </div>
                </Tabs>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

// src/components/how-it-works.tsx

import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { Lightbulb, Wand2, FileQuestion, ZoomIn } from 'lucide-react';

export default function HowItWorks() {
  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center gap-3">
          <Wand2 className="h-6 w-6" />
          <CardTitle className="font-headline text-2xl">How DocuMentor AI Works</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <p className="text-muted-foreground">
          Welcome to DocuMentor AI! This tool leverages generative AI to help you create, improve, and understand code documentation. Here’s a quick guide to get you started.
        </p>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <ZoomIn className="h-5 w-5 text-primary" />
            At a Glance
          </h3>
          <ol className="list-decimal list-inside space-y-2 text-muted-foreground">
            <li><b>Input Your Code:</b> Paste your code into the editor on the left, upload a file, or use the example.</li>
            <li><b>Select Language:</b> Choose the correct programming language (Python or JavaScript).</li>
            <li><b>Generate:</b> Click the "Generate Documentation" button.</li>
            <li><b>Review:</b> Explore the four output tabs:
              <ul className="list-disc list-inside ml-4 mt-1">
                <li><b>Docstrings:</b> AI-generated documentation, ready to be edited and copied.</li>
                <li><b>Improvements:</b> Actionable suggestions for your existing comments.</li>
                <li><b>Undocumented:</b> A list of public functions that need docstrings.</li>
                <li><b>Summary:</b> A high-level README-style summary of your code.</li>
              </ul>
            </li>
          </ol>
        </div>

        <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-primary" />
                What Kind of Suggestions Do I Get?
            </h3>
            <p className="text-muted-foreground">
                The AI analyzes your code to provide several types of feedback:
            </p>
            <ul className="list-disc space-y-2 pl-5 text-muted-foreground">
                <li>
                    <b>Completeness:</b> It identifies public functions missing docstrings entirely.
                </li>
                <li>
                    <b>Clarity and Detail:</b> It suggests adding more detail about what a function does, what its parameters are, and what it returns.
                </li>
                <li>
                    <b>Formatting:</b> It ensures your docstrings follow conventional styles for the selected language (reST for Python, JSDoc for JavaScript).
                </li>
            </ul>
        </div>

        <div className="space-y-4">
          <h3 className="font-semibold text-lg flex items-center gap-2">
            <FileQuestion className="h-5 w-5 text-primary" />
            Frequently Asked Questions
          </h3>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="faq-1">
              <AccordionTrigger>Is my code stored on your servers?</AccordionTrigger>
              <AccordionContent>
                No. Your code is sent for analysis but is not stored. Analysis history is saved locally in your browser's storage, which you can clear at any time from the "History" tab.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-2">
              <AccordionTrigger>Why is the GitHub feature disabled?</AccordionTrigger>
              <AccordionContent>
                Direct GitHub integration for analyzing entire repositories is a complex feature that is currently under development. For now, you can paste code from your files directly into the editor.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="faq-3">
              <AccordionTrigger>Are the AI suggestions always perfect?</AccordionTrigger>
              <AccordionContent>
                While the AI is highly capable, it's not infallible. It's designed to be a helpful assistant, but the generated documentation may occasionally need minor corrections or refinements. That's why the "Docstrings" output is editable, giving you full control over the final result.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
}

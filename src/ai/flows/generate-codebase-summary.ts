'use server';

/**
 * @fileOverview Generates a README-style summary for a given code snippet.
 *
 * - generateCodebaseSummary - A function that generates the code summary.
 * - GenerateCodebaseSummaryInput - The input type for the generateCodebaseSummary function.
 * - GenerateCodebaseSummaryOutput - The return type for the generateCodebaseSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodebaseSummaryInputSchema = z.object({
  code: z
    .string()
    .describe('The code snippet to summarize.'),
});
export type GenerateCodebaseSummaryInput = z.infer<typeof GenerateCodebaseSummaryInputSchema>;

const GenerateCodebaseSummaryOutputSchema = z.object({
  summary: z.string().describe('The generated README-style summary of the code.'),
});
export type GenerateCodebaseSummaryOutput = z.infer<typeof GenerateCodebaseSummaryOutputSchema>;

export async function generateCodebaseSummary(input: GenerateCodebaseSummaryInput): Promise<GenerateCodebaseSummaryOutput> {
  return generateCodebaseSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodebaseSummaryPrompt',
  input: {schema: GenerateCodebaseSummaryInputSchema},
  output: {schema: GenerateCodebaseSummaryOutputSchema},
  prompt: `You are an expert documentation writer. Given the following code snippet, generate a README-style summary. The summary should be well-structured, clear, and concise, explaining the code's purpose, functions, and overall structure. Use a developer tone -- clear, professional, concise, and helpful. Use markdown for formatting.

Code Snippet:
\`\`\`
{{{code}}}
\`\`\`
`,
});

const generateCodebaseSummaryFlow = ai.defineFlow(
  {
    name: 'generateCodebaseSummaryFlow',
    inputSchema: GenerateCodebaseSummaryInputSchema,
    outputSchema: GenerateCodebaseSummaryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

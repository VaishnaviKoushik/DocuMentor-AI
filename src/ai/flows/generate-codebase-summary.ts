'use server';

/**
 * @fileOverview Generates a top-level README file summarizing the codebase structure and purpose.
 *
 * - generateCodebaseSummary - A function that generates the codebase summary.
 * - GenerateCodebaseSummaryInput - The input type for the generateCodebaseSummary function.
 * - GenerateCodebaseSummaryOutput - The return type for the generateCodebaseSummary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateCodebaseSummaryInputSchema = z.object({
  codebaseDescription: z
    .string()
    .describe('A detailed description of the entire codebase.'),
});
export type GenerateCodebaseSummaryInput = z.infer<typeof GenerateCodebaseSummaryInputSchema>;

const GenerateCodebaseSummaryOutputSchema = z.object({
  readmeContent: z.string().describe('The generated content for the top-level README.md file.'),
});
export type GenerateCodebaseSummaryOutput = z.infer<typeof GenerateCodebaseSummaryOutputSchema>;

export async function generateCodebaseSummary(input: GenerateCodebaseSummaryInput): Promise<GenerateCodebaseSummaryOutput> {
  return generateCodebaseSummaryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateCodebaseSummaryPrompt',
  input: {schema: GenerateCodebaseSummaryInputSchema},
  output: {schema: GenerateCodebaseSummaryOutputSchema},
  prompt: `You are an expert documentation writer. Given the following description of a codebase, generate a top-level README.md file that provides a comprehensive overview of the entire codebase structure and purpose. The README should be well-structured, clear, and concise, suitable for new contributors to quickly understand the project and its goals. Use a developer tone -- clear, professional, concise, and helpful.

Codebase Description: {{{codebaseDescription}}}`,
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

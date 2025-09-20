'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating docstrings for code.
 *
 * - generateDocstrings - A function that takes code as input and returns formatted docstrings.
 * - GenerateDocstringsInput - The input type for the generateDocstrings function.
 * - GenerateDocstringsOutput - The return type for the generateDocstrings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDocstringsInputSchema = z.object({
  code: z
    .string()
    .describe('The code to generate docstrings for.'),
  language: z
    .string()
    .describe('The programming language of the code (e.g., "python", "javascript").'),
});
export type GenerateDocstringsInput = z.infer<
  typeof GenerateDocstringsInputSchema
>;

const GenerateDocstringsOutputSchema = z.object({
  docstrings: z
    .string()
    .describe('The generated docstrings.'),
});
export type GenerateDocstringsOutput = z.infer<
  typeof GenerateDocstringsOutputSchema
>;

export async function generateDocstrings(
  input: GenerateDocstringsInput
): Promise<GenerateDocstringsOutput> {
  return generateDocstringsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDocstringsPrompt',
  input: {schema: GenerateDocstringsInputSchema},
  output: {schema: GenerateDocstringsOutputSchema},
  prompt: `You are an expert documentation generator for code.
Your task is to analyze the given code and generate docstrings for it.
The language of the code is {{language}}.
Generate the docstrings in the conventional format for that language (e.g., reStructuredText for Python, JSDoc for JavaScript/TypeScript, Javadoc for Java, Doxygen for C++).
Include summaries, parameter types, and return values based on the code and naming conventions.

Here is the code:
\`\`\`{{language}}
{{{code}}}
\`\`\`

Generate the docstrings:
`,
});

const generateDocstringsFlow = ai.defineFlow(
  {
    name: 'generateDocstringsFlow',
    inputSchema: GenerateDocstringsInputSchema,
    outputSchema: GenerateDocstringsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

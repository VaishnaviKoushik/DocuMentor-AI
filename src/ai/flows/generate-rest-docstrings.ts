'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating reStructuredText (reST) docstrings for Python code.
 *
 * - generateRestDocstrings - A function that takes Python code as input and returns reST-formatted docstrings.
 * - GenerateRestDocstringsInput - The input type for the generateRestDocstrings function.
 * - GenerateRestDocstringsOutput - The return type for the generateRestDocstrings function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateRestDocstringsInputSchema = z.object({
  pythonCode: z
    .string()
    .describe('The Python code to generate reStructuredText docstrings for.'),
});
export type GenerateRestDocstringsInput = z.infer<
  typeof GenerateRestDocstringsInputSchema
>;

const GenerateRestDocstringsOutputSchema = z.object({
  restDocstrings: z
    .string()
    .describe('The generated reStructuredText docstrings.'),
});
export type GenerateRestDocstringsOutput = z.infer<
  typeof GenerateRestDocstringsOutputSchema
>;

export async function generateRestDocstrings(
  input: GenerateRestDocstringsInput
): Promise<GenerateRestDocstringsOutput> {
  return generateRestDocstringsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateRestDocstringsPrompt',
  input: {schema: GenerateRestDocstringsInputSchema},
  output: {schema: GenerateRestDocstringsOutputSchema},
  prompt: `You are an expert documentation generator for Python code.
  Your task is to analyze the given Python code and generate reStructuredText (reST) docstrings for it.
  Include summaries, parameter types, and return values based on the code and naming conventions.

  Here is the Python code:
  \n\n  {{pythonCode}}
  \n\n  Generate the reST docstrings:
  `,
});

const generateRestDocstringsFlow = ai.defineFlow(
  {
    name: 'generateRestDocstringsFlow',
    inputSchema: GenerateRestDocstringsInputSchema,
    outputSchema: GenerateRestDocstringsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

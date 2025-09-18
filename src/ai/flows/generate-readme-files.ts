'use server';

/**
 * @fileOverview A flow to generate README.md files for each directory in a Python project.
 *
 * - generateReadmeFiles - A function that generates README.md content based on directory context.
 * - GenerateReadmeFilesInput - The input type for the generateReadmeFiles function.
 * - GenerateReadmeFilesOutput - The return type for the generateReadmeFiles function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateReadmeFilesInputSchema = z.object({
  directoryContents: z
    .string()
    .describe(
      'A description of the contents of the directory, including modules and subdirectories.'
    ),
  moduleRelationships: z
    .string()
    .describe('A description of the relationships between modules in the directory.'),
  directoryPurpose: z
    .string()
    .describe('The purpose of the directory within the overall project.'),
});
export type GenerateReadmeFilesInput = z.infer<typeof GenerateReadmeFilesInputSchema>;

const GenerateReadmeFilesOutputSchema = z.object({
  readmeContent: z
    .string()
    .describe('The generated README.md content for the directory.'),
});
export type GenerateReadmeFilesOutput = z.infer<typeof GenerateReadmeFilesOutputSchema>;

export async function generateReadmeFiles(
  input: GenerateReadmeFilesInput
): Promise<GenerateReadmeFilesOutput> {
  return generateReadmeFilesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReadmeFilesPrompt',
  input: {schema: GenerateReadmeFilesInputSchema},
  output: {schema: GenerateReadmeFilesOutputSchema},
  prompt: `You are an AI documentation assistant. Generate a README.md file for a Python project directory based on the provided information.

Directory Contents: {{{directoryContents}}}

Module Relationships: {{{moduleRelationships}}}

Directory Purpose: {{{directoryPurpose}}}

README.md:`,
});

const generateReadmeFilesFlow = ai.defineFlow(
  {
    name: 'generateReadmeFilesFlow',
    inputSchema: GenerateReadmeFilesInputSchema,
    outputSchema: GenerateReadmeFilesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

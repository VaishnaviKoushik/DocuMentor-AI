// src/ai/flows/flag-undocumented-functions.ts
'use server';

/**
 * @fileOverview This file defines a Genkit flow to flag undocumented public functions in code.
 *
 * - flagUndocumentedFunctions - A function that takes code as input and returns a list of undocumented public functions.
 * - FlagUndocumentedFunctionsInput - The input type for the flagUndocumentedFunctions function.
 * - FlagUndocumentedFunctionsOutput - The return type for the flagUndocumentedFunctions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FlagUndocumentedFunctionsInputSchema = z.object({
  code: z
    .string()
    .describe('The code to analyze for undocumented functions.'),
  language: z
    .string()
    .describe('The programming language of the code (e.g., "python", "javascript").'),
});
export type FlagUndocumentedFunctionsInput = z.infer<
  typeof FlagUndocumentedFunctionsInputSchema
>;

const FlagUndocumentedFunctionsOutputSchema = z.object({
  undocumentedFunctions: z
    .array(z.string())
    .describe('A list of names of undocumented public functions.'),
});
export type FlagUndocumentedFunctionsOutput = z.infer<
  typeof FlagUndocumentedFunctionsOutputSchema
>;

export async function flagUndocumentedFunctions(
  input: FlagUndocumentedFunctionsInput
): Promise<FlagUndocumentedFunctionsOutput> {
  return flagUndocumentedFunctionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'flagUndocumentedFunctionsPrompt',
  input: {schema: FlagUndocumentedFunctionsInputSchema},
  output: {schema: FlagUndocumentedFunctionsOutputSchema},
  prompt: `You are a code analysis tool.
Your task is to identify and list any public functions in the provided code that lack docstrings. The language is {{language}}.

Analyze the following {{language}} code:

\`\`\`{{language}}
{{{code}}}
\`\`\`

Identify any public functions (i.e., not private/internal functions) that do not have docstrings.
A docstring is the string literal or comment block that occurs as the first statement in a function definition.

Return a JSON array containing the names of these undocumented functions.
If all functions are documented, return an empty array.
`,
});

const flagUndocumentedFunctionsFlow = ai.defineFlow(
  {
    name: 'flagUndocumentedFunctionsFlow',
    inputSchema: FlagUndocumentedFunctionsInputSchema,
    outputSchema: FlagUndocumentedFunctionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

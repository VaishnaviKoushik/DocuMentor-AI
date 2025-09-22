// src/app/actions.ts
'use server';

import { generateDocstrings } from '@/ai/flows/generate-docstrings';
import { suggestImprovementsAndMissingDocstrings } from '@/ai/flows/suggest-improvements-docstrings';
import { flagUndocumentedFunctions } from '@/ai/flows/flag-undocumented-functions';

export type AnalysisResults = {
  docstrings: string;
  improvements: string[];
  undocumented: string[];
  summary?: string; 
};

export async function analyzeCode(
  code: string,
  language: string,
): Promise<AnalysisResults | { error: string }> {
  try {
    if (!code.trim()) {
      return {
        docstrings: '',
        improvements: [],
        undocumented: [],
      };
    }

    const [docstringsResult, improvementsResult, undocumentedResult] =
      await Promise.all([
        generateDocstrings({ code, language }),
        suggestImprovementsAndMissingDocstrings({ code, language }),
        flagUndocumentedFunctions({ code, language }),
      ]);

    return {
      docstrings: docstringsResult.docstrings,
      improvements: improvementsResult.suggestions,
      undocumented: undocumentedResult.undocumentedFunctions,
    };
  } catch (error) {
    console.error('Error during code analysis:', error);
    return { error: 'An unexpected error occurred during analysis.' };
  }
}

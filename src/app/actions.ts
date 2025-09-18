// src/app/actions.ts
'use server';

import { generateRestDocstrings } from '@/ai/flows/generate-rest-docstrings';
import { suggestImprovementsAndMissingDocstrings } from '@/ai/flows/suggest-improvements-docstrings';
import { flagUndocumentedFunctions } from '@/ai/flows/flag-undocumented-functions';
import { generateCodebaseSummary } from '@/ai/flows/generate-codebase-summary';

export type AnalysisResults = {
  docstrings: string;
  improvements: string[];
  undocumented: string[];
  summary: string;
};

export async function analyzeCode(
  pythonCode: string
): Promise<AnalysisResults | { error: string }> {
  try {
    if (!pythonCode.trim()) {
      return {
        docstrings: '',
        improvements: [],
        undocumented: [],
        summary: '',
      };
    }

    const [docstringsResult, improvementsResult, undocumentedResult, summaryResult] =
      await Promise.all([
        generateRestDocstrings({ pythonCode }),
        suggestImprovementsAndMissingDocstrings({ pythonCode }),
        flagUndocumentedFunctions({ pythonCode }),
        generateCodebaseSummary({ codebaseDescription: pythonCode }),
      ]);

    return {
      docstrings: docstringsResult.restDocstrings,
      improvements: improvementsResult.suggestions,
      undocumented: undocumentedResult.undocumentedFunctions,
      summary: summaryResult.readmeContent,
    };
  } catch (error) {
    console.error('Error during code analysis:', error);
    return { error: 'An unexpected error occurred during analysis.' };
  }
}

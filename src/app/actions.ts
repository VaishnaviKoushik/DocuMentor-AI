// src/app/actions.ts
'use server';

import { generateDocstrings } from '@/ai/flows/generate-docstrings';
import { suggestImprovementsAndMissingDocstrings } from '@/ai/flows/suggest-improvements-docstrings';
import { flagUndocumentedFunctions } from '@/ai/flows/flag-undocumented-functions';
import { generateCodebaseSummary } from '@/ai/flows/generate-codebase-summary';


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
        summary: '',
      };
    }

    const [docstringsResult, improvementsResult, undocumentedResult, summaryResult] =
      await Promise.allSettled([
        generateDocstrings({ code, language }),
        suggestImprovementsAndMissingDocstrings({ code, language }),
        flagUndocumentedFunctions({ code, language }),
        generateCodebaseSummary({ code }),
      ]);

      const getResult = <T>(result: PromiseSettledResult<T>): T | null => {
        if (result.status === 'fulfilled') {
          return result.value;
        }
        console.error('Promise rejected in analyzeCode:', result.reason);
        return null;
      };

      const docstrings = getResult(docstringsResult)?.docstrings ?? '';
      const improvements = getResult(improvementsResult)?.suggestions ?? [];
      const undocumented = getResult(undocumentedResult)?.undocumentedFunctions ?? [];
      const summary = getResult(summaryResult)?.summary ?? 'Could not generate summary.';


    return {
      docstrings,
      improvements,
      undocumented,
      summary,
    };
  } catch (error) {
    console.error('Error during code analysis:', error);
    return { error: 'An unexpected error occurred during analysis.' };
  }
}

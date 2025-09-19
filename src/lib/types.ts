// src/lib/types.ts

import { type AnalysisResults } from "@/app/actions";

export type HistoryItem = {
    id: string;
    code: string;
    language: string;
    results: AnalysisResults;
};

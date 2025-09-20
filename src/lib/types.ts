// src/lib/types.ts

import { type AnalysisResults } from "@/app/actions";
import { type Timestamp } from "firebase/firestore";

export type HistoryItem = {
    id: string;
    code: string;
    language: string;
    results: AnalysisResults;
    createdAt: Timestamp; // Ensure createdAt is always a Timestamp
};

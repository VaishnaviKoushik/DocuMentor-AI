import { config } from 'dotenv';
config();

import '@/ai/flows/generate-docstrings.ts';
import '@/ai/flows/suggest-improvements-docstrings.ts';
import '@/ai/flows/generate-codebase-summary.ts';
import '@/ai/flows/flag-undocumented-functions.ts';

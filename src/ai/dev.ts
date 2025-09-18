import { config } from 'dotenv';
config();

import '@/ai/flows/generate-readme-files.ts';
import '@/ai/flows/generate-rest-docstrings.ts';
import '@/ai/flows/suggest-improvements-docstrings.ts';
import '@/ai/flows/generate-codebase-summary.ts';
import '@/ai/flows/flag-undocumented-functions.ts';
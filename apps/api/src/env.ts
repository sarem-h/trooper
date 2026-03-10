import * as dotenv from 'dotenv';
import * as path from 'path';

// Load .env from monorepo root BEFORE any other imports
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });

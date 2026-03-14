import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

const rootEnvPath = path.resolve(__dirname, '../../../.env');

if (process.env.NODE_ENV !== 'production' && fs.existsSync(rootEnvPath)) {
	dotenv.config({ path: rootEnvPath });
}

const REQUIRED_PRODUCTION_ENV_VARS = [
	'DATABASE_URL',
	'AZURE_OPENAI_ENDPOINT',
	'AZURE_OPENAI_API_KEY',
	'AZURE_OPENAI_THINKER_DEPLOYMENT',
	'AZURE_OPENAI_WORKER_DEPLOYMENT',
	'AZURE_OPENAI_EMBEDDER_DEPLOYMENT',
	'AZURE_SEARCH_ENDPOINT',
	'AZURE_SEARCH_API_KEY',
	'CORS_ORIGIN',
] as const;

export function validateEnvironment() {
	const missing = REQUIRED_PRODUCTION_ENV_VARS.filter((name) => !process.env[name]?.trim());

	if (missing.length === 0) {
		return;
	}

	const message = `Missing required environment variables: ${missing.join(', ')}`;

	if (process.env.NODE_ENV === 'production') {
		throw new Error(message);
	}

	console.warn(`[env] ${message}`);
}

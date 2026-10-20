import { config } from 'dotenv';
config({ path: '.env' });
import { defineConfig } from 'drizzle-kit';

if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set');

export default defineConfig({
	schema: './src/lib/features/database/server/schema.ts',
	out: './drizzle',
	dialect: 'postgresql',
	casing: 'snake_case',
	schemaFilter: ['public'],
	dbCredentials: { url: process.env.DATABASE_URL },
	strict: true,
	verbose: true
});

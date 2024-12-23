import { defineConfig, type Config } from 'drizzle-kit';

export default defineConfig({
	dialect: 'sqlite',
	schema: './src/lib/db/schema.ts',
	out: './src-tauri/migrations',
	dbCredentials: {
		url: ':memory:'
	},

	verbose: true,
	strict: true
}) satisfies Config;

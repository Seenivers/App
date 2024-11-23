import { defineConfig } from 'drizzle-kit';
export default defineConfig({
	dialect: 'sqlite',
	schema: './src/lib/db/schema.ts',
	out: './src-tauri/migrations',
	dbCredentials: {
		url: ':memory:'
	}
});
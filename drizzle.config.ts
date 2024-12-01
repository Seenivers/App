import { defineConfig, type Config } from 'drizzle-kit';

const config: Config = {
	dialect: 'sqlite',
	schema: './src/lib/db/schema.ts',
	out: './src-tauri/migrations',
	dbCredentials: {
		url: ':memory:'
	}
};

export default defineConfig(config);

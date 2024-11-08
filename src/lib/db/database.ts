import { drizzle } from 'drizzle-orm/sqlite-proxy';
import { schema } from '$lib/db/schema';
import Database from '@tauri-apps/plugin-sql';

/**
 * Asynchronously loads the SQLite database.
 */
export const sqlitePromise = Database.load('sqlite:sqlite.db');

/**
 * Exports the SQLite database instance as a promise.
 */
export let sqlite: Database;

// Waits for the database to load, then assigns it to `sqlite`.
sqlitePromise.then((db) => {
	sqlite = db;
});

/**
 * The drizzle database instance, initialized only after the SQLite database is ready.
 */
export const db = drizzle<typeof schema>(
	async (sql, params, method) => {
		if (!sqlite) {
			throw new Error('SQLite database is not loaded yet');
		}

		let rows: any = [];
		let results = [];

		// If the query is a SELECT, use the select method
		if (isSelectQuery(sql)) {
			rows = await sqlite.select(sql, params).catch((e) => {
				console.error('SQL Error:', e);
				return [];
			});
		} else {
			// Otherwise, use the execute method
			rows = await sqlite.execute(sql, params).catch((e) => {
				console.error('SQL Error:', e);
				return [];
			});
			return { rows: [] };
		}

		rows = rows.map((row: any) => {
			return Object.values(row);
		});

		// If the method is "all", return all rows
		results = method === 'all' ? rows : rows[0];

		return { rows: results };
	},
	// Pass the schema to the drizzle instance
	{ schema: schema, logger: import.meta.env.DEV }
);

/**
 * Checks if the given SQL query is a SELECT query.
 * @param sql The SQL query to check.
 * @returns True if the query is a SELECT query, false otherwise.
 */
function isSelectQuery(sql: string): boolean {
	const selectRegex = /^\s*SELECT\b/i;
	return selectRegex.test(sql);
}

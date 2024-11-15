import { drizzle } from 'drizzle-orm/sqlite-proxy';
import { schema } from '$lib/db/schema';
import Database from '@tauri-apps/plugin-sql';

/**
 * Exports the SQLite database instance as a promise.
 */
export const sqlite: Database = await Database.load(
	`sqlite:${import.meta.env.DEV ? 'DEV' : ''}-sqlite.db`
);

/**
 * The drizzle database instance, initialized only after the SQLite database is ready.
 */
let dbInstance: ReturnType<typeof drizzle<typeof schema>> | undefined;

/**
 * Initializes the `dbInstance` once `sqlite` is loaded.
 * @returns The `dbInstance` after ensuring SQLite is loaded.
 */
export async function getDb() {
	if (!dbInstance) {
		dbInstance = drizzle<typeof schema>(
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

				rows = rows.map((row: any) => Object.values(row));

				// If the method is "all", return all rows
				results = method === 'all' ? rows : rows[0];

				return { rows: results };
			},
			{ schema: schema, logger: import.meta.env.DEV }
		);
	}
	return dbInstance;
}

/**
 * Checks if the given SQL query is a SELECT query.
 * @param sql The SQL query to check.
 * @returns True if the query is a SELECT query, false otherwise.
 */
function isSelectQuery(sql: string): boolean {
	const selectRegex = /^\s*SELECT\b/i;
	return selectRegex.test(sql);
}

export const db = await getDb();

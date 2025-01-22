import { drizzle } from 'drizzle-orm/sqlite-proxy';
import { schema } from '$lib/db/schema';
import Database from '@tauri-apps/plugin-sql';
import { error } from '@tauri-apps/plugin-log';

/**
 * Exports the SQLite database instance as a promise.
 */
export const sqlite: Database = await Database.load(
	`sqlite:${import.meta.env.DEV ? 'DEV-' : ''}sqlite.db`
);

/**
 * Initializes the `dbInstance` once `sqlite` is loaded.
 * @returns The `dbInstance` after ensuring SQLite is loaded.
 */
export function getDb() {
	// Initialisiere dbInstance mit der asynchronen Callback-Funktion
	const dbInstance = drizzle<typeof schema>(
		async (sql, params, method) => {
			let results: any = []; // eslint-disable-line

			const isSelect = /^\s*SELECT\b/i.test(sql); // Prüft, ob es ein SELECT-Befehl ist

			// Wenn die Abfrage ein SELECT ist, nutze die select-Methode
			if (isSelect) {
				results = await sqlite.select(sql, params).catch((e) => {
					error('SQL Error: ' + e);
					return [];
				});
			} else {
				// Ansonsten, nutze die execute-Methode
				await sqlite.execute(sql, params).catch((e) => {
					error('SQL Error: ' + e);
					return [];
				});
				return { rows: [] };
			}

			// Falls notwendig, mappe die Ergebnisse auf Arrays
			results = results.map((row: any) => Object.values(row)); // eslint-disable-line

			// Wenn die Methode "all" ist, gebe alle Zeilen zurück
			return { rows: method === 'all' ? results : results[0] };
		},
		{ schema: schema, logger: import.meta.env.DEV }
	);
	return dbInstance;
}

export const db = getDb();

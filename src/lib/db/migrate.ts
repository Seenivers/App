import { exists, mkdir, readDir, readFile } from '@tauri-apps/plugin-fs';
import { BaseDirectory, join, resourceDir } from '@tauri-apps/api/path';
import { sqlite } from '$lib/db/database';
import { error, info } from '@tauri-apps/plugin-log';

/**
 * Executes database migrations.
 *
 * @returns A promise that resolves when the migrations are complete.
 */
export async function migrate() {
	const resourcePath = await resourceDir();

	// Check if the migrations directory exists and create it if it doesn't
	const migrationsDir = await join(resourcePath, 'migrations');

	console.log('Resource path:', await exists(resourcePath));
	console.log('Migrations dir:', await exists(migrationsDir));

	if (!(await exists(await join(resourcePath, 'migrations')))) {
		await mkdir(migrationsDir, {
			baseDir: BaseDirectory.AppData,
			recursive: true
		});
	}

	const files = await readDir(migrationsDir);
	let migrations = files.filter((file) => file.name?.endsWith('.sql'));

	// Sort migrations by the first 4 characters of the file name
	migrations = migrations.sort((a, b) => {
		const aHash = a.name?.replace('.sql', '').slice(0, 4);
		const bHash = b.name?.replace('.sql', '').slice(0, 4);

		if (aHash && bHash) {
			return aHash.localeCompare(bHash);
		}

		return 0;
	});

	const migrationTableCreate = /*sql*/ `
		CREATE TABLE IF NOT EXISTS "__drizzle_migrations" (
			id INTEGER PRIMARY KEY AUTOINCREMENT,
			hash text NOT NULL UNIQUE,
			created_at numeric
		)
	`;

	await sqlite.execute(migrationTableCreate, []).catch((err) => {
		error('Failed to create migration table: ' + err);
	});

	const dbMigrations: { id: number; hash: string; created_at: number }[] = await sqlite.select(
		/*sql*/ `SELECT id, hash, created_at FROM "__drizzle_migrations" ORDER BY created_at DESC`
	);

	for (const migration of migrations) {
		const hash = migration.name?.replace('.sql', '');

		const hasBeenRun = (hash: string) =>
			dbMigrations.find((dbMigration) => {
				return dbMigration.hash === hash;
			});

		if (hash && hasBeenRun(hash) === undefined) {
			try {
				// Lese die Datei als Uint8Array
				const fileData: Uint8Array = await readFile(`${resourcePath}/migrations/${migration.name}`);

				// Konvertiere den ArrayBuffer zu einem String
				const sql = arrayBufferToString(fileData.buffer as ArrayBuffer);

				// Führe das SQL-Skript aus
				await sqlite.execute(sql, []);

				// Speichere die Migration in der Tabelle
				await sqlite.execute(
					/*sql*/ `INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES ($1, $2)`,
					[hash, Date.now()]
				);
			} catch (err) {
				error(`Failed to process migration ${hash}: ${err}`);
			}
		}
	}

	info('Migrations complete');
	return Promise.resolve();
}

/**
 * Converts an ArrayBuffer to a UTF-8 string.
 *
 * @param buffer - The ArrayBuffer to convert.
 * @returns The decoded string.
 */
function arrayBufferToString(buffer: ArrayBuffer): string {
	const decoder = new TextDecoder('utf-8');
	return decoder.decode(buffer);
}

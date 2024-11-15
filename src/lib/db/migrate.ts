import { readDir, readTextFile } from '@tauri-apps/plugin-fs';
import { resourceDir } from '@tauri-apps/api/path';
import { sqlite } from './database';

/**
 * Executes database migrations.
 *
 * @returns A promise that resolves when the migrations are complete.
 */
export async function migrate() {
	const resourcePath = await resourceDir();
	const files = await readDir(`${resourcePath}/migrations`);
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

	await sqlite.execute(migrationTableCreate, []).catch((error) => {
		console.error('Failed to create migration table:', error);
	});

	for (const migration of migrations) {
		const hash = migration.name?.replace('.sql', '');

		const dbMigrations = (await sqlite.select(
			/*sql*/ `SELECT id, hash, created_at FROM "__drizzle_migrations" ORDER BY created_at DESC`
		)) as unknown as { id: number; hash: string; created_at: number }[];

		const hasBeenRun = (hash: string) =>
			dbMigrations.find((dbMigration) => {
				return dbMigration.hash === hash;
			});

		if (hash && hasBeenRun(hash) === undefined) {
			const sql = await readTextFile(`${resourcePath}/migrations/${migration.name}`);

			await sqlite.execute(sql, []).catch((error) => {
				console.error(`Failed to execute migration ${hash}:`, error);
			});
			await sqlite
				.execute(/*sql*/ `INSERT INTO "__drizzle_migrations" (hash, created_at) VALUES ($1, $2)`, [
					hash,
					Date.now()
				])
				.catch((error) => {
					console.error(`Failed to insert migration ${hash}:`, error);
				});
		}
	}

	console.info('Migrations complete');
	return Promise.resolve();
}

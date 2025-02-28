import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { appDataDir, join } from '@tauri-apps/api/path';
import { BaseDirectory, copyFile, exists, mkdir } from '@tauri-apps/plugin-fs';
import { error } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm/sql';

export const backup = {
	create: async () => {
		try {
			const folderExists = await exists('backups', { baseDir: BaseDirectory.AppData });
			if (!folderExists) {
				await mkdir('backups', {
					baseDir: BaseDirectory.AppData,
					recursive: true
				});
			}
		} catch (err) {
			error(`Error checking or creating directory: ${err}`);
			return;
		}

		const dbPath = await join(await appDataDir(), `${import.meta.env.DEV ? 'DEV-' : ''}sqlite.db`);
		const backupPath = await join(
			await appDataDir(),
			await join(
				'backups',
				`${import.meta.env.DEV ? 'DEV-' : 'DB'}_${new Date().toISOString().replace(/:/g, '-')}.db`
			)
		);

		await copyFile(dbPath, backupPath);

		await db
			.insert(schema.backups)
			.values({ path: backupPath })
			.catch((err) => {
				error(`Create Backup: ` + err);
			});
	},
	get: async () => {
		return (await db.select().from(schema.backups).limit(1))[0];
	},
	getAll: async () => {
		return await db.select().from(schema.backups).orderBy(schema.backups.createdAt);
	},
	delete: async (id: number) => {
		return await db
			.delete(schema.backups)
			.where(eq(schema.backups.id, id))
			.catch((err) => {
				error(`Delete Backup: ` + err);
				return false;
			})
			.finally(() => {
				return true;
			});
	}
};

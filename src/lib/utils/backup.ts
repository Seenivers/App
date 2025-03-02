import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { appDataDir, join } from '@tauri-apps/api/path';
import { BaseDirectory, copyFile, exists, mkdir } from '@tauri-apps/plugin-fs';
import { error } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm/sql';

export const backup = {
	create: async () => {
		try {
			const appDir = await appDataDir();
			const backupDir = await join(appDir, 'backups');

			// Backup-Ordner erstellen, falls nicht vorhanden
			if (!(await exists(backupDir, { baseDir: BaseDirectory.AppData }))) {
				await mkdir(backupDir, { baseDir: BaseDirectory.AppData, recursive: true });
			}

			const timestamp = new Date().toISOString().replace(/:/g, '-');
			const isDev = import.meta.env.DEV ? 'DEV-' : '';
			const dbPath = await join(appDir, `${isDev}sqlite.db`);
			const backupPath = await join(backupDir, `${isDev}${timestamp}.db`);

			// Backup-Datei kopieren
			await copyFile(dbPath, backupPath);

			// Backup in der DB speichern
			await db.insert(schema.backups).values({ path: backupPath });

			return true;
		} catch (err) {
			error(`Create Backup: ${err}`);
			return false;
		}
	},

	get: async () => {
		try {
			return (await db.select().from(schema.backups).limit(1))[0] ?? null;
		} catch (err) {
			error(`Get Backup: ${err}`);
			return null;
		}
	},

	getAll: async () => {
		try {
			return await db.select().from(schema.backups).orderBy(schema.backups.createdAt);
		} catch (err) {
			error(`Get All Backups: ${err}`);
			return [];
		}
	},

	delete: async (id: number) => {
		try {
			await db.delete(schema.backups).where(eq(schema.backups.id, id));
			return true;
		} catch (err) {
			error(`Delete Backup: ${err}`);
			return false;
		}
	},

	restore: async (id: number) => {
		try {
			const data = await backup.get(id);

			if (!data) {
				error(`Restore Backup: No backup found for ID ${id}`);
				return false;
			}

			// Backup-Datei überprüfen
			if (!(await exists(data.path, { baseDir: BaseDirectory.AppData }))) {
				await backup.delete(id);
				error(`Restore Backup: File not found`);
				return false;
			}

			const appDir = await appDataDir();
			const dbPath = await join(appDir, `${import.meta.env.DEV ? 'DEV-' : ''}sqlite.db`);

			// Backup-Datei kopieren
			await copyFile(data.path, dbPath);

			return true;
		} catch (err) {
			error(`Restore Backup: ${err}`);
			return false;
		}
	}
};

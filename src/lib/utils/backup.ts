import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { appDataDir, join } from '@tauri-apps/api/path';
import { BaseDirectory, copyFile, exists, mkdir, remove, readDir } from '@tauri-apps/plugin-fs';
import { error, info } from '@tauri-apps/plugin-log';
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

			// Backups validieren (bereinige fehlende oder ungenutzte Einträge)
			await backup.validateBackups();

			return true;
		} catch (err) {
			error(`Create Backup: ${err}`);
			return false;
		}
	},

	get: async (id: number) => {
		try {
			return (
				(await db.select().from(schema.backups).where(eq(schema.backups.id, id)).limit(1))[0] ??
				null
			);
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
			const data = await backup.get(id);

			if (!data) {
				error(`Delete Backup: No backup found for ID ${id}`);
				return false;
			}

			// Falls Datei existiert, löschen
			if (await exists(data.path, { baseDir: BaseDirectory.AppData })) {
				await remove(data.path, { baseDir: BaseDirectory.AppData });
			}

			// DB-Eintrag entfernen
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

			// Falls Datei nicht existiert, lösche den DB-Eintrag
			if (!(await exists(data.path, { baseDir: BaseDirectory.AppData }))) {
				error(`Restore Backup: File not found`);
				await backup.validateBackups();
				return false;
			}

			const appDir = await appDataDir();
			const dbPath = await join(appDir, `${import.meta.env.DEV ? 'DEV-' : ''}sqlite.db`);

			// Backup-Datei verschieben
			await copyFile(data.path, dbPath);
			await remove(data.path, { baseDir: BaseDirectory.AppData });

			return true;
		} catch (err) {
			error(`Restore Backup: ${err}`);
			return false;
		}
	},

	/**
	 * 🔍 Überprüft gespeicherte Backups:
	 * - Löscht DB-Einträge, wenn die Datei fehlt.
	 * - Löscht nicht referenzierte Backup-Dateien aus dem Dateisystem.
	 */
	validateBackups: async () => {
		try {
			const appDir = await appDataDir();
			const backupDir = await join(appDir, 'backups');

			// Falls der Backup-Ordner nicht existiert, beende die Funktion
			if (!(await exists(backupDir, { baseDir: BaseDirectory.AppData }))) {
				return;
			}

			// Alle gespeicherten Backups aus der DB abrufen
			const dbBackups = await backup.getAll();
			const dbBackupPaths = dbBackups.map((b) => b.path);

			// Alle Dateien im Backup-Ordner abrufen
			const fsBackupFiles = (await readDir(backupDir, { baseDir: BaseDirectory.AppData })).map(
				(entry) => entry.name
			);

			// 1️⃣ Falls ein Backup in der DB existiert, aber die Datei fehlt → Lösche den DB-Eintrag
			for (const dbBackup of dbBackups) {
				if (!(await exists(dbBackup.path, { baseDir: BaseDirectory.AppData }))) {
					await db.delete(schema.backups).where(eq(schema.backups.id, dbBackup.id));
					info(`🗑️ Gelöschter DB-Eintrag für fehlendes Backup: ${dbBackup.path}`);
				}
			}

			// 2️⃣ Falls eine Datei existiert, aber kein DB-Eintrag → Lösche die Datei
			for (const file of fsBackupFiles) {
				const filePath = await join(backupDir, file);
				if (!dbBackupPaths.includes(filePath)) {
					await remove(filePath, { baseDir: BaseDirectory.AppData });
					info(`🗑️ Gelöschte unreferenzierte Backup-Datei: ${filePath}`);
				}
			}
		} catch (err) {
			error(`Validate Backups: ${err}`);
		}
	}
};

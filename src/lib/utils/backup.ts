import { db, sqlite } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { appDataDir, join } from '@tauri-apps/api/path';
import { BaseDirectory, copyFile, exists, mkdir, remove, readDir } from '@tauri-apps/plugin-fs';
import { error, info } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm/sql';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

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
				error(get(_)('backup.idNotFound', { values: { id: id } }));
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
				error(get(_)('backup.idNotFound', { values: { id: id } }));
				return false;
			}

			sqlite.close(); // Schließe die aktuelle DB-Verbindung

			// Falls Datei nicht existiert, lösche den DB-Eintrag
			if (!(await exists(data.path, { baseDir: BaseDirectory.AppData }))) {
				error(get(_)('backup.fileNotFound', { values: { filePath: data.path } }));
				await backup.validateBackups();
				return false;
			}

			const appDir = await appDataDir();
			const dbPath = await join(appDir, `${import.meta.env.DEV ? 'DEV-' : ''}sqlite.db`);

			// Backup-Datei verschieben
			await copyFile(data.path, dbPath);

			window.location.reload(); // Lade die App neu

			return true;
		} catch (err) {
			error(`Restore Backup: ${err}`);
			return false;
		}
	},

	/**
	 * 🔍 Überprüft gespeicherte Backups:
	 * - Löscht DB-Einträge, wenn die Datei fehlt.
	 * - Nimmt Dateien, die existieren aber keinen DB-Eintrag haben, in die DB auf.
	 */
	validateBackups: async () => {
		try {
			const appDir = await appDataDir();
			const backupDir = await join(appDir, 'backups');

			// Falls der Backup-Ordner nicht existiert, beende die Funktion.
			if (!(await exists(backupDir, { baseDir: BaseDirectory.AppData }))) {
				return;
			}

			// Alle gespeicherten Backups aus der DB abrufen.
			let dbBackups = await backup.getAll();
			// In Prod: Filtere DB-Backups, sodass nur Einträge ohne "DEV-" berücksichtigt werden.
			if (!import.meta.env.DEV) {
				dbBackups = dbBackups.filter((b) => !b.path.includes('DEV-'));
			}
			const dbBackupPaths = dbBackups.map((b) => b.path);

			// Alle Dateien im Backup-Ordner abrufen.
			let fsBackupFiles = (await readDir(backupDir, { baseDir: BaseDirectory.AppData })).map(
				(entry) => entry.name
			);
			// In Prod: Filtere Dateien, sodass nur die ohne "DEV-" berücksichtigt werden.
			if (!import.meta.env.DEV) {
				fsBackupFiles = fsBackupFiles.filter((file) => !file.includes('DEV-'));
			}

			// 1️⃣ DB-Einträge löschen, wenn die Datei fehlt.
			for (const dbBackup of dbBackups) {
				if (!(await exists(dbBackup.path, { baseDir: BaseDirectory.AppData }))) {
					await db.delete(schema.backups).where(eq(schema.backups.id, dbBackup.id));
					info(get(_)('backup.deletedBackup', { values: { filePath: dbBackup.path.toString() } }));
				}
			}

			// 2️⃣ Für jede Datei im Backup-Ordner, die keinen DB-Eintrag hat, neuen DB-Eintrag erstellen.
			for (const file of fsBackupFiles) {
				const filePath = await join(backupDir, file);
				if (!dbBackupPaths.includes(filePath)) {
					await db.insert(schema.backups).values({ path: filePath });
					info(get(_)('backup.newBackup', { values: { filePath } }));
				}
			}

			return true;
		} catch (err) {
			error(`Validate Backups: ${err}`);
			return false;
		}
	}
};

export async function newDB() {
	if (!import.meta.env.DEV) return;
	await backup.create(); // Erstelle ein Backup der aktuellen DB
	sqlite.close(); // Schließe die aktuelle DB-Verbindung
	const appDir = await appDataDir();
	const dbPath = await join(appDir, `${import.meta.env.DEV ? 'DEV-' : ''}sqlite.db`);
	await remove(dbPath, { baseDir: BaseDirectory.AppData });
	window.location.reload(); // Lade die App neu
}

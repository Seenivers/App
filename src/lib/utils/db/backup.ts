import { sqlite } from '$lib/db/database';
import { appDataDir, join } from '@tauri-apps/api/path';
import {
	BaseDirectory,
	copyFile,
	exists,
	mkdir,
	remove,
	readDir,
	stat
} from '@tauri-apps/plugin-fs';

const IS_DEV = import.meta.env.DEV;
const DB_NAME = `${IS_DEV ? 'DEV-' : ''}sqlite.db`;
const BACKUP_PREFIX = IS_DEV ? 'DEV-' : '';

export interface BackupFile {
	name: string;
	path: string;
	size: number;
	createdAt: Date;
}

async function getBackupDir(): Promise<string> {
	const appDir = await appDataDir();
	const backupDir = await join(appDir, 'backups');

	if (!(await exists(backupDir, { baseDir: BaseDirectory.AppData }))) {
		await mkdir(backupDir, { baseDir: BaseDirectory.AppData, recursive: true });
	}

	return backupDir;
}

export const backup = {
	/**
	 * Erstellt ein neues Backup der aktuellen SQLite-DB
	 */
	create: async (): Promise<boolean> => {
		try {
			const appDir = await appDataDir();
			const backupDir = await getBackupDir();

			const timestamp = new Date().toISOString().replace(/:/g, '-');
			const dbPath = await join(appDir, DB_NAME);
			const backupPath = await join(backupDir, `${BACKUP_PREFIX}${timestamp}.db`);

			await copyFile(dbPath, backupPath);
			return true;
		} catch (err) {
			console.error(`Create Backup: ${err}`);
			return false;
		}
	},

	/**
	 * Gibt alle Backups aus dem Ordner zurück
	 */
	getAll: async (): Promise<BackupFile[]> => {
		try {
			const backupDir = await getBackupDir();
			let files = await readDir(backupDir, { baseDir: BaseDirectory.AppData });

			// In PROD keine DEV-Backups anzeigen
			if (!IS_DEV) {
				files = files.filter((f) => !f.name?.startsWith('DEV-'));
			}

			const backups: BackupFile[] = [];

			for (const file of files) {
				if (!file.name?.endsWith('.db')) continue;

				const filePath = await join(backupDir, file.name);
				const meta = await stat(filePath);

				backups.push({
					name: file.name,
					path: filePath,
					size: meta.size,
					createdAt: meta.birthtime ?? meta.mtime ?? new Date()
				});
			}

			// Neueste zuerst
			return backups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
		} catch (err) {
			console.error(`Get All Backups: ${err}`);
			return [];
		}
	},

	/**
	 * Löscht ein Backup anhand des Dateinamens
	 */
	delete: async (fileName: string): Promise<boolean> => {
		try {
			const backupDir = await getBackupDir();
			const filePath = await join(backupDir, fileName);

			if (!(await exists(filePath, { baseDir: BaseDirectory.AppData }))) {
				return false;
			}

			await remove(filePath, { baseDir: BaseDirectory.AppData });
			return true;
		} catch (err) {
			console.error(`Delete Backup: ${err}`);
			return false;
		}
	},

	/**
	 * Stellt ein Backup wieder her (überschreibt die DB)
	 */
	restore: async (fileName: string): Promise<boolean> => {
		try {
			const appDir = await appDataDir();
			const backupDir = await getBackupDir();

			const backupPath = await join(backupDir, fileName);
			const dbPath = await join(appDir, DB_NAME);

			if (!(await exists(backupPath, { baseDir: BaseDirectory.AppData }))) {
				return false;
			}

			sqlite.close();
			await copyFile(backupPath, dbPath);

			window.location.reload();
			return true;
		} catch (err) {
			console.error(`Restore Backup: ${err}`);
			return false;
		}
	}
};

export async function newDB() {
	if (!import.meta.env.DEV) return;
	await backup.create(); // Erstelle ein Backup der aktuellen DB
	sqlite.close(); // Schließe die aktuelle DB-Verbindung
	const appDir = await appDataDir();
	const dbPath = await join(appDir, 'DEV-sqlite.db');
	await remove(dbPath, { baseDir: BaseDirectory.AppData });
	window.location.reload(); // Lade die App neu
}

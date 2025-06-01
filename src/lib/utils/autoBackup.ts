import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { settings } from '$lib/stores.svelte';
import { desc } from 'drizzle-orm/sql';
import { backup } from './backup';

export async function autoBackup() {
	if (settings.backupInterval === 'manual') return;

	const latest = await db.query.backups.findFirst({
		orderBy: desc(schema.backups.createdAt)
	});

	// Kein Backup vorhanden → sofort erstellen
	if (!latest) {
		await backup.create();
		return;
	}

	const lastDate = new Date(latest.createdAt);
	let nextDate: Date = new Date(lastDate);

	switch (settings.backupInterval) {
		case 'daily':
			nextDate.setDate(lastDate.getDate() + 1);
			break;

		case 'weekly':
			nextDate.setDate(lastDate.getDate() + 7);
			break;

		case 'monthly':
			nextDate.setMonth(lastDate.getMonth() + 1);
			break;

		case 'onStartup':
			// immer einmal pro Start prüfen
			nextDate = new Date();
			break;

		default:
			// Fallback: sofort
			nextDate = new Date(0);
			break;
	}

	// Wenn das nächste Backup fällig ist, ausführen
	if (Date.now() >= nextDate.getTime()) {
		await backup.create();
	}
}

export async function cleanupBackups() {
	// 1. Alter: Backups löschen, die älter als erlaubt sind
	if (settings.backupConfig.maxAgeDays > 0) {
		const cutoffDate = new Date(
			Date.now() - settings.backupConfig.maxAgeDays * 24 * 60 * 60 * 1000
		);

		const tooOld = await db.query.backups.findMany({
			where(fields, operators) {
				return operators.lt(fields.createdAt, cutoffDate);
			}
		});

		for (const backupO of tooOld) {
			await backup.delete(backupO.id);
		}
	}

	// 2. Anzahl: Nur die x neuesten behalten
	if (settings.backupConfig.maxBackups > 0) {
		const all = await db.query.backups.findMany({
			orderBy: (fields) => desc(fields.createdAt)
		});

		const toDelete = all.slice(settings.backupConfig.maxBackups);
		for (const backupO of toDelete) {
			await backup.delete(backupO.id);
		}
	}

	// 3. Größe: Gesamtgröße überschreitet maxSizeMB
	if (settings.backupConfig.maxSizeMB > 0) {
		const backups = await db.query.backups.findMany({
			orderBy: (fields) => desc(fields.createdAt)
		});

		let totalSize = 0;
		const toDelete: typeof backups = [];

		for (const backup of backups) {
			totalSize += backup.size;
			if (totalSize > settings.backupConfig.maxSizeMB * 1024 * 1024) {
				toDelete.push(backup);
			}
		}

		for (const backupO of toDelete) {
			await backup.delete(backupO.id);
		}
	}
}

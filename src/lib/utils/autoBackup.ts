import { backup } from './backup';
import { settings } from '$lib/stores.svelte';

/**
 * Führt automatisch ein Backup durch, abhängig von den Einstellungen
 */
export async function autoBackup() {
	if (settings.backupInterval === 'manual') return;

	const allBackups = await backup.getAll();

	// Neueste Backup ermitteln
	const latest = allBackups.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];

	// Kein Backup vorhanden → sofort erstellen
	if (!latest) {
		await backup.create();
		return;
	}

	const lastDate = latest.createdAt;
	let nextDate = new Date(lastDate);

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

	// Backup fällig → erstellen
	if (Date.now() >= nextDate.getTime()) {
		await backup.create();
	}
}

/**
 * Bereinigt alte Backups nach Alter, Anzahl und Gesamtgröße
 */
export async function cleanupBackups() {
	const allBackups = (await backup.getAll()).sort(
		(a, b) => b.createdAt.getTime() - a.createdAt.getTime()
	);

	// 1️⃣ Alter: Backups löschen, die älter als erlaubt sind
	if (settings.backupConfig.maxAgeDays > 0) {
		const cutoff = new Date(Date.now() - settings.backupConfig.maxAgeDays * 24 * 60 * 60 * 1000);
		for (const b of allBackups) {
			if (b.createdAt < cutoff) {
				await backup.delete(b.name);
			}
		}
	}

	// 2️⃣ Anzahl: Nur die x neuesten behalten
	if (settings.backupConfig.maxBackups > 0) {
		const toDelete = allBackups.slice(settings.backupConfig.maxBackups);
		for (const b of toDelete) {
			await backup.delete(b.name);
		}
	}

	// 3️⃣ Größe: Gesamtgröße überschreitet maxSizeMB
	if (settings.backupConfig.maxSizeMB > 0) {
		let totalSize = 0;
		for (const b of allBackups) {
			totalSize += b.size;
			if (totalSize > settings.backupConfig.maxSizeMB * 1024 * 1024) {
				await backup.delete(b.name);
				totalSize -= b.size; // Nach Löschen Größe anpassen
			}
		}
	}
}

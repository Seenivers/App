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

import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error, warn, info } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm';

async function createDefaultSettings(retries = 5) {
	for (let attempt = 1; attempt <= retries; attempt++) {
		const language = navigator.language.substring(0, 2) ?? 'en';
		const defaultSettings: typeof schema.settings.$inferInsert = { id: 1, language };

		info(
			`Versuch ${attempt}/${retries}: Erstelle Default-Settings ` + JSON.stringify(defaultSettings)
		);

		try {
			await db.insert(schema.settings).values(defaultSettings);
		} catch (err) {
			warn(`Einfügen fehlgeschlagen (evtl. Duplikat oder Race Condition): ` + err);
			// kein Problem – es wird trotzdem unten getestet
		}

		const result = (await db.select().from(schema.settings).limit(1))[0];
		if (result !== undefined) {
			info('Settings erfolgreich erstellt/gelesen: ' + JSON.stringify(result));
			return result;
		}

		warn('Noch keine Settings gefunden, warte 1 Sekunde…');
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	error('Alle Versuche fehlgeschlagen. Versuche Migration...');
	try {
		const resultAfterMigrate = (await db.select().from(schema.settings).limit(1))[0];
		if (resultAfterMigrate !== undefined) {
			info('Settings nach Migration gefunden: ' + JSON.stringify(resultAfterMigrate));
			return resultAfterMigrate;
		}
	} catch (err) {
		error('Migration fehlgeschlagen: ' + err);
	}

	error('Konnte Settings nicht erstellen. Seite wird neu geladen.');
	location.reload();
	throw new Error('Unrecoverable settings creation failure');
}

export const settingsDB = {
	/** Holt die gespeicherten Settings (erstellt Standardwerte, falls nicht vorhanden) */
	get: async () =>
		(await db.query.settings.findFirst({ where: eq(schema.settings.id, 1) })) ??
		(await createDefaultSettings()),

	/** Aktualisiert bestehende Settings */
	update: async (data: Partial<typeof schema.settings.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;

		try {
			await db.update(schema.settings).set(data).where(eq(schema.settings.id, 1));
		} catch (err) {
			error(`Update Settings: ${err}`);
		}
	}
};

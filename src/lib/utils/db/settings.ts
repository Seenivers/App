import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm';

async function createDefaultSettings() {
	const language = navigator.language.substring(0, 2);
	const defaultSettings: typeof schema.settings.$inferInsert = { id: 1, language };

	await db.insert(schema.settings).values(defaultSettings);
	return (await db.select().from(schema.settings).limit(1))[0];
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

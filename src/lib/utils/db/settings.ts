import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error, warn, info } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm';

async function createDefaultSettings(retries = 5) {
	for (let attempt = 1; attempt <= retries; attempt++) {
		const language = navigator.language.substring(0, 2) ?? 'en';
		const defaultSettings: typeof schema.settings.$inferInsert = { id: 1, language };

		info(
			`Attempt ${attempt}/${retries}: Creating default settings ` + JSON.stringify(defaultSettings)
		);

		try {
			await db.insert(schema.settings).values(defaultSettings);
		} catch (err) {
			warn(`Insert failed (possibly duplicate or race condition): ` + err);
			// No problem — will be tested again below
		}

		const result = (await db.select().from(schema.settings).limit(1))[0];
		if (result !== undefined) {
			info('Settings successfully created/read: ' + JSON.stringify(result));
			return result;
		}

		warn('No settings found yet, waiting 1 second…');
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	error('All attempts failed. Trying migration...');
	try {
		const resultAfterMigrate = (await db.select().from(schema.settings).limit(1))[0];
		if (resultAfterMigrate !== undefined) {
			info('Settings found after migration: ' + JSON.stringify(resultAfterMigrate));
			return resultAfterMigrate;
		}
	} catch (err) {
		error('Migration failed: ' + err);
	}

	error('Could not create settings. Reloading page.');
	location.reload();
	throw new Error('Unrecoverable settings creation failure');
}

export const settingsDB = {
	/** Retrieves the saved settings (creates default values if not existing) */
	get: async () =>
		(await db.query.settings.findFirst({ where: eq(schema.settings.id, 1) })) ??
		(await createDefaultSettings()),
	/** Updates existing settings */
	update: async (data: Partial<typeof schema.settings.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;
		try {
			await db.update(schema.settings).set(data).where(eq(schema.settings.id, 1));
		} catch (err) {
			error(`Update settings: ${err}`);
		}
	}
};

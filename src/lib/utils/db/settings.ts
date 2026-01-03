import { db } from '$lib/db/database';
import { settings } from '$lib/db/schema';
import { eq } from 'drizzle-orm';

async function createDefaultSettings(retries = 5) {
	for (let attempt = 1; attempt <= retries; attempt++) {
		const language = navigator.language.substring(0, 2) ?? 'en';
		const defaultSettings: typeof settings.$inferInsert = { id: 1, language };

		console.info(
			`Attempt ${attempt}/${retries}: Creating default settings ` + JSON.stringify(defaultSettings)
		);

		try {
			await db.insert(settings).values(defaultSettings);
		} catch (err) {
			console.warn(`Insert failed (possibly duplicate or race condition): ` + err);
			// No problem — will be tested again below
		}

		const result = (await db.select().from(settings).limit(1))[0];
		if (result !== undefined) {
			console.info('Settings successfully created/read: ' + JSON.stringify(result));
			return result;
		}

		console.warn('No settings found yet, waiting 1 second…');
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	console.error('All attempts failed. Trying migration...');
	try {
		const resultAfterMigrate = (await db.select().from(settings).limit(1))[0];
		if (resultAfterMigrate !== undefined) {
			console.info('Settings found after migration: ' + JSON.stringify(resultAfterMigrate));
			return resultAfterMigrate;
		}
	} catch (err) {
		console.error('Migration failed: ' + err);
	}

	console.error('Could not create settings. Reloading page.');
	location.reload();
	throw new Error('Unrecoverable settings creation failure');
}

export const settingsDB = {
	/** Retrieves the saved settings (creates default values if not existing) */
	get: async (): Promise<typeof settings.$inferSelect> =>
		(await db.query.settings.findFirst({ where: eq(settings.id, 1) })) ??
		(await createDefaultSettings()),
	/** Updates existing settings */
	update: async (data: Partial<typeof settings.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;
		try {
			await db.update(settings).set(data).where(eq(settings.id, 1));
		} catch (err) {
			console.error(`Update settings: ${err}`);
		}
	}
};

import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { error, warn, info } from '@tauri-apps/plugin-log';
import { eq } from 'drizzle-orm';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

async function createDefaultSettings(retries = 5) {
	for (let attempt = 1; attempt <= retries; attempt++) {
		const language = navigator.language.substring(0, 2) ?? 'en';
		const defaultSettings: typeof schema.settings.$inferInsert = { id: 1, language };

		info(get(_)('settings.createAttempt', { values: { attempt, retries } }));

		try {
			await db.insert(schema.settings).values(defaultSettings);
		} catch (err) {
			warn(get(_)(`settings.insertFailed`, { values: { error: `${err}` } }));
		}

		const result = (await db.select().from(schema.settings).limit(1))[0];
		if (result !== undefined) {
			info(get(_)('settings.createdOrRead') + JSON.stringify(result));
			return result;
		}

		warn(get(_)('settings.noSettingsWait'));
		await new Promise((resolve) => setTimeout(resolve, 1000));
	}

	error(get(_)('settings.allAttemptsFailed'));
	try {
		const resultAfterMigrate = (await db.select().from(schema.settings).limit(1))[0];
		if (resultAfterMigrate !== undefined) {
			info(`${get(_)('settings.foundAfterMigration')}: ` + JSON.stringify(resultAfterMigrate));
			return resultAfterMigrate;
		}
	} catch (err) {
		error(get(_)('settings.migrationFailed', { values: { error: `${err}` } }));
	}

	error(get(_)('settings.reloadPage'));
	location.reload();
	throw new Error('Unrecoverable settings creation failure');
}

export const settingsDB = {
	get: async () =>
		(await db.query.settings.findFirst({ where: eq(schema.settings.id, 1) })) ??
		(await createDefaultSettings()),

	/** Aktualisiert bestehende Settings */
	update: async (data: Partial<typeof schema.settings.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;

		try {
			await db.update(schema.settings).set(data).where(eq(schema.settings.id, 1));
		} catch (err) {
			error(get(_)('settings.updateFailed', { values: { error: `${err}` } }));
		}
	}
};

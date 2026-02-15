import { db } from '$lib/db/database';
import {
	collections as schemaCollection,
	movies as schemaMovie,
	serie as schemaSerie
} from '$lib/db/schema';
import { isNotNull } from 'drizzle-orm';

export async function loadBatch() {
	const [movies, series, collections] = await Promise.all([
		db.select().from(schemaMovie).where(isNotNull(schemaMovie.path)),
		db.select().from(schemaSerie).where(isNotNull(schemaSerie.path)),
		db.select().from(schemaCollection)
	]);

	return [
		...movies.map((m) => ({ ...m, type: 'movie' as const })),
		...series.map((s) => ({ ...s, type: 'series' as const })),
		...collections.map((s) => ({ ...s, type: 'collection' as const }))
	];
}

import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { db } from '$lib/db/database';
import { eq } from 'drizzle-orm';
import { schema } from '$lib/db/schema';
import { exists } from '@tauri-apps/plugin-fs';

export const load = (async ({ url }) => {
	const id: number = (() => {
		const idParam = url.searchParams.get('id');
		if (!idParam) {
			throw error(400, 'ID must be provided');
		}
		const parsedId = parseInt(idParam, 10);
		if (isNaN(parsedId)) {
			throw error(400, 'ID must be a valid number');
		}
		return parsedId;
	})();

	// Daten des Films laden
	const movieData = (await db.select().from(schema.movies).where(eq(schema.movies.id, id)))[0];

	if (!movieData) {
		throw error(404, 'Movie not found in the database');
	}

	return { id, movieData };
}) satisfies PageLoad;

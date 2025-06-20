import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { eq } from 'drizzle-orm';

export const load = (async () => {
	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	const { db } = await import('$lib/db/database');
	const { schema } = await import('$lib/db/schema');

	const movie = await db.select().from(schema.movies).where(eq(schema.movies.wantsToWatch, true));
	const serie = await db.select().from(schema.serie).where(eq(schema.serie.wantsToWatch, true));

	return { movie, serie };
}) satisfies PageLoad;

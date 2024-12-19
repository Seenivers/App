import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { browser } from '$app/environment';

function parseId(url: URL): number {
	const idParam = url.searchParams.get('id');
	if (!idParam) {
		throw error(400, 'ID must be provided');
	}
	const parsedId = parseInt(idParam, 10);
	if (isNaN(parsedId)) {
		throw error(400, 'ID must be a valid number');
	}
	return parsedId;
}

export const load = (async ({ url }) => {
	const id = parseId(url); // ID validieren und parsen

	if (!browser) {
		throw error(500, 'This operation is only supported in the browser');
	}

	const module = await import('$lib/db/funktion');
	const fs = await import('@tauri-apps/plugin-fs');

	const result = await module.getCollection(id);
	if (!result) {
		throw error(404, 'Collection not found');
	}

	// Nur relevante Daten zurückgeben
	return { id, result };
}) satisfies PageLoad;

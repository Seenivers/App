import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';
import { postSession } from '$lib/utils/tmdb';

export const load = (async ({ url }) => {
	const token = url.searchParams.get('request_token');
	const approved = url.searchParams.get('approved');
	console.log(`Token: ${token}, Approved: ${approved}`);

	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	if (!token) {
		error(400, 'Missing request_token parameter');
	}

	if (!approved) {
		error(403, 'Authentication not approved');
	}

	const session = await postSession(token);
	console.log(session);

	if (!session.success) {
		error(500, 'Failed to create session with TMDB');
	}

	console.log(`Session created successfully: ${JSON.stringify(session)}`);

	return { session };
}) satisfies PageLoad;

import { error } from '@sveltejs/kit';
import type { PageLoad } from './$types';

export const load = (({ url }) => {
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

	return { id };
}) satisfies PageLoad;

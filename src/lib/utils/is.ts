import { extensions } from '$lib';
import type { movies, collections, serie } from '$lib/db/schema';

export function isMovieEntry(
	item:
		| string
		| typeof movies.$inferSelect
		| typeof collections.$inferSelect
		| typeof serie.$inferSelect
): item is typeof movies.$inferSelect {
	if (typeof item === 'string') {
		const fileExtension = item.split('.').pop()?.toLowerCase() ?? '';
		return extensions.includes(fileExtension);
	}

	return 'tmdb' in item && item.tmdb !== undefined && 'title' in item.tmdb;
}

import { schema } from '$lib/db/schema';
import { extensions } from '$lib';

export function isMovieEntry(
	item:
		| string
		| typeof schema.movies.$inferSelect
		| typeof schema.collections.$inferSelect
		| typeof schema.serie.$inferSelect
): item is typeof schema.movies.$inferSelect {
	if (typeof item === 'string') {
		const fileExtension = item.split('.').pop()?.toLowerCase() ?? '';
		return extensions.includes(fileExtension);
	}

	return 'tmdb' in item && 'title' in item.tmdb;
}

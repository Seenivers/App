import { getMovie, tmdb } from '$lib/tmdb';
import { settings } from '$lib/db/funktion';
import type { Movie } from '$lib/types/movie';

export function buttonClass(searchStatus: string) {
	switch (searchStatus) {
		case 'notStarted':
			return 'btn-neutral';
		case 'searching':
			return 'btn-primary';
		case 'notFound':
			return 'btn-error';
		case 'foundOne':
			return 'btn-success';
		case 'foundMultiple':
			return 'btn-warning';
		default:
			return 'btn-neutral';
	}
}

export function getIcon(searchStatus: string) {
	switch (searchStatus) {
		case 'notStarted':
			return '🔍'; // search icon
		case 'searching':
			return '⏳'; // loading icon
		case 'notFound':
			return '❌'; // not found icon
		case 'foundOne':
			return '✅'; // found one icon
		case 'foundMultiple':
			return '⚠️'; // multiple results icon
		default:
			return '🔍'; // default to search icon
	}
}

/**
 * Suche Filme in der TMDB basierend auf einem Namen und optionalen Parametern.
 */
export async function searchMovies(name: string, primaryReleaseYear?: string | number) {
	return tmdb.search.movie(name, {
		language: settings.language,
		includeAdult: settings.adult,
		primaryReleaseYear: primaryReleaseYear?.toString(),
		page: 1
	});
}

/**
 * Holt einen Film von TMDB basierend auf seiner ID.
 */
export async function getMovieDetails(id: number): Promise<Movie | undefined> {
	return await getMovie(id, settings.language);
}

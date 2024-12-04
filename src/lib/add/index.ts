import { getMovie } from '$lib/tmdb';
import { settings } from '$lib/db/funktion';
import type { Movie } from '$lib/types/movie';
import { seeniversURL } from '$lib';
import type { Search, Movie as SearchMovie } from '$lib/types/searchMovie';
import { fetch } from '@tauri-apps/plugin-http';

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
			return '❓'; // default to search icon
	}
}

/**
 * Suche Filme in der TMDB basierend auf einem Namen und optionalen Parametern.
 */
export async function searchMovies(
	name: string,
	primaryReleaseYear?: string | number,
	page = 1
): Promise<Search<SearchMovie>> {
	const url = new URL(seeniversURL + '/api/movie/search');
	url.searchParams.append('name', name);
	url.searchParams.append('language', settings.language);
	url.searchParams.append('includeAdult', settings.adult.toString());
	url.searchParams.append('primaryReleaseYear', primaryReleaseYear?.toString() ?? '');
	url.searchParams.append('page', page.toString());

	const result = await fetch(url.toString());

	return (await result.json()) as Search<SearchMovie>;
}

/**
 * Holt einen Film von TMDB basierend auf seiner ID.
 */
export async function getMovieDetails(id: number): Promise<Movie | undefined> {
	return await getMovie(id, settings.language);
}

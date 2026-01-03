import { searchList } from '$lib/stores.svelte';
import type { SearchStatus } from '$lib/types/add';
import { online } from 'svelte/reactivity/window';
import { updateSearchStatus } from './utils';
import * as tmdb from '$lib/utils/tmdb';

export async function searchMediaStatus(i: number) {
	if (!online.current) {
		updateSearchStatus(i, 'notFound');
		return;
	}

	updateSearchStatus(i, 'searching');

	const entry = searchList[i];
	const { fileName, primaryReleaseYear } = entry.options;
	const page = entry.search?.page ?? 1;

	try {
		const searchResults =
			entry.mediaType === 'movie'
				? await tmdb.searchMovies(fileName, primaryReleaseYear, page)
				: await tmdb.searchTv(fileName, primaryReleaseYear, page);

		let status: SearchStatus;
		let results = [...(entry.search?.results ?? []), ...searchResults.results];

		if (searchResults.results.length === 1) {
			status = 'waitForDownloading';
			entry.options.id = searchResults.results[0].id;
		} else if (searchResults.results.length > 1) {
			status = 'foundMultiple';
		} else {
			status = 'notFound';
			results = [];
		}

		searchList[i] = {
			...entry,
			search: {
				...entry.search,
				results,
				page: searchResults.page,
				total_results: searchResults.total_results,
				total_pages: searchResults.total_pages
			},
			status
		};
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : `Unbekannter Fehler: ${err}`;
		console.error('Fehler bei der Suche: ' + errorMessage);

		searchList[i] = {
			...searchList[i],
			search: {
				...searchList[i].search,
				results: []
			},
			status: 'notFound'
		};
	}
}

import { searchList } from '$lib/stores.svelte';
import type { SearchStatus } from '$lib/types/add';
import { online } from 'svelte/reactivity/window';
import { updateSearchStatus } from './utils';
import { api } from '$lib/trpc';
import { getLocale } from '$lib/paraglide/runtime';

export async function searchMediaStatus(i: number) {
	if (!online.current) {
		updateSearchStatus(i, 'notFound');
		return;
	}

	updateSearchStatus(i, 'searching');

	const entry = searchList[i];
	const { fileName, primaryReleaseYear } = entry.options;
	const page = entry.search?.page ?? 1;
	const numericYear = primaryReleaseYear ? Number(primaryReleaseYear) : undefined;

	try {
		if (entry.mediaType === 'movie') {
			const searchResults = await api.media.searchMovies.query({
				query: fileName,
				page,
				year: numericYear,
				language: getLocale()
			});

			const results = [...(entry.search?.results ?? []), ...searchResults.results];

			let status: SearchStatus;

			if (searchResults.results.length === 1) {
				status = 'waitForDownloading';
				entry.options.id = searchResults.results[0].id;
			} else if (searchResults.results.length > 1) {
				status = 'foundMultiple';
			} else {
				status = 'notFound';
			}

			searchList[i] = {
				...entry,
				search: {
					...searchResults,
					results
				},
				status
			};
		} else {
			const searchResults = await api.media.searchTv.query({
				query: fileName,
				page,
				year: numericYear,
				language: getLocale()
			});

			const results = [...(entry.search?.results ?? []), ...searchResults.results];

			let status: SearchStatus;

			if (searchResults.results.length === 1) {
				status = 'waitForDownloading';
				entry.options.id = searchResults.results[0].id;
			} else if (searchResults.results.length > 1) {
				status = 'foundMultiple';
			} else {
				status = 'notFound';
			}

			searchList[i] = {
				...entry,
				search: {
					...searchResults,
					results
				},
				status
			};
		}
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

import { searchList } from '$lib/stores.svelte';
import type { SearchStatus } from '$lib/types/add';
import { online } from 'svelte/reactivity/window';
import { updateSearchStatus } from './utils';
import * as tmdb from '$lib/utils/tmdb';
import { error } from '@tauri-apps/plugin-log';

export async function searchMediaStatus(i: number) {
	// Prüfe die Internetverbindung
	if (!online.current) {
		updateSearchStatus(i, 'notFound');
		return;
	}

	updateSearchStatus(i, 'searching');

	const { fileName, primaryReleaseYear } = searchList[i].options;
	const page = searchList[i].search?.page || 1;

	try {
		// Bestimme die richtige TMDB-Suchfunktion basierend auf `mediaType`
		const search =
			searchList[i].mediaType === 'movie'
				? await tmdb.searchMovies(fileName, primaryReleaseYear, page)
				: await tmdb.searchTv(fileName, primaryReleaseYear, page);

		let status: SearchStatus;
		let results = [...(searchList[i].search?.results || []), ...search.results];

		if (search.results.length === 1) {
			// Genau ein Ergebnis gefunden
			status = 'waitForDownloading';
			searchList[i].options.id = search.results[0].id;
		} else if (search.results.length > 1) {
			// Mehrere Ergebnisse gefunden
			status = 'foundMultiple';
		} else {
			// Keine Ergebnisse gefunden
			status = 'notFound';
			results = [];
		}

		// Gemeinsame Eigenschaften setzen
		searchList[i] = {
			...searchList[i],
			search: {
				...searchList[i].search,
				results,
				page: search.page,
				total_results: search.total_results,
				total_pages: search.total_pages
			},
			status
		};
	} catch (err) {
		// Fehlerbehandlung
		const errorMessage =
			err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten: ' + err;
		error('Fehler bei der Suche: ' + errorMessage);

		// Fehlerstatus setzen
		searchList[i] = {
			...searchList[i],
			search: {
				...searchList[i].search,
				results: [] // Leeres Array, da keine Ergebnisse gefunden wurden
			},
			status: 'notFound'
		};
	}
}

import { searchList } from '$lib/stores.svelte';
import { online } from 'svelte/reactivity/window';
import { addNewMovies } from './movieAdder';
import { searchMediaStatus } from './search';
import { addNewSerie } from './serieAdder';
import type { SearchList } from '$lib/types/add';

let loading = false;

export async function load() {
	if (loading || !online.current) return;
	loading = true;

	const waitEntries = searchList.filter(({ status }) =>
		['waitForSearching', 'waitForDownloading'].includes(status)
	);

	const movieIds: { id: number; index: number }[] = [];

	// Index-Cache für schnelleren Zugriff
	const indexCache = new Map<SearchList, number>();
	for (const entry of waitEntries) {
		const idx = searchList.indexOf(entry);
		if (idx !== -1) indexCache.set(entry, idx);
	}

	// Parallele Suche für alle "waitForSearching"
	await Promise.all(
		waitEntries.map(async (entry) => {
			const index = indexCache.get(entry);
			if (index === undefined) return;

			if (!searchList[index].options.id && searchList[index].status === 'waitForSearching') {
				await searchMediaStatus(index);
			}
		})
	);

	// Sammle IDs für Filme und verarbeite Serien direkt
	for (const entry of waitEntries) {
		const index = indexCache.get(entry);
		if (index === undefined) continue;

		if (searchList[index].options.id && searchList[index].status === 'waitForDownloading') {
			if (searchList[index].mediaType === 'tv') {
				await addNewSerie({ id: searchList[index].options.id, index });
			} else {
				movieIds.push({ id: searchList[index].options.id, index });
			}
		}
	}

	if (movieIds.length > 0) {
		await addNewMovies(movieIds);
	}

	loading = false;

	// Erneutes Laden, falls noch ausstehende Einträge vorhanden sind
	if (
		searchList.some(({ status }) => ['waitForSearching', 'waitForDownloading'].includes(status))
	) {
		// Self-invoking async loop anstelle setTimeout
		(async () => {
			await new Promise((resolve) => setTimeout(resolve, 1000));
			await load();
		})();
	}
}

import { searchList } from '$lib/stores.svelte';
import { online } from 'svelte/reactivity/window';
import { addNewMovies } from './movieAdder';
import { searchMediaStatus } from './search';
import { addNewSerie } from './serieAdder';

let loading = false;

export async function load() {
	// Verhindere, dass die Funktion startet, wenn bereits geladen wird oder die Verbindung offline ist
	if (loading || !online.current) return;

	loading = true;

	// Filtere die Einträge mit Status "wait"
	const waitEntries = searchList.filter(({ status }) =>
		['waitForSearching', 'waitForDownloading'].includes(status)
	);

	const movieIds: { id: number; index: number }[] = [];

	for (const entry of waitEntries) {
		const entryIndex = searchList.findIndex((e) => e.options.path === entry.options.path);

		if (entryIndex !== -1) {
			// Starte die Filmsuche, falls noch keine ID vorhanden ist
			if (
				!searchList[entryIndex].options.id &&
				searchList[entryIndex].status === 'waitForSearching'
			) {
				await searchMediaStatus(entryIndex);
			}

			// Falls eine ID gefunden wurde und der Status "waitForDownloading" ist, füge sie zur Liste hinzu
			if (
				searchList[entryIndex].options.id &&
				searchList[entryIndex].status === 'waitForDownloading'
			) {
				if (searchList[entryIndex].mediaType === 'tv') {
					await addNewSerie({ id: searchList[entryIndex].options.id, index: entryIndex });
				} else {
					movieIds.push({ id: searchList[entryIndex].options.id, index: entryIndex });
				}
			}
		}
	}

	// Falls IDs vorhanden sind, lade die Filme in einem Rutsch
	if (movieIds.length > 0) {
		await addNewMovies(movieIds);
	}

	// Setze den Ladezustand zurück, nachdem alle Einträge verarbeitet wurden
	loading = false;

	// Falls noch Filme im Status "waitForSearching" oder "waitForDownloading" sind, lade erneut
	if (
		searchList.some(({ status }) => ['waitForSearching', 'waitForDownloading'].includes(status))
	) {
		setTimeout(() => load(), 1000);
	}
}

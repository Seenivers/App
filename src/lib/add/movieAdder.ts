import { searchList } from '$lib/stores.svelte';
import { collection } from '$lib/utils/db/collection';
import { movie } from '$lib/utils/db/movie';
import { error } from '@tauri-apps/plugin-log';
import { online } from 'svelte/reactivity/window';
import { loadImages } from './imageLoader';
import { updateSearchStatus } from './utils';
import type { Movie } from '$lib/types/movie';
import * as tmdb from '$lib/utils/tmdb';

export async function addNewMovies(entries: { id: number; index: number }[]) {
	if (!entries?.length || !online.current) return;

	const uniqueEntries: { id: number; index: number }[] = [];

	for (const { id, index } of entries) {
		if (await movie.isIDUnique(id)) {
			uniqueEntries.push({ id, index });
		} else {
			movie.update(id, { path: searchList[index].options.path });
			updateSearchStatus(index, 'downloaded');
		}
	}

	// Falls alle Filme bereits vorhanden sind, beenden
	if (uniqueEntries.length === 0) return;

	// Status auf "downloading" setzen
	uniqueEntries.forEach(({ index }) => updateSearchStatus(index, 'downloading'));

	try {
		// Mehrere Filme abrufen
		const response: {
			movies?: { id: number; data: Movie }[];
			errors?: { id: number; error: string }[];
		} = await tmdb.getMovies(uniqueEntries.map((entry) => entry.id));

		const movies = response.movies ?? [];
		const errors = response.errors ?? [];

		// Erfolgreiche Filme speichern
		for (const movie of movies) {
			const entry = uniqueEntries.find((e) => e.id === movie.id);

			if (entry) {
				await addMovieToDatabase(movie.data, entry.index);
				updateSearchStatus(entry.index, 'downloaded');
			}
		}

		// Fehlerhafte Filme auf "notFound" setzen
		for (const { id } of errors) {
			const entry = uniqueEntries.find((e) => e.id === id);
			if (entry) updateSearchStatus(entry.index, 'notFound');
		}
	} catch (err) {
		// Falls die gesamte Anfrage fehlschlägt, alle Filme als "notFound" markieren
		uniqueEntries.forEach(({ index }) => updateSearchStatus(index, 'notFound'));
		error(
			`Fehler beim Abrufen der Filme: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
		);
	}
}

export async function addMovieToDatabase(result: Movie, index: number) {
	await movie.add({
		id: result.id,
		path: searchList[index].options.path,
		tmdb: result
	});

	if (
		result.belongs_to_collection?.id &&
		(await collection.isIDUnique(result.belongs_to_collection.id))
	) {
		const collectionResult = await tmdb.getCollection(result.belongs_to_collection.id);
		if (collectionResult) {
			await collection.add({ ...collectionResult });
		}
	}

	await loadImages(result);
}

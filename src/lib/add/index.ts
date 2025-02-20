import {
	addCollection,
	addMovie,
	isCollectionIDUnique,
	isMovieIDUnique,
	isPathUnique,
	settings
} from '$lib/db/funktion';
import { extensions } from '$lib';
import * as tmdb from '$lib/tmdb';
import { error } from '@tauri-apps/plugin-log';
import { image } from '$lib/image/image';
import type { SearchList, SearchStatus } from '$lib/types/add';
import { searchList } from '$lib/stores.svelte';
import { online } from 'svelte/reactivity/window';
import type { Movie } from '$lib/types/movie';
import { isMovie, updateSearchStatus } from './utils';

//#region ADD
/**
 * Fügt neue Filme zum Status hinzu, nachdem sie validiert wurden.
 * @param files - Die Liste der neuen Dateipfade, die verarbeitet werden sollen.
 */
export async function addNewFiles(files: string[]) {
	// Filtere und validiere die Dateien
	const validFiles = files.filter((file) => {
		const fileExtension = file.split('.').pop()?.toLowerCase(); // Extrahiere die Dateierweiterung
		return extensions.includes(fileExtension ?? ''); // Überprüfe, ob die Erweiterung gültig ist
	});

	if (validFiles.length === 0) {
		alert('Keine gültigen Dateien gefunden.');
		return;
	}

	// Filtere neue Dateien, die noch nicht im Status enthalten sind
	const newFiles = await filterNewFiles(validFiles);

	if (newFiles.length === 0) {
		alert('Keine neuen Filme zum Hinzufügen gefunden.');
		return;
	}

	// Füge neue Filme zum Status hinzu
	addNewFilesToStatus(newFiles);
}

/**
 * Filtert nur die Dateien, die nicht bereits im Status enthalten sind und einzigartig sind.
 *
 * @param files - Die Liste der zu überprüfenden Dateipfade.
 * @returns Ein Array von Dateipfaden, die einzigartig sind und noch nicht im Status enthalten sind.
 */
async function filterNewFiles(files: string[]) {
	// Erstelle ein Set für bereits existierende Pfade, um die Suche effizienter zu machen
	const existingPaths = new Set(searchList.map((item) => item.options.path));

	// Filtere die Dateien parallel
	const newFiles = await Promise.all(
		files.map(async (path) => {
			// Überprüfe, ob der Pfad einzigartig ist und noch nicht im Status enthalten
			const unique = await isPathUnique(path);
			return unique && !existingPaths.has(path) ? path : undefined;
		})
	);

	// Entferne `undefined` und gebe nur die einzigartigen Pfade zurück
	return newFiles.filter(Boolean) as string[];
}

/**
 * Fügt die neuen Dateien dem Status hinzu.
 *
 * @param newFiles - Die Liste der neuen Dateipfade, die dem Status hinzugefügt werden sollen.
 */
export function addNewFilesToStatus(newFiles: string[]) {
	const tempStatus: SearchList[] = newFiles.map((path) => {
		const name =
			path
				.split('\\')
				.pop()
				?.replace(/\.[^/.]+$/, '') ?? '';

		// Bereinigung des Dateinamens
		const fileName = name
			.split(/[.\s]+/)
			.filter((word) => !settings.keywords.some((k) => k.toLowerCase() === word.toLowerCase()))
			.join(' ');

		const yearMatch = /(\d{4})/.exec(fileName);
		const year = yearMatch ? yearMatch[1] : '';
		const cleanedFileName = fileName.replace(/\s*\(?\d{4}\)?\s*/g, '').trim();

		return {
			status: 'waitForSearching',
			mediaType: isMovie(path) ? 'movie' : 'tv',
			search: {
				page: 1,
				results: [],
				total_pages: 1,
				total_results: 0
			},
			options: {
				path,
				fileName: cleanedFileName || name,
				includeAdult: settings.adult,
				primaryReleaseYear: year
			}
		};
	});

	// Aktualisiere den Status nur einmal
	searchList.push(...tempStatus);
}
//#endregion

//#region SEARCH
export async function searchMovieStatus(i: number) {
	// Prüfe die Internetverbindung
	if (!online.current) {
		updateSearchStatus(i, 'notFound');
		return;
	}

	updateSearchStatus(i, 'searching');

	const { fileName, primaryReleaseYear } = searchList[i].options;
	const page = searchList[i].search?.page || 1;

	try {
		const search = await tmdb.searchMovies(fileName, primaryReleaseYear, page);

		let status: SearchStatus;
		let results = [...(searchList[i].search?.results || []), ...search.results];

		if (search.results.length === 1) {
			// Nur einen Film gefunden
			status = 'waitForDownloading';
			searchList[i].options.id = search.results[0].id;
		} else if (search.results.length > 1) {
			// Mehrere Filme gefunden
			status = 'foundMultiple';
		} else {
			// Keine Filme gefunden
			status = 'notFound';
			results = []; // Ergebnisse leeren
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
				results: [] // Leeres Array, da keine Filme gefunden wurden
			},
			status: 'notFound'
		};
	}
}
//#endregion

//#region ADD/DOWNLOAD
export async function addNewMovies(entries: { id: number; index: number }[]) {
	if (!entries || entries.length === 0) return;

	const uniqueEntries: { id: number; index: number }[] = [];

	for (const { id, index } of entries) {
		if (await isMovieIDUnique(id)) {
			uniqueEntries.push({ id, index });
		} else {
			updateSearchStatus(index, 'downloaded');
		}
	}

	// Falls alle Filme bereits vorhanden sind, beenden
	if (uniqueEntries.length === 0) return;

	// Prüfen, ob der Benutzer online ist
	if (!online.current) {
		uniqueEntries.forEach(({ index }) => updateSearchStatus(index, 'notFound'));
		return;
	}

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

async function addMovieToDatabase(result: Movie, index: number) {
	await addMovie({
		id: result.id,
		path: searchList[index].options.path,
		tmdb: result,
		updated: new Date()
	});

	if (
		result.belongs_to_collection?.id &&
		(await isCollectionIDUnique(result.belongs_to_collection.id))
	) {
		const collection = await tmdb.getCollection(result.belongs_to_collection.id);
		if (collection) {
			await addCollection({ ...collection, updated: new Date() });
		}
	}

	await loadImages(result);
}

async function loadImages(result: Movie) {
	if (result.poster_path) {
		await image(result.poster_path, 'posters', true);
	}

	if (result.backdrop_path) {
		await image(result.backdrop_path, 'backdrops', true);
	}

	const castImagePaths = result.credits.cast
		.map((actor) => actor.profile_path)
		.filter((path) => path != null);

	const imagesToLoad =
		settings.castImages === 0
			? castImagePaths.length
			: Math.min(settings.castImages, castImagePaths.length);

	for (let i = 0; i < imagesToLoad; i++) {
		const path = castImagePaths[i];
		await image(path, 'actors', true);
	}
}
//#endregion

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
import type { MovieSearchContext, MovieSearchStatus } from '$lib/types/add';
import { searchList } from '$lib/stores.svelte';
import { online } from 'svelte/reactivity/window';
import type { Movie } from '$lib/types/movie';

export function buttonClass(searchStatus: MovieSearchStatus) {
	switch (searchStatus) {
		case 'waitForSearching':
			return 'btn-neutral';
		case 'waitForDownloading':
			return 'btn-neutral';
		case 'searching':
			return 'btn-primary';
		case 'notFound':
			return 'btn-error';
		case 'foundMultiple':
			return 'btn-warning';
		case 'downloading':
			return 'btn-info';
		case 'downloaded':
			return 'btn-success';
		default:
			return 'btn-neutral';
	}
}

export function getIcon(searchStatus: MovieSearchStatus) {
	switch (searchStatus) {
		case 'waitForSearching':
			return '⏳'; // loading icon
		case 'waitForDownloading':
			return '⏳'; // loading icon
		case 'searching':
			return '🔍'; // search icon
		case 'notFound':
			return '❌'; // not found icon
		case 'foundMultiple':
			return '⚠️'; // multiple results icon
		case 'downloading':
			return '📥'; // downloading icon
		case 'downloaded':
			return '✅'; // found one icon
		default:
			return '❓'; // default to search icon
	}
}

//#region add Files
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
function addNewFilesToStatus(newFiles: string[]) {
	const tempStatus: MovieSearchContext[] = newFiles.map((path) => {
		const name =
			path
				.split('\\')
				.pop()
				?.replace(/\.[^/.]+$/, '') ?? '';
		const fileName = name
			.split(/[.\s]+/)
			.filter((word) => !settings.keywords.map((k) => k.toLowerCase()).includes(word.toLowerCase()))
			.join(' ');

		const yearMatch = /(\d{4})/.exec(fileName);
		const year = yearMatch ? yearMatch[1] : '';
		const cleanedFileName = fileName.replace(/\s*\(?\d{4}\)?\s*/g, '').trim();

		return {
			status: 'waitForSearching',
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

//#region search Movie
export async function searchMovieStatus(i: number) {
	// Prüfe die Internetverbindung
	if (!online.current) {
		updateMovieStatus(i, 'notFound');
		return;
	}

	updateMovieStatus(i, 'searching');

	const { fileName, primaryReleaseYear } = searchList[i].options;
	const page = searchList[i].search?.page || 1;

	try {
		const search = await tmdb.searchMovies(fileName, primaryReleaseYear, page);

		let status: MovieSearchStatus;
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

//#region add Movie
export async function addNewMovies(entries: { id: number; index: number }[]) {
	if (!entries || entries.length === 0) return;

	const uniqueEntries: { id: number; index: number }[] = [];

	for (const { id, index } of entries) {
		if (await isMovieIDUnique(id)) {
			uniqueEntries.push({ id, index });
		} else {
			updateMovieStatus(index, 'downloaded');
		}
	}

	// Falls alle Filme bereits vorhanden sind, beenden
	if (uniqueEntries.length === 0) return;

	// Prüfen, ob der Benutzer online ist
	if (!online.current) {
		uniqueEntries.forEach(({ index }) => updateMovieStatus(index, 'notFound'));
		return;
	}

	// Status auf "downloading" setzen
	uniqueEntries.forEach(({ index }) => updateMovieStatus(index, 'downloading'));

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
				updateMovieStatus(entry.index, 'downloaded');
			}
		}

		// Fehlerhafte Filme auf "notFound" setzen
		for (const { id } of errors) {
			const entry = uniqueEntries.find((e) => e.id === id);
			if (entry) updateMovieStatus(entry.index, 'notFound');
		}
	} catch (err) {
		// Falls die gesamte Anfrage fehlschlägt, alle Filme als "notFound" markieren
		uniqueEntries.forEach(({ index }) => updateMovieStatus(index, 'notFound'));
		error(
			`Fehler beim Abrufen der Filme: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
		);
	}
}

function updateMovieStatus(index: number, newState: MovieSearchStatus) {
	searchList[index].status = newState;
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

function handleDownloadError(err: unknown, id: number, index: number) {
	const message =
		err instanceof Error
			? `Fehler beim Hinzufügen des Films mit ID ${id}: ${err.message}`
			: `Unbekannter Fehler beim Hinzufügen des Films mit ID ${id}`;
	error(message);

	updateMovieStatus(index, 'notFound');
}
//#endregion

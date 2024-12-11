import {
	addCollection,
	addMovie,
	isCollectionIDUnique,
	isMovieIDUnique,
	isPathUnique,
	settings
} from '$lib/db/funktion';
import { castImages, seeniversURL } from '$lib';
import type { Search, Movie as SearchMovie } from '$lib/types/searchMovie';
import { fetch } from '@tauri-apps/plugin-http';
import { getCollection as getCollectionTmdb, getMovie as getMovieTmdb } from '$lib/tmdb';
import { error } from '@tauri-apps/plugin-log';
import { image } from '$lib/image';
import type { MovieSearchContext, MovieSearchState } from '$lib/types/add';
import type { schema } from '$lib/db/schema';
import { status } from '$lib/stores';
import { get } from 'svelte/store';

export function buttonClass(searchStatus: MovieSearchState) {
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

export function getIcon(searchStatus: MovieSearchState) {
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
		case 'downloading':
			return '📥'; // downloading icon
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
	url.searchParams.append('includeAdult', String(settings.adult));
	url.searchParams.append('primaryReleaseYear', primaryReleaseYear?.toString() ?? '');
	url.searchParams.append('page', page.toString());

	const result = await fetch(url.toString());

	return (await result.json()) as Search<SearchMovie>;
}

export function getValidFileNames(filePaths: string[], validExtensions: string[]) {
	const supportedExtensions = new Set(validExtensions.map((ext) => ext.toLowerCase()));

	return filePaths.filter((path) => {
		const fileExtension = path.split('.').pop()?.toLowerCase();
		return fileExtension && supportedExtensions.has(fileExtension);
	});
}

export async function addNewMovie(id: number, path: string) {
	// Überprüfen, ob der Benutzer online ist
	if (!window.navigator.onLine) {
		error('Sie sind nicht mit dem Internet verbunden.');
		return Promise.resolve();
	}

	if (!id) {
		error('Es muss eine valide ID angegeben werden.');
		return Promise.resolve();
	}

	// Hole die Filmdetails
	const result = await getMovieTmdb(id);

	if (await isMovieIDUnique(result.id)) {
		// Film zur DB hinzufügen
		await addMovie({ id, path, tmdb: result, updated: new Date() });

		// Posterbild laden, falls verfügbar
		if (result.poster_path) {
			await loadImageWithErrorHandling(result.poster_path, 'posters');
		}

		// Hintergrundbild laden, falls verfügbar
		if (result.backdrop_path) {
			await loadImageWithErrorHandling(result.backdrop_path, 'backdrops');
		}

		// Collection hinzufügen, falls vorhanden
		if (
			result.belongs_to_collection?.id &&
			(await isCollectionIDUnique(result.belongs_to_collection?.id))
		) {
			const collection = await getCollectionTmdb(result.belongs_to_collection.id);
			if (collection) {
				await addCollection({ ...collection, updated: new Date() });
			}
		}

		// Schauspieler-Bilder parallel laden, nur wenn Pfad vorhanden
		const castImagePaths = result.credits.cast
			.map((actor) => actor.profile_path)
			.filter((path) => path != null);

		// `castImages` bestimmen: 0 bedeutet alle Bilder laden
		const imagesToLoad =
			// @ts-expect-error castImages wird später über die Settings verarbeitet
			castImages === 0 ? castImagePaths.length : Math.min(castImages, castImagePaths.length);

		// Bilder für Schauspieler laden
		for (let i = 0; i < imagesToLoad; i++) {
			const path = castImagePaths[i];
			await loadImageWithErrorHandling(path, 'actors');
		}
	}

	return Promise.resolve();
}

// Hilfsfunktion zum Laden von Bildern mit Fehlerbehandlung
async function loadImageWithErrorHandling(
	path: string,
	folder: 'actors' | 'backdrops' | 'posters' | null
) {
	try {
		await image(path, folder, true);
	} catch (err) {
		error(`Fehler beim Laden von ${folder}-Bild: ${err}`);
	}
}

/**
 * Filtert nur die Dateien, die nicht bereits im Status enthalten sind und einzigartig sind.
 *
 * @param files - Die Liste der zu überprüfenden Dateipfade.
 * @param status - Der aktuelle Status, der bereits vorhandene Dateipfade enthält.
 * @returns Ein Array von Dateipfaden, die einzigartig sind und noch nicht im Status enthalten sind.
 */
export async function filterNewFiles(files: string[], status: MovieSearchContext[]) {
	// Filtere nur die Dateien, die nicht bereits im Status enthalten sind
	const newFiles = (
		await Promise.all(
			files.map(async (path) => {
				// Überprüfe, ob der Pfad einzigartig ist und noch nicht im Status enthalten
				const unique = await isPathUnique(path);
				const existsInStatus = status.some((item) => item.options.path === path);
				return unique && !existsInStatus ? path : null;
			})
		)
	).filter((path): path is string => path !== null);

	return newFiles;
}

/**
 * Fügt die neuen Dateien dem Status hinzu.
 *
 * @param newFiles - Die Liste der neuen Dateipfade, die dem Status hinzugefügt werden sollen.
 * @param status - Der aktuelle Status, in dem die neuen Dateien hinzugefügt werden.
 * @param settings - Die aktuellen Einstellungen (z. B. Keywords, Adult-Filter).
 */
export function addNewFilesToStatus(
	newFiles: string[],
	status: MovieSearchContext[],
	settings: typeof schema.settings.$inferSelect
) {
	newFiles.forEach((path) => {
		const name =
			path
				.split('\\')
				.pop()
				?.replace(/\.[^/.]+$/, '') || '';

		const fileName = name
			.split(/[.\s]+/)
			.filter((word) => {
				// Filtern von Keywords ohne async-Aktion
				return !settings.keywords.map((k) => k.toLowerCase()).includes(word.toLowerCase());
			})
			.join(' ');

		const yearMatch = fileName.match(/(\d{4})/);
		const year = yearMatch ? yearMatch[1] : '';
		const cleanedFileName = fileName.replace(/\s*\(\d{4}\)\s*|(\d{4})/g, '').trim();

		status.push({
			state: 'notStarted',
			results: [],
			options: {
				path,
				query: cleanedFileName || name,
				primaryReleaseYear: year,
				includeAdult: settings.adult,
				page: 1
			}
		});
	});
}

// Exportierte Funktion, um die Indizes der neuen Filme zu finden
export function findNewFileIndexes(newFiles: string[], status: MovieSearchContext[]): number[] {
	return status
		.map((movie, index) => (newFiles.includes(movie.options.path) ? index : -1))
		.filter((index) => index !== -1); // Nur Indexes der neuen Filme
}

export async function searchMovieStatus(
	i: number,
	modal: boolean,
	searchMovies: Function,
	addNewMovie: Function
) {
	// Prüfe die Internetverbindung
	if (!window.navigator.onLine) {
		error(
			'Sie sind nicht mit dem Internet verbunden oder es ist ein Fehler mit der API aufgetreten.'
		);
		status.update((currentStatus) => {
			currentStatus[i].state = 'notFound';
			return [...currentStatus]; // Rückgabe einer neuen Kopie, damit Svelte den Store erkennt
		});
		return;
	}

	status.update((currentStatus) => {
		currentStatus[i].state = 'searching';
		return [...currentStatus]; // Rückgabe einer neuen Kopie, damit Svelte den Store erkennt
	});

	const { query, primaryReleaseYear } = get(status)[i].options;

	try {
		// TMDB-Suche durchführen
		const result = (await searchMovies(query, primaryReleaseYear)).results;

		// Update status based on results
		status.update((currentStatus) => {
			if (result.length === 1) {
				currentStatus[i].results = result;
				currentStatus[i].state = 'foundOne';

				// Füge den Film nur hinzu, wenn der Benutzer keinen Film manuell ausgewählt hat
				if (!modal) {
					addNewMovie(result[0].id, currentStatus[i].options.path);
				}
			} else if (result.length > 1) {
				currentStatus[i].results = result;
				currentStatus[i].state = 'foundMultiple';
			} else {
				currentStatus[i].results = [];
				currentStatus[i].state = 'notFound';
			}
			return [...currentStatus]; // Rückgabe einer neuen Kopie
		});
	} catch (err) {
		// Fehlerbehandlung
		if (err instanceof Error) {
			error('Fehler bei der Suche: ' + err.message);
		} else {
			error('Ein unbekannter Fehler ist aufgetreten: ' + err); // Fallback, wenn es kein Error-Objekt ist
		}
		status.update((currentStatus) => {
			currentStatus[i].results = [];
			currentStatus[i].state = 'notFound';
			return [...currentStatus]; // Rückgabe einer neuen Kopie
		});
	}
}

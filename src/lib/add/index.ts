import {
	addCollection,
	addMovie,
	isCollectionIDUnique,
	isMovieIDUnique,
	isPathUnique,
	settings
} from '$lib/db/funktion';
import { castImages, extensions } from '$lib';
import * as tmdb from '$lib/tmdb';
import { error } from '@tauri-apps/plugin-log';
import { image } from '$lib/image/image';
import type { MovieSearchContext, MovieSearchStatus } from '$lib/types/add';
import { searchList } from '$lib/stores.svelte';
import { online } from 'svelte/reactivity/window';

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
let downloadingMovie = false; // Flag, um den laufenden Download zu überwachen
const downloadQueue: Array<{ id: number; index: number }> = []; // Warteschlange für Filme, die heruntergeladen werden müssen

export async function addNewMovie(id: number, index: number) {
	if (!id || !(await isMovieIDUnique(id))) return Promise.resolve();

	downloadQueue.push({ id, index });
	// Film zur Warteschlange hinzufügen, wenn kein Download läuft
	if (!downloadingMovie) {
		// Starte den Download-Prozess, wenn kein Download läuft
		processDownloadQueue();
	}

	return Promise.resolve();
}

function updateMovieStatus(index: number, newState: MovieSearchStatus) {
	searchList[index].status = newState;
}

async function processDownloadQueue() {
	// Überprüfen, ob der Benutzer online ist
	if (!online.current) return;

	// Wenn ein Download bereits läuft oder die Warteschlange leer ist, nichts tun
	if (downloadingMovie || downloadQueue.length === 0) return;

	// Nächsten Film aus der Warteschlange nehmen
	const nextMovie = downloadQueue.shift();
	if (!nextMovie) return;

	// Prüfe, ob der Film bereits heruntergeladen ist
	if (searchList[nextMovie.index].status !== 'waitForDownloading') return;

	// Status aktualisieren und Download starten
	downloadingMovie = true;
	updateMovieStatus(nextMovie.index, 'downloading');

	try {
		// Hole die Filmdetails
		const result = await tmdb.getMovie(nextMovie.id);

		if (await isMovieIDUnique(result.id)) {
			// Film zur Datenbank hinzufügen
			await addMovie({
				id: nextMovie.id,
				path: searchList[nextMovie.index].options.path,
				tmdb: result,
				updated: new Date()
			});

			// Collection hinzufügen, falls nicht vorhanden
			if (
				result.belongs_to_collection?.id &&
				(await isCollectionIDUnique(result.belongs_to_collection?.id))
			) {
				const collection = await tmdb.getCollection(result.belongs_to_collection.id);
				if (collection) {
					await addCollection({ ...collection, updated: new Date() });
				}
			}

			// Posterbild laden, falls verfügbar
			if (result.poster_path) {
				await image(result.poster_path, 'posters', true);
			}

			// Hintergrundbild laden, falls verfügbar
			if (result.backdrop_path) {
				await image(result.backdrop_path, 'backdrops', true);
			}

			// Schauspieler-Bilder parallel laden
			const castImagePaths = result.credits.cast
				.map((actor) => actor.profile_path)
				.filter((path) => path != null);

			// `castImages` bestimmen: 0 bedeutet alle Bilder laden
			const imagesToLoad =
				// @ts-expect-error castImages wird später über die Settings verarbeitet
				castImages === 0 ? castImagePaths.length : Math.min(castImages, castImagePaths.length);

			for (let i = 0; i < imagesToLoad; i++) {
				const path = castImagePaths[i];
				await image(path, 'actors', true);
			}
		}
	} catch (err: unknown) {
		if (err instanceof Error) {
			error(`Fehler beim Hinzufügen des Films mit ID ${nextMovie.id}: ${err.message}`);
		} else {
			error(`Unbekannter Fehler beim Hinzufügen des Films mit ID ${nextMovie.id}`);
		}
		// Status aktualisieren, dass der Film **NICHT** erfolgreich heruntergeladen wurde
		updateMovieStatus(nextMovie.index, 'notFound');
	} finally {
		// Status aktualisieren, dass der Film erfolgreich heruntergeladen wurde
		updateMovieStatus(nextMovie.index, 'downloaded');

		// Flag zurücksetzen, dass der Download abgeschlossen ist
		downloadingMovie = false;

		// Nächsten Download starten, falls die Warteschlange noch Filme enthält
		if (downloadQueue.length > 0) processDownloadQueue();
	}
}
//#endregion

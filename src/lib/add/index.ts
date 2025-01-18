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
import type { MovieSearchContext, MovieSearchState } from '$lib/types/add';
import { searchList } from '$lib/stores.svelte';
import { open } from '@tauri-apps/plugin-dialog';
import { join, videoDir } from '@tauri-apps/api/path';
import { readDir } from '@tauri-apps/plugin-fs';
import { online } from 'svelte/reactivity/window';

export function buttonClass(searchStatus: MovieSearchState) {
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

export function getIcon(searchStatus: MovieSearchState) {
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
			state: 'waitForSearching',
			results: [],
			options: {
				path,
				query: cleanedFileName || name,
				primaryReleaseYear: year,
				includeAdult: settings.adult,
				page: 1
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
		error(
			'Sie sind nicht mit dem Internet verbunden oder es ist ein Fehler mit der API aufgetreten.'
		);
		updateMovieStatus(i, 'notFound');
		return;
	}

	updateMovieStatus(i, 'searching');

	const { query, primaryReleaseYear } = searchList[i].options;

	try {
		// TMDB-Suche durchführen
		const result = (await tmdb.searchMovies(query, primaryReleaseYear)).results;

		// Update status based on results

		if (result.length === 1) {
			searchList[i] = {
				...searchList[i],
				results: result,
				options: {
					...searchList[i].options,
					id: result[0].id
				}
			};

			searchList[i].state = 'waitForDownloading';
		} else if (result.length > 1) {
			searchList[i] = {
				...searchList[i],
				results: result,
				state: 'foundMultiple'
			};
		} else {
			searchList[i] = {
				...searchList[i],
				results: [],
				state: 'notFound'
			};
		}
		return;
	} catch (err) {
		// Fehlerbehandlung
		if (err instanceof Error) {
			error('Fehler bei der Suche: ' + err.message);
		} else {
			error('Ein unbekannter Fehler ist aufgetreten: ' + err); // Fallback, wenn es kein Error-Objekt ist
		}

		searchList[i] = {
			...searchList[i],
			results: [],
			state: 'notFound'
		};
	}
}
//#endregion

//#region add Movie
let downloadingMovie = false; // Flag, um den laufenden Download zu überwachen
const downloadQueue: Array<{ id: number; index: number }> = []; // Warteschlange für Filme, die heruntergeladen werden müssen

export async function addNewMovie(id: number, index: number) {
	if (!id) {
		error('Es muss eine valide ID angegeben werden.');
		return Promise.resolve();
	}

	downloadQueue.push({ id, index });
	// Film zur Warteschlange hinzufügen, wenn kein Download läuft
	if (!downloadingMovie) {
		// Starte den Download-Prozess, wenn kein Download läuft
		processDownloadQueue();
	}

	return Promise.resolve();
}

function updateMovieStatus(index: number, newState: MovieSearchState) {
	searchList[index].state = newState;
}

async function processDownloadQueue() {
	// Überprüfen, ob der Benutzer online ist
	if (!online.current) return;

	// Wenn ein Download bereits läuft oder die Warteschlange leer ist, nichts tun
	if (downloadingMovie || downloadQueue.length === 0) return;

	// Nächsten Film aus der Warteschlange nehmen
	const nextMovie = downloadQueue.shift();
	if (!nextMovie) return;

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

		// Status aktualisieren, dass der Film erfolgreich heruntergeladen wurde
		updateMovieStatus(nextMovie.index, 'downloaded');
	} catch (err: unknown) {
		if (err instanceof Error) {
			error(`Fehler beim Hinzufügen des Films mit ID ${nextMovie.id}: ${err.message}`);
		} else {
			error(`Unbekannter Fehler beim Hinzufügen des Films mit ID ${nextMovie.id}`);
		}
	} finally {
		// Flag zurücksetzen, dass der Download abgeschlossen ist
		downloadingMovie = false;

		// Nächsten Download starten, falls die Warteschlange noch Filme enthält
		if (downloadQueue.length > 0) processDownloadQueue();
	}
}
//#endregion

// Handle file selection
export async function selectFile() {
	const files = await open({
		multiple: true,
		directory: false,
		defaultPath: await videoDir(),
		filters: [{ name: 'Video', extensions }]
	});

	if (files && files.length > 0) {
		// Neue Dateien hinzufügen
		await addNewFiles(files);
	}
}

// Handle folder selection
export async function selectFolder() {
	const folder = await open({
		multiple: false,
		directory: true,
		defaultPath: await videoDir()
	});

	if (folder) {
		const entries = await readDir(folder);

		const pfads = await Promise.all(entries.map(async (entry) => await join(folder, entry.name)));

		if (pfads && pfads.length > 0) {
			// Neue Dateien hinzufügen
			await addNewFiles(pfads);
		}
	}
}

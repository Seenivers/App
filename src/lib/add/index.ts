import { extensions } from '$lib';
import * as tmdb from '$lib/utils/tmdb';
import { error, warn } from '@tauri-apps/plugin-log';
import { image } from '$lib/image/image';
import type { SearchList, SearchStatus } from '$lib/types/add';
import { searchList, settings } from '$lib/stores.svelte';
import { online } from 'svelte/reactivity/window';
import type { Movie } from '$lib/types/movie';
import { hasMovieExtension, isFile, updateSearchStatus } from './utils';
import type { Serie } from '$lib/types/tv/serie';
import { serie } from '$lib/utils/db/serie';
import { season } from '$lib/utils/db/season';
import { episode } from '$lib/utils/db/episode';
import { movie } from '$lib/utils/db/movie';
import { collection } from '$lib/utils/db/collection';
import { BaseDirectory, exists, readDir } from '@tauri-apps/plugin-fs';
import { join } from '@tauri-apps/api/path';

//#region LOAD
// Lade die Dateien und starte die Suche nur, wenn noch nicht alle Filme verarbeitet wurden

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
//#endregion

//#region ADD
/**
 * Fügt neue Filme & Serien zum Status hinzu, nachdem sie validiert wurden.
 * @param paths - Die Liste der neuen Dateipfade, die verarbeitet werden sollen.
 */
export async function addNewFiles(paths: string[]) {
	// Filtere und validiere die Dateien
	const validFiles = paths.filter((path) => {
		if (isFile(path)) {
			// Überprüfe, ob die Datei eine gültige Erweiterung hat
			const fileExtension = path.split('.').pop()?.toLowerCase(); // Extrahiere die Dateierweiterung
			return extensions.includes(fileExtension ?? ''); // Überprüfe, ob die Erweiterung gültig ist
		} else return true;
	});

	if (validFiles.length === 0) {
		alert('Keine gültigen Dateie Pfade gefunden.');
		return;
	}

	// Filtere neue Dateien, die noch nicht im Status enthalten sind
	const newFiles = await filterNewFiles(validFiles);

	if (newFiles.length === 0) {
		alert('Keine neuen Filme und Serien zum Hinzufügen gefunden.');
		return;
	}

	// Füge neue Filme zum Status hinzu
	addNewPathsToStatus(newFiles);
}

/**
 * Filtert nur die Dateien, die nicht bereits im Status enthalten sind und einzigartig sind.
 *
 * @param paths - Die Liste der zu überprüfenden Dateipfade.
 * @returns Ein Array von Dateipfaden, die einzigartig sind und noch nicht im Status enthalten sind.
 */
async function filterNewFiles(paths: string[]) {
	// Erstelle ein Set für bereits existierende Pfade, um die Suche effizienter zu machen
	const existingPaths = new Set(searchList.map((item) => item.options.path));

	// Filtere die Dateien parallel
	const newFiles = await Promise.all(
		paths.map(async (path) => {
			// Überprüfe, ob der Pfad einzigartig ist und noch nicht im Status enthalten
			const unique = hasMovieExtension(path)
				? await movie.isPathUnique(path)
				: await serie.isPathUnique(path);
			return unique && !existingPaths.has(path) ? path : undefined;
		})
	);

	// Entferne `undefined` und gebe nur die einzigartigen Pfade zurück
	return newFiles.filter(Boolean) as string[];
}

/**
 * Fügt die neuen Dateien dem Status hinzu.
 *
 * @param newPaths - Die Liste der neuen Dateipfade, die dem Status hinzugefügt werden sollen.
 */
export function addNewPathsToStatus(newPaths: string[]) {
	const tempStatus: SearchList[] = newPaths.map((path) => {
		const name =
			path
				.split('\\')
				.pop()
				?.replace(/\.[^/.]+$/, '') ?? '';

		// Bereinigung des Dateinamens
		const fileName = name
			.split(/[.\s]+/)
			.filter(
				(word) => !(settings.keywords ?? []).some((k) => k.toLowerCase() === word.toLowerCase())
			)
			.join(' ');

		const yearMatch = /(\d{4})/.exec(fileName);
		const year = yearMatch ? yearMatch[1] : '';
		const cleanedFileName = fileName.replace(/\s*\(?\d{4}\)?\s*/g, '').trim();

		return {
			status: 'waitForSearching',
			mediaType: hasMovieExtension(path) ? 'movie' : 'tv',
			search: {
				page: 1,
				results: [],
				total_pages: 1,
				total_results: 0
			},
			options: {
				path,
				fileName: cleanedFileName || name,
				primaryReleaseYear: year
			}
		};
	});

	// Aktualisiere den Status nur einmal
	searchList.push(...tempStatus);
}
//#endregion

//#region SEARCH
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
//#endregion

//#region ADD Movies
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

async function addMovieToDatabase(result: Movie, index: number) {
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
//#endregion

async function loadImages(result: Movie | Serie) {
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

//#region ADD Serie
export async function addNewSerie(entrie: { id: number; index: number }) {
	if (!entrie || !online.current) return;

	if (!(await serie.isIDUnique(entrie.id))) {
		updateSearchStatus(entrie.index, 'downloaded');
		return;
	}

	// Status auf "downloading" setzen
	updateSearchStatus(entrie.index, 'downloading');

	try {
		// Serie abrufen
		const response = await tmdb.getSerie(entrie.id);

		// Serie speichern
		await serie.add({
			id: response.id,
			path: searchList[entrie.index].options.path,
			tmdb: response
		});

		await addSeasonToDatabase(entrie.index, response.id, response.seasons.length);

		await loadImages(response);

		updateSearchStatus(entrie.index, 'downloaded');
	} catch (err) {
		// Falls die gesamte Anfrage fehlschlägt, Serie als "notFound" markieren
		updateSearchStatus(entrie.index, 'notFound');
		error(
			`Fehler beim Abrufen der Serie: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
		);
	}
}

async function addSeasonToDatabase(index: number, serieId: number, seasons: number) {
	const seriesPath = searchList[index]?.options?.path;
	if (!seriesPath) {
		warn(`Kein gültiger Pfad für Serie mit ID ${serieId} gefunden.`);
		return;
	}

	// Finde die Staffel- und Episodenpfade
	const seasonData = await findSeasonsAndEpisodes(seriesPath);

	// Durchlaufe alle Staffeln
	for (let seasonNumber = 1; seasonNumber <= seasons; seasonNumber++) {
		const resultSeason = await tmdb.getSerieSeason(serieId, seasonNumber);
		if (!resultSeason) continue;

		// Überprüfe, ob für diese Staffel spezielle Episodenpfade existieren
		// Wenn es keine speziellen Staffelordner gibt, verwende den Serienordner
		const seasonPath = seasonData[seasonNumber]
			? await join(seriesPath, seasonNumber.toString())
			: seriesPath;

		// Staffel hinzufügen
		await season.add({
			id: resultSeason.id,
			path: seasonPath, // Den Pfad zur Staffel setzen
			tmdb: resultSeason
		});

		// Episoden hinzufügen
		await addEpisodeToDatabase(serieId, seasonNumber, seasonData[seasonNumber] || {});
	}
}

async function addEpisodeToDatabase(
	serieId: number,
	seasonNumber: number,
	episodePaths: Record<number, string>
) {
	for (const episodeNumber in episodePaths) {
		const resultEpisode = await tmdb.getSerieSeasonEpisode(
			serieId,
			seasonNumber,
			Number(episodeNumber)
		);
		if (!resultEpisode) continue;

		// Pfad zur Episode hinzufügen
		const episodePath = episodePaths[Number(episodeNumber)] || null;

		// Episode hinzufügen
		await episode.add({
			id: resultEpisode.id,
			path: episodePath, // Den Pfad zur Episode speichern
			tmdb: resultEpisode
		});
	}
}

/**
 * Findet Staffeln und Episoden anhand des Verzeichnisaufbaus.
 * Unterstützt beide Strukturen: Staffelordner oder SxxEyy-Dateien.
 */
async function findSeasonsAndEpisodes(seriesPath: string) {
	const seasons: Record<number, Record<number, string>> = {};

	// Prüfen, ob das Serienverzeichnis existiert
	const dirExists = await exists(seriesPath, { baseDir: BaseDirectory.AppData });
	if (!dirExists) {
		warn(`Das Serienverzeichnis ${seriesPath} existiert nicht.`);
		return seasons; // Leeres Objekt zurückgeben
	}

	// Serienverzeichnis lesen
	const files = await readDir(seriesPath, { baseDir: BaseDirectory.AppData });

	// Rekursive Funktion zum Durchsuchen von Unterordnern
	async function processDirectory(path: string, seasonNumber: number) {
		const entries = await readDir(path, { baseDir: BaseDirectory.AppData });

		for (const entry of entries) {
			if (entry.isDirectory) {
				// Rekursiv weiter in Unterordnern nach Episoden suchen
				await processDirectory(await join(path, entry.name), seasonNumber);
			} else if (entry.isFile && entry.name.endsWith('.mp4')) {
				const match = entry.name.match(/S(\d{2})E(\d{2})/i);
				if (match) {
					const episodeSeason = parseInt(match[1], 10);
					const episodeNumber = parseInt(match[2], 10);

					if (episodeSeason === seasonNumber) {
						if (!seasons[seasonNumber]) seasons[seasonNumber] = {};
						seasons[seasonNumber][episodeNumber] = await join(path, entry.name); // Pfad zur Episode speichern
					}
				}
			}
		}
	}

	// Prüfen, ob Staffel-Ordner existieren
	const seasonFolders = files.filter((entry) => entry.isDirectory && /^\d+$/.test(entry.name));

	if (seasonFolders.length > 0) {
		// Falls Staffel-Ordner existieren -> diesen Ansatz nutzen
		for (const seasonFolder of seasonFolders) {
			const seasonNumber = parseInt(seasonFolder.name, 10);
			const seasonPath = await join(seriesPath, seasonFolder.name);

			await processDirectory(seasonPath, seasonNumber);
		}
	} else {
		// Falls keine Staffel-Ordner existieren, nach SxxEyy-Dateien suchen
		for (const file of files) {
			if (file.isFile && file.name.endsWith('.mp4')) {
				const match = file.name.match(/S(\d{2})E(\d{2})/i);
				if (match) {
					const season = parseInt(match[1], 10);
					const episode = parseInt(match[2], 10);

					if (!seasons[season]) seasons[season] = {};
					seasons[season][episode] = await join(seriesPath, file.name); // Pfad zur Episode speichern
				}
			}
		}
	}

	return seasons;
}

//#endregion

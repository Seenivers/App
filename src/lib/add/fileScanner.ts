import { extensions as extensionsArray } from '$lib';
import { serie } from '$lib/utils/db/serie';
import { searchList } from '$lib/stores.svelte';
import type { SearchList } from '$lib/types/add';
import { movie } from '$lib/utils/db/movie';
import { filenameParse } from '@ctrl/video-filename-parser';
import { isFile, hasMovieExtension } from './utils';
import { basename } from '@tauri-apps/api/path';

const extensions = new Set(extensionsArray); // Für performantere Suche

/**
 * Fügt neue Filme & Serien zum Status hinzu, nachdem sie validiert wurden.
 * @param paths - Die Liste der neuen Dateipfade, die verarbeitet werden sollen.
 */
export async function addNewFiles(paths: string[]) {
	// Filtere und validiere die Dateien
	const validResults = await Promise.all(
		paths.map(async (path) => {
			const file = await isFile(path);
			if (file) {
				const ext = path.split('.').pop()?.toLowerCase() ?? '';
				return extensions.has(ext) ? path : null;
			}
			// Ordner immer zulassen
			return path;
		})
	);

	// Nur gültige Pfade behalten (nicht null)
	const validFiles = validResults.filter((p): p is string => p !== null);

	if (validFiles.length === 0) {
		alert('Keine gültigen Dateipfade gefunden.');
		return;
	}

	// Filtere neue Dateien, die noch nicht im Status enthalten sind
	const newFiles = await filterNewFiles(validFiles);

	if (newFiles.length === 0) {
		alert('Keine neuen Filme und Serien zum Hinzufügen gefunden.');
		return;
	}

	// Füge neue Dateien zum Status hinzu
	await addNewPathsToStatus(newFiles);
}

/**
 * Filtert nur die Dateien, die nicht bereits im Status enthalten sind und einzigartig sind.
 * @param paths - Die Liste der zu überprüfenden Dateipfade.
 * @returns Array von einzigartigen Dateipfaden.
 */
export async function filterNewFiles(paths: string[]) {
	const existingPaths = new Set(searchList.map((item) => item.options.path));

	const newFiles = await Promise.all(
		paths.map(async (path) => {
			const unique = hasMovieExtension(path)
				? await movie.isPathUnique(path)
				: await serie.isPathUnique(path);
			return unique && !existingPaths.has(path) ? path : undefined;
		})
	);

	// Filtere undefined heraus und gebe nur gültige Pfade zurück
	return newFiles.filter((p): p is string => p !== undefined);
}

/**
 * Fügt die neuen Dateien dem Status hinzu.
 * @param newPaths - Die Liste der neuen Dateipfade, die dem Status hinzugefügt werden sollen.
 */
export async function addNewPathsToStatus(newPaths: string[]) {
	const tempStatus: SearchList[] = [];

	for (const path of newPaths) {
		const fileNameWithExt = await basename(path);
		const fileNameWithoutExt = fileNameWithExt.replace(/\.[^/.]+$/, '');

		const parsed = filenameParse(fileNameWithoutExt);

		tempStatus.push({
			status: 'waitForSearching',
			mediaType: !hasMovieExtension(path) ? 'tv' : 'movie',
			search: {
				page: 1,
				results: [],
				total_pages: 1,
				total_results: 0
			},
			options: {
				path,
				fileName: parsed.title.length > 1 ? parsed.title : fileNameWithoutExt,
				primaryReleaseYear: parsed.year ?? ''
			}
		});
	}

	// Status aktualisieren
	searchList.push(...tempStatus);
}

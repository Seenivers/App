import { extensions } from '$lib';
import { serie } from '$lib/utils/db/serie';
import { searchList } from '$lib/stores.svelte';
import type { SearchList } from '$lib/types/add';
import { movie } from '$lib/utils/db/movie';
import { filenameParse } from '@ctrl/video-filename-parser';
import { isFile, hasMovieExtension } from './utils';
import { sep } from '@tauri-apps/api/path';

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
				const fileExtension = path.split('.').pop()?.toLowerCase();
				return extensions.includes(fileExtension ?? '') ? path : null;
			}
			return path; // Ordner immer zulassen
		})
	);

	// Filtere nur gültige (nicht-null) Pfade
	const validFiles = validResults.filter((p): p is string => !!p);

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

	// Füge neue Filme zum Status hinzu
	addNewPathsToStatus(newFiles);
}

/**
 * Filtert nur die Dateien, die nicht bereits im Status enthalten sind und einzigartig sind.
 *
 * @param paths - Die Liste der zu überprüfenden Dateipfade.
 * @returns Ein Array von Dateipfaden, die einzigartig sind und noch nicht im Status enthalten sind.
 */
export async function filterNewFiles(paths: string[]) {
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
		const fileNameWithExt = path.split(sep()).pop() ?? '';
		const fileName = fileNameWithExt.replace(/\.[^/.]+$/, '');

		const parsed = filenameParse(fileName, !hasMovieExtension(path));

		return {
			status: 'waitForSearching',
			// @ts-expect-error `isTv` ist optional
			mediaType: parsed.isTv ? 'tv' : 'movie',
			search: {
				page: 1,
				results: [],
				total_pages: 1,
				total_results: 0
			},
			options: {
				path,
				fileName: parsed.title ?? fileName,
				primaryReleaseYear: parsed.year ?? ''
			}
		};
	});

	// Aktualisiere den Status nur einmal
	searchList.push(...tempStatus);
}

import { extensions } from '$lib';
import { searchList } from '$lib/stores.svelte';
import type { SearchStatus } from '$lib/types/add';
import { error } from '@tauri-apps/plugin-log';
import { stat } from '@tauri-apps/plugin-fs';

export function updateSearchStatus(index: number, newState: SearchStatus) {
	searchList[index].status = newState;
}

export function hasMovieExtension(path: string) {
	const fileExtension = path.split('.').pop()?.toLowerCase() ?? '';
	return extensions.includes(fileExtension); // Falls es eine Datei mit Endung ist → Movie
}

/**
 * Prüft, ob der gegebene Pfad eine Datei ist.
 * @param path Der zu überprüfende Pfad.
 * @returns `true` wenn es eine Datei ist, `false` wenn es ein Ordner ist.
 */
export async function isFile(path: string) {
	try {
		const fileInfo = await stat(path);
		return fileInfo.isFile;
	} catch (err) {
		error('Fehler beim Prüfen des Pfads: ' + err);
		return true; // Bei Fehler lieber "true" zurückgeben
	}
}

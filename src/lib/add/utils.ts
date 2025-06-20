import { extensions } from '$lib';
import { searchList } from '$lib/stores.svelte';
import type { SearchStatus } from '$lib/types/add';
import { error } from '@tauri-apps/plugin-log';
import { stat } from '@tauri-apps/plugin-fs';

export function updateSearchStatus(index: number, newState: SearchStatus) {
	if (index < 0 || index >= searchList.length) {
		error(`updateSearchStatus: Ungültiger Index ${index}`);
		return;
	}
	searchList[index].status = newState;
}

export function hasMovieExtension(path: string) {
	const parts = path.split('.');
	if (parts.length < 2) return false;
	const fileExtension = parts.pop()!.toLowerCase();
	return extensions.includes(fileExtension);
}

/**
 * Prüft, ob der gegebene Pfad eine Datei ist.
 * @param path Der zu überprüfende Pfad.
 * @returns `true` wenn es eine Datei ist, `false` wenn es ein Ordner ist oder nicht erreichbar.
 */
export async function isFile(path: string): Promise<boolean> {
	try {
		const fileInfo = await stat(path);
		return fileInfo.isFile;
	} catch (err) {
		error(`Fehler beim Prüfen des Pfads "${path}": ${err instanceof Error ? err.message : err}`);
		return false;
	}
}

import { extensions } from '$lib';
import { searchList } from '$lib/stores.svelte';
import type { SearchStatus } from '$lib/types/add';

export function updateSearchStatus(index: number, newState: SearchStatus) {
	searchList[index].status = newState;
}

export function hasMovieExtension(path: string) {
	const fileExtension = path.split('.').pop()?.toLowerCase() ?? '';
	return extensions.includes(fileExtension); // Falls es eine Datei mit Endung ist → Movie
}

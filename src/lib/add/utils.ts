import { searchList } from '$lib/stores.svelte';
import type { SearchStatus } from '$lib/types/add';

export function updateMovieStatus(index: number, newState: SearchStatus) {
	searchList[index].status = newState;
}

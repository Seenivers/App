import { writable } from 'svelte/store';
import type { MovieSearchContext } from '$lib/types/add';

// Erstelle einen `writable` Store für den Status
export const status = writable<MovieSearchContext[]>([]);

export const isOnline = writable<boolean>(window.navigator.onLine);

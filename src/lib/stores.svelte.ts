import { writable } from 'svelte/store';
import type { MovieSearchContext } from '$lib/types/add';

export let status = $state<MovieSearchContext[]>([]);

export const isOnline = writable<boolean>(window.navigator.onLine);

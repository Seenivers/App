import { Store } from './store';
import { writable } from 'svelte/store';
import type { Data } from './types';

// Initialize the Store instance
const store = new Store('data.lib', 'AppConfig');

// Default settings
const defaultSettings = {
	language: window.navigator.language,
	online: window.navigator.onLine,
	keywords: [
		'mp4',
		'trailer',
		'StreamKiste',
		'tv',
		'HD',
		'HDTV',
		'720p',
		'1080p',
		'4K',
		'HDR',
		'HDR10',
		'HDR10+',
		'stream',
		'StreamKistetv',
		'»'
	],
	adult: false
};

// Function to load stored data or use default values
async function initializeData() {
	const savedData = await store.load();

	// Merge saved data with default settings
	return {
		settings: { ...defaultSettings, ...savedData?.settings },
		movies: savedData?.movies || [],
		actors: savedData?.actors || [],
		collections: savedData?.collections || [],
		save: async () => {
			data.subscribe((data) => {
				store.content = {
					settings: data.settings,
					movies: data.movies,
					actors: data.actors,
					collections: data.collections
				};
			});
			await store.save();
		}
	};
}

// Initialize the writable store
export const data = writable<Data>(await initializeData());

// Monitor online status and update settings
const onlineHandler = () => {
	data.update((currentData) => ({
		...currentData,
		settings: { ...currentData.settings, online: true } // Update online status
	}));
};

const offlineHandler = () => {
	data.update((currentData) => ({
		...currentData,
		settings: { ...currentData.settings, online: false } // Update online status
	}));
};

// Add event listeners for online/offline status
window.addEventListener('online', onlineHandler);
window.addEventListener('offline', offlineHandler);

// Clean up subscription and event listeners when component is destroyed
export async function cleanupData() {
	// Remove event listeners
	window.removeEventListener('online', onlineHandler);
	window.removeEventListener('offline', offlineHandler);
	data.subscribe((data) => {
		store.content = {
			settings: data.settings,
			movies: data.movies,
			actors: data.actors,
			collections: data.collections
		};
	});
	await store.save();
}

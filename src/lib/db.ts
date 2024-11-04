import { Store } from './store';
import { writable } from 'svelte/store';
import type { Data, Settings, Movie, Actor, Collection } from './types';

// Initialize the Store instance
const store = new Store('data.lib', 'AppConfig');

// Funktion zum Speichern der Daten
const save = async () => {
	data.subscribe((data) => {
		store.content = {
			settings: data.settings,
			movies: data.movies,
			actors: data.actors,
			collections: data.collections
		};
	});
	await store.save();
};

// Standardwerte für die Einstellungen
const defaultSettings: Settings = {
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
	adult: false,
	toastPosition: { horizontal: 'end', vertical: 'bottom' }
};

// Initialize the writable store with a placeholder
export const data = writable<Data>();

// Typ für die Rückgabewerte der initializeData-Funktion
type InitialData = {
	settings: Settings;
	movies: Movie[];
	actors: Actor[];
	collections: Collection[];
	save: () => Promise<void>;
};

// Funktion zum Laden der gespeicherten Daten oder Verwendung der Standardwerte
async function initializeData(): Promise<InitialData> {
	const savedData = await store.load();

	// Überprüfung, ob savedData die korrekten Typen hat
	const settings = {
		...defaultSettings,
		...((savedData as { settings?: Partial<Settings> })?.settings || {})
	};
	const movies: Movie[] = (savedData?.movies || []) as Movie[];
	const actors: Actor[] = (savedData?.actors || []) as Actor[];
	const collections: Collection[] = (savedData?.collections || []) as Collection[];

	return {
		settings,
		movies,
		actors,
		collections,
		save
	};
}

// Daten asynchron laden und den Store aktualisieren, sobald sie bereit sind
(async () => {
	const initialData = await initializeData();
	data.set(initialData);
})();

// Online-Status überwachen und Einstellungen aktualisieren
const onlineHandler = () => {
	data.update((currentData) => ({
		...currentData,
		settings: { ...currentData.settings, online: true } // Online-Status aktualisieren
	}));
};

const offlineHandler = () => {
	data.update((currentData) => ({
		...currentData,
		settings: { ...currentData.settings, online: false } // Online-Status aktualisieren
	}));
};

// Event-Listener für Online/Offline-Status hinzufügen
window.addEventListener('online', onlineHandler);
window.addEventListener('offline', offlineHandler);

// Aufräumen der Abonnements und Event-Listener beim Zerstören der Komponente
export async function cleanupData() {
	// Event-Listener entfernen
	window.removeEventListener('online', onlineHandler);
	window.removeEventListener('offline', offlineHandler);
	const unsubscribe = data.subscribe((data) => {
		store.content = {
			settings: data.settings,
			movies: data.movies,
			actors: data.actors,
			collections: data.collections
		};
	});
	await store.save();
	unsubscribe();
}

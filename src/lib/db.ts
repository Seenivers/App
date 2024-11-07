import { Store } from './store';
import { get, writable } from 'svelte/store';
import type { Data, Settings, oldMovie, oldActor, oldCollection } from './types';

// Initialize the Store instance
const store = new Store('data.lib', 'AppConfig');

// Funktion zum Speichern der Daten
const save = async () => {
	const dat = get(data);

	store.content = {
		settings: dat.settings,
		movies: dat.movies,
		actors: dat.actors,
		collections: dat.collections
	};

	await store.save();
};

// Standardwerte für die Einstellungen
const defaultSettings: Settings = {
	language: window.navigator.language,
	online: window.navigator.onLine,
	keywords: ['mp4', 'tv', 'HD', 'HDTV', '720p', '1080p', '4K', 'HDR', 'HDR10', 'HDR10+', '4K+'],
	adult: false,
	toastPosition: { horizontal: 'end', vertical: 'bottom' }
};

// Initialize the writable store with a placeholder
export const data = writable<Data>();

// Typ für die Rückgabewerte der initializeData-Funktion
type InitialData = {
	settings: Settings;
	movies: oldMovie[];
	actors: oldActor[];
	collections: oldCollection[];
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
	const movies: oldMovie[] = (savedData?.movies || []) as oldMovie[];
	const actors: oldActor[] = (savedData?.actors || []) as oldActor[];
	const collections: oldCollection[] = (savedData?.collections || []) as oldCollection[];

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

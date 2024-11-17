import { fetch } from '@tauri-apps/plugin-http';
import TMDB from '@blacktiger/tmdb';
import { newToast } from './toast/toast';
import type { Movie } from './types/movie';
import { settings } from './db/funktion';
import { seeniversURL } from '$lib';

const STATIC_KEY = '51baf525-2720-4c43-8d34-b759bb71ae88';
let apiKey: string | null = null; // Initialisiere apiKey als null

async function newApiKey() {
	const response = await fetch(seeniversURL + '/api/api-key', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ staticKey: STATIC_KEY }) // Verwende JSON.stringify
	});
	const result = await response.json();

	if (response.ok && result) {
		apiKey = result; // Weise den Wert von apiKey zu
		return true; // Erfolgreich abgerufen
	} else {
		console.error('Fehler beim Abrufen des API-Schlüssels:', result);
		newToast('error', 'Fehler beim Abrufen des API-Schlüssels.' + result);
		return false; // Fehler beim Abrufen
	}
}

// Definiere die tmdb-Instanz außerhalb der Funktion
let tmdb: TMDB;

// Stelle sicher, dass die Funktion aufgerufen wird
newApiKey().then((success) => {
	if (success && apiKey) {
		tmdb = new TMDB(apiKey, settings.language || window.navigator.language); // Initialisiere tmdb erst, wenn apiKey gesetzt ist
	} else {
		console.error('API-Key konnte nicht abgerufen werden.');
		newToast('error', 'API-Key konnte nicht abgerufen werden.');
	}
});

// Exportiere die tmdb-Instanz, wenn sie erfolgreich erstellt wurde
export { tmdb };

export async function getMovie(
	id: number,
	language: string = settings.language || window.navigator.language
) {
	try {
		// Erstelle die URL mit den Query-Parametern id und language
		const url = new URL(seeniversURL + '/api/movie');
		url.searchParams.append('id', id.toString());
		url.searchParams.append('language', language);

		// Führe den GET-Request aus
		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// Überprüfe, ob die Antwort OK ist
		if (!response.ok) {
			throw new Error(`Fehler beim Abrufen des Films: ${response.statusText}`);
		}

		// Parst die JSON-Antwort und gibt das Ergebnis zurück
		return (await response.json()) as Movie;
	} catch (error) {
		console.error('Fehler beim Abrufen des Films.', error);
		newToast('error', 'Fehler beim Abrufen des Films. ' + error);
	}
}

import { fetch } from '@tauri-apps/plugin-http';
import { error } from '@tauri-apps/plugin-log';
import type { Movie } from '$lib/types/movie';
import { settings } from '$lib/db/funktion';
import { seeniversURL } from '$lib';
import type { CollectionDetails } from './types/collection';

export async function getMovie(
	id: number,
	language: string = settings.language || window.navigator.language
) {
	try {
		// Erstelle die URL mit den Query-Parametern id und language
		const url = new URL('/api/movie', seeniversURL);
		url.searchParams.set('id', id.toString());
		url.searchParams.set('language', language);

		// Führe den GET-Request aus
		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// Überprüfe, ob die Antwort OK ist
		if (!response.ok) {
			const errorMessage = await response.text(); // Hole den Text der Fehlermeldung
			throw new Error(
				`Fehler beim Abrufen des Films (Status: ${response.status}): ${errorMessage}`
			);
		}

		// Versuche, die JSON-Antwort zu parsen
		const data = await response.json();
		return data as Movie; // Gebe das Movie-Objekt zurück
	} catch (err) {
		// Fehlerbehandlung mit detaillierterer Ausgabe
		if (err instanceof Error) {
			error('Fehler: ' + err.message); // Zeige die detaillierte Fehlermeldung
		} else {
			error('Ein unbekannter Fehler ist aufgetreten'); // Fallback, falls der Fehler kein Error-Objekt ist
		}
	}
}

export async function getCollection(
	id: number,
	language: string = settings.language || window.navigator.language
) {
	try {
		// Erstelle die URL mit den Query-Parametern id und language
		const url = new URL('/api/collection', seeniversURL);
		url.searchParams.set('id', id.toString());
		url.searchParams.set('language', language);

		// Führe den GET-Request aus
		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// Überprüfe, ob die Antwort OK ist
		if (!response.ok) {
			const errorMessage = await response.text(); // Hole den Text der Fehlermeldung
			throw new Error(
				`Fehler beim Abrufen der Collektion (Status: ${response.status}): ${errorMessage}`
			);
		}

		// Versuche, die JSON-Antwort zu parsen
		const data = await response.json();
		return data as CollectionDetails; // Gebe das Movie-Objekt zurück
	} catch (err) {
		// Fehlerbehandlung mit detaillierterer Ausgabe
		if (err instanceof Error) {
			error('Fehler: ' + err.message); // Zeige die detaillierte Fehlermeldung
		} else {
			error('Ein unbekannter Fehler ist aufgetreten: ' + err); // Fallback, falls der Fehler kein Error-Objekt ist
		}
	}
}

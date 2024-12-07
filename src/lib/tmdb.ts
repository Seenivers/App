import { fetch } from '@tauri-apps/plugin-http';
import { error } from '@tauri-apps/plugin-log';
import type { Movie } from '$lib/types/movie';
import { settings } from '$lib/db/funktion';
import { seeniversURL } from '$lib';
import type { CollectionDetails } from './types/collection';

async function fetchData<T>(endpoint: string, id: number, language: string) {
	try {
		// Erstelle die URL mit den Query-Parametern id und language
		const url = new URL(endpoint, seeniversURL);
		url.searchParams.set('id', id.toString());
		url.searchParams.set('language', language);

		// Führe den GET-Request aus
		const response = await fetch(url.toString(), {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});

		// Überprüfe, ob die Antwort OK ist
		if (!response.ok) {
			const errorMessage = await response.text(); // Hole den Text der Fehlermeldung
			throw new Error(
				`Fehler beim Abrufen von ${endpoint} (Status: ${response.status}): ${errorMessage}`
			);
		}

		// Versuche, die JSON-Antwort zu parsen
		const data = await response.json();
		return data as T;
	} catch (err) {
		// Fehlerbehandlung mit detaillierterer Ausgabe
		const errorMessage =
			err instanceof Error ? err.message : 'Ein unbekannter Fehler ist aufgetreten';
		error(`Fehler: ${errorMessage}`);
	}
}

export async function getMovie(
	id: number,
	language: string = settings.language || window.navigator.language
) {
	return await fetchData<Movie>('/api/movie', id, language);
}

export async function getCollection(
	id: number,
	language: string = settings.language || window.navigator.language
) {
	return await fetchData<CollectionDetails>('/api/collection', id, language);
}

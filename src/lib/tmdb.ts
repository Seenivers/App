import { fetch } from '@tauri-apps/plugin-http';
import { error } from '@tauri-apps/plugin-log';
import type { Movie } from '$lib/types/movie';
import { settings } from '$lib/db/funktion';
import { seeniversURL } from '$lib';
import type { CollectionDetails } from '$lib/types/collection';

async function fetchData<T>(endpoint: string, id: number, language: string) {
	// Erstelle die URL mit den Query-Parametern id und language
	const url = new URL(endpoint, seeniversURL);
	url.searchParams.set('id', id.toString());
	url.searchParams.set('language', language);

	// Führe den GET-Request aus
	let response: Response;
	try {
		response = await fetch(url, {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		// Fehlerbehandlung für den Fetch-Aufruf
		const errorMessage = `Fehler beim Abrufen von ${endpoint}: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`;
		error(errorMessage);
		throw new Error(errorMessage); // Fehler weiterwerfen
	}

	// Überprüfe den HTTP-Status der Antwort
	if (!response.ok) {
		// Optional: Versuche, die Fehlermeldung aus der Antwort zu lesen
		let errorMessage = `Fehler beim Abrufen von ${endpoint} (Status: ${response.status})`;
		try {
			const responseText = await response.text();
			if (responseText) errorMessage += `: ${responseText}`;
		} catch {
			errorMessage += ' (Fehler beim Lesen der Fehlermeldung)';
		}
		error(errorMessage);
		throw new Error(errorMessage); // Fehler weiterwerfen
	}

	// Versuche, die JSON-Antwort zu parsen
	try {
		return (await response.json()) as T;
	} catch (err) {
		const errorMessage = `Fehler beim Parsen der JSON-Antwort von ${endpoint}: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`;
		error(errorMessage);
		throw new Error(errorMessage); // Fehler weiterwerfen
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

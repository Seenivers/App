import { fetch } from '@tauri-apps/plugin-http';
import { error } from '@tauri-apps/plugin-log';
import type { Movie } from '$lib/types/movie';
import { settings } from '$lib/db/funktion';
import { seeniversURL } from '$lib';

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
	} catch (err) {
		error('Fehler beim Abrufen des Films: ' + err);
	}
}

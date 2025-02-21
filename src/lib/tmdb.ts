import { error } from '@tauri-apps/plugin-log';
import type { Movie } from '$lib/types/movie';
import { settings } from '$lib/db/funktion';
import { seeniversURL } from '$lib';
import type { CollectionDetails } from '$lib/types/collection';
import type { Search, Movie as SearchMovie, TV as SearchTV } from '$lib/types/searchMovie';
import type { Actor } from '$lib/types/actor';

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

export async function getMovies(
	ids: number[],
	language: string = settings.language || window.navigator.language
) {
	const url = new URL('/api/movie', seeniversURL);

	let response: Response;
	try {
		response = await fetch(url, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ id: ids, language })
		});
	} catch (err) {
		const errorMessage = `Fehler beim Abrufen von Filmen: ${
			err instanceof Error ? err.message : 'Unbekannter Fehler'
		}`;
		error(errorMessage);
		throw new Error(errorMessage);
	}

	if (!response.ok) {
		let errorMessage = `Fehler beim Abrufen von Filmen (Status: ${response.status})`;
		try {
			const responseText = await response.text();
			if (responseText) errorMessage += `: ${responseText}`;
		} catch {
			errorMessage += ' (Fehler beim Lesen der Fehlermeldung)';
		}
		error(errorMessage);
		throw new Error(errorMessage);
	}

	try {
		const result = (await response.json()) as { id: number; data?: Movie; error?: string }[];

		const movies: { id: number; data: Movie }[] = [];
		const errors: { id: number; error: string }[] = [];

		for (const entry of result) {
			if (entry.data) {
				movies.push({ id: entry.id, data: entry.data });
			} else if (entry.error) {
				errors.push({ id: entry.id, error: entry.error });
			}
		}

		return { movies, errors };
	} catch (err) {
		const errorMessage = `Fehler beim Parsen der JSON-Antwort: ${
			err instanceof Error ? err.message : 'Unbekannter Fehler'
		}`;
		error(errorMessage);
		throw new Error(errorMessage);
	}
}

export async function getCollection(
	id: number,
	language: string = settings.language || window.navigator.language
) {
	return await fetchData<CollectionDetails>('/api/collection', id, language);
}

/**
 * Suche Filme in der TMDB basierend auf einem Namen und optionalen Parametern.
 */
export async function searchMovies(
	name: string,
	primaryReleaseYear?: string | number,
	page = 1
): Promise<Search<SearchMovie>> {
	const url = new URL(seeniversURL + '/api/movie/search');
	url.searchParams.append('name', name);
	url.searchParams.append('language', settings.language);
	url.searchParams.append('includeAdult', String(settings.adult));
	url.searchParams.append('primaryReleaseYear', primaryReleaseYear?.toString() ?? '');
	url.searchParams.append('page', page.toString());

	const result = await fetch(url.toString());

	return (await result.json()) as Search<SearchMovie>;
}

export async function getActor(
	id: number,
	language: string = settings.language || window.navigator.language
) {
	return await fetchData<Actor>('/api/actor', id, language);
}

/**
 * Suche TV-Sendungen in der TMDB basierend auf einem Namen und optionalen Parametern.
 */
export async function searchTv(
	name: string,
	first_air_date_year?: string | number,
	page = 1
): Promise<Search<SearchTV>> {
	const url = new URL(seeniversURL + '/api/tv/search');
	url.searchParams.append('name', name);
	url.searchParams.append('language', settings.language);
	url.searchParams.append('includeAdult', String(settings.adult));
	url.searchParams.append('first_air_date_year', first_air_date_year?.toString() ?? '');
	url.searchParams.append('page', page.toString());

	const result = await fetch(url.toString());

	return (await result.json()) as Search<SearchTV>;
}

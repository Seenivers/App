import { error } from '@tauri-apps/plugin-log';
import type { Movie } from '$lib/types/movie';
import { settings } from '$lib/stores.svelte';
import { seeniversURL } from '$lib';
import type { CollectionDetails } from '$lib/types/collection';
import type { Search, Movie as SearchMovie, TV as SearchTV } from '$lib/types/searchMovie';
import type { Actor } from '$lib/types/actor';
import type { Serie } from '../types/tv/serie';
import type { Season } from '../types/tv/season';
import type { Episode } from '../types/tv/episode';
import type { Session, Token } from '$lib/types/authentication';

// 🔧 Fehlerbehandlung + JSON Parsing
async function parseResponse<T>(response: Response, endpoint: string): Promise<T> {
	if (!response.ok) {
		let message = `Fehler beim Abrufen von ${endpoint} (Status: ${response.status})`;
		try {
			const text = await response.text();
			if (text) message += `: ${text}`;
		} catch {
			message += ' (Fehler beim Lesen der Fehlermeldung)';
		}
		error(message);
		throw new Error(message);
	}

	try {
		return (await response.json()) as T;
	} catch (err) {
		const msg = `Fehler beim Parsen von JSON (${endpoint}): ${err instanceof Error ? err.message : 'Unbekannt'}`;
		error(msg);
		throw new Error(msg);
	}
}

// 📦 GET-Request mit URL-Parametern
async function fetchData<T>(endpoint: string, params: Record<string, string | number>): Promise<T> {
	const url = new URL(endpoint, seeniversURL);
	for (const [key, value] of Object.entries(params)) {
		url.searchParams.set(key, String(value));
	}

	let response: Response;
	try {
		response = await fetch(url.toString(), {
			method: 'GET',
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		const msg = `Netzwerkfehler bei ${endpoint}: ${err instanceof Error ? err.message : 'Unbekannt'}`;
		error(msg);
		throw new Error(msg);
	}

	return await parseResponse<T>(response, endpoint);
}

// 📤 POST-Request mit Payload
async function postData<T>(endpoint: string, body: unknown): Promise<T> {
	const url = new URL(endpoint, seeniversURL);

	let response: Response;
	try {
		response = await fetch(url.toString(), {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify(body)
		});
	} catch (err) {
		const msg = `Netzwerkfehler bei ${endpoint}: ${err instanceof Error ? err.message : 'Unbekannt'}`;
		error(msg);
		throw new Error(msg);
	}

	return await parseResponse<T>(response, endpoint);
}

// 📽 Einzelner Film
export const getMovie = (id: number, language = settings.language || window.navigator.language) =>
	fetchData<Movie>('/api/movie', { id, language });

// 📽 Mehrere Filme
export const getMovies = async (
	ids: number[],
	language = settings.language || window.navigator.language
) => {
	const result = await postData<{ id: number; data?: Movie; error?: string }[]>('/api/movie', {
		id: ids,
		language
	});

	const movies: { id: number; data: Movie }[] = [];
	const errors: { id: number; error: string }[] = [];

	for (const entry of result) {
		if (entry.data) movies.push({ id: entry.id, data: entry.data });
		else if (entry.error) errors.push({ id: entry.id, error: entry.error });
	}

	return { movies, errors };
};

// 📚 Collection
export const getCollection = (
	id: number,
	language = settings.language || window.navigator.language
) => fetchData<CollectionDetails>('/api/collection', { id, language });

// 🔎 Suche Filme
export const searchMovies = (name: string, primaryReleaseYear?: string | number, page = 1) => {
	const params = {
		name,
		language: settings.language,
		includeAdult: String(settings.adult),
		primaryReleaseYear: primaryReleaseYear?.toString() ?? '',
		page: String(page)
	};
	return fetchData<Search<SearchMovie>>('/api/movie/search', params);
};

// 👤 Schauspieler
export const getActor = (id: number, language = settings.language || window.navigator.language) =>
	fetchData<Actor>('/api/actor', { id, language });

// 📺 Suche Serien
export const searchTv = (name: string, first_air_date_year?: string | number, page = 1) => {
	const params = {
		name,
		language: settings.language,
		includeAdult: String(settings.adult),
		first_air_date_year: first_air_date_year?.toString() ?? '',
		page: String(page)
	};
	return fetchData<Search<SearchTV>>('/api/tv/search', params);
};

// 📺 Serie
export const getSerie = (
	tvShowID: number,
	language = settings.language || window.navigator.language
) => fetchData<Serie>('/api/tv', { id: tvShowID, language });

// 📅 Staffel
export const getSerieSeason = (
	tvShowID: number,
	seasonNumber: number,
	language = settings.language || window.navigator.language
) => fetchData<Season>('/api/tv/season', { tvShowID, seasonNumber, language });

// 🎬 Episode
export const getSerieSeasonEpisode = (
	tvShowID: number,
	seasonNumber: number,
	episodeNumber: number,
	language = settings.language || window.navigator.language
) =>
	fetchData<Episode>('/api/tv/season/episode', {
		tvShowID,
		seasonNumber,
		episodeNumber,
		language
	});

// Token
export const getToken = () => fetchData<Token>('/api/tmdb/token', {});

/**
 * Sendet einen request_token an die eigene API und erhält eine TMDB-Session.
 * @param request_token Der von TMDB erhaltene Request-Token
 * @returns Session-Objekt mit session_id
 * @throws Error bei Netzwerkfehler oder ungültiger API-Antwort
 */
export const postSession = async (request_token: string): Promise<Session> => {
	const endpoint = '/api/tmdb/session';
	const url = new URL(endpoint, seeniversURL);

	try {
		const response = await fetch(url.toString(), {
			method: 'POST',
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({ request_token })
		});

		return await parseResponse<Session>(response, endpoint);
	} catch (err) {
		const message = `Netzwerkfehler bei ${endpoint}: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`;
		console.error(message);
		throw new Error(message);
	}
};

import {
	addCollection,
	addMovie,
	isCollectionIDUnique,
	isMovieIDUnique,
	settings
} from '$lib/db/funktion';
import { seeniversURL } from '$lib';
import type { Search, Movie as SearchMovie } from '$lib/types/searchMovie';
import { fetch } from '@tauri-apps/plugin-http';
import { getCollection as getCollectionTmdb, getMovie as getMovieTmdb } from '$lib/tmdb';
import { error } from '@tauri-apps/plugin-log';
import { image } from '$lib/image';

let castImages = 5; // 5 Bilder laden

export function buttonClass(searchStatus: string) {
	switch (searchStatus) {
		case 'notStarted':
			return 'btn-neutral';
		case 'searching':
			return 'btn-primary';
		case 'notFound':
			return 'btn-error';
		case 'foundOne':
			return 'btn-success';
		case 'foundMultiple':
			return 'btn-warning';
		default:
			return 'btn-neutral';
	}
}

export function getIcon(searchStatus: string) {
	switch (searchStatus) {
		case 'notStarted':
			return '🔍'; // search icon
		case 'searching':
			return '⏳'; // loading icon
		case 'notFound':
			return '❌'; // not found icon
		case 'foundOne':
			return '✅'; // found one icon
		case 'foundMultiple':
			return '⚠️'; // multiple results icon
		default:
			return '❓'; // default to search icon
	}
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

export function getValidFileNames(filePaths: string[], validExtensions: string[]) {
	const supportedExtensions = new Set(validExtensions.map((ext) => ext.toLowerCase()));

	return filePaths.filter((path) => {
		const fileExtension = path.split('.').pop()?.toLowerCase();
		return fileExtension && supportedExtensions.has(fileExtension);
	});
}

export async function addNewMovie(id: number, path: string) {
	// Überprüfen, ob der Benutzer online ist
	if (!window.navigator.onLine) {
		error('Sie sind nicht mit dem Internet verbunden.');
		return Promise.resolve();
	}

	if (!id) {
		error('Es muss eine valide ID angegeben werden.');
		return Promise.resolve();
	}

	// Hole die Filmdetails
	const result = await getMovieTmdb(id);

	if (await isMovieIDUnique(result.id)) {
		// Film zur DB hinzufügen
		await addMovie({ id, path, tmdb: result, updated: new Date() });

		// Posterbild laden, falls verfügbar
		if (result.poster_path) {
			await loadImageWithErrorHandling(result.poster_path, 'posters');
		}

		// Hintergrundbild laden, falls verfügbar
		if (result.backdrop_path) {
			await loadImageWithErrorHandling(result.backdrop_path, 'backdrops');
		}

		// Collection hinzufügen, falls vorhanden
		if (
			result.belongs_to_collection?.id &&
			(await isCollectionIDUnique(result.belongs_to_collection?.id))
		) {
			const collection = await getCollectionTmdb(result.belongs_to_collection.id);
			if (collection) {
				await addCollection({ ...collection, updated: new Date() });
			}
		}

		// Schauspieler-Bilder parallel laden, nur wenn Pfad vorhanden
		const castImagePaths = result.credits.cast
			.map((actor) => actor.profile_path)
			.filter((path) => path != null);

		// `castImages` bestimmen: 0 bedeutet alle Bilder laden
		const imagesToLoad =
			castImages === 0 ? castImagePaths.length : Math.min(castImages, castImagePaths.length);

		// Bilder für Schauspieler laden
		for (let i = 0; i < imagesToLoad; i++) {
			const path = castImagePaths[i];
			await loadImageWithErrorHandling(path, 'actors');
		}
	}

	return Promise.resolve();
}

// Hilfsfunktion zum Laden von Bildern mit Fehlerbehandlung
async function loadImageWithErrorHandling(
	path: string,
	folder: 'actors' | 'backdrops' | 'posters' | null
) {
	try {
		await image(path, folder, true);
	} catch (err) {
		error(`Fehler beim Laden von ${folder}-Bild: ${err}`);
	}
}

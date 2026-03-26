import { api } from '$lib/trpc';
import type { MediaType } from '$lib/types/add';
import { getLocale } from '$lib/paraglide/runtime';

/**
 * Lädt Medien-Details über das Backend (inkl. Cache-Layer).
 */
export async function getSeasonDetails(tvId: number, seasonNumber: number) {
	return api.media.getSeasonDetails.query({ tvId, seasonNumber, language: getLocale() });
}

export async function getEpisodeDetails(tvId: number, seasonNumber: number, episodeNumber: number) {
	return api.media.getEpisodeDetails.query({
		tvId,
		seasonNumber,
		episodeNumber,
		language: getLocale()
	});
}

export async function findEpisodes(tvId: number, seasonNumber: number) {
	return api.media.findEpisodes.query({ tvId, seasonNumber, language: getLocale() });
}

export async function getCollectionDetails(collectionId: number) {
	return api.media.getCollectionDetails.query({ collectionId, language: getLocale() });
}

/**
 * Schreibt Watchlist-Änderungen serverseitig. Bei Offline/Unauthorized wird false zurückgegeben.
 */
export async function addToWatchlist(tmdbId: number, mediaType: MediaType): Promise<boolean> {
	try {
		await api.sync.addToWatchlist.mutate({ tmdbId, mediaType });
		return true;
	} catch {
		return false;
	}
}

/**
 * Schreibt Watch-History serverseitig. Bei Offline/Unauthorized wird false zurückgegeben.
 */
export async function markAsWatched(tmdbId: number, mediaType: MediaType): Promise<boolean> {
	try {
		await api.sync.markAsWatched.mutate({ tmdbId, mediaType, watchedAt: new Date() });
		return true;
	} catch {
		return false;
	}
}

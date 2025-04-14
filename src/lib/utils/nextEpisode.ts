import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

/**
 * Gibt die ID der nächsten Episode zurück.
 * Falls die aktuelle Staffel zu Ende ist, wird die erste Episode der nächsten Staffel versucht.
 * Gibt `null` zurück, wenn keine weitere Episode existiert.
 */
export async function nextEpisode(serienID: number, seasonID: number, episodeID: number) {
	if (!browser) {
		error(500, 'This operation is only supported in the browser');
	}

	const { season } = await import('./db/season');
	const { serie } = await import('./db/serie');

	const seasonElement = await season.get(seasonID);
	if (!seasonElement) throw new Error('Season not found');

	const episodeIndex = seasonElement.tmdb.episodes.findIndex((e) => e.id === episodeID);
	if (episodeIndex === -1) throw new Error('Episode not found in season');

	// Nächste Episode in der aktuellen Staffel
	if (episodeIndex + 1 < seasonElement.tmdb.episodes.length) {
		return seasonElement.tmdb.episodes[episodeIndex + 1].id;
	}

	// Nächste Staffel
	const serieElement = await serie.get(serienID);
	if (!serieElement) throw new Error('Serie not found');

	const seasonIndex = serieElement.tmdb.seasons.findIndex((s) => s.id === seasonID);
	if (seasonIndex === -1) throw new Error('Season not found in serie');

	// Gibt es eine weitere Staffel?
	if (seasonIndex + 1 < serieElement.tmdb.seasons.length) {
		const nextSeason = await season.get(serieElement.tmdb.seasons[seasonIndex + 1].id);
		if (nextSeason && nextSeason.tmdb.episodes.length > 0) {
			return nextSeason.tmdb.episodes[0].id;
		}
	}

	// Keine nächste Episode oder Staffel
	return null;
}

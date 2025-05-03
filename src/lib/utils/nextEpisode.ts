import { browser } from '$app/environment';
import { error } from '@sveltejs/kit';

/**
 * Gibt die URL der nächsten Episode zurück.
 * Falls die aktuelle Staffel zu Ende ist, wird die erste Episode der nächsten Staffel versucht.
 * Gibt `null` zurück, wenn keine weitere Episode existiert.
 *
 * @param serienID Die Serien-ID in der lokalen DB
 * @param seasonID Die aktuelle Season-ID in der lokalen DB
 * @param episodeID Die aktuelle Episode-ID in der lokalen DB
 * @param tvShowID Die TMDB-ID der Serie
 * @param seasonNumber Die Nummer der aktuellen Staffel
 * @returns URL-String oder null
 */
export async function nextEpisode(
	serienID: number,
	seasonID: number,
	episodeID: number,
	tvShowID: number,
	seasonNumber: number
) {
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
		const nextEpisodeID = seasonElement.tmdb.episodes[episodeIndex + 1].id;
		const url = `./episode?id=${serienID}&tvShowID=${tvShowID}&seasonNumber=${seasonNumber}&seasonID=${seasonID}&episodeID=${nextEpisodeID}`;
		return url;
	}

	// Nächste Staffel
	const serieElement = await serie.get(tvShowID);
	if (!serieElement) throw new Error('Serie not found');

	const seasonIndex = serieElement.tmdb.seasons.findIndex((s) => s.id === seasonID);
	if (seasonIndex === -1) throw new Error('Season not found in serie');

	// Gibt es eine weitere Staffel?
	if (seasonIndex + 1 < serieElement.tmdb.seasons.length) {
		const nextSeason = await season.get(serieElement.tmdb.seasons[seasonIndex + 1].id);
		if (nextSeason && nextSeason.tmdb.episodes.length > 0) {
			const nextEpisodeID = nextSeason.tmdb.episodes[0].id;
			const nextSeasonNumber = serieElement.tmdb.seasons[seasonIndex + 1].season_number;
			const url = `./episode?id=${serienID}&tvShowID=${tvShowID}&seasonNumber=${nextSeasonNumber}&seasonID=${nextSeason.id}&episodeID=${nextEpisodeID}`;
			return url;
		}
	}

	// Keine nächste Episode oder Staffel
	return null;
}

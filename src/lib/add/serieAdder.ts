import { join } from '@tauri-apps/api/path';
import { online } from 'svelte/reactivity/window';
import { searchList } from '$lib/stores.svelte';
import { episode } from '$lib/utils/db/episode';
import { season } from '$lib/utils/db/season';
import { serie } from '$lib/utils/db/serie';
import { findSeasonsAndEpisodes } from './findEpisodes';
import { loadImages } from './imageLoader';
import { getEpisodeDetails, getSeasonDetails } from './mediaService';
import { updateSearchStatus } from './utils';
import { api } from '$lib/trpc';
import type { Serie } from '$lib/db/schema';
import { getLocale } from '$lib/paraglide/runtime';

export async function addNewSerie(entry: { id: number; index: number }) {
	if (!entry) return;
	if (!online.current) {
		updateSearchStatus(entry.index, 'notFound');
		return;
	}

	updateSearchStatus(entry.index, 'downloading');

	try {
		const response = await api.media.getTvDetails.query({
			tmdbId: entry.id,
			language: getLocale()
		});

		if (!(await serie.isIDUnique(entry.id))) {
			await serie.update(entry.id, {
				path: searchList[entry.index].options.path,
				wantsToWatch: false
			});
			await addSeasonToDatabase(entry.index, response.id, response.seasons);
			updateSearchStatus(entry.index, 'downloaded');
			return;
		}

		await serie.add({
			id: response.id,
			path: searchList[entry.index].options.path,
			tmdb: response
		});

		await addSeasonToDatabase(entry.index, response.id, response.seasons);
		await loadImages(response);
		updateSearchStatus(entry.index, 'downloaded');
	} catch (err) {
		updateSearchStatus(entry.index, 'notFound');
		console.error(
			`Fehler beim Abrufen der Serie: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
		);
	}
}

export async function addSeasonToDatabase(
	index: number,
	serieId: number,
	seasons: Serie['tmdb']['seasons']
) {
	const seriesPath = searchList[index]?.options?.path;
	if (!seriesPath) {
		console.warn(`Kein gültiger Pfad für Serie mit ID ${serieId} gefunden.`);
		return;
	}

	const seasonData = await findSeasonsAndEpisodes(seriesPath);
	const seasonPaths = new Map<number, string>();

	for (const seasonInfo of seasons) {
		if (seasonData[seasonInfo.season_number]) {
			seasonPaths.set(
				seasonInfo.season_number,
				await join(seriesPath, seasonInfo.season_number.toString())
			);
		} else {
			seasonPaths.set(seasonInfo.season_number, seriesPath);
		}
	}

	for (const seasonInfo of seasons) {
		try {
			const seasonNumber = seasonInfo.season_number;
			const resultSeason = await getSeasonDetails(serieId, seasonNumber);

			if (!(await season.isIDUnique(resultSeason.id))) {
				await season.update(resultSeason.id, { path: seasonPaths.get(seasonNumber) ?? seriesPath });
			} else {
				await season.add({
					id: resultSeason.id,
					path: seasonPaths.get(seasonNumber) ?? seriesPath,
					tmdb: resultSeason
				});
				await loadImages(resultSeason);
			}

			await addEpisodeToDatabase(serieId, seasonNumber, seasonData[seasonNumber] || {});
		} catch (e) {
			console.error(
				`Fehler beim Verarbeiten der Staffel ${seasonInfo.season_number}: ${e instanceof Error ? e.message : e}`
			);
		}
	}
}

export async function addEpisodeToDatabase(
	serieId: number,
	seasonNumber: number,
	episodePaths: Record<number, string>
) {
	const episodePromises = Object.entries(episodePaths).map(async ([episodeNumberStr, path]) => {
		const episodeNumber = Number(episodeNumberStr);
		try {
			const resultEpisode = await getEpisodeDetails(serieId, seasonNumber, episodeNumber);

			if (!(await episode.isIDUnique(resultEpisode.id))) {
				await episode.update(resultEpisode.id, { path: path ?? null });
			} else {
				await episode.add({
					id: resultEpisode.id,
					path: path ?? null,
					tmdb: resultEpisode
				});
				await loadImages(resultEpisode);
			}
		} catch (e) {
			console.error(
				`Fehler bei Episode ${episodeNumber} Staffel ${seasonNumber}: ${e instanceof Error ? e.message : e}`
			);
		}
	});

	await Promise.all(episodePromises);
}

import * as tmdb from '$lib/utils/tmdb';
import { online } from 'svelte/reactivity/window';
import { updateSearchStatus } from './utils';
import { serie } from '$lib/utils/db/serie';
import { searchList } from '$lib/stores.svelte';
import type { Serie } from '$lib/types/tv/serie';
import { error, warn, info } from '@tauri-apps/plugin-log';
import { findSeasonsAndEpisodes } from './findEpisodes';
import { loadImages } from './imageLoader';
import { season } from '$lib/utils/db/season';
import { episode } from '$lib/utils/db/episode';
import { join } from '@tauri-apps/api/path';

export async function addNewSerie(entry: { id: number; index: number }) {
	if (!entry) return;
	if (!online.current) {
		updateSearchStatus(entry.index, 'notFound');
		return;
	}

	updateSearchStatus(entry.index, 'downloading');

	if (!(await serie.isIDUnique(entry.id))) {
		serie.update(entry.id, { path: searchList[entry.index].options.path });
		updateSearchStatus(entry.index, 'downloaded');
		return;
	}

	try {
		const response = await tmdb.getSerie(entry.id);
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
		error(
			`Fehler beim Abrufen der Serie: ${err instanceof Error ? err.message : 'Unbekannter Fehler'}`
		);
	}
}

export async function addSeasonToDatabase(
	index: number,
	serieId: number,
	seasons: Serie['seasons']
) {
	const seriesPath = searchList[index]?.options?.path;
	if (!seriesPath) {
		warn(`Kein gültiger Pfad für Serie mit ID ${serieId} gefunden.`);
		return;
	}

	const seasonData = await findSeasonsAndEpisodes(seriesPath);

	// Vorbereiten der Pfade für alle Staffeln (asynchron joinen)
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
			const resultSeason = await tmdb.getSerieSeason(serieId, seasonNumber);
			if (!resultSeason) {
				warn(`Staffel ${seasonNumber} der Serie ${serieId} konnte nicht geladen werden.`);
				continue;
			}

			await season.add({
				id: resultSeason.id,
				path: seasonPaths.get(seasonNumber) ?? seriesPath,
				tmdb: resultSeason
			});

			await loadImages(resultSeason);

			await addEpisodeToDatabase(serieId, seasonNumber, seasonData[seasonNumber] || {});
			info(`Staffel ${seasonNumber} erfolgreich hinzugefügt.`);
		} catch (e) {
			error(
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
			const resultEpisode = await tmdb.getSerieSeasonEpisode(serieId, seasonNumber, episodeNumber);
			if (!resultEpisode) {
				warn(`Episode ${episodeNumber} Staffel ${seasonNumber} Serie ${serieId} nicht gefunden.`);
				return;
			}

			await episode.add({
				id: resultEpisode.id,
				path: path ?? null,
				tmdb: resultEpisode
			});

			await loadImages(resultEpisode);
			info(`Episode ${episodeNumber} der Staffel ${seasonNumber} erfolgreich hinzugefügt.`);
		} catch (e) {
			error(
				`Fehler bei Episode ${episodeNumber} Staffel ${seasonNumber}: ${e instanceof Error ? e.message : e}`
			);
		}
	});

	await Promise.all(episodePromises);
}

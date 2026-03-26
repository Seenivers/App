import { join } from '@tauri-apps/api/path';
import { readDir } from '@tauri-apps/plugin-fs';
import { extensions } from '$lib';

const SEASON_FOLDER = /^(season|staffel)[\s._-]?(\d{1,2})$/i;
const EPISODE_HINT = /(S(\d{1,2})E(\d{1,2})|(\d{1,2})x(\d{1,2}))/i;
const VALID_EXTENSIONS = new Set(extensions.map((ext) => ext.toLowerCase()));

function parseEpisode(fileName: string): { season: number; episode: number } | null {
	const match = fileName.match(EPISODE_HINT);
	if (!match) return null;

	const season = Number(match[2] ?? match[4]);
	const episode = Number(match[3] ?? match[5]);
	if (!Number.isFinite(season) || !Number.isFinite(episode)) return null;

	return { season, episode };
}

function hasValidVideoExtension(fileName: string): boolean {
	const extension = fileName.split('.').pop()?.toLowerCase();
	return !!extension && VALID_EXTENSIONS.has(extension);
}

async function collectEpisodesFromDir(
	path: string,
	forcedSeason: number | null,
	seasons: Record<number, Record<number, string>>
) {
	const entries = await readDir(path);

	for (const entry of entries) {
		const fullPath = await join(path, entry.name);

		if (entry.isDirectory) {
			const seasonByFolder = entry.name.match(SEASON_FOLDER);
			const seasonNumber = seasonByFolder ? Number(seasonByFolder[2]) : forcedSeason;
			await collectEpisodesFromDir(fullPath, seasonNumber, seasons);
			continue;
		}

		if (!entry.isFile || !hasValidVideoExtension(entry.name)) continue;

		const parsed = parseEpisode(entry.name);
		if (!parsed) continue;

		const season = forcedSeason ?? parsed.season;
		seasons[season] ??= {};
		seasons[season][parsed.episode] = fullPath;
	}
}

/**
 * Findet Staffeln und Episoden anhand von Dateinamen und Ordnerstruktur.
 */
export async function findSeasonsAndEpisodes(seriesPath: string) {
	const seasons: Record<number, Record<number, string>> = {};
	await collectEpisodesFromDir(seriesPath, null, seasons);
	return seasons;
}

import { basename } from '@tauri-apps/api/path';
import { readDir } from '@tauri-apps/plugin-fs';
import { filenameParse } from '@ctrl/video-filename-parser';
import { searchList } from '$lib/stores.svelte';
import type { MediaType, SearchList } from '$lib/types/add';
import { episode } from '$lib/utils/db/episode';
import { movie } from '$lib/utils/db/movie';
import { findSeasonsAndEpisodes } from './findEpisodes';
import { hasMovieExtension, isFile } from './utils';

const TV_HINT = /(S\d{1,2}E\d{1,2}|\d{1,2}x\d{1,2}|season[\s._-]?\d{1,2}|staffel[\s._-]?\d{1,2})/i;

type EpisodeInfo = {
	title: string;
	season: number;
	episode: number;
};

async function parseEpisodeInfo(path: string): Promise<EpisodeInfo | null> {
	const name = await basename(path);
	const nameWithoutExt = name.replace(/\.[^/.]+$/, '');
	const parsed = filenameParse(nameWithoutExt, true);

	if (!('isTv' in parsed) || !parsed.isTv) return null;

	const season = parsed.seasons?.[0];
	const episode = parsed.episodeNumbers?.[0];
	if (!Number.isFinite(season) || !Number.isFinite(episode)) return null;

	return {
		title: parsed.title,
		season: Number(season),
		episode: Number(episode)
	};
}

async function inferMediaType(path: string): Promise<MediaType> {
	const file = await isFile(path);

	// Dateien: Episode-Muster => TV, sonst Movie.
	if (file) {
		return (await parseEpisodeInfo(path)) ? 'tv' : 'movie';
	}

	// Ordner: sobald Season-/Episode-Muster in Untereinträgen auftauchen => TV.
	try {
		const entries = await readDir(path);
		for (const entry of entries) {
			if (TV_HINT.test(entry.name)) return 'tv';
			if (entry.isDirectory && /^\d+$/.test(entry.name)) return 'tv';
		}
	} catch {
		// Fallback unten.
	}

	return 'movie';
}

/**
 * Fügt neue Medienpfade hinzu, nachdem sie validiert und dedupliziert wurden.
 */
export async function addNewFiles(paths: string[]) {
	const validResults = await Promise.all(
		paths.map(async (path) => {
			const file = await isFile(path);
			if (!file) return path;
			return hasMovieExtension(path) ? path : null;
		})
	);

	const validFiles = validResults.filter((p): p is string => p !== null);
	if (validFiles.length === 0) {
		alert('Keine gültigen Dateipfade gefunden.');
		return;
	}

	const newFiles = await filterNewFiles(validFiles);
	if (newFiles.length === 0) {
		alert('Keine neuen Filme und Serien zum Hinzufügen gefunden.');
		return;
	}

	await addNewPathsToStatus(newFiles);
}

/**
 * Filtert nur neue, noch nicht in Queue/DB vorhandene Pfade.
 */
export async function filterNewFiles(paths: string[]) {
	const existingPaths = new Set(searchList.map((item) => item.options.path));
	const newFiles: string[] = [];

	for (const path of paths) {
		if (existingPaths.has(path)) continue;

		const mediaType = await inferMediaType(path);
		if (mediaType === 'movie') {
			if (await movie.isPathUnique(path)) newFiles.push(path);
			continue;
		}

		newFiles.push(path);
	}

	return newFiles;
}

/**
 * Baut Queue-Einträge für den Add-Workflow auf.
 */
export async function addNewPathsToStatus(newPaths: string[]) {
	const tempStatus: SearchList[] = [];

	for (const path of newPaths) {
		const fileNameWithExt = await basename(path);
		const fileNameWithoutExt = fileNameWithExt.replace(/\.[^/.]+$/, '');
		const parsed = filenameParse(fileNameWithoutExt);
		const mediaType = await inferMediaType(path);

		if (mediaType === 'tv') {
			const file = await isFile(path);
			const shouldAdd = file
				? await isEpisodePathUnique(path)
				: await hasUniqueEpisodeInFolder(path);
			if (!shouldAdd) continue;
		}

		tempStatus.push({
			status: 'waitForSearching',
			mediaType,
			search: {
				page: 1,
				results: [],
				total_pages: 1,
				total_results: 0
			},
			options: {
				path,
				fileName: parsed.title.length > 1 ? parsed.title : fileNameWithoutExt,
				primaryReleaseYear: parsed.year ?? ''
			}
		});
	}

	searchList.push(...tempStatus);
}

async function hasUniqueEpisodeInFolder(seriesPath: string): Promise<boolean> {
	const seasonData = await findSeasonsAndEpisodes(seriesPath);
	const episodePaths = Object.values(seasonData).flatMap((episodes) => Object.values(episodes));

	if (episodePaths.length === 0) return false;

	for (const episodePath of episodePaths) {
		if (await isEpisodePathUnique(episodePath)) return true;
	}

	return false;
}

export async function isEpisodePathUnique(path: string): Promise<boolean> {
	const fileNameWithExt = await basename(path);
	const fileNameWithoutExt = fileNameWithExt.replace(/\.[^/.]+$/, '');
	const parsed = filenameParse(fileNameWithoutExt, true);

	console.log('Parsed episode:', parsed);
	console.log('Checking episode path:', path);

	const episodeInfo = await parseEpisodeInfo(path);
	if (!episodeInfo) return false;

	const isUnique = await episode.isPathUnique(path);
	console.log('Episode already exists:', !isUnique);

	return isUnique;
}

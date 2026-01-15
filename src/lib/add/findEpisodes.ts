import { join } from '@tauri-apps/api/path';
import { BaseDirectory, exists, readDir } from '@tauri-apps/plugin-fs';

const baseDir = BaseDirectory.AppData;

function parseSeasonEpisode(fileName: string): { season: number; episode: number } | null {
	const match = fileName.match(/S(\d{2})E(\d{2})/i);
	if (!match) return null;

	const season = parseInt(match[1], 10);
	const episode = parseInt(match[2], 10);
	if (isNaN(season) || isNaN(episode)) return null;

	return { season, episode };
}

/**
 * Findet Staffeln und Episoden anhand des Verzeichnisaufbaus.
 * Unterstützt beide Strukturen: Staffelordner oder SxxEyy-Dateien.
 */
export async function findSeasonsAndEpisodes(seriesPath: string) {
	const seasons: Record<number, Record<number, string>> = {};

	// Prüfen, ob das Serienverzeichnis existiert
	const dirExists = await exists(seriesPath, { baseDir });
	if (!dirExists) {
		console.warn(`Das Serienverzeichnis ${seriesPath} existiert nicht.`);
		return seasons;
	}

	const files = await readDir(seriesPath, { baseDir });

	async function processDirectory(path: string, seasonNumber: number) {
		const entries = await readDir(path, { baseDir });

		await Promise.all(
			entries.map(async (entry) => {
				if (entry.isDirectory) {
					await processDirectory(await join(path, entry.name), seasonNumber);
				} else if (entry.isFile && entry.name.toLowerCase().endsWith('.mp4')) {
					const parsed = parseSeasonEpisode(entry.name);
					if (parsed && parsed.season === seasonNumber) {
						seasons[seasonNumber] ??= {};
						seasons[seasonNumber][parsed.episode] = await join(path, entry.name);
					}
				}
			})
		);
	}

	// Prüfen, ob Staffel-Ordner existieren
	const seasonFolders = files.filter((entry) => entry.isDirectory && /^\d+$/.test(entry.name));

	if (seasonFolders.length > 0) {
		await Promise.all(
			seasonFolders.map(async (seasonFolder) => {
				const seasonNumber = parseInt(seasonFolder.name, 10);
				const seasonPath = await join(seriesPath, seasonFolder.name);
				await processDirectory(seasonPath, seasonNumber);
			})
		);
	} else {
		// Keine Staffel-Ordner, suche in Hauptverzeichnis
		for (const file of files) {
			if (file.isFile && file.name.toLowerCase().endsWith('.mp4')) {
				const parsed = parseSeasonEpisode(file.name);
				if (parsed) {
					seasons[parsed.season] ??= {};
					seasons[parsed.season][parsed.episode] = await join(seriesPath, file.name);
				}
			}
		}
	}

	return seasons;
}

import { join } from '@tauri-apps/api/path';
import { BaseDirectory, exists, readDir } from '@tauri-apps/plugin-fs';
import { warn } from '@tauri-apps/plugin-log';

/**
 * Findet Staffeln und Episoden anhand des Verzeichnisaufbaus.
 * Unterstützt beide Strukturen: Staffelordner oder SxxEyy-Dateien.
 */
export async function findSeasonsAndEpisodes(seriesPath: string) {
	const seasons: Record<number, Record<number, string>> = {};

	// Prüfen, ob das Serienverzeichnis existiert
	const dirExists = await exists(seriesPath, { baseDir: BaseDirectory.AppData });
	if (!dirExists) {
		warn(`Das Serienverzeichnis ${seriesPath} existiert nicht.`);
		return seasons; // Leeres Objekt zurückgeben
	}

	// Serienverzeichnis lesen
	const files = await readDir(seriesPath, { baseDir: BaseDirectory.AppData });

	// Rekursive Funktion zum Durchsuchen von Unterordnern
	async function processDirectory(path: string, seasonNumber: number) {
		const entries = await readDir(path, { baseDir: BaseDirectory.AppData });

		for (const entry of entries) {
			if (entry.isDirectory) {
				// Rekursiv weiter in Unterordnern nach Episoden suchen
				await processDirectory(await join(path, entry.name), seasonNumber);
			} else if (entry.isFile && entry.name.endsWith('.mp4')) {
				const match = entry.name.match(/S(\d{2})E(\d{2})/i);
				if (match) {
					const episodeSeason = parseInt(match[1], 10);
					const episodeNumber = parseInt(match[2], 10);

					if (episodeSeason === seasonNumber) {
						if (!seasons[seasonNumber]) seasons[seasonNumber] = {};
						seasons[seasonNumber][episodeNumber] = await join(path, entry.name); // Pfad zur Episode speichern
					}
				}
			}
		}
	}

	// Prüfen, ob Staffel-Ordner existieren
	const seasonFolders = files.filter((entry) => entry.isDirectory && /^\d+$/.test(entry.name));

	if (seasonFolders.length > 0) {
		// Falls Staffel-Ordner existieren -> diesen Ansatz nutzen
		for (const seasonFolder of seasonFolders) {
			const seasonNumber = parseInt(seasonFolder.name, 10);
			const seasonPath = await join(seriesPath, seasonFolder.name);

			await processDirectory(seasonPath, seasonNumber);
		}
	} else {
		// Falls keine Staffel-Ordner existieren, nach SxxEyy-Dateien suchen
		for (const file of files) {
			if (file.isFile && file.name.endsWith('.mp4')) {
				const match = file.name.match(/S(\d{2})E(\d{2})/i);
				if (match) {
					const season = parseInt(match[1], 10);
					const episode = parseInt(match[2], 10);

					if (!seasons[season]) seasons[season] = {};
					seasons[season][episode] = await join(seriesPath, file.name); // Pfad zur Episode speichern
				}
			}
		}
	}

	return seasons;
}

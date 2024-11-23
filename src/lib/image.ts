import { imageURL, placeholderURL, seeniversURL } from '$lib';
import { convertFileSrc } from '@tauri-apps/api/core';
import { BaseDirectory, create, exists, mkdir } from '@tauri-apps/plugin-fs';
import { appDataDir, join } from '@tauri-apps/api/path';
import { error } from '@tauri-apps/plugin-log';
import { fetch } from '@tauri-apps/plugin-http';

/**
 * Hilfsfunktion zum Erstellen eines Verzeichnisses, falls es nicht existiert.
 */
async function ensureDirectoryExists(folderPath: string) {
	try {
		const folderExists = await exists(folderPath, { baseDir: BaseDirectory.AppData });
		if (!folderExists) {
			await mkdir(folderPath, {
				baseDir: BaseDirectory.AppData,
				recursive: true
			});
		}
	} catch (err) {
		error(`Error checking or creating directory: ${err}`);
		return;
	}
}

/**
 * Funktion zum Herunterladen eines Bildes und Speichern unter AppData.
 */
export async function downloadImage(url: string, filename: string) {
	try {
		const response = await fetch(`${seeniversURL}/api/image?path=${encodeURIComponent(url)}`);

		if (!response.ok) {
			throw new Error(`Failed to download image: ${response.statusText}`);
		}

		const blob = await response.blob();
		const newFile = await create(filename, { baseDir: BaseDirectory.AppData });

		await newFile.write(new Uint8Array(await blob.arrayBuffer()));
		await newFile.close();
	} catch (err) {
		error(`Error saving image: ${err}`);
		return;
	}
}

/**
 * Funktion zum Verarbeiten eines Bildes.
 */
export async function image(
	file: string | null | undefined,
	path?: 'actors' | 'backdrops' | 'posters' | null,
	download = false
) {
	// Prüfe, ob ein Dateiname vorhanden ist; falls nicht, gib den Platzhalter zurück
	if (!file) return placeholderURL;

	const folderPath = path ? `images/${path}` : 'images';
	const filePath = `${folderPath}/${file}`;

	try {
		// Stelle sicher, dass das Verzeichnis existiert
		await ensureDirectoryExists(folderPath);

		// Überprüfen, ob die Bilddatei bereits existiert
		const imageExists = await exists(filePath, { baseDir: BaseDirectory.AppData });

		if (imageExists) {
			// Rückgabe des konvertierten Dateipfads, falls das Bild existiert
			return convertFileSrc(await join(await appDataDir(), filePath));
		}

		// Wenn das Bild heruntergeladen werden soll und eine Internetverbindung besteht
		if (download && navigator.onLine) {
			await downloadImage(`${imageURL}${file}`, filePath);
			return convertFileSrc(await join(await appDataDir(), filePath));
		}

		// Rückgabe des Platzhalters, falls die Bedingungen nicht erfüllt sind
		return placeholderURL;
	} catch (err) {
		// Allgemeiner Fehler beim Verarbeiten, Platzhalter zurückgeben
		error(`General error handling image: ${err}`);
		return placeholderURL;
	}
}

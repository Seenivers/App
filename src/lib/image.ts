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
 * @param file Dateiname des Bildes.
 * @param path Optionaler Pfad innerhalb des Bilderverzeichnisses ('actors', 'backdrops', 'posters').
 * @param download Gibt an, ob das Bild heruntergeladen werden soll.
 * @returns Ein Objekt mit der Bildquelle (`src`) und den Dimensionen (`width`, `height`).
 */
export async function image(
	file: string | null | undefined,
	path: 'actors' | 'backdrops' | 'posters' | null = null,
	download = false
): Promise<{ src: string; width: number; height: number }> {
	const resolveImageSource = async (src: string) => {
		const { width, height } = await fetchImageDimensions(src);
		return { src, width, height };
	};

	// Rückgabe des Platzhalters, falls kein Dateiname vorhanden
	if (!file) return resolveImageSource(placeholderURL);

	const folderPath = path ? `images/${path}` : 'images';
	const filePath = `${folderPath}/${file}`;

	try {
		// Verzeichnis sicherstellen
		await ensureDirectoryExists(folderPath);

		// Bildpfad überprüfen oder herunterladen
		if (await exists(filePath, { baseDir: BaseDirectory.AppData })) {
			const localPath = await join(await appDataDir(), filePath);
			return resolveImageSource(convertFileSrc(localPath));
		}

		if (navigator.onLine) {
			const remoteSrc = `${imageURL}${file}`;

			if (download) {
				await downloadImage(remoteSrc, filePath);
				const localPath = await join(await appDataDir(), filePath);
				return resolveImageSource(convertFileSrc(localPath));
			}

			return resolveImageSource(remoteSrc);
		}

		// Platzhalter für Offline-Modus
		return resolveImageSource(placeholderURL);
	} catch (err) {
		error(`Fehler bei der Bildverarbeitung: ${err}`);
		return resolveImageSource(placeholderURL);
	}
}

/**
 * Ermittelt die Dimensionen eines Bildes.
 * @param src Die Quelle des Bildes (URL oder lokaler Pfad).
 * @returns Ein Objekt mit `width` und `height` des Bildes.
 */
export async function fetchImageDimensions(
	src: string
): Promise<{ width: number; height: number }> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve({ width: img.width, height: img.height });
		img.onerror = (err) => reject(`Bild konnte nicht geladen werden: ${err}`);
		img.src = src;
	});
}

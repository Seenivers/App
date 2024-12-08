import { imageURL, placeholderURL, seeniversURL } from '$lib';
import { convertFileSrc } from '@tauri-apps/api/core';
import { BaseDirectory, create, exists, mkdir } from '@tauri-apps/plugin-fs';
import { appDataDir, join } from '@tauri-apps/api/path';
import { debug, error } from '@tauri-apps/plugin-log';
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
 * Downloads an image from a URL and saves it in the AppData directory.
 * @param url The URL of the image.
 * @param filename The filename under which the image should be saved.
 */
export async function downloadImage(url: string, filename: string) {
	// Bild herunterladen
	const response = await fetch(`${seeniversURL}/api/image?path=${encodeURIComponent(url)}`).catch(
		(err) => {
			error(`Fehler beim Abrufen des Bildes von ${url}: ${err}`);
			return null;
		}
	);

	if (!response || !response.ok) {
		error(`Fehler beim Herunterladen des Bildes: ${response?.statusText || 'Unbekannter Fehler'}`);
		return;
	}

	// Blob aus der Antwort holen
	const blob = await response.blob().catch((err) => {
		error(`Fehler beim Verarbeiten der Bilddaten: ${err}`);
		return null;
	});
	if (!blob) return;

	// Datei erstellen
	const newFile = await create(filename, { baseDir: BaseDirectory.AppData }).catch((err) => {
		error(`Fehler beim Erstellen der Datei ${filename}: ${err}`);
		return null;
	});
	if (!newFile) return;

	// Bilddaten schreiben
	const arrayBuffer = await blob.arrayBuffer().catch((err) => {
		error(`Fehler beim Umwandeln des Bildes in ein ArrayBuffer: ${err}`);
		return null;
	});
	if (!arrayBuffer) return;

	await newFile.write(new Uint8Array(arrayBuffer)).catch((err) => {
		error(`Fehler beim Schreiben der Bilddaten in die Datei ${filename}: ${err}`);
	});

	// Datei schließen
	await newFile.close().catch((err) => {
		error(`Fehler beim Schließen der Datei ${filename}: ${err}`);
	});
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
		img.onload = () => {
			resolve({ width: img.width, height: img.height });
		};
		img.onerror = (err) => {
			const errorDetails =
				err instanceof ErrorEvent ? `Message: ${err.message}, URL: ${src}` : JSON.stringify(err);
			reject(new Error(`Bild konnte nicht geladen werden. Details: ${errorDetails}`));
		};
		debug('Lade Bild von Quelle: ' + src);
		img.src = src;
	});
}

import { imageURL, placeholderURL, seeniversURL } from '$lib';
import { convertFileSrc } from '@tauri-apps/api/core';
import { BaseDirectory, create, exists, mkdir, remove } from '@tauri-apps/plugin-fs';
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
) {
	const resolveImageSource = async (src: string) => {
		const { width, height } = await fetchImageDimensions(src).catch((err) => {
			error(`Fehler beim Abrufen der Bildabmessungen: ${err}`);
			// Rückfallwerte, falls das Bild nicht geladen werden kann
			return { width: 300, height: 450 };
		});
		return { src, width, height };
	};

	// Rückgabe des Platzhalters, falls kein Dateiname vorhanden
	if (!file) {
		return resolveImageSource(placeholderURL);
	}

	const folderPath = path ? `images/${path}` : 'images';
	const filePath = `${folderPath}/${file}`;

	// Verzeichnis sicherstellen
	await ensureDirectoryExists(folderPath).catch((err) => {
		error(`Fehler beim Erstellen des Verzeichnisses '${folderPath}': ${err}`);
	});

	// Bildpfad überprüfen oder herunterladen
	if (
		await exists(filePath, { baseDir: BaseDirectory.AppData }).catch((err) => {
			error(`Fehler bei der Überprüfung des Bildpfads '${filePath}': ${err}`);
			return false;
		})
	) {
		let localPath = await join(await appDataDir(), filePath).catch((err) => {
			error(`Fehler beim Zusammenfügen des lokalen Pfads: ${err}`);
		});

		if (localPath) {
			return resolveImageSource(convertFileSrc(localPath));
		} else {
			return resolveImageSource(placeholderURL);
		}
	}

	if (navigator.onLine) {
		const remoteSrc = `${imageURL}${file}`;

		if (download) {
			// Nur starten, kein `await`, da Rückgabe direkt erfolgen soll
			downloadImage(remoteSrc, filePath).catch((err) => {
				error(`Fehler beim Herunterladen des Bildes '${remoteSrc}': ${err}`);
			});
		}

		// Remote-URL ohne Verarbeitung zurückgeben
		return resolveImageSource(remoteSrc);
	}

	// Platzhalter für Offline-Modus
	return resolveImageSource(placeholderURL);
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
		img.onerror = async (err) => {
			// Wenn das Bild geladen wurde, aber keine gültigen Dimensionen hat (z.B. 0x0), dann Lösche Bild
			if (img.width === 0 || img.height === 0) {
				try {
					// Entkodiere den Pfad, bevor du versuchst, das Bild zu entfernen
					const decodedPath = decodeURIComponent(src.replace('http://asset.localhost/', ''));
					await remove(decodedPath);
				} catch (removeError) {
					error(`Fehler beim Verarbeiten des Pfads zum Entfernen des Bildes: ${removeError}`);
				}
				return resolve({ width: 300, height: 450 });
			} else {
				const errorDetails =
					err instanceof ErrorEvent ? `Message: ${err.message}, URL: ${src}` : JSON.stringify(err);
				reject(new Error(`Bild konnte nicht geladen werden. Details: ${errorDetails}`));
			}
		};
		img.src = src;
	});
}

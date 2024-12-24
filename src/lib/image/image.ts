import { imageURL, placeholderURL, seeniversURL } from '$lib';
import { convertFileSrc } from '@tauri-apps/api/core';
import { BaseDirectory, create, exists, mkdir, remove } from '@tauri-apps/plugin-fs';
import { appDataDir, join } from '@tauri-apps/api/path';
import { error } from '@tauri-apps/plugin-log';
import { fetch } from '@tauri-apps/plugin-http';
import { isOnline } from '../stores.svelte';
import { get } from 'svelte/store';

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
	// Download the image
	const response = await fetch(`${seeniversURL}/api/image?path=${encodeURIComponent(url)}`).catch(
		(err) => {
			error(`Error fetching image from ${url}: ${err}`);
			return null;
		}
	);

	if (!response?.ok) {
		error(`Error downloading image: ${response?.statusText ?? 'Unknown error'}`);
		return;
	}

	// Retrieve the Blob from the response
	const blob = await response.blob().catch((err) => {
		error(`Error processing image data: ${err}`);
		return null;
	});
	if (!blob) return;

	// Create the file
	const newFile = await create(filename, { baseDir: BaseDirectory.AppData }).catch((err) => {
		error(`Error creating file ${filename}: ${err}`);
		return null;
	});
	if (!newFile) return;

	// Write the image data to the file
	const arrayBuffer = await blob.arrayBuffer().catch((err) => {
		error(`Error converting image to arrayBuffer: ${err}`);
		return null;
	});
	if (!arrayBuffer) return;

	await newFile.write(new Uint8Array(arrayBuffer)).catch((err) => {
		error(`Error writing image data to file ${filename}: ${err}`);
	});

	// Close the file
	await newFile.close().catch((err) => {
		error(`Error closing file ${filename}: ${err}`);
	});
}

const resolveImageSource = async (src: string) => {
	const { width, height } = await fetchImageDimensions(src).catch((err) => {
		error(`Fehler beim Abrufen der Bildabmessungen: ${err}`);
		// Rückfallwerte, falls das Bild nicht geladen werden kann
		return { width: 300, height: 450 };
	});
	return { src, width, height };
};

/**
 * Funktion zum Verarbeiten eines Bildes.
 * @param file Dateiname des Bildes.
 * @param path Optionaler Pfad innerhalb des Bilderverzeichnisses ('actors', 'backdrops', 'posters'). Wenn null, wird das Standardverzeichnis 'images' verwendet.
 * @param download Gibt an, ob das Bild heruntergeladen werden soll, wenn es lokal nicht gefunden wird.
 * @returns Ein Objekt mit der Bildquelle (`src`) und den Dimensionen (`width`, `height`).
 */
export async function image(
	file: string | null | undefined,
	path: 'actors' | 'backdrops' | 'posters' | null = null,
	download = false
) {
	// Rückgabe des Platzhalters, falls kein Dateiname vorhanden
	if (!file) {
		return resolveImageSource(placeholderURL);
	}

	// Verzeichnisstruktur basierend auf dem optionalen `path`-Parameter
	const folderPath = path ? await join('images', path) : 'images';
	const filePath = await join(folderPath, file);

	// Sicherstellen, dass das Verzeichnis existiert
	try {
		await ensureDirectoryExists(folderPath);
	} catch (err) {
		error(`Fehler beim Erstellen des Verzeichnisses '${folderPath}': ${err}`);
	}

	// Überprüfen, ob das Bild lokal vorhanden ist oder heruntergeladen werden muss
	const imageExists = await checkImageExistence(filePath);
	if (!imageExists) {
		if (get(isOnline)) {
			const remoteSrc = `${imageURL}${file}`;

			// Wenn das Bild nicht existiert und der Download aktiviert ist, versuche es herunterzuladen
			if (download) {
				await downloadImage(remoteSrc, filePath).catch((err) => {
					error(`Fehler beim Herunterladen des Bildes '${remoteSrc}': ${err}`);
				});
			} else {
				return resolveImageSource(remoteSrc);
			}
		} else {
			return resolveImageSource(placeholderURL);
		}
	}

	// Lokalen Pfad auflösen und Bildquelle zurückgeben
	return resolveImageFromLocal(filePath);
}

async function checkImageExistence(filePath: string): Promise<boolean> {
	try {
		return await exists(filePath, { baseDir: BaseDirectory.AppData });
	} catch (err) {
		error(`Fehler bei der Überprüfung des Bildpfads '${filePath}': ${err}`);
		return false;
	}
}

async function resolveImageFromLocal(filePath: string) {
	try {
		const localPath = await join(await appDataDir(), filePath);
		if (localPath) {
			return resolveImageSource(convertFileSrc(localPath));
		}
	} catch (err) {
		error(`Fehler beim Zusammenfügen des lokalen Pfads: ${err}`);
	}
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

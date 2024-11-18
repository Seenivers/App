import { imageURL, placeholderURL, seeniversURL } from '$lib';
import { convertFileSrc } from '@tauri-apps/api/core';
import { BaseDirectory, create, exists, mkdir } from '@tauri-apps/plugin-fs';
import { appDataDir, join } from '@tauri-apps/api/path';
import { newToast } from './toast/toast';
import { fetch } from '@tauri-apps/plugin-http';

export async function downloadImage(url: string, filename: string) {
	try {
		// Abrufen des Bildes von deinem API-Endpunkt
		const response = await fetch(seeniversURL + '/api/image?path=' + encodeURIComponent(url));

		// Überprüfen, ob der Abruf erfolgreich war
		if (!response.ok) {
			throw new Error(`Failed to download image: ${response.statusText}`);
		}

		// Bild als Blob abrufen
		const blob = await response.blob();

		// Erstelle einen neuen Datei-Handle in AppData unter dem Verzeichnis "images"
		const newFile = await create(`images/${filename}`, { baseDir: BaseDirectory.AppData });

		// Schreibe das Bild in die Datei als Uint8Array
		await newFile.write(new Uint8Array(await blob.arrayBuffer()));
		await newFile.close();
	} catch (err) {
		console.error('Error saving image:', err);
		newToast('error', 'Error saving image: ' + err);
	}
}

export async function image(path: string | null | undefined) {
	if (!path) return placeholderURL;

	if (
		!(await exists('images', {
			baseDir: BaseDirectory.AppData
		}))
	) {
		await mkdir('images', {
			baseDir: BaseDirectory.AppData,
			recursive: true
		});
	}

	const filePath = convertFileSrc(await join(await appDataDir(), 'images', path)); // Sicherstellen, dass der Pfad korrekt ist

	// Prüfen, ob das Bild bereits existiert
	const imageExists = await exists('images/' + path, { baseDir: BaseDirectory.AppData });

	if (imageExists) {
		// Wenn das Bild bereits existiert, gebe den Dateipfad zurück
		return filePath;
	} else {
		// Andernfalls versuche, das Bild herunterzuladen und zu speichern
		try {
			if (!navigator.onLine) return imageURL + path;

			// Bild herunterladen und speichern
			await downloadImage(imageURL + path, path);
			return filePath;
		} catch (error: unknown) {
			// Fehlerbehandlung
			console.error('Error downloading or saving image:', error);
			newToast('error', `Image: ${error instanceof Error ? error.message : 'Unknown error'}`);
			// Rückgabe der URL des Bildes als Fallback
			return imageURL + path;
		}
	}
}

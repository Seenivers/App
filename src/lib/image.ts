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
	// Prüfe, ob ein Pfad existiert; falls nicht, gib den Platzhalter zurück
	if (!path) return placeholderURL;

	// Überprüfen, ob der 'images'-Ordner existiert; wenn nicht, erstelle ihn
	try {
		const imagesExist = await exists('images', { baseDir: BaseDirectory.AppData });
		if (!imagesExist) {
			await mkdir('images', {
				baseDir: BaseDirectory.AppData,
				recursive: true
			});
		}
	} catch (error) {
		// Fehler beim Überprüfen oder Erstellen des Ordners, gib den Platzhalter zurück
		console.error('Error checking or creating images directory:', error);
		newToast('error', 'Error with images directory: ' + error);
		return placeholderURL;
	}

	try {
		const filePath = convertFileSrc(await join(await appDataDir(), 'images', path));

		// Prüfen, ob das Bild bereits existiert
		const imageExists = await exists('images/' + path, { baseDir: BaseDirectory.AppData });

		if (imageExists) {
			// Wenn das Bild existiert, gebe den Dateipfad zurück
			return filePath;
		} else {
			// Bild herunterladen und speichern
			if (!navigator.onLine) return placeholderURL;

			try {
				await downloadImage(imageURL + path, path);
				return filePath;
			} catch (error) {
				// Fehler beim Herunterladen oder Speichern des Bildes, Platzhalter zurückgeben
				console.error('Error downloading or saving image:', error);
				newToast('error', 'Image: ' + error);
				return placeholderURL;
			}
		}
	} catch (error) {
		// Allgemeiner Fehler beim Verarbeiten, Platzhalter zurückgeben
		console.error('General error handling image:', error);
		newToast('error', 'General error: ' + error);
		return placeholderURL;
	}
}

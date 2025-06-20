import { open } from '@tauri-apps/plugin-dialog';
import { join, videoDir } from '@tauri-apps/api/path';
import { readDir } from '@tauri-apps/plugin-fs';
import { extensions, plyr, vidstack } from '$lib';
import { addNewFiles } from './fileScanner';

async function resolvePaths(folder: string) {
	const entries = await readDir(folder);
	const paths = await Promise.all(entries.map((entry) => join(folder, entry.name)));
	return paths;
}

export async function selectFile() {
	try {
		const files = await open({
			multiple: true,
			directory: false,
			defaultPath: await videoDir(),
			filters: [
				{ name: 'Video', extensions },
				{ name: 'Plyr', extensions: plyr },
				{ name: 'Vidstack', extensions: vidstack }
			]
		});

		// Prüfen, ob Dateien ausgewählt wurden
		if (!files) return;

		// files kann string oder string[] sein, also normalisieren
		const fileList = Array.isArray(files) ? files : [files];

		await addNewFiles(fileList);
	} catch (e) {
		console.error('Fehler beim Datei-Auswählen:', e);
	}
}

export async function selectFolder() {
	try {
		const folder = await open({
			multiple: false,
			directory: true,
			defaultPath: await videoDir()
		});

		if (!folder || typeof folder !== 'string') return;

		const paths = await resolvePaths(folder);

		if (paths.length > 0) {
			await addNewFiles(paths);
		}
	} catch (e) {
		console.error('Fehler beim Ordner-Auswählen:', e);
	}
}

export async function selectTvFolder() {
	try {
		const folders = await open({
			multiple: true,
			directory: true,
			defaultPath: await videoDir()
		});

		if (!folders) return;

		// Normalize to array
		const folderList = Array.isArray(folders) ? folders : [folders];

		// Für jeden Ordner Pfade auflösen und flach zusammenfassen
		const allPaths = (await Promise.all(folderList.map((folder) => resolvePaths(folder)))).flat();

		if (allPaths.length > 0) {
			await addNewFiles(folderList);
		}
	} catch (e) {
		console.error('Fehler beim TV-Ordner-Auswählen:', e);
	}
}

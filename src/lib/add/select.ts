import { open } from '@tauri-apps/plugin-dialog';
import { join, videoDir } from '@tauri-apps/api/path';
import { readDir } from '@tauri-apps/plugin-fs';
import { extensions } from '$lib';
import { addNewFiles } from '.';

// Handle file selection
export async function selectFile() {
	const files = await open({
		multiple: true,
		directory: false,
		defaultPath: await videoDir(),
		filters: [{ name: 'Video', extensions }]
	});

	if (files && files.length > 0) {
		// Neue Dateien hinzufügen
		await addNewFiles(files);
	}
}

// Handle folder selection
export async function selectFolder() {
	const folder = await open({
		multiple: false,
		directory: true,
		defaultPath: await videoDir()
	});

	if (folder) {
		const entries = await readDir(folder);

		const pfads = await Promise.all(entries.map(async (entry) => await join(folder, entry.name)));

		if (pfads && pfads.length > 0) {
			// Neue Dateien hinzufügen
			await addNewFiles(pfads);
		}
	}
}

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { listen } from '@tauri-apps/api/event';
	import { readDir, stat } from '@tauri-apps/plugin-fs';
	import type { UnlistenFn } from '@tauri-apps/api/event';
	import type { DropPayload } from '$lib/types/add';
	import { error } from '@tauri-apps/plugin-log';
	import { addNewFiles } from '$lib/add/index';
	import { join } from '@tauri-apps/api/path';

	let isDraggingOver = false;
	let handleDrop: UnlistenFn | undefined;
	let handleDragEnter: UnlistenFn | undefined;
	let handleDragLeave: UnlistenFn | undefined;

	export let load: () => Promise<void>;
	export let extensions: string[];

	onMount(async () => {
		const supportedExtensions = new Set(extensions.map((ext) => ext.toLowerCase()));

		handleDrop = await listen<DropPayload>('tauri://drag-drop', async (event) => {
			isDraggingOver = false;
			const files: string[] = [];

			// Durchlaufe alle übergebenen Pfade
			for (const path of event.payload.paths) {
				let metadata;

				try {
					// Hole die Metadaten des Pfads
					metadata = await stat(path);
				} catch (err) {
					error(`Fehler beim Abrufen der Metadaten für den Pfad ${path}: ${err}`);
					continue; // Überspringe diesen Pfad bei Fehlern
				}

				if (metadata.isFile) {
					// Überprüfe, ob die Datei eine unterstützte Erweiterung hat
					const fileExtension = path.split('.').pop()?.toLowerCase();
					if (fileExtension && supportedExtensions.has(fileExtension)) {
						files.push(path);
					}
				} else if (metadata.isDirectory) {
					try {
						// Lese die Inhalte des Verzeichnisses
						const entries = await readDir(path);

						// Filtere und füge unterstützte Dateien hinzu
						for (const entry of entries) {
							if (entry.name) {
								const entryExtension = entry.name.split('.').pop()?.toLowerCase();
								if (entryExtension && supportedExtensions.has(entryExtension)) {
									// Verwende join innerhalb der for...of-Schleife und warte auf die Rückgabe
									const joinedPath = await join(path, entry.name);
									files.push(joinedPath);
								}
							}
						}
					} catch (err) {
						error(`Fehler beim Lesen des Verzeichnisses ${path}: ${err}`);
					}
				} else {
					error(`Der Pfad ${path} ist weder eine Datei noch ein Verzeichnis.`);
				}
			}

			// Wenn gültige Dateien gefunden wurden, übergebe sie an die Ladefunktion
			if (files.length > 0) {
				// Neue Dateien hinzufügen
				await addNewFiles(files);
				// Danach Suche starten
				await load();
			} else {
				alert('Keine Dateien zum Hinzufügen gefunden.');
			}
		});

		handleDragEnter = await listen<DropPayload>(
			'tauri://drag-enter',
			() => (isDraggingOver = true)
		);

		handleDragLeave = await listen<DropPayload>(
			'tauri://drag-leave',
			() => (isDraggingOver = false)
		);
	});

	// Clean up the event listeners when the component is destroyed
	onDestroy(() => {
		if (handleDrop) handleDrop();
		if (handleDragEnter) handleDragEnter();
		if (handleDragLeave) handleDragLeave();
	});
</script>

{#if isDraggingOver}
	<div class="fixed inset-0 z-40 flex items-center justify-center p-5 backdrop-blur-sm">
		<div
			class="flex h-full w-full flex-col items-center justify-center rounded-lg border-4 border-dashed border-base-content bg-opacity-50 shadow-lg"
		>
			<p class="text-lg font-semibold text-base-content">
				Zieh eine Datei oder Ordner hierher, um sie hinzuzufügen
			</p>
		</div>
	</div>
{/if}

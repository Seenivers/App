<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { listen } from '@tauri-apps/api/event';
	import { readDir } from '@tauri-apps/plugin-fs';
	import type { UnlistenFn } from '@tauri-apps/api/event';
	import type { DropPayload } from '$lib/types/add';
	import { error } from '@tauri-apps/plugin-log';

	let isDraggingOver = false;
	let handleDrop: UnlistenFn;
	let handleDragEnter: UnlistenFn;
	let handleDragLeave: UnlistenFn;

	export let load: (files: string[]) => void;
	export let extensions: string[];

	onMount(async () => {
		const supportedExtensions = new Set(extensions.map((ext) => ext.toLowerCase()));

		handleDrop = await listen<DropPayload>('tauri://drag-drop', async (event) => {
			isDraggingOver = false;
			const files: string[] = [];

			// Loop through the dropped paths
			for (const path of event.payload.paths) {
				// Check if the path has a file extension
				const fileExtension = path.split('.').pop()?.toLowerCase();

				if (fileExtension && supportedExtensions.has(fileExtension)) {
					// If it's a file with a supported extension, add it to the list
					files.push(path);
				} else {
					// If it's a directory or doesn't have a file extension, try reading its contents
					try {
						const entries = await readDir(path);
						// Filter and collect only the files with supported extensions
						entries.forEach((entry) => {
							const entryExtension = entry.name.split('.').pop()?.toLowerCase();
							if (entryExtension && supportedExtensions.has(entryExtension)) {
								files.push(`${path}\\${entry.name}`);
							}
						});
					} catch (err) {
						error('Fehler beim Lesen des Verzeichnisses: ' + err);
					}
				}
			}

			// If valid files are found, pass them to the load function
			if (files.length > 0) {
				load(files);
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
		handleDrop();
		handleDragEnter();
		handleDragLeave();
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

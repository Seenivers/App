<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { listen } from '@tauri-apps/api/event';
	import type { UnlistenFn } from '@tauri-apps/api/event';
	import type { DropPayload } from '$lib/types/add';

	let isDraggingOver = false;
	let handleDrop: UnlistenFn;
	let handleDragEnter: UnlistenFn;
	let handleDragLeave: UnlistenFn;

	export let load: (files: string[]) => void;
	export let extensions: string[];

	onMount(async () => {
		const supportedExtensions = new Set(extensions.map((ext) => ext.toLowerCase()));

		handleDrop = await listen<DropPayload>('tauri://drag-drop', (event) => {
			isDraggingOver = false;
			const files = event.payload.paths.filter((path) => {
				const fileExtension = path.split('.').pop()?.toLowerCase();
				return fileExtension && supportedExtensions.has(fileExtension);
			});

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

	// Bereinigen der Event-Listener bei Zerstörung der Komponente
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
				Zieh eine Datei hierher, um sie hinzufügen
			</p>
		</div>
	</div>
{/if}

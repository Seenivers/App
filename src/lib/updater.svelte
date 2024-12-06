<script lang="ts">
	import { onMount } from 'svelte';
	import { check, type Update } from '@tauri-apps/plugin-updater';
	import { relaunch } from '@tauri-apps/plugin-process';
	import { debug, error } from '@tauri-apps/plugin-log';
	import { marked } from 'marked';
	import '$lib/md.css';

	let update: Update | null = null;
	let downloadProgress = 0;
	let downloadStarted = false;
	let downloadFinished = false;
	let modalOpen = false;

	onMount(async () => {
		if (!window.navigator.onLine) return;

		update = await check();

		if (update) {
			modalOpen = true;
		}
	});

	async function download() {
		if (!window.navigator.onLine) {
			error('You are not connected to the internet.');
			return;
		}
		if (update) {
			downloadStarted = true;
			downloadFinished = false;
			let downloaded = 0;
			let contentLength: number | undefined = 0;

			await update.downloadAndInstall((event) => {
				switch (event.event) {
					case 'Started':
						contentLength = event.data.contentLength;
						debug(`started downloading ${contentLength} bytes`);
						break;
					case 'Progress':
						downloaded += event.data.chunkLength;
						if (contentLength) {
							downloadProgress = Math.round((downloaded / contentLength) * 100);
						}
						debug(`downloaded ${downloaded} from ${contentLength}`);
						break;
					case 'Finished':
						downloadFinished = true;
						downloadProgress = 100;
						debug('download finished');
						break;
				}
			});

			debug('update installed');
			await relaunch();
		}
	}
</script>

<dialog class="modal backdrop-blur-sm" open={modalOpen}>
	<div class="modal-box max-w-3xl">
		<button
			class="btn btn-circle btn-sm absolute right-2 top-2"
			on:click={() => (modalOpen = false)}>✕</button
		>

		{#if update !== null && update.body}
			{#await marked.parse(update.body) then body}
				<h2 class="mb-2 text-3xl font-semibold">Eine neue Version ist verfügbar</h2>
				<h3 class="text-2xl font-semibold">Version {update.version}</h3>
				<div class="body my-3 h-[40rem] overflow-y-scroll rounded-md bg-base-200 px-3">
					{@html body ? body : 'Siehe Changelog'}
				</div>

				<div class="mt-4">
					{#if downloadStarted && !downloadFinished}
						<p class="mb-2">Downloadfortschritt: {downloadProgress}%</p>
						<progress class="progress progress-primary w-full" value={downloadProgress} max="100"
						></progress>
					{:else if downloadFinished}
						<p class="mt-4 text-lg font-semibold text-success">Update abgeschlossen!</p>
					{/if}
				</div>

				<div class="mt-6 flex justify-end space-x-4">
					{#if !downloadStarted}
						<button class="btn btn-primary" disabled={!window.navigator.onLine} on:click={download}
							>Update herunterladen</button
						>
					{:else if downloadFinished}
						<button class="btn btn-secondary" on:click={() => (modalOpen = false)}>Schließen</button
						>
					{:else}
						<button class="btn btn-disabled" disabled>Herunterladen...</button>
					{/if}
				</div>
			{/await}
		{/if}
	</div>
</dialog>

<script lang="ts">
	import { onMount } from 'svelte';
	import { check, type Update } from '@tauri-apps/plugin-updater';
	import { relaunch } from '@tauri-apps/plugin-process';
	import { data } from './db';

	let update: Update | null = null;
	let downloadProgress = 0;
	let downloadStarted = false;
	let downloadFinished = false;
	let modalOpen = false;

	onMount(async () => {
		if ($data && !$data.settings.online) return;
		update = await check();
		if (update) {
			modalOpen = true;
		}
	});

	async function download() {
		if (!$data.settings.online) {
			alert('Du bist nicht mit dem Internet verbunden');
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
						console.log(`started downloading ${contentLength} bytes`);
						break;
					case 'Progress':
						downloaded += event.data.chunkLength;
						if (contentLength) {
							downloadProgress = Math.round((downloaded / contentLength) * 100);
						}
						console.log(`downloaded ${downloaded} from ${contentLength}`);
						break;
					case 'Finished':
						downloadFinished = true;
						downloadProgress = 100;
						console.log('download finished');
						break;
				}
			});

			console.log('update installed');
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

		{#if update !== null}
			<h2 class="mb-2 text-3xl font-semibold">Eine neue Version ist verfügbar</h2>
			<p class="text-lg font-semibold">Version {update.version}</p>
			<p class="mt-1 whitespace-pre-line text-sm">{update.body}</p>

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
					<button class="btn btn-primary" disabled={!$data.settings.online} on:click={download}
						>Update herunterladen</button
					>
				{:else if downloadFinished}
					<button class="btn btn-secondary" on:click={() => (modalOpen = false)}>Schließen</button>
				{:else}
					<button class="btn btn-disabled" disabled>Herunterladen...</button>
				{/if}
			</div>
		{/if}
	</div>
</dialog>

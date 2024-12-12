<script lang="ts">
	import { afterUpdate, onMount } from 'svelte';
	import { check, type Update } from '@tauri-apps/plugin-updater';
	import { relaunch } from '@tauri-apps/plugin-process';
	import { debug, error } from '@tauri-apps/plugin-log';
	import { marked } from 'marked';
	import '$lib/css/md.css';
	import { open } from '@tauri-apps/plugin-shell';
	import { isOnline } from './stores';

	let update: Update | null = null;
	let downloadProgress = 0;
	let downloadStarted = false;
	let downloadFinished = false;
	let modalOpen = false;

	onMount(async () => {
		if (!$isOnline) return;

		update = await check();

		if (update) {
			modalOpen = true;
		}
	});

	// Nachdem der HTML-Inhalt gerendert wurde, werden alle Links abgefangen
	afterUpdate(() => {
		if (update) {
			// Alle Links im body finden und die Funktion openLink darauf anwenden
			const links = document.querySelectorAll('.body a');
			links.forEach((link) => {
				link.addEventListener('click', openLink);
			});
		}
	});

	// Funktion zum Abfangen des Klicks auf Links
	function openLink(event: Event) {
		event.preventDefault(); // Verhindere das Standard-Verhalten des Links
		if (event.target instanceof HTMLAnchorElement) {
			const URL = event.target.getAttribute('href');
			if (URL) {
				open(URL);
			}
		}
	}

	async function download() {
		if (!$isOnline) {
			error('You are not connected to the internet.');
			return;
		}
		if (update && !downloadStarted) {
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
	<div class="modal-box mx-4 w-full max-w-xl sm:w-auto sm:max-w-3xl">
		<button
			class="btn btn-circle btn-sm absolute right-2 top-2"
			on:click={() => (modalOpen = false)}>✕</button
		>

		{#if update !== null && update.body}
			<h2 class="mb-2 text-xl font-semibold sm:text-3xl">Es ist ein neues Update verfügbar</h2>
			<h3 class="text-lg font-semibold sm:text-2xl">Version {update.version}</h3>
			<div class="body my-3 h-[40rem] overflow-y-scroll rounded-md bg-base-200 px-3">
				{#await marked.parse(update.body)}
					<p>Lade Änderungsprotokoll...</p>
				{:then body}
					{@html body} <!-- eslint-disable-line -->
				{/await}
			</div>

			<div class="mt-4">
				{#if downloadStarted && !downloadFinished}
					<p class="mb-2">Fortschritt des Downloads: {downloadProgress}%</p>
					<progress class="progress progress-primary w-full" value={downloadProgress} max="100"
					></progress>
				{:else if downloadFinished}
					<p class="mt-4 text-lg font-semibold text-success">
						Das Update wurde erfolgreich abgeschlossen!
					</p>
				{/if}
			</div>

			<div class="mt-6 flex flex-col justify-end space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
				{#if update && !downloadStarted}
					<button class="btn btn-primary" disabled={!$isOnline} on:click={download}
						>Update herunterladen</button
					>
				{:else if update && downloadFinished}
					<button class="btn btn-secondary" on:click={() => (modalOpen = false)}>Schließen</button>
				{/if}
			</div>
		{/if}
	</div>
</dialog>

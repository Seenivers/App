<script lang="ts">
	import { onMount } from 'svelte';
	import { check, type DownloadEvent, type Update } from '@tauri-apps/plugin-updater';
	import { relaunch } from '@tauri-apps/plugin-process';
	import { debug, error } from '@tauri-apps/plugin-log';
	import { marked } from 'marked';
	import '$lib/css/md.css';
	import { openUrl } from '@tauri-apps/plugin-opener';
	import { online } from 'svelte/reactivity/window';
	import { backup } from './utils/db/backup';
	import { _ } from 'svelte-i18n';

	let update: Update | null = $state(null);
	let downloadProgress = $state(0);
	let downloadStarted = $state(false);
	let downloadFinished = $state(false);
	let modalOpen = $state(false);
	let contentLength: number | undefined = $state(0);
	let downloaded = $state(0);

	onMount(async () => {
		if (online.current) {
			const result = await check();
			if (result) {
				update = result;
				modalOpen = true;
			}
		}
	});

	$effect(() => {
		if (!update) return;
		const links = document.querySelectorAll('.body a');
		links.forEach((link) => link.addEventListener('click', handleLinkClick));

		return () => links.forEach((link) => link.removeEventListener('click', handleLinkClick));
	});

	function handleLinkClick(event: Event) {
		event.preventDefault();
		if (event.target instanceof HTMLAnchorElement) {
			const url = event.target.getAttribute('href');
			if (url) openUrl(url);
		}
	}

	async function download() {
		if (!online.current) {
			error($_('networkStatus.error'));
			return;
		}
		if (update && !downloadStarted) {
			await backup.create();
			await update.download(downloadLog);
		}
	}

	async function downloadAndInstall() {
		if (!online.current) {
			error($_('networkStatus.error'));
			return;
		}
		if (update && !downloadStarted) {
			await backup.create();
			await update.downloadAndInstall(downloadLog);
			debug('Update installiert');
			await relaunch();
		}
	}

	async function downloadLog(event: DownloadEvent) {
		switch (event.event) {
			case 'Started':
				downloadStarted = true;
				downloadFinished = false;
				contentLength = event.data.contentLength;

				debug(
					`Download gestartet für Version ${update?.version}. Erwartete Dateigröße: ${contentLength ?? 'unbekannt'} Bytes.`
				);
				break;
			case 'Progress':
				downloaded += event.data.chunkLength;
				if (!contentLength) {
					debug(
						`Download-Fortschritt kann nicht berechnet werden: Content-Length nicht verfügbar.`
					);
					return;
				}
				if (downloaded > contentLength) {
					debug(
						`Download-Fortschritt: ${downloaded} von ${contentLength} Bytes (WARNUNG: Geladene Daten überschreiten erwartete Größe!)`
					);
					return;
				}
				downloadProgress = Math.round((downloaded / contentLength) * 100);
				debug(`Download-Fortschritt: ${downloadProgress}% (${downloaded}/${contentLength} Bytes)`);
				break;
			case 'Finished':
				downloadFinished = true;
				downloadProgress = 100;
				debug(`Download abgeschlossen für Version ${update?.version}.`);
				break;
		}
	}
</script>

<dialog class="modal backdrop-blur-sm" open={modalOpen}>
	<div class="modal-box flex w-full max-w-lg flex-col space-y-2 md:max-w-2xl">
		<button
			class="btn btn-circle btn-sm absolute top-2 right-2"
			onclick={() => {
				modalOpen = false;
				update?.close();
			}}
		>
			✕
		</button>

		{#if update && update.body}
			<h2 class="text-xl font-semibold md:text-2xl">{$_('updater.available')}</h2>
			<h3 class="text-lg font-semibold md:text-xl">
				{$_('updater.version', { values: { version: update.version } })}
			</h3>
			<h4 class="text-lg">{$_('updater.changelog')}</h4>

			<div class="body bg-base-200 my-3 max-h-[70vh] flex-1 overflow-y-auto rounded-md px-3">
				{#await marked.parse(update.body)}
					<p>{$_('updater.loadChangelog')}</p>
				{:then body}
					{@html body} <!-- eslint-disable-line -->
				{/await}
			</div>

			{#if downloadStarted && !downloadFinished}
				<p class="mb-2">Download-Fortschritt: {downloadProgress}%</p>
				<progress class="progress progress-primary w-full" value={downloadProgress} max="100"
				></progress>
			{:else if downloadFinished}
				<p class="text-success mt-4 text-lg font-semibold">{$_('updater.downloadFinished')}</p>
			{/if}

			<div class="flex flex-col justify-end space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
				{#if update && !downloadStarted}
					<button class="btn btn-primary" disabled={!online.current} onclick={download}>
						{$_('updater.download')}
					</button>
					<button class="btn btn-primary" disabled={!online.current} onclick={downloadAndInstall}>
						{$_('updater.downloadandInstall')}
					</button>
				{:else if update && downloadFinished}
					<button class="btn btn-secondary" onclick={update.install}>{$_('updater.install')}</button
					>
				{/if}
			</div>
		{/if}
	</div>
</dialog>

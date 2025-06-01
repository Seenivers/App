<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Updater from '$lib/updater.svelte';
	import Toast from '$lib/toast/toast.svelte';
	import '../app.css';
	import { networkStatus } from '$lib/utils/networkStatus';
	import { db } from '$lib/db/database';
	import { settings } from '$lib/stores.svelte';
	import { attachConsole, attachLogger, trace } from '@tauri-apps/plugin-log';
	import type { UnlistenFn } from '@tauri-apps/api/event';
	import { forwardConsole } from '$lib/utils/log';
	import { online } from 'svelte/reactivity/window';
	import { discord } from '$lib/discord';
	import { destroy } from 'tauri-plugin-drpc';
	import { handleElements } from '$lib/utils/utils';
	import { setTheme } from '$lib/utils/themeUtils';
	import { updateActors, updateCollections, updateMovies, updateOldDB } from '$lib/db/update';
	import ProgressBar from '$lib/ProgressBar.svelte';
	import { autoBackup, cleanupBackups } from '$lib/utils/autoBackup';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	oncontextmenu = (event: MouseEvent) => {
		if (import.meta.env.DEV) return;
		event.preventDefault();
	};

	let logLogger: UnlistenFn;
	let logConsole: UnlistenFn;

	onMount(async () => {
		if (settings) {
			logConsole = await attachConsole();
			logLogger = await attachLogger(forwardConsole);

			setTheme(settings.theme);

			await discord();

			if (import.meta.env.PROD) {
				await autoBackup();
				await cleanupBackups();
				if (online.current) {
					await updateOldDB();
					await updateMovies();
					await updateCollections();
					await updateActors();
				}
			}
		}
		networkStatus();

		handleElements();
		const observer = new MutationObserver(() => handleElements());
		observer.observe(document.body, { childList: true, subtree: true });

		trace('App loaded');
	});

	onDestroy(async () => {
		await destroy();

		logLogger();
		logConsole();

		trace('App closed');
	});
</script>

<div class="flex h-fit min-h-screen flex-col bg-base-300">
	<ProgressBar />
	{#if db && settings}
		{@render children?.()}
		<Toast />
		{#if online.current && !import.meta.env.DEV}
			<Updater />
		{/if}
	{:else}
		<div class="flex items-center justify-center">
			<div
				class="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
			></div>
		</div>
	{/if}
</div>

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Updater from '$lib/components/updater.svelte';
	import Toast from '$lib/toast/toast.svelte';
	import '../app.css';
	import { networkStatus } from '$lib/utils/networkStatus';
	import { db } from '$lib/db/database';
	import { settings } from '$lib/stores.svelte';
	import { online } from 'svelte/reactivity/window';
	import { discord } from '$lib/utils/discord';
	import { stop as stopDrpc } from 'tauri-plugin-drpc';
	import { handleElements } from '$lib/utils/utils';
	import { setTheme } from '$lib/utils/themeUtils';
	import {
		collectAndProcessWatchedFiles,
		updateActors,
		updateCollections,
		updateMovies,
		updateOldDB
	} from '$lib/db/update';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import { autoBackup, cleanupBackups } from '$lib/utils/autoBackup';
	import { getCurrentWebview } from '@tauri-apps/api/webview';
	import { syncWatchlist } from '$lib/utils/tmdb/watchlist';
	import { endClientSession, startClientSession } from '$lib/utils/telemetry';
	import { listen, type UnlistenFn } from '@tauri-apps/api/event';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();
	let handleCloseRequested: UnlistenFn | undefined;

	oncontextmenu = (event: MouseEvent) => {
		if (import.meta.env.DEV) return;
		event.preventDefault();
	};

	onMount(async () => {
		handleCloseRequested = await listen('tauri://close-requested', customDestroy);

		const mainWindow = getCurrentWebview().label === 'main';

		if (settings) {
			setTheme(settings.theme);

			if (mainWindow) {
				await discord();
				startClientSession();
			}

			if (import.meta.env.PROD && mainWindow) {
				await autoBackup();
				await cleanupBackups();
				if (online.current) {
					await syncWatchlist();
					await updateOldDB();
					await updateMovies();
					await updateCollections();
					await updateActors();
					await collectAndProcessWatchedFiles();
				}
			}
		}
		networkStatus();

		handleElements();
		const observer = new MutationObserver(() => handleElements());
		observer.observe(document.body, { childList: true, subtree: true });

		console.debug('App loaded');
	});

	onDestroy(customDestroy);

	async function customDestroy() {
		endClientSession();
		await stopDrpc();
		console.debug('App closed');
	}
</script>

<div class="bg-base-300 flex h-fit min-h-screen flex-col">
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

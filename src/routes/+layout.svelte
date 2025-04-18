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
	import { startRPC } from '$lib/discord';
	import { destroy } from 'tauri-plugin-drpc';
	import { handleElements } from '$lib/utils/utils';
	import { settingsDB } from '$lib/utils/db/settings';
	import { setTheme } from '$lib/utils/themeUtils';
	import { updateActors, updateCollections, updateMovies, updateOldDB } from '$lib/db/update';

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
			setTheme(settings.theme);

			if (import.meta.env.PROD) {
				await updateOldDB();
				await updateMovies();
				await updateCollections();
				await updateActors();
			}

			logConsole = await attachConsole();
			logLogger = await attachLogger(forwardConsole);

			await startRPC();
		}
		networkStatus();

		handleElements();
		const observer = new MutationObserver(() => handleElements());
		observer.observe(document.body, { childList: true, subtree: true });

		trace('App loaded');
	});

	onDestroy(async () => {
		trace('App closed');

		await settingsDB.update(settings);

		await destroy();

		logLogger();
		logConsole();
	});
</script>

<div class="flex h-fit min-h-screen flex-col bg-base-300">
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

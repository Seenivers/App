<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Updater from '$lib/updater.svelte';
	import Toast from '$lib/toast/toast.svelte';
	import '../app.css';
	import { networkStatus } from '$lib/utils/networkStatus';
	import { db } from '$lib/db/database';
	import { settings } from '$lib/db/funktion';
	import { attachConsole, attachLogger, trace } from '@tauri-apps/plugin-log';
	import type { UnlistenFn } from '@tauri-apps/api/event';
	import { forwardConsole } from '$lib/utils/log';
	import { online } from 'svelte/reactivity/window';
	import { startRPC } from '$lib/discord';
	import { destroy } from 'tauri-plugin-drpc';
	import { handleElements } from '$lib/utils/utils';

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
		logConsole = await attachConsole();
		logLogger = await attachLogger(forwardConsole);
		networkStatus();

		handleElements();
		const observer = new MutationObserver(() => handleElements());
		observer.observe(document.body, { childList: true, subtree: true });

		await startRPC();

		trace('App loaded');
	});

	onDestroy(async () => {
		trace('App closed');

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

<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import Updater from '$lib/updater.svelte';
	import Toast from '$lib/toast/toast.svelte';
	import '../app.css';
	import { networkStatus } from '$lib/networkStatus';
	import { db } from '$lib/db/database';
	import { settings } from '$lib/db/funktion';
	import { attachConsole, attachLogger, trace } from '@tauri-apps/plugin-log';
	import type { UnlistenFn } from '@tauri-apps/api/event';
	import { forwardConsole } from '$lib/log';
	import { isOnline } from '$lib/stores.svelte';
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

		trace('App loaded');
	});

	onDestroy(() => {
		trace('App closed');

		logLogger();
		logConsole();
	});
</script>

<div class="flex h-fit min-h-screen flex-col bg-base-300">
	{#if db && settings}
		{@render children?.()}
		<Toast />
		{#if $isOnline && !import.meta.env.DEV}
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

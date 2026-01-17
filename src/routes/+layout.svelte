<script lang="ts">
	import { onMount, onDestroy } from 'svelte';
	import Updater from '$lib/components/updater.svelte';
	import Toast from '$lib/toast/toast.svelte';
	import ProgressBar from '$lib/components/ProgressBar.svelte';
	import '../app.css';
	import { db } from '$lib/db/database';
	import { online } from 'svelte/reactivity/window';
	import { initApp, destroyApp } from '$lib/utils/appInit';
	import { getSettings, initSettings } from '$lib/utils/settings/state';

	interface Props {
		children?: import('svelte').Snippet;
	}

	let { children }: Props = $props();

	onMount(async () => {
		await initApp();
		void initSettings();
	});
	onDestroy(destroyApp);
</script>

<div class="bg-base-300 flex h-fit min-h-screen flex-col">
	<ProgressBar />
	{#if db && getSettings()}
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

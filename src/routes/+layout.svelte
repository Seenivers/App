<script>
	import { onDestroy } from 'svelte';
	import { cleanupData, data } from '$lib/db';
	import Updater from '$lib/updater.svelte';
	import '../app.css';

	onDestroy(() => {
		cleanupData();
	});
</script>

<div class="flex h-fit min-h-screen flex-col bg-base-300">
	{#if $data}
		<slot />
	{:else}
		<span class="loading loading-infinity loading-lg text-info"></span>
	{/if}
	<Updater />
</div>

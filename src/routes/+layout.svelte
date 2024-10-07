<script>
	import { onDestroy } from 'svelte';
	import { cleanupData, data } from '$lib/db';
	import Updater from '$lib/updater.svelte';
	import Toast from '$lib/toast/toast.svelte';
	import '../app.css';

	onDestroy(() => {
		cleanupData();
	});
</script>

<div class="flex h-fit min-h-screen flex-col bg-base-300">
	{#if $data}
		<slot />
		<Toast />
	{:else}
		<span class="loading loading-infinity loading-lg text-info"></span>
	{/if}
	<Updater />
</div>

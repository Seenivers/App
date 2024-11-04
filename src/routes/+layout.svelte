<script>
	import { onDestroy, onMount } from 'svelte';
	import { cleanupData, data } from '$lib/db';
	import Updater from '$lib/updater.svelte';
	import Toast from '$lib/toast/toast.svelte';
	import '../app.css';
	import { addCustomEventListener, removeCustomEventListener } from '$lib/networkStatus';

	onMount(async () => {
		addCustomEventListener();
	});

	onDestroy(() => {
		cleanupData();
		removeCustomEventListener();
	});
</script>

<div class="flex h-fit min-h-screen flex-col bg-base-300">
	{#if $data}
		<slot />
		<Toast />
		{#if $data.settings.online}
			<Updater />
		{/if}
	{:else}
		<div class="flex items-center justify-center">
			<div
				class="h-16 w-16 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
			/>
		</div>
	{/if}
</div>

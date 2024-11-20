<script lang="ts">
	import { onMount } from 'svelte';
	import Updater from '$lib/updater.svelte';
	import Toast from '$lib/toast/toast.svelte';
	import '../app.css';
	import { networkStatus } from '$lib/networkStatus';
	import { db } from '$lib/db/database';
	import { settings } from '$lib/db/schema';

	oncontextmenu = (event: MouseEvent) => {
		event.preventDefault();
	};

	onMount(async () => {
		networkStatus();
	});
</script>

<div class="flex h-fit min-h-screen flex-col bg-base-300">
	{#if db && settings}
		<slot />
		<Toast />
		{#if window.navigator.onLine && !import.meta.env.DEV}
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

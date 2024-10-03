<script>
	import { onDestroy } from 'svelte';
	import '../app.css';
	import { cleanupData } from '$lib/db';

	onDestroy(() => {
		cleanupData();
	});
</script>

<div class="flex h-fit min-h-screen flex-col bg-base-300">
	<slot />
</div>

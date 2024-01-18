<script>
	import Updater from '$lib/updater.svelte';
	import '../app.postcss';
	import { load } from '../ts/dir';

	load();
</script>

<div class="min-h-screen w-full bg-base-300 text-base-content h-fit">
	<Updater/>
	<slot />
</div>

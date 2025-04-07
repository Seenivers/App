<script lang="ts">
	import { settings } from '$lib/stores.svelte';
	import { app } from '@tauri-apps/api';
	import Navbar from '$lib/Navbar.svelte';
	import { onMount } from 'svelte';
	import { discord } from '$lib/discord';
	import { setTheme } from '$lib/utils/themeUtils';
	import Backup from './backup.svelte';
	import Settings from './settings.svelte';

	onMount(() => {
		discord();
	});
</script>

<Navbar
	back={true}
	onclick={async () => {
		setTheme(settings.theme);
		window.history.length > 1 ? window.history.back() : (window.location.href = '/');
	}}
></Navbar>

<main class="container mx-auto w-full flex-grow px-4 py-6 lg:w-4/5 xl:w-2/3">
	<div role="tablist" class="tabs tabs-lifted">
		<!-- Einstellungen Tab -->
		<input type="radio" name="my_tabs" role="tab" class="tab" aria-label="Einstellungen" checked />
		<div role="tabpanel" class="tab-content rounded-box border-base-300 bg-base-100 p-6">
			<Settings />
		</div>

		<!-- Backup Tab -->
		<input type="radio" name="my_tabs" role="tab" class="tab" aria-label="Backup" />
		<div role="tabpanel" class="tab-content rounded-box border-base-300 bg-base-100 p-6">
			<Backup />
		</div>
	</div>
</main>

<footer class="footer footer-center bg-base-200 text-base-content p-4">
	<aside>
		{#await app.getVersion() then version}
			<p>v{version}</p>
		{/await}
	</aside>
</footer>

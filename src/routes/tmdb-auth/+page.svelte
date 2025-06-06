<script lang="ts">
	import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
	import { onMount } from 'svelte';
	import { type PageData } from './$types';

	let { data }: { data: PageData } = $props();

	onMount(async () => {
		await getCurrentWebviewWindow().emitTo({ kind: 'Any' }, 'tmdb-auth', data.session);
		await getCurrentWebviewWindow().close();
	});
</script>

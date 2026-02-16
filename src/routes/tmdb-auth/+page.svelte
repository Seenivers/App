<script lang="ts">
	import { TMDB_AUTH_EVENT } from '$lib/utils/authentication';
	import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
	import { onMount } from 'svelte';

	onMount(async () => {
		await getCurrentWebviewWindow().emitTo({ kind: 'Any' }, TMDB_AUTH_EVENT);
		await getCurrentWebviewWindow().close();
	});
</script>

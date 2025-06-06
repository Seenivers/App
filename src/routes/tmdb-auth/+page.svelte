<script lang="ts">
	import { getCurrentWebviewWindow } from '@tauri-apps/api/webviewWindow';
	import { onMount } from 'svelte';

	onMount(async () => {
		await getCurrentWebviewWindow().emitTo({ kind: 'Any' }, 'tmdb-auth');
		await getCurrentWebviewWindow().close();
	});
</script>

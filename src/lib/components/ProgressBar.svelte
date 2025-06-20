<script lang="ts">
	import { navigating } from '$app/state';
	import { onDestroy } from 'svelte';

	// Lokaler State für die Sichtbarkeit
	let show = $state(false);
	let timeout: ReturnType<typeof setTimeout> | undefined;

	/**
	 * $effect läuft nach jedem Render im Browser und trackt,
	 * wenn wir `navigating()` lesen. So können wir
	 * auf Start/Ende der Navigation reagieren.
	 */
	$effect(() => {
		// Alte Timer aufräumen
		if (timeout) {
			clearTimeout(timeout);
			timeout = undefined;
		}

		if (navigating.complete !== null) {
			// Navigation läuft → Progress erst nach 500 ms anzeigen
			timeout = setTimeout(() => {
				show = true;
			}, 500);
		} else {
			// Navigation beendet → sofort ausblenden
			show = false;
		}

		// Teardown: läuft vor jedem Re-run und beim Unmount
		return () => {
			if (timeout) {
				clearTimeout(timeout);
				timeout = undefined;
			}
		};
	});

	onDestroy(() => {
		// Sicherstellen, dass kein Timer hängen bleibt
		if (timeout) clearTimeout(timeout);
	});
</script>

{#if show}
	<progress class="progress progress-accent fixed top-0 z-50 w-full"></progress>
{/if}

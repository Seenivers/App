<!-- https://daisyui.com/components/toast/ -->
<script lang="ts">
	import { settings } from '$lib/db/funktion';
	import type { AlertPositionHorizontally, AlertPositionVertically } from '$lib/types/settings';
	import { messages } from './toast';

	const positionHorizontally: AlertPositionHorizontally = settings
		? settings.toastPosition.horizontal
		: 'end';
	const positionVertically: AlertPositionVertically = settings
		? settings.toastPosition.vertical
		: 'bottom';
</script>

<!-- Toast messages rendering -->
<div class={`toast z-50 toast-${positionHorizontally} toast-${positionVertically}`}>
	{#each $messages as { type, text }}
		<div class={`alert alert-${type}`}>
			<span>{text}</span>
		</div>
	{/each}
</div>

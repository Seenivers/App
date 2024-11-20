<!-- https://daisyui.com/components/toast/ -->
<script lang="ts">
	import { settings } from '$lib/db/funktion';
	import type { AlertPositionHorizontally, AlertPositionVertically } from '$lib/types/settings';
	import { messages } from './toast';
	import { fly } from 'svelte/transition';
	import { cubicOut, cubicIn } from 'svelte/easing';

	const positionHorizontally: AlertPositionHorizontally = settings
		? settings.toastPosition.horizontal
		: 'end';
	const positionVertically: AlertPositionVertically = settings
		? settings.toastPosition.vertical
		: 'bottom';
</script>

<!-- Toast messages rendering with optimized animation -->
<div
	class="toast z-50 toast-{positionHorizontally} toast-{positionVertically} max-h-96 overflow-y-auto"
>
	{#each $messages as { type, text }}
		<div
			class="alert alert-{type} mb-2 h-full min-h-fit w-full max-w-prose overflow-y-auto rounded-lg p-4 shadow-lg transition-all"
			in:fly={{ duration: 400, y: -50, easing: cubicOut }}
			out:fly={{ duration: 400, y: 100, easing: cubicIn }}
		>
			<span>{text}</span>
		</div>
	{/each}
</div>

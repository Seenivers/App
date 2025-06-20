<!-- https://daisyui.com/components/toast/ -->
<script lang="ts">
	import { settings } from '$lib/stores.svelte';
	import type { AlertPositionHorizontally, AlertPositionVertically } from '$lib/types/settings';
	import { messages } from '$lib/toast/toast';
	import { fly } from 'svelte/transition';
	import { cubicOut, cubicIn } from 'svelte/easing';

	// Default-Werte setzen, falls Einstellungen nicht verfügbar sind
	const positionHorizontally: AlertPositionHorizontally =
		settings?.toastPosition.horizontal || 'end';
	const positionVertically: AlertPositionVertically = settings?.toastPosition.vertical || 'bottom';
	const toastVariants = {
		start: 'toast-start',
		center: 'toast-center',
		end: 'toast-end',
		top: 'toast-top',
		middle: 'toast-middle',
		bottom: 'toast-bottom'
	};
	const toastAlertVariants = {
		info: 'alert-info',
		success: 'alert-success',
		warning: 'alert-warning',
		error: 'alert-error'
	};
</script>

<!-- Toast Container -->
<div
	class={`toast z-50 ${toastVariants[positionHorizontally]} ${toastVariants[positionVertically]} !min-w-unset max-h-full w-fit max-w-full print:hidden`}
>
	<details class="collapse-plus bg-base-100/70 collapse backdrop-blur-sm" open>
		<summary class="collapse-title text-xl font-medium">Info-Panel</summary>
		<div
			class="collapse-content !min-h-unset !min-w-unset mb-3 box-border grid max-h-[33vh] w-full flex-col flex-wrap gap-3 overflow-y-auto p-3"
		>
			{#if $messages.length > 0}
				{#each $messages as { type, text, id } (id)}
					<div
						class="alert min-h-fit w-fit shrink-0 snap-center rounded-lg p-4 break-words whitespace-normal shadow-lg transition-all
						{toastAlertVariants[type]}"
						in:fly={{ duration: 400, y: -50, easing: cubicOut }}
						out:fly={{ duration: 400, y: 100, easing: cubicIn }}
					>
						<span>{text}</span>
					</div>
				{/each}
			{:else}
				<p class="text-center">Keine Meldungen</p>
			{/if}
		</div>
	</details>
</div>

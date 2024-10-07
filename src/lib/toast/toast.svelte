<!-- https://daisyui.com/components/toast/ -->
<script lang="ts">
	import { data } from '$lib/db';
	import type { AlertPositionHorizontally, AlertPositionVertically } from '../types';
	import { messages } from './toast';

	const positionHorizontally: AlertPositionHorizontally =
		$data.settings.toastPosition.horizontal || 'end';
	const positionVertically: AlertPositionVertically =
		$data.settings.toastPosition.vertical || 'bottom';
</script>

<!-- Toast messages rendering -->
<div class={`toast z-50 toast-${positionHorizontally} toast-${positionVertically}`}>
	{#each $messages as { type, text }}
		<div class={`alert alert-${type}`}>
			<span>{text}</span>
		</div>
	{/each}
</div>

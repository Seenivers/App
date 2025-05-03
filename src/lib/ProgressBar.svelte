<script lang="ts">
	import { navigating } from '$app/state';
</script>

{#if navigating.complete !== null}
	<progress class="progress progress-accent fixed top-0 z-50 w-full"></progress>
{/if}

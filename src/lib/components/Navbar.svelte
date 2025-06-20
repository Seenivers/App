<script lang="ts">
	import { goto } from '$app/navigation';
	import { _ } from 'svelte-i18n';
	interface NavbarProps {
		back?: boolean;
		onclick?: () => void;
		ondblclick?: () => void;
		left?: () => null;
		middle?: () => null;
		right?: () => null;
	}

	let {
		back = false,
		onclick = () =>
			window.history.length > 1 ? window.history.back() : (window.location.href = '/'),
		ondblclick = () => goto('/'),
		left,
		middle,
		right
	}: NavbarProps = $props();
</script>

<nav
	class="navbar bg-base-100 sticky top-0 z-10 flex justify-between p-2 shadow-lg md:p-4 print:hidden"
>
	{#if left || back}
		<div class="gap-1">
			{#if back}
				<button class="btn btn-sm md:btn-md" {onclick} {ondblclick}>
					{window.history.length > 1 ? $_('nav.back') : $_('nav.backToHome')}
				</button>
			{/if}
			{@render left?.()}
		</div>
	{/if}
	{#if middle}
		<div class="gap-1">
			{@render middle?.()}
		</div>
	{/if}
	{#if right}
		<div class="gap-1">
			{@render right?.()}
		</div>
	{/if}
</nav>

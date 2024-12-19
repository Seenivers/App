<script lang="ts">
	interface NavbarProps {
		back?: boolean;
		onclick?: () => void;
		left?: () => null;
		middle?: () => null;
		right?: () => null;
	}

	let {
		back = false,
		onclick = () =>
			window.history.length > 1 ? window.history.back() : (window.location.href = '/'),
		left,
		middle,
		right
	}: NavbarProps = $props();
</script>

<nav class="navbar sticky top-0 z-10 flex justify-between bg-base-100 p-2 shadow-lg md:p-4">
	{#if left || back}
		<div class="gap-1">
			{#if back}
				<button class="btn btn-sm md:btn-md" {onclick}>
					{window.history.length > 1 ? 'Zurück' : 'Zur Startseite'}
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

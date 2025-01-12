<script lang="ts">
	import { page } from '$app/state';
	import { _ } from 'svelte-i18n';
</script>

<main class="flex flex-grow flex-col justify-center">
	<div class="hero">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold opacity-10 lg:text-7xl xl:text-9xl">
					{$_('error.title')}
				</h1>
				<h2 class="mb-5 text-4xl font-bold opacity-10 lg:text-6xl xl:text-8xl">{page.status}</h2>
				<p class="mb-5 text-3xl">{page.error?.message}</p>
				<button
					class="btn btn-outline btn-sm md:btn-md"
					onclick={() =>
						window.history.length > 1 ? window.history.back() : (window.location.href = '/')}
				>
					{window.history.length > 1 ? $_('nav.back') : $_('nav.backToHome')}
				</button>
			</div>
		</div>
	</div>
</main>

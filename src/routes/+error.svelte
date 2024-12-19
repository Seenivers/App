<script lang="ts">
	import { page } from '$app/stores';
</script>

<main class="flex flex-grow flex-col justify-center">
	<div class="hero">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold opacity-10 lg:text-7xl xl:text-9xl">Error</h1>
				<h2 class="mb-5 text-4xl font-bold opacity-10 lg:text-6xl xl:text-8xl">{$page.status}</h2>
				<p class="mb-5 text-3xl">{$page.error?.message}</p>
				<button
					class="btn btn-outline btn-sm md:btn-md"
					onclick={() =>
						window.history.length > 1 ? window.history.back() : (window.location.href = '/')}
				>
					{window.history.length > 1 ? 'Zurück' : 'Zur Startseite'}
				</button>
			</div>
		</div>
	</div>
</main>

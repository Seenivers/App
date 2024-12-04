<script lang="ts">
	import type { PageData } from './$types';
	import { getCollection, settings } from '$lib/db/funktion';
	import { image } from '$lib/image';

	export let data: PageData;

	const id = data.id;
</script>

<!-- Navbar -->
<nav class="navbar flex-wrap gap-3 bg-base-100 p-2 md:p-4">
	<button
		class="btn btn-sm md:btn-md"
		on:click={() =>
			window.history.length > 1 ? window.history.back() : (window.location.href = '/')}
		>{window.history.length > 1 ? 'Zurück' : 'Zur Startseite'}</button
	>
</nav>

<!-- Main -->
<main class="flex flex-col items-center p-3 md:p-5">
	{#await getCollection(id) then collection}
		{#if collection}
			<div class="mx-auto w-full max-w-full">
				{#await image(collection.backdrop_path, 'backdrops', true) then image2}
					<div class="hero rounded-box bg-base-200" style="background-image: url({image2.src});">
						<div class="hero-overlay rounded-box bg-opacity-90"></div>
						<div class="hero-content flex-col lg:flex-row">
							{#await image(collection.poster_path, 'posters', true) then { src, height, width }}
								<img
									alt="Poster"
									{src}
									{height}
									{width}
									loading="lazy"
									class="max-w-sm rounded-lg shadow-2xl"
								/>
							{/await}
							<div>
								<h1 class="text-5xl font-bold">{collection.name}</h1>
								<p class="py-6 text-2xl">
									{collection.overview}
								</p>
							</div>
						</div>
					</div>
				{/await}

				<div>
					<h2 class="my-2 text-4xl font-bold">Filme</h2>
					<div class="grid grid-cols-1 gap-4">
						{#each collection.parts as movie}
							<a
								href="/movie?id={movie.id}"
								class="flex max-h-min gap-4 rounded-box bg-base-200 p-4"
							>
								{#await image(movie.poster_path, 'posters', true) then { src, height, width }}
									<img
										alt="Poster"
										{src}
										{height}
										{width}
										loading="lazy"
										class="max-w-xs rounded-lg shadow-2xl"
									/>
								{/await}
								<span class="flex flex-col gap-2">
									<h3 class="text-2xl font-bold">{movie.title}</h3>
									{#if movie.title !== movie.original_title}
										<p class="text-lg font-semibold italic">{movie.original_title}</p>
									{/if}
									<p>
										{new Date(movie.release_date).toLocaleDateString(
											settings ? settings.language : window.navigator.language
										)}
									</p>
									<p>{movie.overview}</p>
								</span>
							</a>
						{/each}
					</div>
				</div>
			</div>
		{:else}
			<div class="flex h-full w-full justify-center">
				<div class="grid gap-8">
					<p class="text-4xl md:text-5xl">Keine Daten</p>
					<a href="/" class="btn btn-lg text-2xl">Zurück</a>
				</div>
			</div>
		{/if}
	{/await}
</main>

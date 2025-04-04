<script lang="ts">
	import type { PageData } from './$types';
	import { settings } from '$lib/stores.svelte';
	import { image } from '$lib/image/image';
	import Navbar from '$lib/Navbar.svelte';
	import Img from '$lib/image/Img.svelte';
	import { onMount } from 'svelte';
	import { discord } from '$lib/discord';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let isGridView = $state(false); // Startwert für das Layout

	onMount(() => {
		discord({
			details: `Schaut gerade die ${data.result.name} an`,
			state: `${data.result.parts.length} Filme`
		});
	});
</script>

<Navbar back={true}>
	{#snippet right()}
		<!-- Toggle für Grid/List-Ansicht -->
		<button class="btn" onclick={() => (isGridView = !isGridView)}>
			{isGridView ? 'Wechsel zu Listenansicht' : 'Wechsel zu Grid-Ansicht'}
		</button>
		<a
			href="https://www.themoviedb.org/collection/{data.id}"
			class="btn btn-sm md:btn-md"
			target="_blank"
			rel="noopener noreferrer">Bei TMDB öffnen</a
		>
	{/snippet}
</Navbar>

<!-- Main -->
<main class="z-0 flex flex-col items-center p-3 md:p-5">
	{#if data.result}
		{@const collection = data.result}
		{@const movies = data.movies}

		<div class="mx-auto w-full max-w-full">
			{#await image(collection.backdrop_path, 'backdrops', true) then backdropImage}
				<div
					class="hero rounded-box bg-base-200"
					style="background-image: url({backdropImage.src});"
				>
					<div class="hero-overlay rounded-box bg-opacity-90"></div>
					<div class="hero-content flex-col gap-4 lg:flex-row">
						<Img
							alt="Poster"
							params={[collection.poster_path, 'backdrops', true]}
							class="max-w-xs rounded-lg shadow-2xl md:max-w-sm"
						/>
						<div class="text-center text-neutral-content lg:text-left">
							<h1 class="text-4xl font-bold md:text-5xl">{collection.name}</h1>
							<p class="py-6 text-lg md:text-2xl">{collection.overview}</p>
						</div>
					</div>
				</div>
			{/await}

			<div class="mt-6 w-full">
				<!-- Grid-Ansicht / Listenansicht -->
				<div
					class="mt-4"
					class:grid={isGridView}
					class:grid-cols-1={isGridView}
					class:md:grid-cols-2={isGridView}
					class:lg:grid-cols-3={isGridView}
					class:xl:grid-cols-4={isGridView}
					class:2xl:grid-cols-5={isGridView}
					class:gap-4={isGridView}
					class:space-y-4={!isGridView}
				>
					{#each collection.parts as movie}
						{@const downloadedMovie = movies.some((m) => m && m.id === movie.id && m.path !== null)}
						<a
							href="/movie?id={movie.id}"
							data-sveltekit-preload-data={downloadedMovie ? 'hover' : 'tap'}
							class="relative flex flex-col items-center gap-4 rounded-lg bg-base-200 p-4 shadow-md"
							class:transform={isGridView}
							class:transition-transform={isGridView}
							class:hover:scale-105={isGridView}
							class:md:flex-row={!isGridView}
						>
							<Img
								alt="Poster"
								params={[movie.poster_path, 'posters', true]}
								class="aspect-[2/3] w-full max-w-[15rem] rounded-lg object-cover shadow-2xl"
							/>
							{#if downloadedMovie}
								<div class="badge badge-accent badge-outline absolute right-3 top-3 bg-base-300">
									Film in der Sammlung
								</div>
							{/if}
							<div
								class:text-center={isGridView}
								class:flex={!isGridView}
								class:flex-col={!isGridView}
								class:gap-2={!isGridView}
								class:text-left={!isGridView}
							>
								<h3 class="text-2xl font-bold">{movie.title}</h3>
								{#if movie.title !== movie.original_title}
									<p class="font-semibold italic">{movie.original_title}</p>
								{/if}
								<p>
									{movie.release_date
										? new Date(movie.release_date).toLocaleDateString(
												settings ? settings.language : window.navigator.language
											)
										: 'Kein Datum vorhanden'}
								</p>
								<p>{movie.overview}</p>
							</div>
						</a>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<div class="flex h-full w-full items-center justify-center">
			<div class="grid gap-8 text-center">
				<p class="text-4xl md:text-5xl">Keine Daten gefunden</p>
				<a href="/" class="btn btn-lg mt-4 text-2xl">Zurück</a>
			</div>
		</div>
	{/if}
</main>

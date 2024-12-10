<script lang="ts">
	import type { PageData } from './$types';
	import { getCollection, settings } from '$lib/db/funktion';
	import { image } from '$lib/image';

	export let data: PageData;
	const id = data.id;

	let isGridView = false; // Startwert für das Layout
</script>

<!-- Navbar -->
<nav class="navbar sticky top-0 z-10 flex justify-between bg-base-100 p-2 shadow-lg md:p-4">
	<div class="gap-1">
		<button
			class="btn btn-sm md:btn-md"
			on:click={() =>
				window.history.length > 1 ? window.history.back() : (window.location.href = '/')}
		>
			{window.history.length > 1 ? 'Zurück' : 'Zur Startseite'}
		</button>
	</div>
	<div class="gap-1">
		<!-- Platzhalter -->
	</div>
</nav>

<!-- Main -->
<main class="z-0 flex flex-col items-center p-3 md:p-5">
	{#await getCollection(id) then collection}
		{#if collection}
			<div class="mx-auto w-full max-w-full">
				{#await image(collection.backdrop_path, 'backdrops', true) then backdropImage}
					<div
						class="hero rounded-box bg-base-200"
						style="background-image: url({backdropImage.src});"
					>
						<div class="hero-overlay rounded-box bg-opacity-90"></div>
						<div class="hero-content flex-col gap-4 lg:flex-row">
							{#await image(collection.poster_path, 'posters', true) then { src, height, width }}
								<img
									alt="Poster"
									{src}
									{height}
									{width}
									loading="lazy"
									class="max-w-xs rounded-lg shadow-2xl md:max-w-sm"
								/>
							{/await}
							<div class="text-center text-slate-300 lg:text-left">
								<h1 class="text-4xl font-bold md:text-5xl">{collection.name}</h1>
								<p class="py-6 text-lg md:text-2xl">{collection.overview}</p>
							</div>
						</div>
					</div>
				{/await}

				<div class="mt-6 w-full">
					<div class="flex items-center justify-between">
						<h2 class="text-3xl font-bold md:text-4xl">Filme</h2>

						<!-- Toggle für Grid/List-Ansicht -->
						<button class="btn btn-outline" on:click={() => (isGridView = !isGridView)}>
							{isGridView ? 'Wechsel zu Listenansicht' : 'Wechsel zu Grid-Ansicht'}
						</button>
					</div>

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
							<a
								href="/movie?id={movie.id}"
								class="flex flex-col items-center gap-4 rounded-lg bg-base-200 p-4 shadow-md"
								class:transform={isGridView}
								class:transition-transform={isGridView}
								class:hover:scale-105={isGridView}
								class:md:flex-row={!isGridView}
							>
								{#await image(movie.poster_path, 'posters', true) then { src, height, width }}
									<img
										alt="Poster"
										{src}
										{height}
										{width}
										loading="lazy"
										class="aspect-[2/3] w-full max-w-[15rem] rounded-lg object-cover shadow-2xl"
									/>
								{/await}
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
	{/await}
</main>

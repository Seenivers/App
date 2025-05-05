<script lang="ts">
	import type { PageData } from './$types';
	import { settings } from '$lib/stores.svelte';
	import { image } from '$lib/image/image';
	import Navbar from '$lib/Navbar.svelte';
	import Img from '$lib/image/Img.svelte';
	import { onMount } from 'svelte';
	import { discord } from '$lib/discord';
	import { _ } from 'svelte-i18n';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let isGridView = $state(false); // Startwert für das Layout
	let moviesStore = $state(data.result.parts);
	let sortNewestFirst = $state(true);

	// Verwende $derived mit einer einzigen Funktion, die beide Zustände referenziert:
	let sortedMovies = $derived(() => {
		// Zugriff auf die reaktiven Werte:
		const movies = moviesStore;
		const sortNewest = sortNewestFirst;
		// Kopiere das Array, um keine direkte Mutation vorzunehmen:
		return [...movies].sort((a, b) => {
			const dateA = a.release_date ? new Date(a.release_date).getTime() : 0;
			const dateB = b.release_date ? new Date(b.release_date).getTime() : 0;
			// Wenn sortNewestFirst true ist, werden die ältesten zuerst angezeigt (d.h. Datum aufsteigend)
			return sortNewest ? dateA - dateB : dateB - dateA;
		});
	});

	// Umschalt-Funktion: Toggle und speichern in localStorage
	function toggleSort() {
		sortNewestFirst = !sortNewestFirst;
		localStorage.setItem('sortNewestFirst', sortNewestFirst.toString());
	}

	onMount(() => {
		const stored = localStorage.getItem('sortNewestFirst');
		if (stored !== null) {
			sortNewestFirst = stored === 'true';
		}

		discord({
			details: `Schaut gerade die ${data.result.name} an`,
			state: `${data.result.parts.length} Filme`
		});
	});
</script>

<Navbar back={true}>
	{#snippet right()}
		<button class="btn" onclick={toggleSort}>
			{#if sortNewestFirst}
				Sortiere: Älteste zuerst
			{:else}
				Sortiere: Neueste zuerst
			{/if}
		</button>
		<!-- Toggle für Grid/List-Ansicht -->
		<button class="btn" onclick={() => (isGridView = !isGridView)}>
			{isGridView ? $_('switchToListView') : $_('switchToGridView')}
		</button>
		<a
			href="https://www.themoviedb.org/collection/{data.id}"
			class="btn btn-sm md:btn-md"
			target="_blank"
			rel="noopener noreferrer">{$_('openOnTMDB')}</a
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
							alt={$_('backdropAlt', { values: { title: collection.name } })}
							params={[collection.poster_path, 'backdrops', true]}
							class="max-w-xs rounded-lg shadow-2xl md:max-w-sm"
						/>
						<div class="text-neutral-content text-center lg:text-left">
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
					{#each sortedMovies() as movie (movie.id)}
						{@const downloadedMovie = movies.some((m) => m && m.id === movie.id && m.path !== null)}
						{@const watched = movies.some((m) => m && m.id === movie.id && m.watched)}
						<a
							href="/movie?id={movie.id}"
							data-sveltekit-preload-data={downloadedMovie ? 'hover' : 'tap'}
							class="bg-base-200 relative flex flex-col items-center gap-4 rounded-lg p-4 shadow-md transition-all duration-300 {isGridView
								? 'transform hover:scale-105'
								: 'md:flex-row'}"
						>
							<Img
								alt={$_('posterAlt', { values: { title: movie.title } })}
								params={[movie.poster_path, 'posters', true]}
								class="aspect-[2/3] w-full max-w-[15rem] rounded-lg object-cover shadow-2xl"
							/>

							<!-- Badge-Container: beide Badges werden hier gruppiert -->
							{#if watched || downloadedMovie}
								<div
									class="absolute right-3 top-3 flex w-full flex-col items-end justify-end gap-1"
								>
									{#if downloadedMovie}
										<div class="badge badge-accent badge-outline bg-base-300">
											{$_('badge.collection')}
										</div>
									{/if}
									{#if watched}
										<div class="badge badge-accent badge-outline bg-base-300">
											{$_('badge.watched')}
										</div>
									{/if}
								</div>
							{/if}

							<div class={isGridView ? 'text-center' : 'flex flex-col gap-2 text-left'}>
								<h3 class="text-2xl font-bold">{movie.title}</h3>
								{#if movie.title !== movie.original_title}
									<p class="font-semibold italic">{movie.original_title}</p>
								{/if}
								<p>
									{movie.release_date
										? new Date(movie.release_date).toLocaleDateString(
												settings ? settings.language : window.navigator.language
											)
										: $_('noInformationAvailable')}
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
				<p class="text-4xl md:text-5xl">{$_('noDataFound')}</p>
				<a href="/" class="btn btn-lg mt-4 text-2xl">{$_('nav.back')}</a>
			</div>
		</div>
	{/if}
</main>

<script lang="ts">
	import type { PageData } from './$types';
	import { image } from '$lib/image/image';
	import Navbar from '$lib/components/Navbar.svelte';
	import Img from '$lib/image/Img.svelte';
	import { onMount } from 'svelte';
	import { discord } from '$lib/utils/discord';
	import { m } from '$lib/paraglide/messages';
	import { collection } from '$lib/utils/db/collection';
	import { getSettings } from '$lib/utils/settings/state';
	import { getLocale } from '$lib/paraglide/runtime';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let watched: boolean = $derived(data.result.watched ?? false);
	let isGridView = $state(false); // Startwert für das Layout
	let sortNewestFirst = $state(true);

	// Verwende $derived mit einer einzigen Funktion, die beide Zustände referenziert:
	let sortedMovies = $derived(() => {
		// Zugriff auf die reaktiven Werte:
		const movies = data.result.parts;
		const sortNewest = sortNewestFirst;
		// Kopiere das Array, um keine direkte Mutation vorzunehmen:
		return [...movies].sort((a, b) => {
			const dateA = a.release_date ? new Date(a.release_date).getTime() : Infinity;
			const dateB = b.release_date ? new Date(b.release_date).getTime() : Infinity;
			// Wenn sortNewestFirst false ist, werden die ältesten zuerst angezeigt
			return sortNewest ? dateB - dateA : dateA - dateB;
		});
	});

	// Umschalt-Funktion: Toggle und speichern in localStorage
	function toggleSort() {
		sortNewestFirst = !sortNewestFirst;
		localStorage.setItem('sortNewestFirst', sortNewestFirst.toString());
	}

	async function toggleWatchedStatus() {
		watched = !watched;
		await collection.update(data.id, { watched: watched });
	}

	onMount(() => {
		const stored = localStorage.getItem('sortNewestFirst');
		if (stored !== null) {
			sortNewestFirst = stored === 'true';
		}

		discord();
	});
</script>

<Navbar back={true}>
	{#snippet right()}
		<button class="btn" onclick={toggleSort}>
			{#if sortNewestFirst}
				{m.sortOldestFirst()}
			{:else}
				{m.sortNewestFirst()}
			{/if}
		</button>
		<!-- Toggle für Grid/List-Ansicht -->
		<button class="btn" onclick={() => (isGridView = !isGridView)}>
			{isGridView ? m.switchToListView() : m.switchToGridView()}
		</button>
		<button class="btn btn-sm md:btn-md" onclick={toggleWatchedStatus} disabled={!data.result}>
			{watched ? m['marked.asWatched']() : m['marked.notWatched']()}
		</button>
		<a
			href="https://www.themoviedb.org/collection/{data.id}"
			class="btn btn-sm md:btn-md"
			target="_blank"
			rel="noopener noreferrer">{m.openOnTMDB()}</a
		>
	{/snippet}
</Navbar>

<!-- Main -->
<main class="z-0 flex flex-col items-center p-3 md:p-5">
	{#if data.result}
		<div class="mx-auto w-full max-w-full">
			{#await image(data.result.backdrop_path, 'backdrops', true) then backdropImage}
				<div class="hero rounded-box bg-base-200 bg-[url('{backdropImage.src}')]">
					<div class="hero-overlay rounded-box bg-opacity-90"></div>
					<div class="hero-content flex-col gap-4 lg:flex-row">
						<Img
							alt={m.backdropAlt({ title: data.result.name })}
							params={[data.result.poster_path, 'backdrops', true]}
							class="max-w-xs rounded-lg shadow-2xl md:max-w-sm"
						/>
						<div class="text-neutral-content text-center lg:text-left">
							<h1 class="text-4xl font-bold md:text-5xl">{data.result.name}</h1>
							<p class="py-6 text-lg md:text-2xl">{data.result.overview}</p>
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
						{@const dbMovie = data.movies.find((m) => m && m.id === movie.id)}
						{@const downloadedMovie = !!dbMovie?.path}
						{@const watched = !!dbMovie?.watched}

						<a
							href="/movie?id={movie.id}"
							data-sveltekit-preload-data={downloadedMovie ? 'hover' : 'tap'}
							class="bg-base-200 relative flex flex-col items-center gap-4 rounded-lg p-4 shadow-md transition-all duration-300 {isGridView
								? 'transform hover:scale-105'
								: 'md:flex-row'}"
						>
							<Img
								alt={m.posterAlt({ title: movie.title })}
								params={[movie.poster_path, 'posters', true]}
								class="aspect-2/3 w-full max-w-60 rounded-lg object-cover shadow-2xl"
							/>

							<!-- Badge-Container: beide Badges werden hier gruppiert -->
							{#if watched || downloadedMovie}
								<div
									class="absolute top-3 right-3 flex w-full flex-col items-end justify-end gap-1"
								>
									{#if downloadedMovie}
										<div class="badge badge-accent badge-outline bg-base-300">
											{m['badge.collection']()}
										</div>
									{/if}
									{#if watched}
										<div class="badge badge-accent badge-outline bg-base-300">
											{m['badge.watched']()}
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
												getSettings() ? getLocale() : window.navigator.language
											)
										: m.noInformationAvailable()}
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
				<p class="text-4xl md:text-5xl">{m.noDataFound()}</p>
				<a href="/" class="btn btn-lg mt-4 text-2xl">{m['nav.back']()}</a>
			</div>
		</div>
	{/if}
</main>

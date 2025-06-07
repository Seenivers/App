<script lang="ts">
	import Fuse from 'fuse.js';
	import type { IFuseOptions } from 'fuse.js';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { PageData } from './$types';
	import Card from '$lib/utils/card.svelte';
	import { _ } from 'svelte-i18n';
	import type { CardscaleNumbers } from '$lib/types/cardscale';
	import Search from '$lib/SVG/search.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { getFilter, setFilter, type SortOption } from '$lib/utils/sessionStorage';
	import Reset from '$lib/SVG/reset.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Ermittelt den tatsächlichen Typ der Einträge aus den geladenen Daten:
	type MovieItem = (typeof data.movies)[number];
	type SeriesItem = (typeof data.series)[number];
	type CollectionItem = (typeof data.collections)[number];

	// UI-Zustände
	let CARDSCALE: CardscaleNumbers = $state(2);
	let search = $state('');
	let showCollections = $state(false);
	let showMovies = $state(true);
	let showSeries = $state(true);
	let sortOption: SortOption = $state('added');
	let selectedGenres: string[] = $state([]);
	let watchedFilter: 'all' | 'watched' | 'unwatched' = $state('all');

	// Fuse.js-Instanzen, getippt auf die tatsächlichen Elementtypen
	let fuseMovies: Fuse<MovieItem>;
	let fuseSeries: Fuse<SeriesItem>;
	let fuseCollections: Fuse<CollectionItem>;

	// Hilfs-Funktion: Genre-Filter
	const genreFilter = (genres: { name: string }[]) =>
		selectedGenres.length === 0 || genres.some((g) => selectedGenres.includes(g.name));

	// Reaktive Filter & Sortierungen mit Fuse.js
	const filteredMovies = $derived(() => {
		const base: MovieItem[] =
			search.trim() === '' ? data.movies : fuseMovies.search(search).map((r) => r.item);
		return base
			.filter(() => showMovies)
			.filter((m) => genreFilter(m.tmdb.genres || []))
			.filter((m) =>
				watchedFilter === 'all' ? true : watchedFilter === 'watched' ? m.watched : !m.watched
			)
			.sort(sortBy);
	});

	const filteredSeries = $derived(() => {
		const base: SeriesItem[] =
			search.trim() === '' ? data.series : fuseSeries.search(search).map((r) => r.item);
		return base
			.filter(() => showSeries)
			.filter((s) => genreFilter(s.tmdb.genres || []))
			.filter((s) =>
				watchedFilter === 'all' ? true : watchedFilter === 'watched' ? s.watched : !s.watched
			)
			.sort(sortBy);
	});

	const filteredCollections = $derived(() => {
		const base: CollectionItem[] =
			search.trim() === '' ? data.collections : fuseCollections.search(search).map((r) => r.item);
		return base
			.filter(() => showCollections)
			.filter(() => genreFilter([])) // Collections haben keine Genres
			.sort(sortBy);
	});

	// Allgemeine Sortierfunktion
	function sortBy(a: any, b: any) {
		switch (sortOption) {
			case 'rating':
				return (b.tmdb.vote_average ?? 0) - (a.tmdb.vote_average ?? 0);
			case 'duration':
				return (b.tmdb.runtime ?? 0) - (a.tmdb.runtime ?? 0);
			case 'release_date_desc':
				return (
					new Date((b as any).tmdb.release_date ?? '').getTime() -
					new Date((a as any).tmdb.release_date ?? '').getTime()
				);
			case 'release_date_asc':
				return (
					new Date((a as any).tmdb.release_date ?? '').getTime() -
					new Date((b as any).tmdb.release_date ?? '').getTime()
				);
			case 'popularity':
				return (b.tmdb.popularity ?? 0) - (a.tmdb.popularity ?? 0);
			case 'alpha':
				return (a.tmdb.title || a.tmdb.name || '').localeCompare(b.tmdb.title || b.tmdb.name || '');
			case 'last_watched':
				// Nur auf Filme angewandt – für Series/Collections bleibt der Listen-Index erhalten
				return (
					new Date((b as MovieItem).watchTime ?? 0).getTime() -
					new Date((a as MovieItem).watchTime ?? 0).getTime()
				);
			default: // 'added'
				return new Date(b.updated).getTime() - new Date(a.updated).getTime();
		}
	}

	/** Setzt alle Filter und Suchfelder auf ihre Standardwerte zurück */
	function resetFilters() {
		CARDSCALE = 2;
		search = '';
		showCollections = false;
		showMovies = true;
		showSeries = true;
		sortOption = 'added';
		selectedGenres = [];
		watchedFilter = 'all';
	}

	onMount(() => {
		// Session-Storage wiederherstellen
		const filter = getFilter();
		CARDSCALE = filter.CARDSCALE;
		search = filter.search;
		showCollections = filter.showCollections;
		showMovies = filter.showMovies;
		showSeries = filter.showSeries;
		sortOption = filter.sortOption;
		selectedGenres = filter.selectedGenres;
		watchedFilter = filter.watchedFilter;

		// Fuse-Key-Konfigurationen je Datentyp
		const fuseKeyConfig = {
			movies: [
				{ name: 'tmdb.title', weight: 0.7 },
				{ name: 'tmdb.genres.name', weight: 0.3 }
			] as const,
			series: [
				{ name: 'tmdb.name', weight: 0.7 },
				{ name: 'tmdb.genres.name', weight: 0.3 }
			] as const,
			collections: [{ name: 'tmdb.name', weight: 1.0 }] as const
		};

		// Funktion zum Erzeugen einer Fuse-Instanz
		function makeFuse<T>(list: T[], keys: readonly { name: string; weight: number }[]) {
			const options: IFuseOptions<T> = {
				keys: keys.map((k) => k),
				threshold: 0.3,
				ignoreLocation: true
			};
			return new Fuse<T>(list, options);
		}

		// Fuse-Instanzen in einem Rutsch erzeugen
		fuseMovies = makeFuse<MovieItem>(data.movies, fuseKeyConfig.movies);
		fuseSeries = makeFuse<SeriesItem>(data.series, fuseKeyConfig.series);
		fuseCollections = makeFuse<CollectionItem>(data.collections, fuseKeyConfig.collections);
	});

	onDestroy(() => {
		// Session-Storage speichern
		setFilter({
			CARDSCALE,
			search,
			showCollections,
			showMovies,
			showSeries,
			sortOption,
			selectedGenres,
			watchedFilter
		});
	});
</script>

<Navbar>
	{#snippet left()}
		<a href="./add" class="btn btn-ghost">{$_('nav.add')}</a>
	{/snippet}
	{#snippet right()}
		<a href="./settings" class="btn btn-ghost">{$_('nav.settings')}</a>
	{/snippet}
</Navbar>

<main class="z-0 flex flex-col p-1 sm:p-3">
	{#if data.movies.length > 0 || data.collections.length > 0 || data.series.length > 0}
		<div class="my-2 space-y-2 print:hidden">
			<!-- Sucheingabe -->
			<div class="mx-auto flex w-full max-w-md flex-wrap items-center gap-3 sm:max-w-lg">
				<div class="flex grow gap-2">
					<label class="input input-bordered flex w-full items-center gap-2">
						<Search class="h-4 w-4 opacity-70" />
						<input
							type="text"
							class="grow"
							placeholder={$_('main.searchPlaceholder')}
							bind:value={search}
						/>
					</label>
					<button
						type="reset"
						class="btn btn-ghost"
						onclick={resetFilters}
						title={$_('resetFilters')}
					>
						<Reset class="h-8 w-8 opacity-70" />
					</button>
				</div>
			</div>

			<!-- Filter & Sortierung -->
			<div class="flex flex-wrap justify-center gap-4 sm:gap-6">
				<!-- Typ Filter -->
				<div class="flex flex-wrap gap-2">
					<label class="label cursor-pointer space-x-2">
						<span class="label-text">{$_('movies')}</span>
						<input
							type="checkbox"
							class="toggle toggle-sm"
							disabled={data.movies.length === 0}
							bind:checked={showMovies}
						/>
					</label>
					<label class="label cursor-pointer space-x-2">
						<span class="label-text">{$_('series')}</span>
						<input
							type="checkbox"
							class="toggle toggle-sm"
							disabled={data.series.length === 0}
							bind:checked={showSeries}
						/>
					</label>
					<label class="label cursor-pointer space-x-2">
						<span class="label-text">{$_('collections')}</span>
						<input
							type="checkbox"
							class="toggle toggle-sm"
							disabled={data.collections.length === 0}
							bind:checked={showCollections}
						/>
					</label>
				</div>

				<!-- Sortierung -->
				<select class="select select-bordered select-sm w-36 sm:w-48" bind:value={sortOption}>
					<option value="added">{$_('newlyAdded')}</option>
					<option value="rating">{$_('bestRating')}</option>
					<option value="duration">{$_('longestDuration')}</option>
					<option value="release_date_desc">{$_('releaseDateNew')}</option>
					<option value="release_date_asc">{$_('releaseDateOld')}</option>
					<option value="popularity">{$_('popularity')}</option>
					<option value="alpha">{$_('alphabetical')}</option>
					<option value="last_watched">{$_('lastWatched')}</option>
				</select>

				<!-- Gesehen Filter -->
				<select class="select select-bordered select-sm w-36 sm:w-48" bind:value={watchedFilter}>
					<option value="all">{$_('all')}</option>
					<option value="watched">{$_('watched')}</option>
					<option value="unwatched">{$_('unwatched')}</option>
				</select>
			</div>
		</div>

		<!-- Ergebnisse -->
		<div class="flex flex-wrap justify-center gap-4 pb-2 sm:gap-5">
			{#if filteredCollections().length > 0 || filteredMovies().length > 0 || filteredSeries().length > 0}
				<!-- Collections -->
				{#if filteredCollections().length > 0}
					{#each filteredCollections() as item (item.id)}
						{@const title = item.tmdb?.name}
						<Card
							bind:CARDSCALE
							{title}
							href={`./collection?id=${item.id}`}
							params={[item.poster_path, 'posters', true]}
							alt={$_('posterAlt', { values: { title } })}
						/>
					{/each}
				{/if}

				<!-- Movies -->
				{#if filteredMovies().length > 0}
					{#each filteredMovies() as item (item.id)}
						{@const title = item.tmdb?.name}
						<Card
							bind:CARDSCALE
							{title}
							href={`./movie?id=${item.id}`}
							params={[item.tmdb.poster_path, 'posters', true]}
							watched={item.watched}
							alt={$_('posterAlt', { values: { title } })}
						/>
					{/each}
				{/if}

				<!-- Series -->
				{#if filteredSeries().length > 0}
					{#each filteredSeries() as item (item.id)}
						{@const title = item.tmdb?.name}
						<Card
							bind:CARDSCALE
							{title}
							href={`./tv?id=${item.id}`}
							params={[item.tmdb.poster_path, 'posters', true]}
							watched={item.watched}
							alt={$_('posterAlt', { values: { title } })}
						/>
					{/each}
				{/if}
			{:else}
				<p class="mt-10 w-full text-center text-gray-400">{$_('main.noneFound')}</p>
			{/if}
		</div>
	{:else}
		<div class="flex flex-col items-center space-y-4">
			<p>{$_('main.noneAdded')}</p>
			<a href="./add" class="btn">{$_('nav.add')}</a>
		</div>
	{/if}
</main>

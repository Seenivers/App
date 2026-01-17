<script lang="ts">
	import Fuse from 'fuse.js';
	import type { IFuseOptions } from 'fuse.js';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { PageData } from './$types';
	import Card from '$lib/components/card.svelte';
	import { _ } from 'svelte-i18n';
	import type { CardscaleNumbers } from '$lib/types/cardscale';
	import Search from '$lib/assets/SVG/search.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { getFilter, setFilter, type SortOption } from '$lib/utils/sessionStorage';
	import Reset from '$lib/assets/SVG/reset.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	type MovieItem = (typeof data.movies)[number];
	type SeriesItem = (typeof data.series)[number];
	type CollectionItem = (typeof data.collections)[number];

	let CARDSCALE: CardscaleNumbers = $state(2);
	let search = $state('');
	let showCollections = $state(false);
	let showMovies = $state(true);
	let showSeries = $state(true);
	let sortOption: SortOption = $state('added');
	let selectedGenres: string[] = $state([]);
	let watchedFilter: 'all' | 'watched' | 'unwatched' = $state('all');

	let fuseMovies: Fuse<MovieItem> | null = $state(null);
	let fuseSeries: Fuse<SeriesItem> | null = $state(null);
	let fuseCollections: Fuse<CollectionItem> | null = $state(null);

	const genreFilter = (genres: { name: string }[]) =>
		selectedGenres.length === 0 || genres.some((g) => selectedGenres.includes(g.name));

	const filteredItems = <T extends { tmdb: any; watched?: boolean }>(
		items: T[],
		fuse: Fuse<T> | null,
		visible: boolean
	) => {
		if (!visible || !fuse) return [];
		const base = search.trim() === '' ? items : fuse.search(search).map((r) => r.item);
		return base
			.filter((item) => genreFilter(item.tmdb.genres || []))
			.filter((item) =>
				watchedFilter === 'all' ? true : watchedFilter === 'watched' ? item.watched : !item.watched
			)
			.sort(sortBy);
	};

	function sortBy(a: any, b: any) {
		switch (sortOption) {
			case 'rating':
				return (b.tmdb.vote_average ?? 0) - (a.tmdb.vote_average ?? 0);
			case 'duration':
				return (b.tmdb.runtime ?? 0) - (a.tmdb.runtime ?? 0);
			case 'release_date_desc':
				return (
					new Date(b.tmdb.release_date ?? '').getTime() -
					new Date(a.tmdb.release_date ?? '').getTime()
				);
			case 'release_date_asc':
				return (
					new Date(a.tmdb.release_date ?? '').getTime() -
					new Date(b.tmdb.release_date ?? '').getTime()
				);
			case 'popularity':
				return (b.tmdb.popularity ?? 0) - (a.tmdb.popularity ?? 0);
			case 'alpha':
				return (a.tmdb.title || a.tmdb.name || '').localeCompare(b.tmdb.title || b.tmdb.name || '');
			case 'last_watched':
				return new Date(b.watchTime ?? 0).getTime() - new Date(a.watchTime ?? 0).getTime();
			default:
				return new Date(b.updated).getTime() - new Date(a.updated).getTime();
		}
	}

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
		const filter = getFilter();
		CARDSCALE = filter.CARDSCALE;
		search = filter.search;
		showCollections = filter.showCollections;
		showMovies = filter.showMovies;
		showSeries = filter.showSeries;
		sortOption = filter.sortOption;
		selectedGenres = filter.selectedGenres;
		watchedFilter = filter.watchedFilter;

		const makeFuse = <T,>(list: T[], keys: { name: string; weight: number }[]) => {
			const options: IFuseOptions<T> = {
				keys,
				threshold: 0.3,
				ignoreLocation: true
			};
			return new Fuse<T>(list, options);
		};

		fuseMovies = makeFuse(data.movies, [
			{ name: 'tmdb.title', weight: 0.7 },
			{ name: 'tmdb.genres.name', weight: 0.3 }
		]);
		fuseSeries = makeFuse(data.series, [
			{ name: 'tmdb.name', weight: 0.7 },
			{ name: 'tmdb.genres.name', weight: 0.3 }
		]);
		fuseCollections = makeFuse(data.collections, [{ name: 'tmdb.name', weight: 1.0 }]);

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
	});
</script>

<Navbar>
	{#snippet left()}
		<a href="./add" class="btn btn-ghost">{$_('nav.add')}</a>
		<a href="./watchlist" class="btn btn-ghost">{$_('watchlist')}</a>
	{/snippet}
	{#snippet right()}
		<a href="./settings" class="btn btn-ghost">{$_('nav.settings')}</a>
	{/snippet}
</Navbar>

<main class="z-0 flex flex-col p-1 sm:p-3">
	{#if data.movies.length + data.series.length + data.collections.length > 0}
		<div class="my-2 space-y-2 print:hidden">
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

			<div class="flex flex-wrap justify-center gap-4 sm:gap-6">
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

				<select class="select select-bordered select-sm w-36 sm:w-48" bind:value={watchedFilter}>
					<option value="all">{$_('all')}</option>
					<option value="watched">{$_('watched')}</option>
					<option value="unwatched">{$_('unwatched')}</option>
				</select>
			</div>
		</div>

		<div class="flex flex-wrap justify-center gap-4 pb-2 sm:gap-5">
			{#if filteredItems(data.collections, fuseCollections, showCollections).length + filteredItems(data.movies, fuseMovies, showMovies).length + filteredItems(data.series, fuseSeries, showSeries).length > 0}
				{#each filteredItems(data.collections, fuseCollections, showCollections) as item (item.id)}
					{@const title = item.tmdb?.name}
					<Card
						bind:CARDSCALE
						{title}
						href={`./collection?id=${item.id}`}
						params={[item.poster_path, 'posters', true]}
						watched={item.watched}
						alt={$_('posterAlt', { values: { title } })}
					/>
				{/each}

				{#each filteredItems(data.movies, fuseMovies, showMovies) as item (item.id)}
					{@const title = item.tmdb?.title}
					<Card
						bind:CARDSCALE
						{title}
						href={`./movie?id=${item.id}`}
						params={[item.tmdb.poster_path, 'posters', true]}
						watched={item.watched}
						alt={$_('posterAlt', { values: { title } })}
					/>
				{/each}

				{#each filteredItems(data.series, fuseSeries, showSeries) as item (item.id)}
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

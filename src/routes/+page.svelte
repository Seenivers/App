<script lang="ts">
	import Navbar from '$lib/Navbar.svelte';
	import type { PageData } from './$types';
	import Card from '$lib/utils/card.svelte';
	import { _ } from 'svelte-i18n';
	import { type CardscaleNumbers } from '$lib/types/cardscale';
	import Search from '$lib/SVG/search.svelte';
	import { onDestroy, onMount } from 'svelte';
	import { getFilter, setFilter } from '$lib/utils/sessionStorage';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let CARDSCALE: CardscaleNumbers = $state(2);
	let search = $state('');
	let showCollections = $state(false);
	let showMovies = $state(true);
	let showSeries = $state(true);
	let sortOption = $state<
		| 'added'
		| 'rating'
		| 'duration'
		| 'release_date_desc'
		| 'release_date_asc'
		| 'popularity'
		| 'alpha'
		| 'last_watched'
	>('added');
	let selectedGenres = $state<string[]>([]);
	let watchedFilter = $state<'all' | 'watched' | 'unwatched'>('all');

	// Genre-Filter
	const genreFilter = (genres: { name: string }[]) =>
		selectedGenres.length === 0 || genres.some((g) => selectedGenres.includes(g.name));

	// Filter für Filme, Serien und Sammlungen
	const filteredMovies = $derived(() =>
		data.movies
			.filter((m) => showMovies && m.tmdb.title?.toLowerCase().includes(search.toLowerCase()))
			.filter((m) => genreFilter(m.tmdb.genres || []))
			.filter((m) =>
				watchedFilter === 'all'
					? true
					: watchedFilter === 'watched'
						? m.watched === true
						: m.watched === false
			)
			.sort(sortBy)
	);

	const filteredSeries = $derived(() =>
		data.series
			.filter((s) => showSeries && s.tmdb.name?.toLowerCase().includes(search.toLowerCase()))
			.filter((s) => genreFilter(s.tmdb.genres || []))
			.filter((s) =>
				watchedFilter === 'all'
					? true
					: watchedFilter === 'watched'
						? s.watched === true
						: s.watched === false
			)
			.sort(sortBy)
	);

	const filteredCollections = $derived(() =>
		(watchedFilter === 'all' ? data.collections : []) // nur bei „all“ zeigen
			.filter((c) => showCollections && c.tmdb?.name?.toLowerCase().includes(search.toLowerCase()))
			.filter(() => genreFilter([]))
			.sort(sortBy)
	);

	function sortBy(a: any, b: any) {
		if (sortOption === 'rating') return (b.tmdb.vote_average ?? 0) - (a.tmdb.vote_average ?? 0);
		if (sortOption === 'duration') return (b.tmdb.runtime ?? 0) - (a.tmdb.runtime ?? 0);
		if (sortOption === 'release_date_desc')
			return (
				new Date(b.tmdb.release_date ?? 0).getTime() - new Date(a.tmdb.release_date ?? 0).getTime()
			);
		if (sortOption === 'release_date_asc')
			return (
				new Date(a.tmdb.release_date ?? 0).getTime() - new Date(b.tmdb.release_date ?? 0).getTime()
			);
		if (sortOption === 'popularity') return (b.tmdb.popularity ?? 0) - (a.tmdb.popularity ?? 0);
		if (sortOption === 'alpha')
			return (a.tmdb.title || a.tmdb.name || '').localeCompare(b.tmdb.title || b.tmdb.name || '');
		if (sortOption === 'last_watched')
			return new Date(b.watchTime ?? 0).getTime() - new Date(a.watchTime ?? 0).getTime();
		return new Date(b.updated).getTime() - new Date(a.updated).getTime();
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
	});

	onDestroy(() => {
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
				<label class="input input-bordered flex w-full items-center gap-2">
					<Search class="h-4 w-4 opacity-70" />
					<input
						type="text"
						class="grow"
						placeholder={$_('main.searchPlaceholder')}
						bind:value={search}
					/>
				</label>
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

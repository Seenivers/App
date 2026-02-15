<script lang="ts">
	import Card from '$lib/components/card.svelte';
	import { m } from '$lib/paraglide/messages';
	import { onDestroy, onMount } from 'svelte';
	import { loadBatch } from './load';
	import { getFilter, resetFilter, setFilter } from '$lib/utils/sessionStorage';
	import Navbar from '$lib/components/Navbar.svelte';
	import Search from '$lib/assets/SVG/search.svelte';
	import Reset from '$lib/assets/SVG/reset.svelte';
	import { buildIndex, type SearchItem } from './searchIndex';
	import type Fuse from 'fuse.js';

	let fuse: Fuse<SearchItem> | null = null;
	let indexMap = new Map<string, Item>();

	type Batch = Awaited<ReturnType<typeof loadBatch>>;
	type Item = Batch extends Array<infer T> ? T : never;

	let items: Batch | null = null;

	let filter = getFilter();

	function getTitle(item: Item): string {
		switch (item.type) {
			case 'collection':
				return item.name;

			case 'movie':
				return item.tmdb.title;

			case 'series':
				return item.tmdb.name;

			default:
				return '';
		}
	}

	function getPoster(item: Item): string | null {
		if (item.type === 'collection') return item.poster_path;
		return item.tmdb?.poster_path ?? null;
	}

	function getHref(item: Item): string {
		if (item.type === 'series') return `/tv?id=${item.id}`;
		return `/${item.type}?id=${item.id}`;
	}

	function resetFilters() {
		filter = resetFilter();
	}

	function getDate(i: Item) {
		return new Date(i.updated).getTime();
	}

	function getRating(i: Item) {
		return i.type === 'collection' ? 0 : (i.tmdb.vote_average ?? 0);
	}

	function getTitleSafe(i: Item) {
		return getTitle(i).toLowerCase();
	}

	function getDuration(i: Item): number {
		if (i.type === 'movie') return i.tmdb.runtime ?? 0;

		if (i.type === 'series') {
			// episode_run_time ist Array
			const ep = i.tmdb.episode_run_time?.[0] ?? 0;
			const seasons = i.tmdb.number_of_seasons ?? 1;
			return ep * seasons;
		}

		return 0; // collections
	}

	function getReleaseDate(i: Item): number {
		const d =
			i.type === 'movie' ? i.tmdb.release_date : i.type === 'series' ? i.tmdb.first_air_date : null;

		return d ? new Date(d).getTime() : 0;
	}

	function getPopularity(i: Item): number {
		return i.type === 'collection' ? 0 : (i.tmdb.popularity ?? 0);
	}

	function getLastWatched(i: Item): number {
		switch (i.type) {
			case 'movie':
				return i.watchTime ?? 0;

			default:
				return 0;
		}
	}

	function sortBy(a: Item, b: Item) {
		switch (filter.sortOption) {
			case 'rating':
				return getRating(b) - getRating(a);

			case 'duration':
				return getDuration(b) - getDuration(a);

			case 'release_date_desc':
				return getReleaseDate(b) - getReleaseDate(a);

			case 'release_date_asc':
				return getReleaseDate(a) - getReleaseDate(b);

			case 'popularity':
				return getPopularity(b) - getPopularity(a);

			case 'last_watched':
				return getLastWatched(b) - getLastWatched(a);

			case 'alpha':
				return getTitleSafe(a).localeCompare(getTitleSafe(b));

			case 'added':
			default:
				return getDate(b) - getDate(a);
		}
	}

	function getFilteredItems(): Item[] {
		if (!items) return [];

		let base: Item[];

		if (!filter.search.trim() || !fuse) {
			base = items;
		} else {
			base = fuse
				.search(filter.search)
				.map((r) => indexMap.get(`${r.item.type}-${r.item.ref}`)!)
				.filter(Boolean);
		}

		return base
			.filter(
				(i) =>
					(filter.showCollections && i.type === 'collection') ||
					(filter.showMovies && i.type === 'movie') ||
					(filter.showSeries && i.type === 'series')
			)
			.filter((i) =>
				filter.watchedFilter === 'all'
					? true
					: filter.watchedFilter === 'watched'
						? i.watched
						: !i.watched
			)
			.sort(sortBy);
	}

	onMount(async () => {
		items = await loadBatch();

		const { index, fuse: f } = buildIndex(items);
		fuse = f;

		indexMap = new Map(
			index.map((i) => [
				`${i.type}-${i.ref}`,
				items!.find((x) => x.id === i.ref && x.type === i.type)!
			])
		);
	});

	onDestroy(() => {
		setFilter(filter);
	});
</script>

<Navbar>
	{#snippet left()}
		<a href="./add" class="btn btn-ghost">{m['nav.add']()}</a>
		<a href="./watchlist" class="btn btn-ghost">{m['watchlist']()}</a>
	{/snippet}
	{#snippet right()}
		<a href="./settings" class="btn btn-ghost">{m['nav.settings']()}</a>
	{/snippet}
</Navbar>

<main class="z-0 flex flex-col p-1 sm:p-3">
	<div class="my-2 space-y-2 print:hidden">
		<div class="mx-auto flex w-full max-w-md flex-wrap items-center gap-3 sm:max-w-lg">
			<div class="flex grow gap-2">
				<label class="input input-bordered flex w-full items-center gap-2">
					<Search class="h-4 w-4 opacity-70" />
					<input
						type="text"
						class="grow"
						placeholder={m['main.searchPlaceholder']()}
						bind:value={filter.search}
					/>
				</label>
				<button type="reset" class="btn btn-ghost" onclick={resetFilters} title={m.resetFilters()}>
					<Reset class="h-8 w-8 opacity-70" />
				</button>
			</div>
		</div>

		<div class="flex flex-wrap justify-center gap-4 sm:gap-6">
			<div class="flex flex-wrap gap-2">
				<label class="label cursor-pointer space-x-2">
					<span class="label-text">{m.movies()}</span>
					<input type="checkbox" class="toggle toggle-sm" bind:checked={filter.showMovies} />
				</label>
				<label class="label cursor-pointer space-x-2">
					<span class="label-text">{m.series()}</span>
					<input type="checkbox" class="toggle toggle-sm" bind:checked={filter.showSeries} />
				</label>
				<label class="label cursor-pointer space-x-2">
					<span class="label-text">{m.collections()}</span>
					<input type="checkbox" class="toggle toggle-sm" bind:checked={filter.showCollections} />
				</label>
			</div>

			<select class="select select-bordered select-sm w-36 sm:w-48" bind:value={filter.sortOption}>
				<option value="added">{m.newlyAdded()}</option>
				<option value="rating">{m.bestRating()}</option>
				<option value="duration">{m.longestDuration()}</option>
				<option value="release_date_desc">{m.releaseDateNew()}</option>
				<option value="release_date_asc">{m.releaseDateOld()}</option>
				<option value="popularity">{m.popularity()}</option>
				<option value="alpha">{m.alphabetical()}</option>
				<option value="last_watched">{m.lastWatched()}</option>
			</select>

			<select
				class="select select-bordered select-sm w-36 sm:w-48"
				bind:value={filter.watchedFilter}
			>
				<option value="all">{m.all()}</option>
				<option value="watched">{m.watched()}</option>
				<option value="unwatched">{m.unwatched()}</option>
			</select>
		</div>
	</div>

	{#if !items}
		<p class="w-full pb-2 text-center">loading...</p>
		<div class="flex flex-wrap justify-center gap-4 pb-2 sm:gap-5">
			{#each Array(30).fill(0) as _, i (i)}
				<div
					class="skeleton card hover:bg-base-content/20 h-115 w-72 max-w-[18rem] min-w-48 grow shadow-xl transition-all duration-300 select-none hover:scale-105"
				></div>
			{/each}
		</div>
	{:else if getFilteredItems().length > 0}
		<div class="flex flex-wrap justify-center gap-4 pb-2 sm:gap-5">
			{#each getFilteredItems() as item (item.type + '-' + item.id)}
				{@const title = getTitle(item)}
				<Card
					bind:CARDSCALE={filter.CARDSCALE}
					{title}
					href={getHref(item)}
					params={[getPoster(item), 'posters', true]}
					watched={item.watched}
					alt={m.posterAlt({ title })}
				/>
			{/each}
		</div>
	{:else}
		<p class="mt-10 w-full text-center text-gray-400">
			{m['main.noneFound']()}
		</p>
	{/if}
</main>

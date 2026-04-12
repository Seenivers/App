<script lang="ts">
	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';
	import ArrowPath from '$lib/assets/SVG/ArrowPath.svelte';
	import ExternalLink from '$lib/assets/SVG/ExternalLink.svelte';
	import Eye from '$lib/assets/SVG/Eye.svelte';
	import EyeSlash from '$lib/assets/SVG/EyeSlash.svelte';
	import InfoCircle from '$lib/assets/SVG/InfoCircle.svelte';
	import PencilSquare from '$lib/assets/SVG/PencilSquare.svelte';
	import Reset from '$lib/assets/SVG/reset.svelte';
	import Search from '$lib/assets/SVG/search.svelte';
	import Trash from '$lib/assets/SVG/Trash.svelte';
	import Navbar from '$lib/components/Navbar.svelte';
	import Card from '$lib/components/card.svelte';
	import ContextMenu from '$lib/components/ContextMenu.svelte';
	import { m } from '$lib/paraglide/messages';
	import { collection } from '$lib/utils/db/collection';
	import { movie } from '$lib/utils/db/movie';
	import { serie } from '$lib/utils/db/serie';
	import { getFilter, resetFilter, setFilter } from '$lib/utils/sessionStorage';
	import { openPath } from '@tauri-apps/plugin-opener';
	import type Fuse from 'fuse.js';
	import { onDestroy, onMount, type Component } from 'svelte';
	import { buildIndex, type SearchItem } from './searchIndex';
	import { loadBatch } from './load';

	type ContextMenuActionId =
		| 'toggle_watched'
		| 'details'
		| 'external'
		| 'tmdb'
		| 'delete'
		| 'edit'
		| 'metadata';

	type ContextMenuAction = {
		id: ContextMenuActionId;
		label: string;
		icon?: Component;
		disabled?: boolean;
		danger?: boolean;
		separatorBefore?: boolean;
	};

	let fuse: Fuse<SearchItem> | null = null;
	let indexMap = new Map<string, Item>();

	type Batch = Awaited<ReturnType<typeof loadBatch>>;
	type Item = Batch extends Array<infer T> ? T : never;

	let items = $state<Batch | null>(null);
	let contextMenu = $state({
		open: false,
		x: 0,
		y: 0,
		item: null as Item | null
	});

	const LONG_PRESS_DURATION_MS = 550;
	const LONG_PRESS_MOVE_THRESHOLD = 10;
	let longPressTimer: ReturnType<typeof setTimeout> | null = null;
	let longPressStartPoint: { x: number; y: number } | null = null;
	let suppressClickForKey: string | null = null;

	let filter = $state(getFilter());

	function getItemKey(item: Item): string {
		return `${item.type}-${item.id}`;
	}

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
		if (item.type === 'series') return resolve(`/tv?id=${item.id}`);
		if (item.type === 'movie') return resolve(`/movie?id=${item.id}`);
		if (item.type === 'collection') return resolve(`/collection?id=${item.id}`);
		// @ts-expect-error item.type sollte nicht null sein
		console.error('Unknown item type: ' + item.type);
		return resolve('/(main)');
	}

	function resetFilters() {
		filter = resetFilter();
	}

	function openContextMenuFor(item: Item, x: number, y: number) {
		contextMenu.open = true;
		contextMenu.x = x;
		contextMenu.y = y;
		contextMenu.item = item;
	}

	function closeContextMenu() {
		contextMenu.open = false;
		contextMenu.item = null;
	}

	function clearLongPressTimer() {
		if (longPressTimer) {
			clearTimeout(longPressTimer);
			longPressTimer = null;
		}

		longPressStartPoint = null;
	}

	function getTMDBUrl(item: Item): string {
		if (item.type === 'series') return `https://www.themoviedb.org/tv/${item.id}`;
		if (item.type === 'movie') return `https://www.themoviedb.org/movie/${item.id}`;
		return `https://www.themoviedb.org/collection/${item.id}`;
	}

	function updateLocalWatched(item: Item, watched: boolean) {
		if (!items) return;

		items = items.map((entry) =>
			entry.id === item.id && entry.type === item.type ? { ...entry, watched } : entry
		) as Batch;
	}

	async function toggleWatched(item: Item) {
		const nextWatched = !item.watched;
		updateLocalWatched(item, nextWatched);

		try {
			switch (item.type) {
				case 'movie':
					await movie.update(item.id, { watched: nextWatched, wantsToWatch: false });
					return;

				case 'series':
					await serie.update(item.id, { watched: nextWatched, wantsToWatch: false });
					return;

				case 'collection':
					await collection.update(item.id, { watched: nextWatched });
					return;

				default:
					return;
			}
		} catch (error) {
			updateLocalWatched(item, !nextWatched);
			console.error('Failed to toggle watched state:', error);
		}
	}

	async function openExternal(item: Item) {
		if (item.type === 'collection' || !item.path) return;

		try {
			await openPath(item.path);
		} catch (error) {
			console.error('Failed to open external target:', error);
		}
	}

	async function openTMDB(item: Item) {
		try {
			await openPath(getTMDBUrl(item));
		} catch (error) {
			console.error('Failed to open TMDB:', error);
		}
	}

	function getContextMenuActions(item: Item | null): ContextMenuAction[] {
		if (!item) return [];

		const actions: ContextMenuAction[] = [
			{
				id: 'toggle_watched',
				label: item.watched ? m['marked.asWatched']() : m['marked.notWatched'](),
				icon: item.watched ? EyeSlash : Eye
			},
			{
				id: 'details',
				label: 'Details',
				icon: InfoCircle
			}
		];

		if (item.type !== 'collection' && item.path) {
			actions.push({
				id: 'external',
				label: item.type === 'movie' ? m.startExternalPlayer() : m.openFolder(),
				icon: ExternalLink
			});
		}

		actions.push({
			id: 'tmdb',
			label: m.openOnTMDB(),
			icon: ExternalLink,
			separatorBefore: true
		});

		actions.push(
			// Optional actions are already part of the menu model and can be enabled later.
			{
				id: 'edit',
				label: m.edit(),
				icon: PencilSquare,
				disabled: true,
				separatorBefore: true
			},
			{
				id: 'delete',
				label: m.delete(),
				icon: Trash,
				disabled: true,
				danger: true
			},
			{
				id: 'metadata',
				label: 'Update metadata',
				icon: ArrowPath,
				disabled: true
			}
		);

		return actions;
	}

	async function handleContextAction(actionId: string) {
		const item = contextMenu.item;
		if (!item) return;

		switch (actionId as ContextMenuActionId) {
			case 'toggle_watched':
				await toggleWatched(item);
				return;

			case 'details':
				// eslint-disable-next-line svelte/no-navigation-without-resolve
				await goto(getHref(item));
				return;

			case 'external':
				await openExternal(item);
				return;

			case 'tmdb':
				await openTMDB(item);
				return;

			default:
				return;
		}
	}

	function handleCardContextMenu(event: MouseEvent, item: Item) {
		event.preventDefault();
		clearLongPressTimer();
		openContextMenuFor(item, event.clientX, event.clientY);
	}

	function handleCardPointerDown(event: PointerEvent, item: Item) {
		if (event.pointerType !== 'touch') return;

		clearLongPressTimer();

		const key = getItemKey(item);
		const x = event.clientX;
		const y = event.clientY;
		longPressStartPoint = { x: event.clientX, y: event.clientY };

		longPressTimer = setTimeout(() => {
			suppressClickForKey = key;
			openContextMenuFor(item, x, y);
		}, LONG_PRESS_DURATION_MS);
	}

	function handleCardPointerMove(event: PointerEvent) {
		if (event.pointerType !== 'touch' || !longPressStartPoint) return;

		const movedX = Math.abs(event.clientX - longPressStartPoint.x);
		const movedY = Math.abs(event.clientY - longPressStartPoint.y);

		if (movedX > LONG_PRESS_MOVE_THRESHOLD || movedY > LONG_PRESS_MOVE_THRESHOLD) {
			clearLongPressTimer();
		}
	}

	function handleCardPointerUpOrCancel() {
		clearLongPressTimer();
	}

	function handleCardClick(event: MouseEvent, item: Item) {
		if (suppressClickForKey !== getItemKey(item)) return;
		event.preventDefault();
		suppressClickForKey = null;
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
		clearLongPressTimer();
		setFilter(filter);
	});
</script>

<Navbar>
	{#snippet left()}
		<a href={resolve('/add')} class="btn btn-ghost">{m['nav.add']()}</a>
		<a href={resolve('/watchlist')} class="btn btn-ghost">{m['watchlist']()}</a>
	{/snippet}
	{#snippet right()}
		<a href={resolve('/settings')} class="btn btn-ghost">{m['nav.settings']()}</a>
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
			{#each Array(30).fill(0), i (i)}
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
					onClick={(event) => handleCardClick(event, item)}
					onContextMenu={(event) => handleCardContextMenu(event, item)}
					onPointerDown={(event) => handleCardPointerDown(event, item)}
					onPointerMove={handleCardPointerMove}
					onPointerUp={handleCardPointerUpOrCancel}
					onPointerCancel={handleCardPointerUpOrCancel}
				/>
			{/each}
		</div>
	{:else}
		<p class="mt-10 w-full text-center text-gray-400">
			{m['main.noneFound']()}
		</p>
	{/if}
</main>

<ContextMenu
	open={contextMenu.open}
	x={contextMenu.x}
	y={contextMenu.y}
	items={getContextMenuActions(contextMenu.item)}
	onClose={closeContextMenu}
	onSelect={handleContextAction}
/>

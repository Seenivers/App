<script lang="ts">
	import { schema } from '$lib/db/schema';
	import Img from '$lib/image/Img.svelte';
	import Navbar from '$lib/Navbar.svelte';
	import type { Cardscale } from '$lib/types/cardscale';
	import Fuse, { type FuseResult } from 'fuse.js';
	import { onDestroy, onMount } from 'svelte';
	import type { PageData } from './$types';
	import { getFilter, type SearchCriteria, setFilter } from '$lib/sessionStorage';
	import { _ } from 'svelte-i18n';
	import { discord } from '$lib/discord';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	// Suchparameter initialisieren
	let searchCriteria: SearchCriteria = $state(getFilter());

	// Lade die Filme und initialisiere die Fuse-Suche
	let matchedMovies: typeof data.result = $state(data.result);
	let isLoading = $state(false);
	let CARDSCALE: Cardscale = $state({
		aktiv: 2,
		sizes: [
			{
				number: 1,
				size: 'Small'
			},
			{
				number: 2,
				size: 'Medium'
			},
			{
				number: 3,
				size: 'Large'
			}
		]
	});
	// Referenzen für das Such-Eingabefeld
	let searchInput: HTMLInputElement | undefined = $state();
	let datalistItem: HTMLDataListElement | undefined = $state();

	// Funktion zum Filtern der Filme
	async function filterMovies() {
		setFilter(searchCriteria);
		if (!searchCriteria.title && !searchCriteria.genre && searchCriteria.isWatched === null) {
			matchedMovies = data.result;
			return;
		}

		// Ansonsten wird gefiltert
		isLoading = true;
		setTimeout(() => {
			const fuse = new Fuse(matchedMovies, {
				keys: ['tmdb.title', 'tmdb.genres.name'],
				threshold: 0.4 // Anpassung des Schwellenwerts für unscharfe Übereinstimmungen
			});

			// Prüft, ob ein Element ein Film ist
			function isMovie(
				item: typeof schema.movies.$inferSelect | typeof schema.collections.$inferSelect
			): item is typeof schema.movies.$inferSelect {
				return 'tmdb' in item;
			}

			// Präziserer Typ statt any
			const results: FuseResult<typeof schema.movies.$inferSelect>[] = searchCriteria.title
				? fuse.search(searchCriteria.title)
				: matchedMovies
						.filter(isMovie) // Nur Filme durchsuchen
						.map((movie) => ({ item: movie }) as FuseResult<typeof schema.movies.$inferSelect>);

			matchedMovies = (
				results.length >= 1 ? results.map((result) => result.item) : data.result
			).filter((movie) => {
				// Sicherstellen, dass es sich um einen Film handelt
				if (!isMovie(movie)) return false;

				// Genre-Filterung
				const genreMatches =
					searchCriteria.genre === null ||
					movie.tmdb.genres.some((genre) =>
						genre.name.toLowerCase().includes(searchCriteria.genre?.toLowerCase() || '')
					);

				// Watch-Status-Filterung
				const watchedMatches =
					searchCriteria.isWatched === null || movie.watched === searchCriteria.isWatched;

				return genreMatches && watchedMatches;
			});

			isLoading = false;
		}, 300); // Setzt Debouncing mit 300 ms ein
	}

	function updateCardScale(change: number) {
		CARDSCALE.aktiv += change;
		if (CARDSCALE.aktiv > 3) {
			CARDSCALE.aktiv = 1;
		} else if (CARDSCALE.aktiv < 1) {
			CARDSCALE.aktiv = 3;
		}
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (event.ctrlKey && event.key === 'f') {
			event.preventDefault();
			if (searchInput) searchInput.focus();
		} else if (event.ctrlKey && event.key === 'p') {
			event.preventDefault();
		} else if (event.ctrlKey && event.key === '+') {
			event.preventDefault();
			updateCardScale(1);
		} else if (event.ctrlKey && event.key === '-') {
			event.preventDefault();
			updateCardScale(-1);
		}
	}

	function handleWheel(event: WheelEvent) {
		if (event.ctrlKey) {
			event.preventDefault();
			if (event.deltaY < 0) {
				updateCardScale(1);
			} else if (event.deltaY > 0) {
				updateCardScale(-1);
			}
		}
	}

	// Initiale Daten und Setup
	onMount(async () => {
		discord({
			details: `Schaut gerade seine Filme durch 🍿`,
			state: `Hat ${data.result.length} Filme, Filmreihen und Serien in seiner Sammlung`
		});

		// Füge das Wheel-Event mit { passive: false } hinzu
		window.addEventListener('wheel', handleWheel, { passive: false });

		let currentFocus = -1;

		if (matchedMovies.length >= 1 && searchInput && datalistItem) {
			searchInput.onfocus = function () {
				if (!datalistItem || !searchInput) return;
				datalistItem.style.display = 'block';
				datalistItem.style.width = `${searchInput.offsetWidth}px`;
				searchInput.style.borderBottomLeftRadius = '0';
			};

			// Datalist-Optionen verstecken
			searchInput.onblur = function () {
				// Kurze Verzögerung, um sicherzustellen, dass das Klicken auf ein Optionselement erkannt wird
				setTimeout(() => {
					if (!datalistItem || !searchInput) return;
					datalistItem.style.display = 'none';
					searchInput.style.borderBottomLeftRadius = '0.5rem';
				}, 200);
			};

			// Datalist-Optionen behandeln
			for (let option of datalistItem.options) {
				option.onclick = () => {
					if (!datalistItem) return;
					searchCriteria.title = option.value;
					datalistItem.style.display = 'none';
					filterMovies();
				};
			}

			searchInput.oninput = () => {
				if (!datalistItem) return;
				const text = searchCriteria.title.toUpperCase();
				for (let option of datalistItem.options) {
					option.style.display = option.value.toUpperCase().includes(text) ? 'block' : 'none';
				}
			};

			searchInput.onkeydown = (e: KeyboardEvent) => {
				if (!datalistItem) return;
				const optionsArray = Array.from(datalistItem.options);
				switch (e.key) {
					case 'ArrowDown':
						currentFocus++;
						addActive(optionsArray);
						break;
					case 'ArrowUp':
						currentFocus--;
						addActive(optionsArray);
						break;
					case 'Enter':
						e.preventDefault();
						if (currentFocus > -1 && currentFocus < optionsArray.length) {
							optionsArray[currentFocus].click();
						}
						break;
					default:
						break;
				}
			};
		}

		function addActive(options: HTMLOptionElement[]) {
			if (options.length === 0) return;
			removeActive(options);
			// Schleifen Sie den Fokus nach oben/unten durch
			if (currentFocus >= options.length) currentFocus = 0;
			if (currentFocus < 0) currentFocus = options.length - 1;
			options[currentFocus].classList.add('active');
		}

		function removeActive(options: HTMLOptionElement[]) {
			options.forEach((option) => option.classList.remove('active'));
		}

		filterMovies();
	});

	onDestroy(() => {
		window.removeEventListener('wheel', handleWheel);
	});
</script>

<svelte:window onkeydown={handleKeyDown} />

<Navbar>
	{#snippet left()}
		<a href="./add" class="btn btn-ghost">{$_('main.nav.add')}</a>
	{/snippet}
	{#snippet right()}
		<a href="./settings" class="btn btn-ghost">{$_('main.nav.settings')}</a>
	{/snippet}
</Navbar>

<main class="z-0 flex-grow flex-col p-5">
	{#if data.result.length >= 1}
		<!-- Suche -->
		<div class="join flex flex-wrap justify-center" onchange={filterMovies}>
			<div>
				<input
					class="input join-item input-bordered"
					name="title"
					placeholder={$_('main.search.titlePlaceholder')}
					autocomplete="off"
					bind:value={searchCriteria.title}
					oninput={filterMovies}
					bind:this={searchInput}
				/>
				<datalist
					class="absolute z-10 max-h-96 overflow-y-auto rounded-b-lg bg-base-100"
					bind:this={datalistItem}
				>
					{#each Array.from(new Set(matchedMovies
								.filter((movie) => 'tmdb' in movie) // Type Guard: Nur Filme mit `tmdb` zulassen
								.map((movie) => movie.tmdb.title))) as title}
						<option
							class="w-full min-w-fit cursor-pointer px-2 hover:bg-base-content/20"
							value={title}
						>
							{title}
						</option>
					{/each}
				</datalist>
			</div>

			<select
				class="join-item select select-bordered"
				name="genre"
				bind:value={searchCriteria.genre}
			>
				<option value={null}>{$_('main.search.genreDefault')}</option>
				{#each Array.from(new Set(matchedMovies
							.filter((item) => 'tmdb' in item) // Type Guard: Nur Filme mit `tmdb` zulassen
							.flatMap((item) => item.tmdb.genres.map((i) => i.name)))) as genre}
					<option>{genre}</option>
				{/each}
			</select>

			<select
				class="join-item select select-bordered"
				name="isWatched"
				bind:value={searchCriteria.isWatched}
			>
				<option value={null}>{$_('main.search.isWatched.all')}</option>
				<option value={true}>{$_('main.search.isWatched.watched')}</option>
				<option value={false}>{$_('main.search.isWatched.notWatched')}</option>
			</select>
			<button
				onclick={() => {
					searchCriteria = { title: '', genre: null, isWatched: null };
					filterMovies();
				}}
				class="btn join-item"
				disabled={!searchCriteria.title &&
					!searchCriteria.genre &&
					searchCriteria.isWatched === null}
			>
				{$_('main.search.resetFilter')}
			</button>
		</div>

		<!-- Scaling -->
		<div class="z-0 mt-5 flex flex-1 justify-end">
			<div class="join join-vertical lg:join-horizontal">
				{#each CARDSCALE.sizes as { number, size }}
					{@const r = 4 + 2 * number}

					<button
						class="btn join-item flex items-center gap-2"
						class:btn-active={CARDSCALE.aktiv === number}
						onclick={() => {
							CARDSCALE.aktiv = number;
						}}
					>
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-5 w-5"
							viewBox="0 0 24 24"
							fill="currentColor"
						>
							<circle cx="12" cy="12" {r} />
						</svg>
						<span class="hidden lg:inline">
							{size}
						</span>
					</button>
				{/each}
			</div>
		</div>

		{#if isLoading}
			<p>{$_('main.scaling.loading')}</p>
		{:else if matchedMovies.length >= 1}
			<div class="flex flex-wrap justify-center gap-5 p-5 pb-20">
				{#each data.result as item}
					{#if 'parts' in item}
						<!-- Collection -->
						<a
							href={'./collection?id=' + item.id.toString()}
							draggable="false"
							class="card h-fit flex-grow select-none bg-base-100 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-base-content/20
					{CARDSCALE.aktiv === 1
								? 'min-w-[8rem] max-w-[12rem]'
								: CARDSCALE.aktiv === 2
									? 'min-w-[12rem] max-w-[18rem]'
									: 'min-w-[16rem] max-w-[24rem]'}"
						>
							<figure class="relative px-2 pt-2">
								<Img
									params={[item.poster_path, 'posters', true]}
									alt={$_('main.movies.posterAlt', { values: { title: item.name } })}
									class="rounded-xl"
								/>
							</figure>
							<div class="card-body items-center py-2 text-center">
								<p
									class="card-title {CARDSCALE.aktiv === 1
										? 'text-base'
										: CARDSCALE.aktiv === 2
											? 'text-lg'
											: 'text-2xl'}"
								>
									{item.name}
								</p>
							</div>
						</a>
					{:else if 'tmdb' in item}
						<!-- Film -->
						<a
							href={'./movie?id=' + item.id.toString()}
							draggable="false"
							class="card h-fit flex-grow select-none bg-base-100 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-base-content/20
					{CARDSCALE.aktiv === 1
								? 'min-w-[8rem] max-w-[12rem]'
								: CARDSCALE.aktiv === 2
									? 'min-w-[12rem] max-w-[18rem]'
									: 'min-w-[16rem] max-w-[24rem]'}"
						>
							<figure class="relative px-2 pt-2">
								<Img
									params={[item.tmdb.poster_path, 'posters', true]}
									alt={$_('main.movies.posterAlt', { values: { title: item.tmdb.title } })}
									class="rounded-xl"
								/>
								{#if item.watched}
									<div class="badge badge-outline absolute left-3 top-3 bg-base-300">
										{$_('main.movies.badgeWatched')}
									</div>
								{/if}
							</figure>
							<div class="card-body items-center py-2 text-center">
								<p
									class="card-title {CARDSCALE.aktiv === 1
										? 'text-base'
										: CARDSCALE.aktiv === 2
											? 'text-lg'
											: 'text-2xl'}"
								>
									{item.tmdb.title}
								</p>
							</div>
						</a>
					{/if}
				{/each}
			</div>
		{:else}
			<p>{$_('main.movies.noneFound')}</p>
		{/if}
	{:else}
		<p>{$_('main.movies.noneAdded')}</p>
	{/if}
</main>

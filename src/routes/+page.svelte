<script lang="ts">
	import { getAllMovies } from '$lib/db/funktion';
	import { schema } from '$lib/db/schema';
	import { image } from '$lib/image';
	import Fuse, { type FuseResult } from 'fuse.js';
	import { onMount } from 'svelte';

	// Typ für die Suchparameter
	type SearchCriteria = {
		title: string;
		genre: string | null;
		isWatched: boolean | null;
	};

	// Suchparameter initialisieren
	let searchCriteria: SearchCriteria = {
		title: '',
		genre: null,
		isWatched: null
	};

	// Lade die Filme und initialisiere die Fuse-Suche
	let matchedMovies: (typeof schema.movies.$inferSelect)[] = [];
	let isLoading = false;

	// Funktion zum Laden der Filme
	async function loadMovies() {
		matchedMovies = (await getAllMovies()) || [];
	}

	// Referenzen für das Such-Eingabefeld
	let searchInput: HTMLInputElement;
	let datalistItem: HTMLDataListElement;

	// Funktion zum Filtern der Filme
	async function filterMovies() {
		if (!searchCriteria.title && !searchCriteria.genre && searchCriteria.isWatched === null) {
			// Zeigt alle Filme an, wenn keine Suchkriterien gesetzt sind
			await loadMovies();
			return;
		}

		// Ansonsten wird gefiltert
		isLoading = true;
		setTimeout(() => {
			const fuse = new Fuse(matchedMovies, {
				keys: ['tmdb.title', 'tmdb.genres.name'],
				threshold: 0.4 // Anpassung des Schwellenwerts für unscharfe Übereinstimmungen
			});

			// Präziserer Typ statt any
			const results: FuseResult<typeof schema.movies.$inferSelect>[] = searchCriteria.title
				? fuse.search(searchCriteria.title)
				: matchedMovies.map(
						(movie) => ({ item: movie }) as FuseResult<typeof schema.movies.$inferSelect>
					);

			matchedMovies = (
				results.length ? results.map((result) => result.item) : matchedMovies
			).filter((movie) => {
				// Typ-Deklaration für Genre hinzufügen
				const genreMatches =
					searchCriteria.genre === null ||
					movie.tmdb.genres.some((genre) =>
						genre.name.toLowerCase().includes(searchCriteria.genre?.toLowerCase() || '')
					);

				const watchedMatches =
					searchCriteria.isWatched === null || movie.watched === searchCriteria.isWatched;

				return genreMatches && watchedMatches;
			});
			isLoading = false;
		}, 300); // Setzt Debouncing mit 300 ms ein
	}

	// Funktion zum Abfangen der Strg+F-Kombination
	function handleKeyDown(event: KeyboardEvent) {
		if (event.ctrlKey && event.key === 'f') {
			event.preventDefault();
			searchInput.focus();
		}
	}

	// Initiale Daten und Setup
	onMount(async () => {
		await loadMovies();

		let currentFocus = -1;

		if (matchedMovies.length >= 1 && searchInput && datalistItem) {
			searchInput.onfocus = function () {
				datalistItem.style.display = 'block';
				datalistItem.style.width = `${searchInput.offsetWidth}px`;
				searchInput.style.borderBottomLeftRadius = '0';
			};

			// Datalist-Optionen verstecken
			searchInput.onblur = function () {
				// Kurze Verzögerung, um sicherzustellen, dass das Klicken auf ein Optionselement erkannt wird
				setTimeout(() => {
					datalistItem.style.display = 'none';
					searchInput.style.borderBottomLeftRadius = '0.5rem';
				}, 200);
			};

			// Datalist-Optionen behandeln
			for (let option of datalistItem.options) {
				option.onclick = () => {
					searchCriteria.title = option.value;
					datalistItem.style.display = 'none';
					filterMovies();
				};
			}

			searchInput.oninput = () => {
				const text = searchCriteria.title.toUpperCase();
				for (let option of datalistItem.options) {
					option.style.display = option.value.toUpperCase().includes(text) ? 'block' : 'none';
				}
			};

			searchInput.onkeydown = (e: KeyboardEvent) => {
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
	});
</script>

<svelte:window on:keydown={handleKeyDown} />

<nav class="navbar flex justify-between bg-base-100">
	<div>
		<a href="./add" class="btn btn-ghost">Hinzufügen</a>
	</div>
	<div>
		<a href="./settings" class="btn btn-ghost">Settings</a>
	</div>
</nav>

<main class="flex-grow flex-col p-5">
	{#if matchedMovies.length >= 1}
		<div class="join flex flex-wrap justify-center" on:change={filterMovies}>
			<div>
				<input
					class="input join-item input-bordered"
					name="title"
					placeholder="Titel"
					bind:value={searchCriteria.title}
					on:input={filterMovies}
					bind:this={searchInput}
				/>
				<datalist
					class="absolute z-10 overflow-y-auto rounded-b-lg bg-base-100"
					bind:this={datalistItem}
				>
					{#each Array.from(new Set(matchedMovies.flatMap((movie) => movie.tmdb.title))) as title}
						<option class="cursor-pointer px-2 hover:bg-base-content/20" value={title}
							>{title}</option
						>
					{/each}
				</datalist>
			</div>
			<select
				class="join-item select select-bordered"
				name="genre"
				bind:value={searchCriteria.genre}
			>
				<option value={null}>Kein Filter</option>
				{#each Array.from(new Set(matchedMovies.flatMap( (item) => item.tmdb.genres.map((i) => i.name) ))) as genre}
					<option>{genre}</option>
				{/each}
			</select>
			<select
				class="join-item select select-bordered"
				name="isWatched"
				bind:value={searchCriteria.isWatched}
			>
				<option value={null}>Alle Filme</option>
				<option value={true}>Angeschaut</option>
				<option value={false}>Nicht angeschaut</option>
			</select>
			<button
				on:click={() => {
					searchCriteria = { title: '', genre: null, isWatched: null };
					filterMovies();
				}}
				class="btn join-item"
			>
				Filter zurücksetzen
			</button>
		</div>
	{/if}

	<div class="flex flex-wrap justify-center gap-5 p-5 pb-20">
		{#if isLoading}
			<p>Lädt...</p>
		{:else if matchedMovies.length >= 1}
			{#each matchedMovies as movie}
				<a
					href={'./movie?id=' + movie.id.toString()}
					draggable="false"
					class="card h-fit min-w-[15rem] max-w-[20rem] flex-grow select-none bg-base-100 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-base-content/20"
				>
					<figure class="relative px-2 pt-2">
						{#await image(movie.tmdb.poster_path, 'posters', true) then src}
							<img {src} alt="Poster von {movie.tmdb.title}" class="rounded-xl" draggable="false" />
						{/await}
						{#if movie.watched}
							<div class="badge badge-outline absolute left-3 top-3 bg-base-300">Angesehen</div>
						{/if}
					</figure>
					<div class="card-body items-center py-2 text-center">
						<p class="card-title">{movie.tmdb.title}</p>
					</div>
				</a>
			{/each}
		{:else}
			<p>Du hast noch keine Filme hinzugefügt</p>
		{/if}
	</div>
</main>

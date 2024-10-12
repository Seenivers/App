<script lang="ts">
	import { placeholderURL, imageURL } from '$lib';
	import { data } from '$lib/db';
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

	// Initiale Anzeige aller Filme
	let matchedMovies: typeof $data.movies = $data.movies;
	let isLoading = false;

	// Fuse.js für die unscharfe Suche konfigurieren
	const fuse = new Fuse($data.movies, {
		keys: ['title', 'genres.name'],
		threshold: 0.4 // Anpassung des Schwellenwerts für unscharfe Übereinstimmungen
	});

	// Referenzen für das Such-Eingabefeld
	let searchInput: HTMLInputElement;
	let datalistItem: HTMLDataListElement;

	// Initiale Filterung ausführen
	filterMovies();

	// Funktion zum Filtern der Filme
	function filterMovies() {
		if (!searchCriteria.title && !searchCriteria.genre && searchCriteria.isWatched === null) {
			// Zeigt alle Filme an, wenn keine Suchkriterien gesetzt sind
			matchedMovies = $data.movies;
			return;
		}

		// Ansonsten wird gefiltert
		isLoading = true;
		setTimeout(() => {
			const results: FuseResult<(typeof $data.movies)[0]>[] = searchCriteria.title
				? fuse.search(searchCriteria.title)
				: $data.movies.map((movie) => ({ item: movie }) as FuseResult<(typeof $data.movies)[0]>);

			matchedMovies = (results.length ? results.map((result) => result.item) : $data.movies).filter(
				(movie) => {
					// Typ-Deklaration für Genre hinzufügen
					const genreMatches =
						searchCriteria.genre === null ||
						movie.genres.some((genre: { name: string }) =>
							genre.name.toLowerCase().includes(searchCriteria.genre?.toLowerCase() || '')
						);

					const watchedMatches =
						searchCriteria.isWatched === null || movie.watched === searchCriteria.isWatched;

					return genreMatches && watchedMatches;
				}
			);
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

	onMount(() => {
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
				searchInput.value = option.value;
				datalistItem.style.display = 'none';
			};
		}
		searchInput.oninput = () => {
			const text = searchInput.value.toUpperCase();
			for (let option of datalistItem.options) {
				option.style.display = option.value.toUpperCase().includes(text) ? 'block' : 'none';
			}
		};
		let currentFocus = -1;
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

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a href="add" class="btn btn-ghost">Hinzufügen</a>
	</div>
</div>

<main class="flex-grow flex-col p-5">
	<div class="join flex flex-wrap justify-center" on:change={filterMovies}>
		<div>
			<input
				class="input join-item input-bordered"
				placeholder="Titel"
				bind:value={searchCriteria.title}
				on:input={filterMovies}
				bind:this={searchInput}
			/>
			<datalist
				class="absolute z-10 overflow-y-auto rounded-b-lg bg-base-100"
				bind:this={datalistItem}
			>
				{#each Array.from(new Set($data.movies.map((movie) => movie.title))) as title}
					<option class="cursor-pointer px-2 hover:bg-base-content/20" value={title}>{title}</option
					>
				{/each}
			</datalist>
		</div>
		<select class="join-item select select-bordered" bind:value={searchCriteria.genre}>
			<option value={null}>Kein Filter</option>
			{#each Array.from(new Set($data.movies.flatMap( (item) => item.genres.map((i) => i.name) ))) as genre}
				<option>{genre}</option>
			{/each}
		</select>
		<select class="join-item select select-bordered" bind:value={searchCriteria.isWatched}>
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

	<div class="flex flex-wrap justify-center gap-5 p-5 pb-20">
		{#if isLoading}
			<p>Lädt...</p>
		{:else if matchedMovies.length >= 1}
			{#each matchedMovies as movie}
				<a
					href={movie.id.toString()}
					draggable="false"
					class="card h-fit min-w-[15rem] max-w-[20rem] flex-grow select-none bg-base-100 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-base-content/20"
				>
					<figure class="relative px-2 pt-2">
						<img
							src={movie.poster_path ? imageURL + movie.poster_path : placeholderURL}
							alt="Poster von {movie.title}"
							class="rounded-xl"
							draggable="false"
						/>
						{#if movie.watched}
							<div class="badge badge-outline absolute left-3 top-3 bg-base-300">Angesehen</div>
						{/if}
					</figure>
					<div class="card-body items-center py-2 text-center">
						<p class="card-title">{movie.title}</p>
					</div>
				</a>
			{/each}
		{:else}
			<p>Du hast noch keine Filme hinzugefügt</p>
		{/if}
	</div>
</main>

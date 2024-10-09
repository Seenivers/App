<script lang="ts">
	import { placeholderURL, imageURL } from '$lib';
	import { data } from '$lib/db';

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

	// Gefilterte Filme basierend auf den Suchparametern
	let matchedMovies: typeof $data.movies = [];

	function filterMovies() {
		// Filtert die Filme basierend auf den Kriterien
		matchedMovies = $data.movies.filter((movie) => {
			// Filter für den Titel
			const titleMatches =
				searchCriteria.title === '' ||
				movie.title.toLowerCase().includes(searchCriteria.title.toLowerCase());

			// Filter für das Genre
			const genreMatches =
				searchCriteria.genre === null ||
				movie.genres.some((genre) =>
					genre.name.toLowerCase().includes(searchCriteria.genre?.toLowerCase() || '')
				);

			// Filter für den "Gesehen"-Status
			const watchedMatches =
				searchCriteria.isWatched === null || movie.watched === searchCriteria.isWatched;

			// Rückgabe nur, wenn alle Bedingungen erfüllt sind
			return titleMatches && genreMatches && watchedMatches;
		});
	}

	// Initiale Filterung ausführen
	filterMovies();
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a href="add" class="btn btn-ghost">Hinzufügen</a>
	</div>
</div>

<main class="flex-grow flex-col p-5">
	<div class="join flex flex-wrap justify-center" on:change={filterMovies}>
		<div>
			<div>
				<input
					class="input join-item input-bordered"
					placeholder="Title"
					bind:value={searchCriteria.title}
				/>
			</div>
		</div>
		<select class="join-item select select-bordered" bind:value={searchCriteria.genre}>
			<option value={null}>Kein Filter</option>
			{#each $data.movies.flatMap((item) => item.genres.map((i) => i.name)) as item}
				<option>{item}</option>
			{/each}
		</select>
		<select class="join-item select select-bordered" bind:value={searchCriteria.isWatched}>
			<option value={null}>Film angesehen</option>
			<option value={true}>Angeschaut</option>
			<option value={false}>Nicht angeschaut</option>
		</select>
	</div>
	<div class="flex flex-wrap justify-center gap-5 p-5 pb-20">
		{#if matchedMovies.length >= 1}
			{#each matchedMovies as item}
				<a
					href={item.id.toString()}
					draggable="false"
					class="card h-fit min-w-[15rem] max-w-[20rem] flex-grow select-none bg-base-100 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-base-content/20"
				>
					<figure class="relative px-2 pt-2">
						<img
							src={item.poster_path ? imageURL + item.poster_path : placeholderURL}
							alt="Poster von {item.title}"
							class="rounded-xl"
							draggable="false"
						/>
						{#if item.watched}
							<div class="badge badge-outline absolute left-3 top-3 bg-base-300">Angesehen</div>
						{/if}
					</figure>
					<div class="card-body items-center py-2 text-center">
						<p class="card-title">{item.title}</p>
					</div>
				</a>
			{/each}
		{:else}
			<p>Du hast noch keine Filme hinzugefügt</p>
		{/if}
	</div>
</main>

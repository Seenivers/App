<script lang="ts">
	import { open } from '@tauri-apps/plugin-dialog';
	import { videoDir } from '@tauri-apps/api/path';
	import { data } from '$lib/db';
	import { tmdb } from '$lib/tmdb';
	import { readDir } from '@tauri-apps/plugin-fs';
	import { imageURL, placeholderURL } from '$lib';
	import { newToast } from '$lib/toast/toast';

	let selected: string | string[] | null = null;
	let status: {
		searchStatus: 'notStarted' | 'searching' | 'notFound' | 'foundOne' | 'foundMultiple';
		searchResults: {
			adult: boolean;
			backdrop_path: string | null;
			genre_ids: number[];
			id: number;
			original_language: string;
			original_title: string;
			overview: string;
			popularity: number;
			poster_path: string | null;
			release_date: string;
			title: string;
			video: boolean;
			vote_average: number;
			vote_count: number;
		}[];
		searchParams: {
			path: string;
			name: string;
			includeAdult?: boolean;
			language?: string;
			primaryReleaseYear?: string | number;
			page: number;
		};
	}[] = [];

	const extensions = ['mp4', 'mkv'];

	let modal = false;
	let modalID = 0;

	// Handle file selection
	async function selectFile() {
		selected = await open({
			multiple: true,
			directory: false,
			defaultPath: await videoDir(),
			filters: [{ name: 'Video', extensions }]
		});
		if (Array.isArray(selected)) load(selected);
	}

	// Handle folder selection
	async function selectFolder() {
		selected = await open({
			multiple: false,
			directory: true,
			defaultPath: await videoDir()
		});
		if (selected) {
			let entries = await readDir(selected);
			const test = entries
				.filter((entry) => entry.name.toLowerCase().endsWith('.mp4'))
				.map((entry) => `${selected}\\${entry.name}`);
			load(test);
		}
	}

	async function load(files: string[]) {
		if (!files || !$data.settings.online) return;

		selected = null;

		// Filter out already added movies
		files = files.filter((path) => {
			const lowerCasePath = path.toLowerCase();
			return !$data.movies.some((movie) => movie.path.toLowerCase() === lowerCasePath);
		});

		if (files.length === 0) {
			alert(
				'Es sind keine Filme zum Hinzufügen vorhanden, da sie bereits in der Datenbank gespeichert sind.'
			);
			return;
		}

		// Initialisiere den Suchstatus und die Parameter
		status = files.map((path) => {
			const name =
				path
					.split('\\')
					.pop()
					?.replace(/\.[^/.]+$/, '') || '';
			const fileName = name
				.split(/[.\s]+/)
				.filter(
					(word) =>
						!$data.settings.keywords.map((k) => k.toLowerCase()).includes(word.toLowerCase())
				)
				.join(' ');
			const yearMatch = fileName.match(/(\d{4})/);
			const year = yearMatch ? yearMatch[1] : '';
			const cleanedFileName = fileName.replace(/\s*\(\d{4}\)\s*|(\d{4})/g, '').trim();

			return {
				searchStatus: 'notStarted',
				searchResults: [],
				searchParams: {
					path,
					name: cleanedFileName || name,
					primaryReleaseYear: year,
					includeAdult: $data.settings.adult,
					language: $data.settings.language,
					page: 1
				}
			};
		});

		// Suche gleichzeitig
		await Promise.all(status.map((_, i) => search(i)));

		// Speichere in der Datenbank
		$data.save();
	}

	async function search(i: number) {
		status[i].searchStatus = 'searching';
		if (!$data.settings.online && tmdb) {
			console.error(!$data.settings.online && tmdb);
			newToast(
				'error',
				'Sie sind nicht mit dem Internet verbunden oder es ist ein Fehler mit der TMDB Api aufgetreten'
			);
			return;
		}
		const { name, primaryReleaseYear } = status[i].searchParams;

		// Perform TMDB search
		const result = (
			await tmdb.search.movie(name, {
				language: $data.settings.language,
				includeAdult: $data.settings.adult,
				primaryReleaseYear: primaryReleaseYear?.toString(),
				page: 1
			})
		).results;

		// Update status based on results
		if (result.length === 1) {
			status[i].searchResults = result;
			status[i].searchStatus = 'foundOne';

			// Füge den Film nur hinzu, wenn der Benutzer keinen Film manuell ausgewählt hat
			if (status[i].searchStatus === 'foundOne' && !modal) {
				addMovie(result[0].id, status[i].searchParams.path);
			}
		} else if (result.length > 1) {
			status[i].searchResults = result;
			status[i].searchStatus = 'foundMultiple';
		} else {
			status[i].searchStatus = 'notFound';
		}
	}

	async function addMovie(id: number, path: string) {
		if (!$data.settings.online && tmdb) {
			console.error(!$data.settings.online && tmdb);
			newToast(
				'error',
				'Sie sind nicht mit dem Internet verbunden oder es ist ein Fehler mit der TMDB Api aufgetreten'
			);
			return;
		}
		const result = await tmdb.movie.details(id);

		$data.movies.push({
			path: path,
			watched: false,
			watchTime: 0,
			...result
		});
	}

	// Ensure that only the selected movie is added
	function selectMovie(modalID: number, movieIndex: number) {
		const selectedMovie = status[modalID].searchResults[movieIndex];

		// Remove previously added movie from auto-selection
		$data.movies = $data.movies.filter((movie) => movie.path !== status[modalID].searchParams.path);

		// Add the user-selected movie
		addMovie(selectedMovie.id, status[modalID].searchParams.path);

		// Save to database
		$data.save();

		status[modalID].searchStatus = 'foundOne';
		modal = false; // Close the modal after selection
	}

	function buttonClass(searchStatus: string) {
		switch (searchStatus) {
			case 'notStarted':
				return 'btn-neutral';
			case 'searching':
				return 'btn-primary';
			case 'notFound':
				return 'btn-error';
			case 'foundOne':
				return 'btn-success';
			case 'foundMultiple':
				return 'btn-warning';
			default:
				return 'btn-neutral';
		}
	}

	function getIcon(searchStatus: string) {
		switch (searchStatus) {
			case 'notStarted':
				return '🔍'; // search icon
			case 'searching':
				return '⏳'; // loading icon
			case 'notFound':
				return '❌'; // not found icon
			case 'foundOne':
				return '✅'; // found one icon
			case 'foundMultiple':
				return '⚠️'; // multiple results icon
			default:
				return '🔍'; // default to search icon
		}
	}

	function openModal(index: number) {
		modalID = index;
		modal = true;
	}
</script>

<!-- Responsive Design and Layout -->
<nav class="navbar bg-base-100">
	<div class="flex-1">
		<a href="/" class="btn btn-ghost">Zurück</a>
	</div>
</nav>

<main class="flex flex-col items-center p-5">
	{#if !$data.settings.online}
		<div class="alert alert-error text-center">Du bist nicht mit dem Internet verbunden</div>
	{:else if status && status.length > 0}
		<div class="grid w-full gap-3">
			{#each status as item, index}
				<div class="flex justify-between rounded-md bg-base-200 p-3">
					<span>Name: {item.searchParams.name}</span>
					<button
						class="btn bg-opacity-50 {buttonClass(status[index].searchStatus)}"
						on:click={() => openModal(index)}
					>
						{getIcon(status[index].searchStatus)}
					</button>
				</div>
			{/each}
		</div>
	{:else}
		<div class="flex w-3/4 gap-5">
			<button
				class="btn grow"
				on:click={selectFile}
				disabled={selected !== null || !$data.settings.online}>Film(e) auswählen</button
			>
			<button
				class="btn grow"
				on:click={selectFolder}
				disabled={selected !== null || !$data.settings.online}>Ordner auswählen</button
			>
		</div>
	{/if}
</main>

<!-- Modal -->
<dialog class="modal backdrop-blur-sm" open={modal}>
	<div class="modal-box max-w-3xl">
		<button class="btn btn-circle btn-sm absolute right-2 top-2" on:click={() => (modal = false)}
			>✕</button
		>
		{#if modalID !== null && status[modalID]}
			<h2 class="line-clamp-1 py-1 text-3xl">
				{status[modalID].searchParams.path.split('\\').pop()}
			</h2>

			<form
				on:submit|preventDefault={() => {
					search(modalID);
				}}
				class="my-3 grid gap-3"
			>
				<label class="input input-bordered flex items-center gap-2">
					Filmname:
					<input
						type="text"
						class="grow"
						minlength="2"
						disabled={status[modalID].searchStatus === 'searching'}
						required
						bind:value={status[modalID].searchParams.name}
					/>
				</label>
				<label class="input input-bordered flex items-center gap-2">
					Veröffentlichungsjahr:
					<input
						type="number"
						class="grow"
						minlength="4"
						maxlength="4"
						disabled={status[modalID].searchStatus === 'searching'}
						bind:value={status[modalID].searchParams.primaryReleaseYear}
					/>
					<span class="badge badge-info">Optional</span>
				</label>
				<button
					type="submit"
					class="btn grow"
					disabled={status[modalID].searchStatus === 'searching'}>Suchen</button
				>
			</form>

			<hr class="my-3 border-2 border-base-content" />

			{#if status[modalID].searchStatus === 'searching'}
				<div
					class="mx-auto flex max-w-md flex-col items-center rounded-lg bg-base-200 p-5 shadow-md"
				>
					<h2 class="mb-2 text-2xl font-semibold">Suche läuft...</h2>
					<p class="mb-4 text-sm text-gray-600">
						Bitte warten Sie, während wir nach Filmen suchen.
					</p>
					<div class="mb-4 flex items-center justify-center">
						<div
							class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
						></div>
					</div>
					<button class="btn btn-secondary w-full" disabled> Suchen... </button>
				</div>
			{:else if modalID !== null && status[modalID]?.searchResults?.length > 0}
				<div class="grid gap-4">
					{#each status[modalID].searchResults as result, i}
						<button
							class="flex cursor-pointer space-y-2 rounded-lg border border-base-300 bg-base-200 p-3"
							on:click={() => selectMovie(modalID, i)}
						>
							<img
								src={result.poster_path ? imageURL + result.poster_path : placeholderURL}
								alt="Poster"
								class="h-72 rounded-lg"
							/>
							<div class="px-3 text-left">
								<p><strong>{result.title}</strong></p>
								<p class="text-sm text-gray-500">Veröffentlichungsdatum: {result.release_date}</p>
								<p class=" text-gray-400">{result.overview}</p>
							</div>
						</button>
					{/each}
				</div>
			{:else}
				<p class="text-center text-error">Keine Ergebnisse gefunden.</p>
			{/if}
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop" on:submit|preventDefault={() => (modal = false)}>
		<button>close</button>
	</form>
</dialog>

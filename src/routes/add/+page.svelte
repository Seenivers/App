<script lang="ts">
	import { open } from '@tauri-apps/plugin-dialog';
	import { videoDir } from '@tauri-apps/api/path';
	import { readDir } from '@tauri-apps/plugin-fs';
	import { imageURL, placeholderURL } from '$lib';
	import { error } from '@tauri-apps/plugin-log';
	import { addMovie, isPathUnique, settings } from '$lib/db/funktion';
	import { buttonClass, getIcon, getMovieDetails, searchMovies } from '$lib/add/index';
	import type { MovieSearchStatus } from '$lib/add/types';
	import { image } from '$lib/image';

	let selected: string | string[] | null = null;
	let status: MovieSearchStatus[] = [];

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
		if (!files || !window.navigator.onLine) return;

		selected = null;

		// Filter out already added movies
		const newFiles = (
			await Promise.all(
				files.map(async (path) => {
					const unique = await isPathUnique(path);
					return unique ? path : null;
				})
			)
		).filter((path): path is string => path !== null);

		if (newFiles.length === 0) {
			alert(
				'Es sind keine Filme zum Hinzufügen vorhanden, da sie bereits in der Datenbank gespeichert sind.'
			);
			return;
		}

		// Initialisiere den Suchstatus und die Parameter
		status = newFiles.map((path) => {
			const name =
				path
					.split('\\')
					.pop()
					?.replace(/\.[^/.]+$/, '') || '';

			const fileName = name
				.split(/[.\s]+/)
				.filter((word) => {
					// Filtern von Keywords ohne async-Aktion
					return !settings.keywords.map((k) => k.toLowerCase()).includes(word.toLowerCase());
				})
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
					includeAdult: settings.adult,
					page: 1
				}
			};
		});

		// Suche
		status.forEach(async (_, i) => await search(i));
	}

	async function search(i: number) {
		status[i].searchStatus = 'searching';
		if (!window.navigator.onLine) {
			error(
				'Sie sind nicht mit dem Internet verbunden oder es ist ein Fehler mit der Api aufgetreten'
			);
			return;
		}
		const { name, primaryReleaseYear } = status[i].searchParams;

		// Perform TMDB search
		const result = (await searchMovies(name, primaryReleaseYear)).results;

		// Update status based on results
		if (result.length === 1) {
			status[i].searchResults = result;
			status[i].searchStatus = 'foundOne';

			// Füge den Film nur hinzu, wenn der Benutzer keinen Film manuell ausgewählt hat
			if (status[i].searchStatus === 'foundOne' && !modal) {
				addNewMovie(result[0].id, status[i].searchParams.path);
			}
		} else if (result.length > 1) {
			status[i].searchResults = result;
			status[i].searchStatus = 'foundMultiple';
		} else {
			status[i].searchStatus = 'notFound';
		}
	}

	async function addNewMovie(id: number, path: string) {
		if (!window.navigator.onLine) {
			error(
				'Sie sind nicht mit dem Internet verbunden oder es ist ein Fehler mit der Api aufgetreten'
			);
			return;
		}

		try {
			const result = await getMovieDetails(id);

			if (result) {
				// Film zur DB hinzufügen
				addMovie({ id, path, tmdb: result });

				// Posterbild laden, falls verfügbar
				if (result.poster_path) {
					try {
						await image(result.poster_path, 'posters', true);
					} catch (err) {
						error('Fehler beim Laden des Posters: ' + err);
					}
				}

				// Hintergrundbild laden, falls verfügbar
				if (result.backdrop_path) {
					try {
						await image(result.backdrop_path, 'backdrops', true);
					} catch (err) {
						error('Fehler beim Laden des Hintergrundbilds: ' + err);
					}
				}

				// Schauspieler-Bilder parallel laden, nur wenn Pfad vorhanden
				const castImagePaths = result.credits.cast
					.map((actor) => actor.profile_path)
					.filter((path) => path != null);

				const images = 4; // 5 Bilder laden

				try {
					castImagePaths.forEach(async (path, i) => {
						if (i > images) return;
						await image(path, 'actors', true);
					});
				} catch (err) {
					error('Fehler beim Laden der Schauspieler-Bilder: ' + err);
					return;
				}
			} else {
				error('Der Film konnte nicht geladen werden.');
				return;
			}
		} catch (err) {
			error('Fehler beim Abrufen der Filmdetails: ' + err);
			return;
		}

		return Promise.resolve();
	}

	// Ensure that only the selected movie is added
	function selectMovie(modalID: number, movieIndex: number) {
		// Add the user-selected movie
		addNewMovie(status[modalID].searchResults[movieIndex].id, status[modalID].searchParams.path);

		status[modalID].searchStatus = 'foundOne';
		modal = false; // Close the modal after selection
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
	{#if !window.navigator.onLine}
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
				disabled={selected !== null || !window.navigator.onLine}>Film(e) auswählen</button
			>
			<button
				class="btn grow"
				on:click={selectFolder}
				disabled={selected !== null || !window.navigator.onLine}>Ordner auswählen</button
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

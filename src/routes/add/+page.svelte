<script lang="ts">
	import { open } from '@tauri-apps/plugin-dialog';
	import { videoDir } from '@tauri-apps/api/path';
	import { readDir } from '@tauri-apps/plugin-fs';
	import { imageURL, placeholderURL } from '$lib';
	import { error } from '@tauri-apps/plugin-log';
	import { settings } from '$lib/db/funktion';
	import {
		addNewFilesToStatus,
		addNewMovie,
		buttonClass,
		filterNewFiles,
		findNewFileIndexes,
		getIcon,
		getValidFileNames,
		searchMovies
	} from '$lib/add/index';
	import type { MovieSearchContext } from '$lib/types/add';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import Dnd from '$lib/add/dnd.svelte';

	export let data: PageData;

	let status: MovieSearchContext[] = [];

	const extensions = ['mp4', 'mkv'];

	let modal = false;
	let modalID = 0;

	let loading = false;

	onMount(async () => {
		if (data.paths.length > 0 && Array.isArray(data.paths)) {
			load(data.paths);
		}
	});

	// Handle file selection
	async function selectFile() {
		const files = await open({
			multiple: true,
			directory: false,
			defaultPath: await videoDir(),
			filters: [{ name: 'Video', extensions }]
		});

		if (files) {
			// Filter and map in a single loop using the provided extensions
			const validFiles = getValidFileNames(files, extensions);

			if (validFiles && Array.isArray(validFiles) && validFiles.length > 0) load(validFiles);
		}
	}

	// Handle folder selection
	async function selectFolder() {
		const folder = await open({
			multiple: false,
			directory: true,
			defaultPath: await videoDir()
		});

		if (folder) {
			const entries = await readDir(folder);

			// Filter and map in a single loop using the provided extensions
			const validFiles = getValidFileNames(
				entries.map((entry) => `${folder}\\${entry.name}`),
				extensions
			);

			if (validFiles && Array.isArray(validFiles) && validFiles.length > 0) load(validFiles);
		}
	}

	async function load(files: string[]) {
		if (loading || !files || !window.navigator.onLine) return;

		loading = true;

		// Filtere nur die Dateien, die nicht bereits im Status enthalten sind
		const newFiles = await filterNewFiles(files, status);

		if (newFiles.length === 0) {
			alert(
				'Es sind keine Filme zum Hinzufügen vorhanden, da sie bereits in der Datenbank gespeichert sind.'
			);
			return;
		}

		addNewFilesToStatus(newFiles, status, settings);

		// Suche nur für neue Filme durchführen
		const newFileIndexes = findNewFileIndexes(newFiles, status);

		for (const index of newFileIndexes) {
			await search(index);
		}
		loading = false;
	}

	async function search(i: number) {
		// Prüfe die Internetverbindung
		if (!window.navigator.onLine) {
			error(
				'Sie sind nicht mit dem Internet verbunden oder es ist ein Fehler mit der API aufgetreten.'
			);
			status[i].state = 'notFound';
			return;
		}

		status[i].state = 'searching';

		const { query, primaryReleaseYear } = status[i].options;

		try {
			// TMDB-Suche durchführen
			const result = (await searchMovies(query, primaryReleaseYear)).results;

			// Update status based on results
			if (result.length === 1) {
				status[i].results = result;
				status[i].state = 'foundOne';

				// Füge den Film nur hinzu, wenn der Benutzer keinen Film manuell ausgewählt hat
				if (!modal) {
					await addNewMovie(result[0].id, status[i].options.path);
				}
			} else if (result.length > 1) {
				status[i].results = result;
				status[i].state = 'foundMultiple';
			} else {
				status[i].results = [];
				status[i].state = 'notFound';
			}
		} catch (err) {
			// Fehlerbehandlung
			if (err instanceof Error) {
				error('Fehler bei der Suche: ' + err.message);
			} else {
				error('Ein unbekannter Fehler ist aufgetreten: ' + err); // Fallback, wenn es kein Error-Objekt ist
			}
			status[i].results = [];
			status[i].state = 'notFound';
		}
	}

	// Ensure that only the selected movie is added
	async function selectMovie(modalID: number, movieIndex: number) {
		modal = false; // Close the modal after selection
		status[modalID].state = 'foundOne';

		// Add the user-selected movie
		await addNewMovie(status[modalID].results[movieIndex].id, status[modalID].options.path);
	}

	function openModal(index: number) {
		modalID = index;
		modal = true;
	}
</script>

<Dnd {load} {extensions} />

<!-- Navbar -->
<nav class="navbar sticky top-0 z-10 flex justify-between bg-base-100 p-2 shadow-lg md:p-4">
	<div class="gap-1">
		<a href="/" class="btn btn-ghost">Zurück zur Startseite</a>
	</div>
	<div class="gap-1">
		<!-- Platzhalter -->
	</div>
</nav>

<main class="z-0 flex flex-col items-center p-5">
	{#if !window.navigator.onLine}
		<div class="alert alert-error text-center">
			Du bist momentan nicht mit dem Internet verbunden.
		</div>
	{:else}
		<div class="mb-5 flex w-3/4 gap-5">
			<button class="btn grow" on:click={selectFile} disabled={!window.navigator.onLine}>
				Filme auswählen
			</button>
			<button class="btn grow" on:click={selectFolder} disabled={!window.navigator.onLine}>
				Ordner auswählen
			</button>
		</div>

		<div class="grid w-full gap-3">
			{#each status as item, index}
				<div class="flex justify-between gap-3 rounded-md bg-base-200 p-3">
					<span>
						<p class="text-lg">Filmtitel: {item.options.query}</p>
						<p class="text-sm">Dateipfad: {item.options.path}</p>
					</span>
					<button
						class="btn bg-opacity-50 {buttonClass(status[index].state)}"
						on:click={() => openModal(index)}
					>
						{getIcon(status[index].state)}
					</button>
				</div>
			{/each}
		</div>
	{/if}
</main>

<!-- Modal -->
<dialog class="modal backdrop-blur-sm" open={modal}>
	<div class="modal-box max-w-3xl">
		<button class="btn btn-circle btn-sm absolute right-2 top-2" on:click={() => (modal = false)}>
			✕
		</button>
		{#if modalID !== null && status[modalID]}
			<h2 class="line-clamp-1 py-1 text-3xl">
				{status[modalID].options.path.split('\\').pop()}
			</h2>

			<form
				on:submit|preventDefault={() => {
					search(modalID);
				}}
				class="my-3 grid gap-3"
			>
				<label class="input input-bordered flex items-center gap-2">
					Filmtitel:
					<input
						type="text"
						class="grow"
						minlength="2"
						disabled={status[modalID].state === 'searching'}
						required
						bind:value={status[modalID].options.query}
					/>
				</label>
				<label class="input input-bordered flex items-center gap-2">
					Veröffentlichungsjahr:
					<input
						type="number"
						class="grow"
						minlength="4"
						maxlength="4"
						disabled={status[modalID].state === 'searching'}
						bind:value={status[modalID].options.primaryReleaseYear}
					/>
					<span class="badge badge-info">Optional</span>
				</label>
				<button type="submit" class="btn grow" disabled={status[modalID].state === 'searching'}>
					Suchen
				</button>
			</form>

			<hr class="my-3 border-2 border-base-content" />

			{#if status[modalID].state === 'searching'}
				<div
					class="mx-auto flex max-w-md flex-col items-center rounded-lg bg-base-200 p-5 shadow-md"
				>
					<h2 class="mb-2 text-2xl font-semibold">Suche läuft...</h2>
					<p class="mb-4 text-sm text-gray-600">
						Wir durchsuchen gerade die Datenbank nach dem Film.
					</p>
					<div class="mb-4 flex items-center justify-center">
						<div
							class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
						></div>
					</div>
					<button class="btn btn-secondary w-full" disabled> Suchen... </button>
				</div>
			{:else if modalID !== null && status[modalID]?.results?.length > 0}
				<div class="grid gap-4">
					{#each status[modalID].results as result, i}
						<button
							class="flex cursor-pointer space-y-2 rounded-lg border border-base-300 bg-base-200 p-3"
							on:click={async () => {
								await selectMovie(modalID, i);
							}}
						>
							<img
								src={result.poster_path ? imageURL + result.poster_path : placeholderURL}
								alt="Poster"
								class="h-72 rounded-lg"
							/>
							<div class="px-3 text-left">
								<p><strong>{result.title}</strong></p>
								<p class="text-sm text-gray-500">Veröffentlichungsdatum: {result.release_date}</p>
								<p class="text-gray-400">{result.overview}</p>
							</div>
						</button>
					{/each}
				</div>
			{:else if status[modalID].state === 'notStarted'}
				<p class="text-center">
					Es wurde noch nicht nach einem Film gesucht. Bitte klicken Sie auf "Suchen", wenn Sie den
					Film hinzufügen möchten.
				</p>
			{:else}
				<p class="text-center text-error">Es wurden keine Ergebnisse gefunden.</p>
			{/if}
		{/if}
	</div>
	<form method="dialog" class="modal-backdrop" on:submit|preventDefault={() => (modal = false)}>
		<button>Schließen</button>
	</form>
</dialog>

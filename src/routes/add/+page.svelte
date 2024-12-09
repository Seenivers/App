<script lang="ts">
	import { open } from '@tauri-apps/plugin-dialog';
	import { videoDir } from '@tauri-apps/api/path';
	import { readDir } from '@tauri-apps/plugin-fs';
	import { imageURL, placeholderURL } from '$lib';
	import { error } from '@tauri-apps/plugin-log';
	import { addCollection, addMovie, isPathUnique, settings } from '$lib/db/funktion';
	import { buttonClass, getIcon, searchMovies } from '$lib/add/index';
	import type { MovieSearchStatus } from '$lib/add/types';
	import { image } from '$lib/image';
	import { getCollection as getCollectionTmdb, getMovie as getMovieTmdb } from '$lib/tmdb';
	import type { PageData } from './$types';
	import { onDestroy, onMount } from 'svelte';
	import { listen } from '@tauri-apps/api/event';
	import type { UnlistenFn } from '@tauri-apps/api/event';
	import type { DropPayload } from '$lib/types/add';

	export let data: PageData;

	let selected: string | string[] | null = data.paths.length > 0 ? data.paths : null;
	let status: MovieSearchStatus[] = [];

	const castImages = 4; // 5 Bilder laden
	const extensions = ['mp4', 'mkv'];

	let modal = false;
	let modalID = 0;

	let isDraggingOver = false;
	let handleDrop: UnlistenFn;
	let handleDragEnter: UnlistenFn;
	let handleDragLeave: UnlistenFn;

	onMount(async () => {
		if (selected && Array.isArray(selected)) {
			load(selected);
		}

		const supportedExtensions = new Set(extensions.map((ext) => ext.toLowerCase()));

		handleDrop = await listen<DropPayload>('tauri://drag-drop', (event) => {
			isDraggingOver = false;
			const files = event.payload.paths.filter((path) => {
				const fileExtension = path.split('.').pop()?.toLowerCase();
				return fileExtension && supportedExtensions.has(fileExtension);
			});

			if (files.length > 0) {
				load(files);
			}
		});

		handleDragEnter = await listen<DropPayload>(
			'tauri://drag-enter',
			() => (isDraggingOver = true)
		);
		handleDragLeave = await listen<DropPayload>(
			'tauri://drag-leave',
			() => (isDraggingOver = false)
		);
	});

	// Bereinigen der Event-Listener bei Zerstörung der Komponente
	onDestroy(() => {
		handleDrop();
		handleDragEnter();
		handleDragLeave();
	});

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

		// Prüfe die Internetverbindung
		if (!window.navigator.onLine) {
			error(
				'Sie sind nicht mit dem Internet verbunden oder es ist ein Fehler mit der API aufgetreten.'
			);
			status[i].searchStatus = 'notFound';
			return;
		}

		const { name, primaryReleaseYear } = status[i].searchParams;

		try {
			// TMDB-Suche durchführen
			const result = (await searchMovies(name, primaryReleaseYear)).results;

			// Update status based on results
			if (result.length === 1) {
				status[i].searchResults = result;
				status[i].searchStatus = 'foundOne';

				// Füge den Film nur hinzu, wenn der Benutzer keinen Film manuell ausgewählt hat
				if (!modal) {
					await addNewMovie(result[0].id, status[i].searchParams.path);
				}
			} else if (result.length > 1) {
				status[i].searchResults = result;
				status[i].searchStatus = 'foundMultiple';
			} else {
				status[i].searchResults = [];
				status[i].searchStatus = 'notFound';
			}
		} catch (err) {
			// Fehlerbehandlung
			if (err instanceof Error) {
				error('Fehler bei der Suche: ' + err.message);
			} else {
				error('Ein unbekannter Fehler ist aufgetreten: ' + err); // Fallback, wenn es kein Error-Objekt ist
			}
			status[i].searchResults = [];
			status[i].searchStatus = 'notFound';
		}
	}

	async function addNewMovie(id: number, path: string) {
		// Überprüfen, ob der Benutzer online ist
		if (!window.navigator.onLine) {
			error('Sie sind nicht mit dem Internet verbunden.');
			return;
		}

		if (!id) {
			error('Es muss eine Valide ID angegeben werden.');
			return;
		}

		// Hole die Filmdetails
		const result = await getMovieTmdb(id);

		// Film zur DB hinzufügen
		await addMovie({ id, path, tmdb: result, updated: new Date() });

		// Posterbild laden, falls verfügbar
		if (result.poster_path) {
			await loadImageWithErrorHandling(result.poster_path, 'posters');
		}

		// Hintergrundbild laden, falls verfügbar
		if (result.backdrop_path) {
			await loadImageWithErrorHandling(result.backdrop_path, 'backdrops');
		}

		// Collection hinzufügen, falls vorhanden
		if (result.belongs_to_collection && result.belongs_to_collection.id) {
			const collection = await getCollectionTmdb(result.belongs_to_collection.id);
			if (collection) {
				await addCollection({ ...collection, updated: new Date() });
			}
		}

		// Schauspieler-Bilder parallel laden, nur wenn Pfad vorhanden
		const castImagePaths = result.credits.cast
			.map((actor) => actor.profile_path)
			.filter((path) => path != null);

		// Bilder für Schauspieler laden
		for (let i = 0; i < castImagePaths.length || i <= castImages; i++) {
			const path = castImagePaths[i];
			await loadImageWithErrorHandling(path, 'actors');
		}

		return Promise.resolve();
	}

	// Hilfsfunktion zum Laden von Bildern mit Fehlerbehandlung
	async function loadImageWithErrorHandling(
		path: string,
		folder: 'actors' | 'backdrops' | 'posters' | null
	) {
		try {
			await image(path, folder, true);
		} catch (err) {
			error(`Fehler beim Laden von ${folder}-Bild: ${err}`);
		}
	}

	// Ensure that only the selected movie is added
	async function selectMovie(modalID: number, movieIndex: number) {
		modal = false; // Close the modal after selection
		status[modalID].searchStatus = 'foundOne';

		// Add the user-selected movie
		await addNewMovie(
			status[modalID].searchResults[movieIndex].id,
			status[modalID].searchParams.path
		);
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

{#if isDraggingOver}
	<div class="fixed inset-0 z-40 flex items-center justify-center p-5 backdrop-blur-sm">
		<div
			class="flex h-full w-full flex-col items-center justify-center rounded-lg border-4 border-dashed border-base-content bg-opacity-50 shadow-lg"
		>
			<p class="text-lg font-semibold text-base-content">
				Zieh eine Datei hierher, um sie hinzufügen
			</p>
		</div>
	</div>
{/if}

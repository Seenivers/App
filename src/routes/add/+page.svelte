<script lang="ts">
	import {
		addNewFiles,
		addNewMovie,
		buttonClass,
		getIcon,
		searchMovieStatus,
		selectFile,
		selectFolder
	} from '$lib/add/index';
	import { isOnline, status } from '$lib/stores.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { clearResultsOnLeave } from '$lib';
	import Dnd from '$lib/add/dnd.svelte';
	import type { MovieSearchState } from '$lib/types/add';
	import { error, warn } from '@tauri-apps/plugin-log';
	import Navbar from '$lib/Navbar.svelte';
	import Img from '$lib/image/Img.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let modal = $state(false);
	let modalID: number | null = $state(null);
	let loading = false;
	let filter: MovieSearchState | null = $state(null);

	// Zähle die Anzahl der Filme für jeden Zustand
	let counts = $derived(
		status.reduce(
			(acc, item) => {
				const state = item.state; // Hole den Zustand des Films
				if (state && acc.hasOwnProperty(state)) {
					// Überprüfe, ob der Zustand existiert und validiere ihn
					acc[state] = (acc[state] || 0) + 1;
				} else {
					warn(`Ungültiger Zustand für Film gefunden: ${state}`);
				}
				return acc;
			},
			{
				wait: 0,
				searching: 0,
				notFound: 0,
				foundOne: 0,
				foundMultiple: 0,
				downloading: 0
			}
		)
	);

	// Überprüfe beim Mounten, ob die Daten valide sind und starte den Ladevorgang
	onMount(async () => {
		if (Array.isArray(data.paths) && data.paths.length > 0) {
			// Wenn data.paths ein Array ist und nicht leer, starte den Ladevorgang
			await load(data.paths);
		}
	});

	// Lade die Dateien und starte die Suche nur, wenn noch nicht alle Filme verarbeitet wurden
	async function load(newFiles?: string[]) {
		// Falls neue Dateien übergeben werden, füge sie dem Status hinzu
		if (newFiles && newFiles.length > 0) {
			await addNewFiles(newFiles);
		}

		// Verhindere, dass die Funktion startet, wenn bereits geladen wird oder die Verbindung offline ist
		if (loading || !$isOnline) return;

		loading = true;

		// Filtere die Einträge mit dem Status "wait"
		const waitEntries = status.filter((entry) => entry.state === 'wait');

		// Iteriere über alle "wait"-Einträge und starte die Suche für diese
		for (const entry of waitEntries) {
			const entryIndex = status.findIndex((e) => e.options.path === entry.options.path);

			// Falls der Eintrag noch im Status vorhanden ist, starte die Suche
			if (entryIndex !== -1) {
				// Suche nach dem Film
				if (status[entryIndex].options.id) {
					await searchMovieStatus(entryIndex, modal);
				}

				// Wenn der Film gefunden wurde, füge ihn dem Status hinzu
				if (status[entryIndex].options.id) {
					await addNewMovie(status[entryIndex].options.id, entryIndex);
				}
			}
		}

		// Setze den Ladezustand zurück, nachdem alle Einträge verarbeitet wurden
		loading = false;

		// Wenn noch Filme im Status mit "wait" und ohne Ergebnisse sind, starte die Funktion erneut
		const hasUnprocessedMovies = status.some(
			(entry) => entry.state === 'wait' && entry.results.length === 0
		);

		// Nur erneut laden, wenn wirklich noch Einträge zu verarbeiten sind
		if (hasUnprocessedMovies) {
			load();
		}
	}

	// Stelle sicher, dass nur der ausgewählte Film hinzugefügt wird
	async function selectMovie(modalID: number, movieIndex: number) {
		// Überprüfe, ob der Index gültig ist, um Fehler zu vermeiden
		const movieResults = status[modalID]?.results ?? [];
		if (movieIndex < 0 || movieIndex >= movieResults.length) {
			error('Ungültiger Film-Index');
			return; // Verhindere die Auswahl eines ungültigen Films
		}

		modal = false; // Schließe das Modal nach Auswahl

		// Füge den vom Benutzer ausgewählten Film hinzu
		status[modalID].options.id = movieResults[movieIndex].id;
		status[modalID].state = 'wait'; // Setze den Status auf "wait" zurück

		// Lade neue Filme
		load();
	}

	// Öffne das Modal nur, wenn der Status des Films 'downloading' oder 'foundOne' ist
	function openModal(index: number) {
		// Sicherstellen, dass der Status des Films gültig ist, bevor das Modal geöffnet wird
		const filmState = status[index]?.state;
		if (filmState !== 'downloading' && filmState !== 'foundOne') {
			modalID = index;
			modal = true; // Öffne das Modal nur, wenn der Status gültig ist
		} else {
			error('Modal kann nicht geöffnet werden, da der Status ungültig ist: ' + filmState);
		}
	}
</script>

<Dnd {load} />

<Navbar
	back={true}
	onclick={() => {
		window.history.length > 1 ? window.history.back() : (window.location.href = '/');
		if (clearResultsOnLeave) {
			status.length = 0;
			filter = null;
		}
	}}
></Navbar>

<main class="z-0 flex flex-col items-center p-5">
	{#if !$isOnline}
		<div class="alert alert-error text-center">
			Du bist momentan nicht mit dem Internet verbunden.
		</div>
	{:else}
		<div class="mb-5 flex w-3/4 gap-5">
			<button
				class="btn grow"
				onclick={async () => {
					await selectFile();
					load();
				}}
				disabled={!$isOnline}
			>
				Filme auswählen
			</button>
			<button
				class="btn grow"
				onclick={async () => {
					await selectFolder();
					load();
				}}
				disabled={!$isOnline}
			>
				Ordner auswählen
			</button>
			<button
				class="btn hover:btn-error"
				onclick={() => {
					status.length = 0;
					filter = null;
				}}
				disabled={!$isOnline || status.length === 0}
			>
				Alles entfernen
			</button>
			<select class="select" bind:value={filter} disabled={!$isOnline || status.length === 0}>
				<option value={null} selected disabled={status.length === 0}>Kein Filter</option>
				<option value="wait" disabled={counts.wait === 0}>
					Warteschlange ({counts.wait})
				</option>
				<option value="searching" disabled={counts.searching === 0}>
					Sucht ({counts.searching})
				</option>
				<option value="notFound" disabled={counts.notFound === 0}>
					Nicht gefunden ({counts.notFound})
				</option>
				<option value="foundOne" disabled={counts.foundOne === 0}>
					Ein Film gefunden ({counts.foundOne})
				</option>
				<option value="foundMultiple" disabled={counts.foundMultiple === 0}>
					Mehrere Filme gefunden ({counts.foundMultiple})
				</option>
				<option value="downloading" disabled={counts.downloading === 0}>
					Laderunter ({counts.downloading})
				</option>
			</select>
		</div>

		<div class="grid w-full gap-3">
			{#each status as item, index}
				{#if item.state === filter || filter === null}
					<div class="flex justify-between gap-3 rounded-md bg-base-200 p-3">
						<span>
							<p class="text-lg">Filmtitel: {item.options.query}</p>
							<p class="text-sm">Dateipfad: {item.options.path}</p>
						</span>
						<button
							class="btn bg-opacity-50 {buttonClass(status[index].state)}"
							onclick={() => openModal(index)}
						>
							{getIcon(status[index].state)}
						</button>
					</div>
				{/if}
			{/each}
		</div>
	{/if}
</main>

<!-- Modal -->
<dialog class="modal backdrop-blur-sm" open={modal}>
	<div class="modal-box max-w-3xl">
		<button class="btn btn-circle btn-sm absolute right-2 top-2" onclick={() => (modal = false)}>
			✕
		</button>
		{#if modalID !== null && status[modalID]}
			<h2 class="line-clamp-1 py-1 text-3xl">
				{status[modalID].options.path.split('\\').pop()}
			</h2>

			<form
				onsubmit={async (event) => {
					event.preventDefault();
					if (modalID !== null) {
						await searchMovieStatus(modalID, modal);
					}
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
							onclick={async () => {
								if (modalID !== null) {
									await selectMovie(modalID, i);
									modalID = null;
								}
							}}
						>
							<Img
								params={[result.poster_path, null, false]}
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
			{:else if status[modalID].state === 'wait'}
				<p class="text-center">
					Es wurde noch nicht nach einem Film gesucht.
					<br />
					Bitte klicken Sie auf "Suchen", wenn Sie den Film hinzufügen möchten.
				</p>
			{:else}
				<p class="text-center text-error">Es wurden keine Ergebnisse gefunden.</p>
			{/if}
		{/if}
	</div>
	<button
		class="modal-backdrop"
		onclick={() => {
			modal = false;
			modalID = null;
		}}>Schließen</button
	>
</dialog>

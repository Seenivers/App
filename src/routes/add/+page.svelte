<script lang="ts">
	import {
		addNewFiles,
		addNewMovie,
		buttonClass,
		getIcon,
		searchMovies,
		searchMovieStatus,
		selectFile,
		selectFolder
	} from '$lib/add/index';
	import { isOnline, status } from '$lib/stores';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { clearResultsOnLeave, extensions, imageURL, placeholderURL } from '$lib';
	import Dnd from '$lib/add/dnd.svelte';
	import type { MovieSearchState } from '$lib/types/add';

	export let data: PageData;

	let modal = false;
	let modalID = 0;

	let loading = false;
	let filter: MovieSearchState | null = null;

	// Zähle die Anzahl der Filme für jeden Zustand
	$: counts = $status.reduce(
		(acc, item) => {
			if (item.state) {
				acc[item.state] = (acc[item.state] || 0) + 1;
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
	);

	onMount(async () => {
		if (data.paths.length > 0 && Array.isArray(data.paths)) {
			// Neue Dateien hinzufügen
			await addNewFiles(data.paths);
			// Danach Suche starten
			await load();
		}
	});

	// Lade die Dateien und starte die Suche nur, wenn noch nicht alle Filme verarbeitet wurden
	async function load() {
		if (loading || !$isOnline) return;

		loading = true;

		// Überprüfe nach dem Hinzufügen der Dateien den Status der Einträge
		// Wenn noch Einträge mit dem Status "wait" existieren, starte die Suche für diese Filme
		const waitEntries = $status.filter((entry) => entry.state === 'wait');

		for (const entry of waitEntries) {
			// Nutze die 'path' Eigenschaft aus 'options' als Identifikator
			const entryIndex = $status.findIndex((e) => e.options.path === entry.options.path);
			if (entryIndex !== -1) {
				// Rufe 'searchMovieStatus' mit dem Index des Eintrags auf
				await searchMovieStatus(entryIndex, modal, searchMovies, addNewMovie);
			}
		}
		loading = false;
		if ($status.some((entry) => entry.state === 'wait' && entry.results.length === 0)) load();
	}

	// Stelle sicher, dass nur der ausgewählte Film hinzugefügt wird
	async function selectMovie(modalID: number, movieIndex: number) {
		modal = false; // Schließe das Modal nach Auswahl

		// Füge den vom Benutzer ausgewählten Film hinzu
		await addNewMovie($status[modalID].results[movieIndex].id, $status[modalID].options.path);
	}

	function openModal(index: number) {
		if ($status[index].state !== 'downloading' && $status[index].state !== 'foundOne') {
			modalID = index;
			modal = true;
		}
	}
</script>

<Dnd {load} {extensions} />

<!-- Navbar -->
<nav class="navbar sticky top-0 z-10 flex justify-between bg-base-100 p-2 shadow-lg md:p-4">
	<div class="gap-1">
		<a
			href="/"
			class="btn btn-ghost"
			on:click={() => {
				if (clearResultsOnLeave) {
					status.set([]);
					filter = null;
				}
			}}
		>
			Zurück zur Startseite
		</a>
	</div>
	<div class="gap-1">
		<!-- Platzhalter -->
	</div>
</nav>

<main class="z-0 flex flex-col items-center p-5">
	{#if !$isOnline}
		<div class="alert alert-error text-center">
			Du bist momentan nicht mit dem Internet verbunden.
		</div>
	{:else}
		<div class="mb-5 flex w-3/4 gap-5">
			<button
				class="btn grow"
				on:click={async () => {
					await selectFile();
					load();
				}}
				disabled={!$isOnline}
			>
				Filme auswählen
			</button>
			<button
				class="btn grow"
				on:click={async () => {
					await selectFolder();
					load();
				}}
				disabled={!$isOnline}
			>
				Ordner auswählen
			</button>
			<button
				class="btn hover:btn-error"
				on:click={() => {
					status.set([]);
					filter = null;
				}}
				disabled={!$isOnline || $status.length === 0}
			>
				Alles entfernen
			</button>
			<select class="select" bind:value={filter} disabled={!$isOnline || $status.length === 0}>
				<option value={null} selected disabled={$status.length === 0}>Kein Filter</option>
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
			{#each $status as item, index}
				{#if item.state === filter || filter === null}
					<div class="flex justify-between gap-3 rounded-md bg-base-200 p-3">
						<span>
							<p class="text-lg">Filmtitel: {item.options.query}</p>
							<p class="text-sm">Dateipfad: {item.options.path}</p>
						</span>
						<button
							class="btn bg-opacity-50 {buttonClass($status[index].state)}"
							on:click={() => openModal(index)}
						>
							{getIcon($status[index].state)}
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
		<button class="btn btn-circle btn-sm absolute right-2 top-2" on:click={() => (modal = false)}>
			✕
		</button>
		{#if modalID !== null && $status[modalID]}
			<h2 class="line-clamp-1 py-1 text-3xl">
				{$status[modalID].options.path.split('\\').pop()}
			</h2>

			<form
				on:submit|preventDefault={async () => {
					await searchMovieStatus(modalID, modal, searchMovies, addNewMovie);
				}}
				class="my-3 grid gap-3"
			>
				<label class="input input-bordered flex items-center gap-2">
					Filmtitel:
					<input
						type="text"
						class="grow"
						minlength="2"
						disabled={$status[modalID].state === 'searching'}
						required
						bind:value={$status[modalID].options.query}
					/>
				</label>
				<label class="input input-bordered flex items-center gap-2">
					Veröffentlichungsjahr:
					<input
						type="number"
						class="grow"
						minlength="4"
						maxlength="4"
						disabled={$status[modalID].state === 'searching'}
						bind:value={$status[modalID].options.primaryReleaseYear}
					/>
					<span class="badge badge-info">Optional</span>
				</label>
				<button type="submit" class="btn grow" disabled={$status[modalID].state === 'searching'}>
					Suchen
				</button>
			</form>

			<hr class="my-3 border-2 border-base-content" />

			{#if $status[modalID].state === 'searching'}
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
			{:else if modalID !== null && $status[modalID]?.results?.length > 0}
				<div class="grid gap-4">
					{#each $status[modalID].results as result, i}
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
			{:else if $status[modalID].state === 'wait'}
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
	<button class="modal-backdrop" on:click={() => (modal = false)}>Schließen</button>
</dialog>

<script lang="ts">
	import {
		addNewFiles,
		addNewMovie,
		buttonClass,
		getIcon,
		searchMovieStatus
	} from '$lib/add/index';
	import { searchList } from '$lib/stores.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { clearResultsOnLeave } from '$lib';
	import Dnd from '$lib/add/dnd.svelte';
	import type { MovieSearchState } from '$lib/types/add';
	import { error, warn } from '@tauri-apps/plugin-log';
	import Navbar from '$lib/Navbar.svelte';
	import Img from '$lib/image/Img.svelte';
	import { _ } from 'svelte-i18n';
	import { online } from 'svelte/reactivity/window';
	import { selectFile, selectFolder } from '$lib/add/select';

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
		searchList.reduce(
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
				waitForSearching: 0,
				searching: 0,
				notFound: 0,
				waitForDownloading: 0,
				foundMultiple: 0,
				downloading: 0,
				downloaded: 0
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
		if (loading || !online.current) return;

		loading = true;

		// Filtere die Einträge mit dem Status "wait"
		const waitEntries = searchList.filter(
			(entry) => entry.state === 'waitForSearching' || entry.state === 'waitForDownloading'
		);

		// Iteriere über alle "wait"-Einträge und starte die Suche für diese
		for (const entry of waitEntries) {
			const entryIndex = searchList.findIndex((e) => e.options.path === entry.options.path);

			// Falls der Eintrag noch im Status vorhanden ist, starte die Suche
			if (entryIndex !== -1) {
				// Suche nach dem Film
				if (
					!searchList[entryIndex].options.id &&
					searchList[entryIndex].state === 'waitForSearching'
				) {
					await searchMovieStatus(entryIndex);
				}

				// Wenn der Film gefunden wurde, füge ihn dem Status hinzu
				if (
					searchList[entryIndex].options.id &&
					searchList[entryIndex].state === 'waitForDownloading'
				) {
					await addNewMovie(searchList[entryIndex].options.id, entryIndex);
				}
			}
		}

		// Setze den Ladezustand zurück, nachdem alle Einträge verarbeitet wurden
		loading = false;

		// Wenn noch Filme im Status mit "waitForSearching" oder "waitForDownloading" sind, starte die Funktion erneut
		const hasUnprocessedMovies = searchList.some(
			(entry) => entry.state === 'waitForSearching' || entry.state === 'waitForDownloading'
		);

		if (hasUnprocessedMovies) {
			// Verzögere den erneuten Aufruf, um den Stack zu entlasten
			setTimeout(() => {
				load();
			}, 1000); // 100 ms Verzögerung
		}
	}

	// Stelle sicher, dass nur der ausgewählte Film hinzugefügt wird
	async function selectMovie(modalID: number, movieIndex: number) {
		// Überprüfe, ob der Index gültig ist, um Fehler zu vermeiden
		const movieResults = searchList[modalID]?.results ?? [];
		if (movieIndex < 0 || movieIndex >= movieResults.length) {
			error('Ungültiger Film-Index');
			return; // Verhindere die Auswahl eines ungültigen Films
		}

		modal = false; // Schließe das Modal nach Auswahl

		// Füge den vom Benutzer ausgewählten Film hinzu
		searchList[modalID].options.id = movieResults[movieIndex].id;
		searchList[modalID].state = 'waitForDownloading'; // Setze den Status auf "waitForDownloading" zurück

		// Lade neue Filme
		load();
	}

	// Öffne das Modal nur, wenn der Status des Films 'downloading' oder 'foundOne' ist
	function openModal(index: number) {
		// Sicherstellen, dass der Status des Films gültig ist, bevor das Modal geöffnet wird
		const filmState = searchList[index]?.state;
		if (filmState !== 'downloading' || 'waitForDownloading') {
			modalID = index;
			modal = true; // Öffne das Modal nur, wenn der Status gültig ist
		}
	}
</script>

<Dnd {load} />

<Navbar
	back={true}
	onclick={() => {
		window.history.length > 1 ? window.history.back() : (window.location.href = '/');
		if (clearResultsOnLeave) {
			searchList.length = 0;
			filter = null;
		}
	}}
></Navbar>

<main class="z-0 flex flex-col items-center p-5">
	{#if !online.current}
		<div class="alert alert-error text-center">
			{$_('networkStatus.offline')}
		</div>
	{:else}
		<div class="mb-5 flex w-3/4 gap-5">
			<button
				class="btn grow"
				onclick={async () => {
					await selectFile();
					load();
				}}
				disabled={!online.current}
			>
				{$_('add.main.buttons.selectFile')}
			</button>
			<button
				class="btn grow"
				onclick={async () => {
					await selectFolder();
					load();
				}}
				disabled={!online.current}
			>
				{$_('add.main.buttons.selectFolder')}
			</button>
			<button
				class="btn hover:btn-error"
				onclick={() => {
					searchList.length = 0;
					filter = null;
				}}
				disabled={!online.current || searchList.length === 0}
			>
				{$_('add.main.buttons.clearAll')}
			</button>
			<select class="select" bind:value={filter} disabled={!online || searchList.length === 0}>
				<option value={null} selected disabled={searchList.length === 0}
					>{$_('add.main.filter.default')}</option
				>
				<option
					value="waitForSearching"
					disabled={counts.waitForSearching === 0 && counts.waitForDownloading === 0}
				>
					{$_('add.main.filter.wait', {
						values: { count: counts.waitForSearching + counts.waitForDownloading }
					})}
				</option>
				<option value="searching" disabled={counts.searching === 0}>
					{$_('add.main.filter.searching', { values: { count: counts.searching } })}
				</option>
				<option value="notFound" disabled={counts.notFound === 0}>
					{$_('add.main.filter.notFound', { values: { count: counts.notFound } })}
				</option>
				<option value="foundMultiple" disabled={counts.foundMultiple === 0}>
					{$_('add.main.filter.foundMultiple', { values: { count: counts.foundMultiple } })}
				</option>
				<option value="downloading" disabled={counts.downloading === 0}>
					{$_('add.main.filter.downloading', { values: { count: counts.downloading } })}
				</option>
				<option value="downloaded" disabled={counts.downloaded === 0}>
					{$_('add.main.filter.foundOne', { values: { count: counts.downloaded } })}
				</option>
			</select>
		</div>

		<div class="grid w-full gap-3">
			{#each searchList as item, index}
				{#if item.state === filter || filter === null}
					<div class="flex justify-between gap-3 rounded-md bg-base-200 p-3">
						<span>
							<p class="text-lg">
								{$_('add.main.movie.title', { values: { title: item.options.query } })}
							</p>
							<p class="text-sm">
								{$_('add.main.movie.path', { values: { path: item.options.path } })}
							</p>
						</span>
						<button
							class="btn bg-opacity-50 {buttonClass(searchList[index].state)}"
							onclick={() => openModal(index)}
						>
							{getIcon(searchList[index].state)}
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
		{#if modalID !== null && searchList[modalID]}
			<h2 class="line-clamp-1 py-1 text-3xl">
				{searchList[modalID].options.path.split('\\').pop()}
			</h2>

			<form
				onsubmit={async (event) => {
					event.preventDefault();
					if (modalID !== null) {
						await searchMovieStatus(modalID);
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
						disabled={searchList[modalID].state === 'searching'}
						required
						bind:value={searchList[modalID].options.query}
					/>
				</label>
				<label class="input input-bordered flex items-center gap-2">
					{$_('add.modal.inputs.year')}
					<input
						type="number"
						class="grow"
						minlength="4"
						maxlength="4"
						disabled={searchList[modalID].state === 'searching'}
						bind:value={searchList[modalID].options.primaryReleaseYear}
					/>
					<span class="badge badge-info">Optional</span>
				</label>
				<button type="submit" class="btn grow" disabled={searchList[modalID].state === 'searching'}>
					{$_('add.modal.search')}
				</button>
			</form>

			<hr class="my-3 border-2 border-base-content" />

			{#if searchList[modalID].state === 'searching'}
				<div
					class="mx-auto flex max-w-md flex-col items-center rounded-lg bg-base-200 p-5 shadow-md"
				>
					<h2 class="mb-2 text-2xl font-semibold">{$_('add.modal.state.searching.title')}</h2>
					<p class="mb-4 text-sm text-gray-600">
						{$_('add.modal.state.searching.description')}
					</p>
					<div class="mb-4 flex items-center justify-center">
						<div
							class="h-8 w-8 animate-spin rounded-full border-4 border-blue-500 border-t-transparent"
						></div>
					</div>
					<button class="btn btn-secondary w-full" disabled>{$_('add.modal.search')}</button>
				</div>
			{:else if modalID !== null && searchList[modalID]?.results?.length > 0}
				<div class="grid gap-4">
					{#each searchList[modalID].results as result, i}
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
								<p class="text-sm text-gray-500">
									{$_('add.modal.inputs.year')}: {result.release_date}
								</p>
								<p class="text-gray-400">{result.overview}</p>
							</div>
						</button>
					{/each}
				</div>
			{:else if searchList[modalID].state === 'waitForSearching'}
				<p class="text-center">
					{$_('add.modal.state.notSearched')}
				</p>
			{:else}
				<p class="text-center text-error">
					{$_('add.modal.state.noResults')}
				</p>
			{/if}
		{/if}
	</div>
	<button
		class="modal-backdrop"
		onclick={() => {
			modal = false;
			modalID = null;
		}}
	>
		{$_('add.modal.close')}
	</button>
</dialog>

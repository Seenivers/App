<script lang="ts">
	import { addNewFiles, load, searchMediaStatus } from '$lib/add/index';
	import { buttonClass, getIcon } from '$lib/add/searchStatusUtils';
	import { searchList } from '$lib/stores.svelte';
	import type { PageData } from './$types';
	import { onMount } from 'svelte';
	import { clearResultsOnLeave } from '$lib';
	import Dnd from '$lib/add/dnd.svelte';
	import type { SearchStatus } from '$lib/types/add';
	import { error, warn } from '@tauri-apps/plugin-log';
	import Navbar from '$lib/Navbar.svelte';
	import Img from '$lib/image/Img.svelte';
	import { _ } from 'svelte-i18n';
	import { online } from 'svelte/reactivity/window';
	import { selectFile, selectFolder, selectTvFolder } from '$lib/add/select';
	import { discord } from '$lib/discord';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();
	let modal = $state(false);
	let modalID: number | null = $state(null);
	let filter: SearchStatus | null = $state(null);

	// Zähle die Anzahl der Filme für jeden Zustand
	let counts = $derived(
		searchList.reduce(
			(acc, item) => {
				const state = item.status; // Hole den Zustand des Films
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
		discord({
			details: `Fügt gerade neue Filme hinzu`,
			state: searchList.length > 0 ? `${searchList.length} Filme` : undefined
		});

		if (Array.isArray(data.paths) && data.paths.length > 0) {
			// Wenn data.paths ein Array ist und nicht leer, füge die Dateien hinzu
			await addNewFiles(data.paths);
		}
	});

	// Stelle sicher, dass nur der ausgewählte Film hinzugefügt wird
	async function selectMovie(modalID: number, movieIndex: number) {
		// Überprüfe, ob der Index gültig ist, um Fehler zu vermeiden
		const movieResults = searchList[modalID]?.search.results ?? [];
		if (movieIndex < 0 || movieIndex >= movieResults.length) {
			error('Ungültiger Film-Index');
			return; // Verhindere die Auswahl eines ungültigen Films
		}

		modal = false; // Schließe das Modal nach Auswahl

		// Füge den vom Benutzer ausgewählten Film hinzu
		searchList[modalID].options.id = movieResults[movieIndex].id;
		searchList[modalID].status = 'waitForDownloading'; // Setze den Status auf "waitForDownloading" zurück

		// Lade neue Filme
		load();
	}

	// Öffne das Modal nur, wenn der Status des Films 'downloading' oder 'foundOne' ist
	function openModal(index: number) {
		// Sicherstellen, dass der Status des Films gültig ist, bevor das Modal geöffnet wird
		if (searchList[index]?.status !== 'downloading' || 'waitForDownloading') {
			modalID = index;
			modal = true; // Öffne das Modal nur, wenn der Status gültig ist
		}
	}
</script>

<Dnd />

<Navbar
	back={true}
	onclick={() => {
		window.history.length > 1 ? window.history.back() : (window.location.href = '/');
		if (clearResultsOnLeave) {
			searchList.length = 0;
			filter = null;
		}
	}}
>
	{#snippet right()}
		<button
			class="btn grow"
			onclick={async () => {
				await selectTvFolder();
				load();
			}}
		>
			Serien Ordner auswählen
		</button>
		<button
			class="btn grow"
			onclick={async () => {
				await selectFile();
				load();
			}}
		>
			{$_('add.main.buttons.selectFile')}
		</button>
		<button
			class="btn grow"
			onclick={async () => {
				await selectFolder();
				load();
			}}
		>
			{$_('add.main.buttons.selectFolder')}
		</button>
		<div class="tooltip tooltip-bottom" data-tip="Doppel klicken zum löschen">
			<button
				class="btn hover:btn-error"
				ondblclick={() => {
					searchList.length = 0;
					filter = null;
				}}
				disabled={searchList.length === 0}
			>
				{$_('add.main.buttons.clearAll')}
			</button>
		</div>
		<select
			class="select select-bordered max-w-96"
			bind:value={filter}
			disabled={!online || searchList.length === 0}
		>
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
	{/snippet}
</Navbar>

<main class="z-0 flex flex-col items-center p-5">
	{#if !online.current}
		<div class="alert alert-error text-center">
			{$_('networkStatus.offline')}
		</div>
	{:else}
		<div class="grid w-full gap-3">
			{#each searchList as item, index}
				{#if item.status === filter || filter === null}
					<div class="flex justify-between gap-3 rounded-md bg-base-200 p-3">
						<span>
							<p class="text-lg">
								{$_('add.main.movie.title', { values: { title: item.options.fileName } })}
							</p>
							<p class="text-sm">
								{$_('add.main.movie.path', { values: { path: item.options.path } })}
							</p>
						</span>
						<button
							class="btn bg-opacity-50 {buttonClass(searchList[index].status)}"
							onclick={() => openModal(index)}
						>
							{getIcon(searchList[index].status)}
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
						await searchMediaStatus(modalID);
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
						disabled={searchList[modalID].status === 'searching'}
						required
						bind:value={searchList[modalID].options.fileName}
					/>
				</label>
				<label class="input input-bordered flex items-center gap-2">
					{$_('add.modal.inputs.year')}
					<input
						type="number"
						class="grow"
						minlength="4"
						maxlength="4"
						disabled={searchList[modalID].status === 'searching'}
						bind:value={searchList[modalID].options.primaryReleaseYear}
					/>
					<span class="badge badge-info">Optional</span>
				</label>
				<button
					type="submit"
					class="btn grow"
					disabled={searchList[modalID].status === 'searching'}
				>
					{$_('add.modal.search')}
				</button>
			</form>

			<hr class="my-3 border-2 border-base-content" />

			{#if searchList[modalID].status === 'searching'}
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
			{:else if modalID !== null && searchList[modalID]?.search?.results.length > 0}
				<div class="grid gap-4">
					{#each searchList[modalID].search.results as result, i}
						{@const title = 'title' in result ? result.title : result.name}
						{@const year = 'release_date' in result ? result.release_date : result.first_air_date}
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
								class="h-72 w-fit rounded-lg object-contain"
							/>

							<div class="px-3 text-left">
								<p><strong>{title}</strong></p>
								<p class="text-sm text-gray-500">
									{$_('add.modal.inputs.year')}: {year}
								</p>
								<p class="text-gray-400">{result.overview}</p>
							</div>
						</button>
					{/each}
					{#if searchList[modalID].search.total_pages > searchList[modalID].search.page}
						<button
							class="btn"
							onclick={() => {
								if (modalID === null) return;
								searchList[modalID].search.page++;
								searchMediaStatus(modalID);
							}}>Lade weiter ergebnisse</button
						>
					{/if}
				</div>
			{:else if searchList[modalID].status === 'waitForSearching'}
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

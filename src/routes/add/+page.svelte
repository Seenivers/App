<script lang="ts">
	import { open } from '@tauri-apps/api/dialog';
	import { readDir } from '@tauri-apps/api/fs';
	import { findMovie, getMovie, imageURL, placeholderURL } from '../../ts/tmdb';
	import { mediaLibrary, settings } from '../../ts/db';
	import { save } from '../../ts/dir';
	import { videoDir } from '@tauri-apps/api/path';

	interface SearchResult {
		id: number;
		title: string;
	}

	interface MediaItem {
		name: string;
		path: string;
		watched: boolean;
		watchTime: number;
		tmdb: {
			id: number | null;
			searchResults?: SearchResult[];
		};
	}

	let dir: string | null = null;
	let file: boolean = false;
	let data: MediaItem[];
	let status: { disabledInputs: boolean; searchStatus: string; searchResults?: TMDBMovie[] }[] = [];
	let modalID: number = 0;

	async function selectFile() {
		const selected = await open({
			directory: false,
			defaultPath: await videoDir(),
			filters: [{ name: 'Video', extensions: ['mp4'] }]
		});

		if (selected !== null) {
			dir = selected as string;
			file = true;
			loadData();
		}
	}

	async function selectFolder() {
		const selected = await open({
			directory: true,
			defaultPath: await videoDir()
		});

		if (selected !== null) {
			dir = selected as string;
			file = false;
			loadData();
		}
	}

	async function loadData() {
		if (dir === null) {
			return;
		}

		let entries;

		if (file) {
			entries = dir;
			data = [
				{
					name: dir.split('\\').pop() || '',
					path: dir,
					watched: false,
					watchTime: 0,
					tmdb: { id: null }
				}
			];
		} else {
			entries = await readDir(dir);
			// @ts-ignore
			data = entries.map((entry) => ({
				name: entry.name,
				path: entry.path,
				watched: false,
				tmdb: { id: null }
			}));
		}

		data = data.filter((item) => !$mediaLibrary.map((item) => item.path).includes(item.path));

		status = new Array(entries.length).fill({
			disabledInputs: false,
			searchStatus: 'notStarted'
		});

		if (data.length === 0) {
			alert('Alle ausgewählten Dateien existieren bereits in der Medienbibliothek.');
			dir = null;
			file = false;
			data = [];
			status = [];
		} else {
			suche();
		}
	}

	async function suche() {
		if (!data || !window.navigator.onLine) {
			return;
		}

		for (let i = 0; i < data.length; i++) {
			const item = data[i];
			const fullName = item.name
				.split(/[.\s]+/)
				.filter((word) => !$settings.keywords.includes(word))
				.join(' ');

			status[i] = { disabledInputs: false, searchStatus: 'searching' };
			const nameWithoutDate = fullName.replace(/\s*\(\d{4}\)$/, '');
			let result = await findMovie(nameWithoutDate);
			if (result.results.length === 1) {
				status[i] = { disabledInputs: true, searchStatus: 'foundOne' };
				data[i].tmdb.id = result.results[0].id;
				await updateMediaLibrary(i);
				continue;
			} else if (result.results.length > 0) {
				status[i] = {
					disabledInputs: false,
					searchStatus: 'foundMultiple',
					searchResults: result.results
				};
				continue;
			}

			result = await findMovie(fullName);
			if (result.results.length === 1) {
				status[i] = { disabledInputs: true, searchStatus: 'foundOne' };
				data[i].tmdb.id = result.results[0].id;
				await updateMediaLibrary(i);
				continue;
			} else if (result.results.length > 0) {
				status[i] = {
					disabledInputs: false,
					searchStatus: 'foundMultiple',
					searchResults: result.results
				};
				continue;
			}

			const firstWord = nameWithoutDate.split(/\s+/)[0];
			result = await findMovie(firstWord);
			if (result.results.length === 1) {
				status[i] = { disabledInputs: true, searchStatus: 'foundOne' };
				data[i].tmdb.id = result.results[0].id;
				await updateMediaLibrary(i);
				continue;
			} else if (result.results.length > 0) {
				status[i] = {
					disabledInputs: false,
					searchStatus: 'foundMultiple',
					searchResults: result.results
				};
				continue;
			}

			status[i] = { disabledInputs: false, searchStatus: 'notFound' };
			console.log(`Keine Ergebnisse für: ${fullName}`);
		}
	}

	async function updateMediaLibrary(index: number) {
		const tmdbId = data[index].tmdb.id;

		if (tmdbId !== undefined && tmdbId !== null) {
			const isDuplicate = $mediaLibrary.some((item) => item.tmdb.id === tmdbId);

			if (!isDuplicate) {
				data[index].tmdb = await getMovie(tmdbId);
				// @ts-ignore
				mediaLibrary.update((library) => [...library, data[index]]);
				save();
			} else {
				alert('Film mit dieser TMDB-ID existiert bereits in der Medienbibliothek.');
			}
		}
	}
</script>

<main class="min-h-screen h-fit w-full bg-base-100 pb-10">
	<div class="w-full pt-5 flex justify-center gap-5">
		<button
			class="btn text-xl"
			disabled={dir !== null || !window.navigator.onLine}
			on:click={selectFile}
		>
			Filmdatei auswählen
		</button>
		<button
			class="btn text-xl"
			disabled={dir !== null || !window.navigator.onLine}
			on:click={selectFolder}
		>
			Ordner auswählen
		</button>
		<a href="/" class="btn text-xl"> Zurück </a>
	</div>
	<hr class="my-5 border-2 border-base-300" />
	{#if data && window.navigator.onLine}
		{#each data as item, index}
			<div class="bg-base-200 p-3 rounded-md flex justify-between h-fit mt-3 mx-24">
				<span>
					Name: {item.name
						.split(/[.\s]+/)
						.filter((word) => !$settings.keywords.includes(word))
						.join(' ')}{' '}
					<br />
					Pfad: {item.path}
				</span>
				<div class="min-w-48 w-fit">
					<!-- svelte-ignore missing-declaration -->
					<button
						id={index.toString()}
						on:click={() => {
							modalID = index;
							if (status[index].searchStatus === 'foundMultiple') {
								// @ts-ignore
								selectModal.showModal();
							}
						}}
						class="btn btn-neutral mr-2 {status[index].searchStatus === 'notStarted'
							? ''
							: status[index].searchStatus === 'searching'
							? ''
							: status[index].searchStatus === 'notFound'
							? 'btn-error'
							: status[index].searchStatus === 'foundOne'
							? 'btn-success'
							: status[index].searchStatus === 'foundMultiple'
							? 'btn-info'
							: ''}
							{status[index].searchStatus !== 'foundMultiple' ? 'btn-ghost' : ''}"
					>
						{#if status[index].searchStatus === 'notStarted'}
							<span>⏰</span>
						{:else if status[index].searchStatus === 'searching'}
							<span>🔍</span>
						{:else if status[index].searchStatus === 'notFound'}
							<span>⚠️</span>
						{:else if status[index].searchStatus === 'foundOne'}
							<span>✅</span>
						{:else if status[index].searchStatus === 'foundMultiple'}
							<span>ℹ️</span>
						{/if}
					</button>

					<input
						class="input"
						type="number"
						placeholder="TMDB ID"
						bind:value={data[index].tmdb.id}
						on:change={() => updateMediaLibrary(index)}
						disabled={status[index].disabledInputs ||
							status[index].searchStatus !== 'foundMultiple'}
					/>
				</div>
			</div>
		{/each}
	{:else if !window.navigator.onLine}
		<span class="w-full flex justify-center text-xl underline"
			>Du bist Offline und kannst gerade keine Filme hinzufügen.</span
		>
	{/if}
</main>

<dialog id="selectModal" class="modal">
	<div class="modal-box w-11/12 max-w-7xl bg-base-300">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h1 class="text-2xl mb-3">
			<span>Datei Name: </span>
			{#if modalID !== undefined && data && data[modalID]}
				<span>{data[modalID].name}</span>
			{:else}
				<span>Fehler beim Laden des Title</span>
			{/if}
		</h1>

		<div class=" h-[65rem] overflow-y-auto">
			<div class="grid gap-5">
				{#each status as { searchResults = [] }, i}
					{#if i === modalID && searchResults.length > 0}
						{#each searchResults as result}
							<!-- svelte-ignore missing-declaration -->
							<button
								on:click={async () => {
									data[i].tmdb = result;
									// @ts-ignore
									mediaLibrary.update((library) => [...library, data[i]]);
									status[i] = { disabledInputs: true, searchStatus: 'foundOne' };
									save();
									// @ts-ignore
									selectModal.close();
								}}
								class="flex bg-neutral p-3 rounded-md hover:bg-opacity-70 text-lg h-fit"
							>
								<img
									src={result.poster_path ? imageURL + result.poster_path : placeholderURL}
									alt="poster"
									class="h-72"
								/>
								<div class="mb-2 ml-5 grid gap-2">
									<div class="flex">
										<span class="mr-2 font-bold">Title:</span>
										<span>{result.title}</span>
									</div>
									<div class="flex">
										<span class="mr-2 font-bold">Veröffentlichungsdatum:</span>
										<span>{result.release_date}</span>
									</div>
									<div class="grid text-left">
										<span class="mr-2 font-bold">Handlung:</span>
										<span>{result.overview}</span>
									</div>
								</div>
							</button>
						{/each}
					{/if}
				{/each}
			</div>
		</div>
	</div>
</dialog>

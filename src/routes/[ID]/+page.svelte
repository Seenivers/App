<script lang="ts">
	import { page } from '$app/stores';
	import { data } from '$lib/db';
	import { exists, open } from '@tauri-apps/plugin-fs';
	import Videoplayer from '$lib/videoplayer.svelte';
	import { imageURL } from '$lib';
	import { convertFileSrc } from '@tauri-apps/api/core';
	import { tmdb } from '$lib/tmdb';

	const index: number = $data.movies.findIndex((item) => item.id === parseInt($page.params.ID));
	let pathExists: boolean = false;
	const checkPath = async () => {
		pathExists = await exists($data.movies[index].path);
	};

	let modal = false;
	let form: HTMLFormElement;

	// Gibt es die Datei beim Laden des Skripts
	checkPath();

	function removeElementById() {
		data.update((library) => {
			return {
				...library,
				movies: library.movies.filter((item) => item.id !== index)
			};
		});
		$data.save();
		window.location.href = '/';
	}
</script>

<!-- Navbar -->
<nav class="navbar sticky top-0 z-50 flex-wrap gap-3 bg-base-100 p-2 md:p-4">
	<a href="/" class="btn btn-sm md:btn-md">Zurück</a>
	<button
		class="btn btn-sm my-2 md:btn-md"
		on:click={async () => {
			await open($data.movies[index].path);
		}}
		disabled
		>Starte Externen Player
	</button>
	<div class="tooltip tooltip-bottom" data-tip="Doppel klicken zum löschen">
		<button class="btn btn-sm hover:btn-error md:btn-md" on:dblclick={removeElementById}
			>Löschen</button
		>
	</div>
	<button
		class="btn btn-sm md:btn-md"
		on:click={() => {
			modal = true;
		}}>Bearbeiten</button
	>
	<button
		class="btn btn-sm md:btn-md"
		on:click={() => ($data.movies[index].watched = !$data.movies[index].watched)}
	>
		{$data.movies[index].watched ? 'Als Nicht Gesehen markieren' : 'Als Gesehen markieren'}
	</button>
	<!-- <a
		href="/{$data.movies[index].belongs_to_collection
			? $data.movies[index].belongs_to_collection.id
			: ''}/collection"
		class="btn btn-sm md:btn-md">Öffne Sammlung</a
	> -->
</nav>

<!-- Main -->
<main class="flex flex-col items-center p-3 md:p-5">
	{#if $data}
		<div class="mx-auto w-full max-w-full p-4 md:w-[80%] lg:w-[60%]">
			<h1 class="mb-2 text-lg font-bold sm:text-xl md:text-2xl">{$data.movies[index].title}</h1>

			{#if $data.movies[index].tagline}
				<h2 class="mb-2 text-sm font-bold sm:text-base md:text-base">
					{$data.movies[index].tagline}
				</h2>
			{/if}

			{#if pathExists}
				<Videoplayer
					src={convertFileSrc($data.movies[index].path)}
					poster={imageURL + $data.movies[index].backdrop_path}
					{index}
				/>
			{:else}
				<p class="text-lg font-bold text-error underline md:text-2xl">Video Datei Nicht gefunden</p>
				<p class="text-xs">{$data.movies[index].path}</p>
			{/if}

			<br />

			<div class="grid gap-3">
				{#each [{ label: 'Stimmenanzahl', value: $data.movies[index].vote_count }, { label: 'Durchschnittliche Bewertung', value: $data.movies[index].vote_average ? `${Math.round($data.movies[index].vote_average * 10) / 10}/10` : null }, { label: 'Genres', value: $data.movies[index].genres?.map((g) => g.name) }, { label: 'Produktionsfirmen', value: $data.movies[index].production_companies?.map((c) => c.name) }, { label: 'Produktionsländer', value: $data.movies[index].production_countries?.map((c) => c.name) }, { label: 'Veröffentlichungsdatum', value: $data.movies[index].release_date ? new Date($data.movies[index].release_date).toLocaleDateString(window.navigator.language) : null }, { label: 'Laufzeit', value: $data.movies[index].runtime ? `${$data.movies[index].runtime} Minuten` : null }, { label: 'Beliebtheit', value: $data.movies[index].popularity }, { label: 'Budget', value: $data.movies[index].budget }, { label: 'Homepage', value: $data.movies[index].homepage }, { label: 'Originalsprache', value: $data.movies[index].original_language }, { label: 'Originaltitel', value: $data.movies[index].original_title }, { label: 'Einnahmen', value: $data.movies[index].revenue }, { label: 'Status', value: $data.movies[index].status }, { label: 'Handlung', value: $data.movies[index].overview }] as info}
					<div class="text-sm md:text-base">
						<p class="font-bold">{info.label}:</p>
						<p>{info.value || 'Keine Informationen verfügbar'}</p>
					</div>
				{/each}
			</div>
		</div>
	{:else}
		<div class="flex h-full w-full justify-center">
			<div class="grid gap-8">
				<p class="text-4xl md:text-5xl">Keine Daten</p>
				<a href="/" class="btn btn-lg text-2xl">Zurück</a>
			</div>
		</div>
	{/if}
</main>

<!-- Modal -->
<dialog class="modal" open={modal}>
	<div class="modal-box">
		<!-- Close Button -->
		<form method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
		</form>

		<h3 class="text-lg font-bold">Neue TMDB ID</h3>

		<!-- Form Submission with Error Handling -->
		<form
			bind:this={form}
			on:submit|preventDefault={async () => {
				const newID = parseInt(form.newID.value);
				try {
					if (index !== -1 && newID && newID !== $data.movies[index].id) {
						const result = await tmdb.movie.details(newID);
						const newMovieData = { ...$data.movies[index], ...result };

						data.update((library) => {
							return {
								...library,
								movies: library.movies.map((movie, i) => (i === index ? newMovieData : movie))
							};
						});

						$data.save();
						modal = false;
						window.location.href = newID.toString();
					} else {
						alert('Da ist wol etwas schief gelaufen');
					}
				} catch {
					alert('Diese TMDB ID ist falsch');
				}
			}}
			class="flex gap-2"
		>
			<input
				class="input input-bordered flex-grow"
				type="number"
				placeholder={$data.movies[index].id.toString()}
				name="newID"
				required
			/>
			<button class="btn" type="submit">Speichern</button>
		</form>
	</div>
</dialog>

<script lang="ts">
	import { page } from '$app/stores';
	import { exists } from '@tauri-apps/plugin-fs';
	import { image } from '$lib/image';
	import { convertFileSrc } from '@tauri-apps/api/core';
	import { getMovie } from '$lib/tmdb';
	import { db } from '$lib/db/database';
	import { eq } from 'drizzle-orm';
	import { schema } from '$lib/db/schema';
	import Videoplayer from '$lib/player/videoplayer.svelte';
	import { open } from '@tauri-apps/plugin-shell';

	const id = parseInt($page.params.ID, 10);
	let pathExists: boolean = false;
	let watched: boolean = false;
	let movieData: typeof schema.movies.$inferSelect;

	const loadMovieData = async () => {
		const movie = await db.select().from(schema.movies).where(eq(schema.movies.id, id));

		if (movie.length > 0) {
			movieData = movie[0];
			pathExists = await exists(movieData.path);
			watched = movieData.watched;
		}
	};

	let modal = false;
	let form: HTMLFormElement;

	// Lädt die Datei beim Laden des Skripts
	loadMovieData();

	async function toggleWatchedStatus() {
		watched = !watched;
		await db.update(schema.movies).set({ watched }).where(eq(schema.movies.id, id));
	}

	async function removeElementById() {
		await db.delete(schema.movies).where(eq(schema.movies.id, id));
		window.location.href = '/';
	}

	async function openExternalPlayer() {
		try {
			// Öffne die Datei mit dem Standardplayer
			await open(movieData.path);
		} catch (error) {
			console.error('Failed to open video with external player:', error);
		}
	}
</script>

<!-- Navbar -->
<nav class="navbar sticky top-0 z-50 flex-wrap gap-3 bg-base-100">
	<a href="/" class="btn btn-sm md:btn-md">Zurück</a>
	<button class="btn btn-sm md:btn-md" on:click={openExternalPlayer} disabled={!pathExists}
		>Starte Externen Player</button
	>
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
	<button class="btn btn-sm md:btn-md" on:click={toggleWatchedStatus}>
		{watched ? 'Als Nicht Gesehen markieren' : 'Als Gesehen markieren'}
	</button>
</nav>

<!-- Main -->
<main class="flex flex-col items-center p-3 md:p-5">
	{#if movieData}
		<div class="mx-auto w-full max-w-full p-4 md:w-[80%] lg:w-[60%]">
			<h1 class="mb-2 text-lg font-bold sm:text-xl md:text-2xl">{movieData.tmdb.title}</h1>
			{#if movieData.tmdb.tagline}
				<h2 class="mb-2 text-sm font-bold italic sm:text-base md:text-base">
					{movieData.tmdb.tagline}
				</h2>
			{/if}

			{#if pathExists}
				{#await image(movieData.tmdb.backdrop_path) then poster}
					<Videoplayer src={convertFileSrc(movieData.path)} {poster} {id} />
				{/await}
			{:else}
				<p class="text-lg font-bold text-error underline md:text-2xl">Video Datei Nicht gefunden</p>
				<p class="text-xs">{movieData.path}</p>
			{/if}

			<div class="my-4">
				<h2 class="my-2 text-lg font-bold">Hauptdarsteller</h2>
				<div class="carousel carousel-center w-full space-x-3 rounded-box bg-base-100 p-3">
					{#each movieData.tmdb.credits.cast as cast}
						<button
							class="carousel-item flex flex-col items-center"
							on:click={() => open('https://www.themoviedb.org/person/' + cast.id)}
						>
							{#await image(cast.profile_path) then src}
								<img {src} alt={cast.name} class="max-w-40 rounded-box sm:max-w-60" />
							{/await}
							<p class="text-center text-lg">{cast.name}</p>
							<p class="text-base italic">{cast.character}</p>
						</button>
					{/each}
				</div>
			</div>

			<div class="grid gap-3">
				{#each [{ label: 'Stimmenanzahl', value: movieData.tmdb.vote_count }, { label: 'Durchschnittliche Bewertung', value: movieData.tmdb.vote_average ? `${Math.round(movieData.tmdb.vote_average * 10) / 10}/10` : null }, { label: 'Genres', value: movieData.tmdb.genres
								?.map((g) => g.name)
								.join(', ') }, { label: 'Produktionsfirmen', value: movieData.tmdb.production_companies
								?.map((c) => c.name)
								.join(', ') }, { label: 'Produktionsländer', value: movieData.tmdb.production_countries
								?.map((c) => c.name)
								.join(', ') }, { label: 'Veröffentlichungsdatum', value: movieData.tmdb.release_date ? new Date(movieData.tmdb.release_date).toLocaleDateString(window.navigator.language) : null }, { label: 'Laufzeit', value: movieData.tmdb.runtime ? `${movieData.tmdb.runtime} Minuten` : null }, { label: 'Beliebtheit', value: movieData.tmdb.popularity }, { label: 'Budget', value: movieData.tmdb.budget }, { label: 'Homepage', value: movieData.tmdb.homepage }, { label: 'Originalsprache', value: movieData.tmdb.original_language }, { label: 'Originaltitel', value: movieData.tmdb.original_title }, { label: 'Einnahmen', value: movieData.tmdb.revenue }, { label: 'Status', value: movieData.tmdb.status }, { label: 'Handlung', value: movieData.tmdb.overview }] as info}
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

		<form
			bind:this={form}
			on:submit|preventDefault={async () => {
				const newID = parseInt(form.newID.value, 10);
				try {
					if (id !== -1 && newID && newID !== movieData.id) {
						const newMovieByTmdb = await getMovie(newID);
						await db
							.update(schema.movies)
							.set({ id: newID, tmdb: newMovieByTmdb })
							.where(eq(schema.movies.id, id));

						modal = false;
						window.location.href = newID.toString();
					} else {
						alert('Da ist wohl etwas schief gelaufen');
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
				placeholder={movieData?.id?.toString() || ''}
				name="newID"
				required
			/>
			<button class="btn" type="submit">Speichern</button>
		</form>
	</div>
</dialog>

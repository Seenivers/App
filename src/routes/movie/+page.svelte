<script lang="ts">
	import { exists } from '@tauri-apps/plugin-fs';
	import { image } from '$lib/image';
	import { convertFileSrc } from '@tauri-apps/api/core';
	import { getMovie } from '$lib/tmdb';
	import { db } from '$lib/db/database';
	import { eq } from 'drizzle-orm';
	import { schema } from '$lib/db/schema';
	import Videoplayer from '$lib/player/videoplayer.svelte';
	import { open } from '@tauri-apps/plugin-shell';
	import { error } from '@tauri-apps/plugin-log';
	import type { PageData } from './$types';
	import { getCollection } from '$lib/db/funktion';
	import Navbar from '$lib/Navbar.svelte';
	import Img from '$lib/image/Img.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const id = data.id;
	let pathExists: boolean = $state(false);
	let watched: boolean = $state(false);
	let modal = $state(false);
	let form: HTMLFormElement;
	let movieData: typeof schema.movies.$inferSelect | undefined = $state();
	const loadMovieData = async () => {
		const movie = await db.select().from(schema.movies).where(eq(schema.movies.id, id));
		if (movie.length > 0) {
			movieData = movie[0];
			pathExists = await exists(movieData.path);
			watched = movieData.watched;
		}
	};

	// Lädt die Datei beim Laden des Skripts
	loadMovieData();

	// Markiere Film als gesehen/ungesehen
	async function toggleWatchedStatus() {
		watched = !watched;
		await db.update(schema.movies).set({ watched }).where(eq(schema.movies.id, id));
	}

	// Entferne Film anhand der ID
	async function removeElementById() {
		await db.delete(schema.movies).where(eq(schema.movies.id, id));
		window.location.href = '/';
	}

	// Öffne die Datei mit dem Standardplayer
	async function openExternalPlayer() {
		if (!movieData) return;
		try {
			// Öffne die Datei mit dem Standardplayer
			await open(movieData.path);
		} catch (err) {
			error('Failed to open video with external player: ' + err);
		}
	}
</script>

<Navbar back={true}>
	{#snippet right()}
		<button class="btn btn-sm md:btn-md" onclick={openExternalPlayer} disabled={!pathExists}
			>Starte Externen Player</button
		>
		<div
			class={pathExists ? 'tooltip tooltip-bottom' : ''}
			data-tip={pathExists ? 'Doppel klicken zum löschen' : ''}
		>
			<button
				class="btn btn-sm hover:btn-error md:btn-md"
				ondblclick={removeElementById}
				disabled={!movieData}>Löschen</button
			>
		</div>
		<button
			class="btn btn-sm md:btn-md"
			disabled={!movieData}
			onclick={() => {
				modal = true;
			}}>Bearbeiten</button
		>
		<button class="btn btn-sm md:btn-md" onclick={toggleWatchedStatus} disabled={!movieData}>
			{watched ? 'Als Nicht Gesehen markieren' : 'Als Gesehen markieren'}
		</button>
	{/snippet}
</Navbar>

<!-- Main -->
<main class="z-0">
	{#if movieData}
		<div class="mx-auto w-full py-5 md:w-[80%] lg:w-[70%]">
			<h1 class="text-x1 mb-2 font-bold sm:text-2xl md:text-3xl">{movieData.tmdb.title}</h1>
			{#if movieData.tmdb.tagline}
				<h2 class="mb-2 text-sm font-bold italic sm:text-base md:text-base">
					{movieData.tmdb.tagline}
				</h2>
			{/if}

			{#if pathExists}
				{#await image(movieData.tmdb.backdrop_path, 'backdrops', true) then poster}
					<Videoplayer src={convertFileSrc(movieData.path)} poster={poster.src} {id} />
				{/await}
			{:else}
				<p class="text-lg font-bold text-error underline md:text-2xl">Video Datei Nicht gefunden</p>
				<p class="text-xs">{movieData.path}</p>
			{/if}

			<div class="my-4">
				{#if movieData.tmdb.belongs_to_collection?.id}
					{#await getCollection(movieData.tmdb.belongs_to_collection.id) then value}
						{#await image(value?.backdrop_path, 'backdrops', true) then image}
							<div class="hero rounded-box" style="background-image: url({image.src});">
								<div class="hero-overlay rounded-box bg-opacity-90"></div>
								<div class="hero-content text-center text-neutral-content">
									<div class="max-w-md">
										<h2 class="mb-5 text-3xl font-bold">{value?.name}</h2>
										<p class="mb-5 text-lg">
											{value?.overview}
										</p>
										<a href="./collection?id={value?.id}" class="btn btn-primary"
											>Sammlung anzeigen</a
										>
									</div>
								</div>
							</div>
						{/await}
					{/await}
				{/if}
			</div>

			<div class="my-4">
				<h2 class="my-2 text-2xl font-bold">Hauptdarsteller</h2>
				<div class="carousel carousel-center w-full space-x-3 rounded-box bg-base-100 p-3">
					{#each movieData.tmdb.credits.cast as cast}
						<button
							class="carousel-item flex flex-col items-center"
							onclick={() => open('https://www.themoviedb.org/person/' + cast.id)}
						>
							<Img
								params={[cast.profile_path, 'actors', false]}
								alt={cast.name}
								class="max-w-40 rounded-box sm:max-w-60"
							/>
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
		<div class="flex justify-center p-5">
			<p class="text-4xl md:text-5xl">Keine Daten gefunden</p>
		</div>
	{/if}
</main>

<!-- Modal -->
<dialog class="modal backdrop-blur-sm" open={modal}>
	<div class="modal-box">
		<!-- Close Button -->
		<form method="dialog">
			<button class="btn btn-circle btn-ghost btn-sm absolute right-2 top-2">✕</button>
		</form>

		<h3 class="text-lg font-bold">Neue TMDB ID</h3>

		<form
			bind:this={form}
			onsubmit={async (event) => {
				event.preventDefault();
				if (!form || !form.newID || !movieData) return;
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

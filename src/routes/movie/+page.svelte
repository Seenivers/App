<script lang="ts">
	import { image } from '$lib/image/image';
	import { convertFileSrc } from '@tauri-apps/api/core';
	import { getMovie } from '$lib/tmdb';
	import { db } from '$lib/db/database';
	import { eq } from 'drizzle-orm';
	import { schema } from '$lib/db/schema';
	import Videoplayer from '$lib/player/Plyr.svelte';
	import { error } from '@tauri-apps/plugin-log';
	import type { PageData } from './$types';
	import { getCollection } from '$lib/db/funktion';
	import Navbar from '$lib/Navbar.svelte';
	import Img from '$lib/image/Img.svelte';
	import { openUrl } from '@tauri-apps/plugin-opener';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const id = data.id;
	let watched: boolean = $state(data.result.watched ?? false);
	let modal = $state(false);
	let form: HTMLFormElement;
	let movieData: typeof schema.movies.$inferSelect = $state(data.result);

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
			await openUrl(movieData.path);
		} catch (err) {
			error('Failed to open video with external player: ' + err);
		}
	}

	function formate(money: number) {
		if (!money) return 'Keine Informationen verfugbar';
		return new Intl.NumberFormat(window.navigator.language, {
			style: 'currency',
			currency: 'USD',
			minimumFractionDigits: 0,
			maximumFractionDigits: 0
		}).format(money);
	}
</script>

<Navbar back={true}>
	{#snippet right()}
		{#if data.result.path}
			<button class="btn btn-sm md:btn-md" onclick={openExternalPlayer} disabled={!data.pathExists}
				>Starte Externen Player</button
			>
			<div class="tooltip tooltip-bottom" data-tip="Doppel klicken zum löschen">
				<button
					class="btn btn-sm hover:btn-error md:btn-md"
					ondblclick={removeElementById}
					disabled={!movieData}>Löschen</button
				>
			</div>
			<button class="btn btn-sm md:btn-md" disabled={!movieData} onclick={() => (modal = true)}
				>Bearbeiten</button
			>
			<button class="btn btn-sm md:btn-md" onclick={toggleWatchedStatus} disabled={!movieData}>
				{watched ? 'Als Nicht Gesehen markieren' : 'Als Gesehen markieren'}
			</button>
		{/if}
		<a
			href="https://www.themoviedb.org/movie/{id}"
			class="btn btn-sm md:btn-md"
			target="_blank"
			rel="noopener noreferrer">Bei TMDB öffnen</a
		>
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

			{#if data.pathExists}
				{#await image(movieData.tmdb.backdrop_path, 'backdrops', true) then poster}
					<Videoplayer src={convertFileSrc(movieData.path)} poster={poster.src} {id} />
				{/await}
			{:else if movieData.path}
				<p class="text-lg font-bold text-error underline md:text-2xl">Video Datei Nicht gefunden</p>
				<p class="text-xs">{movieData.path}</p>
			{:else}
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each movieData.tmdb.videos.results as trailer}
						{#if trailer.site === 'YouTube'}
							<div
								class="card bg-base-200 shadow-lg transition-shadow duration-300 hover:shadow-xl"
							>
								<figure>
									<img
										src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
										alt={`Thumbnail for ${trailer.name}`}
										class="h-48 w-full rounded-t-lg object-cover"
									/>
								</figure>
								<div class="card-body">
									<h3 class="card-title text-lg font-bold">{trailer.name}</h3>
									<a
										href={`https://www.youtube.com/watch?v=${trailer.key}`}
										onclick={(e) => {
											{
												e.preventDefault();
												openUrl(`https://www.youtube.com/watch?v=${trailer.key}`);
											}
										}}
										class="btn btn-primary mt-2"
										rel="noopener noreferrer"
									>
										Watch on YouTube
									</a>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}

			{#if movieData.tmdb.belongs_to_collection?.id && data.result.path}
				<div class="my-4">
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
				</div>
			{/if}

			<div class="my-4">
				<h2 class="my-2 text-2xl font-bold">Hauptdarsteller</h2>
				<div class="carousel carousel-center w-full space-x-3 rounded-box bg-base-100 p-3">
					{#each movieData.tmdb.credits.cast as cast}
						<a
							href="./actor?id={cast.id}"
							class="carousel-item flex flex-col items-center"
							data-sveltekit-preload-data="tap"
						>
							<Img
								params={[cast.profile_path, 'actors', false]}
								alt={cast.name}
								class="max-w-40 rounded-box sm:max-w-60"
							/>
							<p class="text-center text-lg">{cast.name}</p>
							<p class="text-base italic">{cast.character}</p>
						</a>
					{/each}
				</div>
			</div>

			<div class="space-y-3">
				<div>
					<h2 class="text-lg font-bold">Handlung</h2>
					<p>{movieData.tmdb.overview || 'Keine Informationen verfügbar'}</p>
				</div>
				<div class="col-span-1 grid gap-3 md:grid-cols-2">
					<div>
						<h2 class="text-lg font-bold">Veröffentlichungsdatum</h2>
						<p>
							{new Date(movieData.tmdb.release_date).toLocaleDateString(
								window.navigator.language
							) || 'Keine Informationen verfügbar'}
						</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Laufzeit</h2>
						<p>
							{#if movieData.tmdb.runtime}
								<time
									datetime={`PT${Math.floor(movieData.tmdb.runtime / 60)}H${movieData.tmdb.runtime % 60}M`}
								>
									{Math.floor(movieData.tmdb.runtime / 60)} Std {movieData.tmdb.runtime % 60} Min
								</time>
							{:else}
								<span>Keine Informationen verfügbar</span>
							{/if}
						</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Durchschnittliche Bewertung</h2>
						<p>
							{movieData.tmdb.vote_average
								? `${Math.round(movieData.tmdb.vote_average * 10) / 10}/10`
								: 'Keine Informationen verfügbar'}
							{movieData.tmdb.vote_count ? `(${movieData.tmdb.vote_count} Bewertungen)` : ''}
						</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Genres</h2>
						{#if movieData.tmdb.genres}
							<div class="space-x-1">
								{#each movieData.tmdb.genres as genre}
									<span class="badge">{genre.name} </span>
								{/each}
							</div>
						{:else}
							<p>Keine Informationen verfügbar</p>
						{/if}
					</div>
					<div>
						<h2 class="text-lg font-bold">Produktionsfirmen</h2>
						<p>
							{movieData.tmdb.production_companies?.map((c) => c.name).join(', ') ||
								'Keine Informationen verfügbar'}
						</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Produktionsländer</h2>
						<p>
							{movieData.tmdb.production_countries?.map((c) => c.name).join(', ') ||
								'Keine Informationen verfügbar'}
						</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Beliebtheit</h2>
						<p>{movieData.tmdb.popularity || 'Keine Informationen verfügbar'}</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Budget</h2>
						<p>
							{formate(movieData.tmdb.budget)}
						</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Originalsprache</h2>
						<p>{movieData.tmdb.original_language || 'Keine Informationen verfügbar'}</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Originaltitel</h2>
						<p>{movieData.tmdb.original_title || 'Keine Informationen verfügbar'}</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Einnahmen</h2>
						<p>{formate(movieData.tmdb.revenue)}</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Status</h2>
						<p>{movieData.tmdb.status || 'Keine Informationen verfügbar'}</p>
					</div>
				</div>
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
				placeholder={movieData?.id?.toString() ?? 'TMDB ID'}
				name="newID"
				min="1"
				required
			/>
			<button class="btn" type="submit">Speichern</button>
		</form>
	</div>
</dialog>

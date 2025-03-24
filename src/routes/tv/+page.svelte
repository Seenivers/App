<script lang="ts">
	import { db } from '$lib/db/database';
	import { eq } from 'drizzle-orm';
	import { schema } from '$lib/db/schema';
	import { settings } from '$lib/db/funktion';
	import Navbar from '$lib/Navbar.svelte';
	import type { PageData } from './$types';
	import { error } from '@tauri-apps/plugin-log';
	import { openPath } from '@tauri-apps/plugin-opener';
	import Img from '$lib/image/Img.svelte';
	import { placeholderURL } from '$lib';

	let { data }: { data: PageData } = $props();

	const id = data.id;
	let watched: boolean = $state(data.result.watched ?? false);
	let serieData: typeof schema.serie.$inferSelect = $state(data.result);
	let modal = $state(false);

	// Markiere Film als gesehen/ungesehen
	async function toggleWatchedStatus() {
		watched = !watched;
		await db.update(schema.serie).set({ watched }).where(eq(schema.serie.id, id));
	}

	// Entferne Film anhand der ID
	async function removeElementById() {
		await db.delete(schema.serie).where(eq(schema.serie.id, id));
		window.location.href = '/';
	}

	// Öffne die Datei mit dem Standardplayer
	async function openSeriePath() {
		if (!serieData || !serieData.path) return;
		try {
			// Öffne die Datei mit dem Standardplayer
			await openPath(serieData.path);
		} catch (err) {
			error('Failed to open Path: ' + err);
		}
	}
</script>

<Navbar back={true}>
	{#snippet right()}
		{#if data.result.path}
			<button class="btn btn-sm md:btn-md" onclick={openSeriePath} disabled={!data.pathExists}>
				Öffne Serien Ordner
			</button>
			<div class="tooltip tooltip-bottom" data-tip="Doppel klicken zum löschen">
				<button
					class="btn btn-sm hover:btn-error md:btn-md"
					ondblclick={removeElementById}
					disabled={!serieData}
				>
					Löschen
				</button>
			</div>
			<button class="btn btn-sm md:btn-md" disabled={!serieData} onclick={() => (modal = true)}>
				Bearbeiten
			</button>
			<button class="btn btn-sm md:btn-md" onclick={toggleWatchedStatus} disabled={!serieData}>
				{watched ? 'Als Nicht Gesehen markieren' : 'Als Gesehen markieren'}
			</button>
		{/if}
		<a
			href="https://www.themoviedb.org/tv/{id}"
			class="btn btn-sm md:btn-md"
			target="_blank"
			rel="noopener noreferrer">Bei TMDB öffnen</a
		>
	{/snippet}
</Navbar>

<!-- Main -->
<main class="z-0">
	{#if serieData}
		<div class="mx-auto w-full space-y-4 py-5 md:w-[80%] lg:w-[70%]">
			<h1 class="text-x1 mb-2 font-bold sm:text-2xl md:text-3xl">{serieData.tmdb.name}</h1>
			{#if serieData.tmdb.tagline}
				<h2 class="mb-2 text-sm font-bold italic sm:text-base md:text-base">
					{serieData.tmdb.tagline}
				</h2>
			{/if}

			<Img params={[serieData.tmdb.backdrop_path, 'backdrops', true]} alt={serieData.tmdb.name} />

			<!-- Trailer -->
			<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
				{#each serieData.tmdb.videos.results as trailer}
					{#if trailer.site === 'YouTube'}
						<div class="card bg-base-200 shadow-lg transition-shadow duration-300 hover:shadow-xl">
							<img
								src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
								alt={`Thumbnail for ${trailer.name}`}
								draggable="false"
								class="h-48 w-full rounded-t-lg object-cover"
							/>
							<div class="card-body">
								<h3 class="card-title text-lg font-bold">{trailer.name}</h3>
								<a
									href={`https://www.youtube.com/watch?v=${trailer.key}`}
									target="_blank"
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

			<!-- Serienbesetzung -->
			{#if serieData.tmdb.credits.cast.length > 0}
				<div>
					<h2 class="my-2 text-2xl font-bold">Serienbesetzung</h2>
					<div class="rounded-box bg-base-100 p-3">
						<div class="carousel carousel-center rounded-box w-full space-x-3">
							{#each serieData.tmdb.credits.cast as cast}
								<a
									href="./actor?id={cast.id}"
									class="carousel-item flex flex-col items-center"
									data-sveltekit-preload-data="tap"
								>
									<Img
										params={[cast.profile_path, 'actors', false]}
										alt={cast.name}
										class="rounded-box max-w-40 sm:max-w-60"
									/>
									<p class="text-center text-lg">{cast.name}</p>
									<p class="text-base italic">{cast.character}</p>
								</a>
							{/each}
						</div>
					</div>
				</div>
			{/if}

			<!-- Beschreibung -->
			<div class="space-y-3">
				<div>
					<h2 class="text-lg font-bold">Handlung</h2>
					<p>{serieData.tmdb.overview || 'Keine Informationen verfügbar'}</p>
				</div>
				<div class="col-span-1 grid gap-3 md:grid-cols-2">
					<div>
						<h2 class="text-lg font-bold">Erscheinungsdatum</h2>
						<p>
							{serieData.tmdb.first_air_date
								? new Date(serieData.tmdb.first_air_date).toLocaleDateString(
										window.navigator.language
									)
								: 'Keine Informationen verfügbar'}
						</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Durchschnittliche Bewertung</h2>
						<p>
							{serieData.tmdb.vote_average
								? `${Math.round(serieData.tmdb.vote_average * 10) / 10}/10`
								: 'Keine Informationen verfügbar'}
							{serieData.tmdb.vote_count ? `(${serieData.tmdb.vote_count} Bewertungen)` : ''}
						</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Genres</h2>
						{#if serieData.tmdb.genres}
							<div class="space-x-1">
								{#each serieData.tmdb.genres as genre}
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
							{serieData.tmdb.production_companies?.map((c) => c.name).join(', ') ||
								'Keine Informationen verfügbar'}
						</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Produktionsländer</h2>
						<p>
							{serieData.tmdb.production_countries?.map((c) => c.name).join(', ') ||
								'Keine Informationen verfügbar'}
						</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Beliebtheit</h2>
						<p>{serieData.tmdb.popularity || 'Keine Informationen verfügbar'}</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Originalsprache</h2>
						<p>{serieData.tmdb.original_language || 'Keine Informationen verfügbar'}</p>
					</div>
					<div>
						<h2 class="text-lg font-bold">Status</h2>
						<p>{serieData.tmdb.status || 'Keine Informationen verfügbar'}</p>
					</div>
				</div>
			</div>

			<!-- Seasons -->
			<div>
				<h2 class="my-2 text-2xl font-bold">Seasons</h2>
				{#if serieData.tmdb.seasons.length > 0}
					<div class="grid grid-cols-1 gap-4 md:grid-cols-2">
						{#each serieData.tmdb.seasons as season}
							<a
								href="./season?id={season.season_number}&tvShowID={id}"
								data-sveltekit-preload-data="tap"
								class="card card-compact bg-base-100 shadow-xl"
							>
								<figure>
									<img
										src={season.poster_path
											? `https://image.tmdb.org/t/p/w500${season.poster_path}`
											: placeholderURL}
										alt={season.name}
										class="h-48 w-full rounded-t-lg object-cover"
									/>
								</figure>
								<div class="card-body">
									<h2 class="card-title">{season.name}</h2>
									<p>{season.episode_count} Episodes</p>
								</div>
							</a>
						{/each}
					</div>
				{:else}
					<p>Keine Informationen verfügbar</p>
				{/if}
			</div>
		</div>
	{:else}
		<div class="flex justify-center p-5">
			<p class="text-4xl md:text-5xl">Keine Daten gefunden</p>
		</div>
	{/if}
</main>

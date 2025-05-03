<script lang="ts">
	import { goto } from '$app/navigation';
	import Navbar from '$lib/Navbar.svelte';
	import type { PageData } from './$types';
	import { error } from '@tauri-apps/plugin-log';
	import { openPath } from '@tauri-apps/plugin-opener';
	import Img from '$lib/image/Img.svelte';
	import { online } from 'svelte/reactivity/window';
	import { image } from '$lib/image/image';
	import { serie } from '$lib/utils/db/serie';
	import { season } from '$lib/utils/db/season';
	import { placeholderURL } from '$lib';
	import { _ } from 'svelte-i18n';

	// Seite-Daten, z. B. aus load()
	let { data }: { data: PageData } = $props();

	// Erstelle eine reaktive Kopie der Staffeln, die lokal bearbeitet wird
	let seasons = $state([...data.seasons]);

	// Der ausgewählte Staffelwert entspricht dem TMDB season_number (nicht dem Array-Index)
	let selectedSeason: number = $state(1);
	let modal = $state(false);

	// Ableiten der sortierten Staffeln; Extras (season_number 0) kommen immer ans Ende, ansonsten aufsteigend
	let sortedSeasons = $derived(() =>
		seasons.slice().sort((a, b) => {
			if (a.tmdb.season_number === 0) return 1;
			if (b.tmdb.season_number === 0) return -1;
			return a.tmdb.season_number - b.tmdb.season_number;
		})
	);

	// Gruppiere alle Episoden anhand der Staffeln (über tmdb.season_number)
	const episodesGrouped = new Map<number, (typeof data.episodes)[0][]>();
	data.episodes.forEach((ep) => {
		const seasonNumber = ep.tmdb.season_number;
		if (!episodesGrouped.has(seasonNumber)) {
			episodesGrouped.set(seasonNumber, []);
		}
		episodesGrouped.get(seasonNumber)?.push(ep);
	});
	// Sortiere die Episoden innerhalb jeder Staffel nach episode_number
	for (const [seasonNumber, episodes] of episodesGrouped.entries()) {
		episodes.sort((a, b) => a.tmdb.episode_number - b.tmdb.episode_number);
	}

	/**
	 * Navigiert zur Episode-Seite mit den nötigen URL-Parametern.
	 * Beispiel-URL:
	 * "./episode?id={episode.tmdb.episode_number}&tvShowID={data.id}&seasonNumber={seasonObj.tmdb.season_number}&seasonID={seasonObj.id}&episodeID={episode.id}"
	 */
	function navigateToEpisode(
		seasonObj: (typeof data.seasons)[0],
		episode: (typeof data.episodes)[0]
	) {
		const url = `./episode?id=${episode.tmdb.episode_number}&tvShowID=${data.id}&seasonNumber=${seasonObj.tmdb.season_number}&seasonID=${seasonObj.id}&episodeID=${episode.id}`;
		goto(url);
	}

	// Staffel als gesehen/ungesehen markieren und in der Datenbank speichern
	async function toggleWatchedStatus() {
		// Finde das aktuell ausgewählte Staffel-Objekt (über den TMDB-Wert)
		const seasonElement = seasons.find((s) => s.tmdb.season_number === selectedSeason);
		if (!seasonElement) return;
		// Neuer Status ist die Negation des aktuellen Werts
		const newStatus = !seasonElement.watched;
		// Aktualisiere die lokale Kopie: Erzeuge ein neues Array, damit Svelte reaktiv reagiert
		seasons = seasons.map((s) =>
			s.tmdb.season_number === selectedSeason ? { ...s, watched: newStatus } : s
		);
		// Aktualisiere auch die Originaldaten (falls benötigt)
		data.seasons = seasons;
		// Speichere den neuen Status in der Datenbank
		await season.update(seasonElement.id, { watched: newStatus });
	}

	// Entfernt die Serie (setzt den Pfad auf null)
	async function removeElementById() {
		await serie.update(data.serie.id, { path: null });
		data.pathExists = false;
		data.serie.path = null;
		window.location.reload();
	}

	// Öffnet den Serienpfad mit dem Standardplayer
	async function openSeriePath() {
		if (!data.serie || !data.serie.path) return;
		try {
			await openPath(data.serie.path);
		} catch (err) {
			error('Failed to open Path: ' + err);
		}
	}
</script>

<Navbar back={true}>
	{#snippet right()}
		{#if data.serie.path}
			<button class="btn btn-sm md:btn-md" onclick={openSeriePath} disabled={!data.pathExists}>
				Öffne Serien Ordner
			</button>
			<div class="tooltip tooltip-bottom" data-tip="Doppel klicken zum löschen">
				<button
					class="btn btn-sm hover:btn-error md:btn-md"
					ondblclick={removeElementById}
					disabled={!data.serie}
				>
					Löschen
				</button>
			</div>
			<button class="btn btn-sm md:btn-md" disabled={!data.serie} onclick={() => (modal = true)}>
				Bearbeiten
			</button>
			<!-- Status-Button für die Serie (nicht die Staffel) -->
			<button
				class="btn btn-sm md:btn-md"
				onclick={() => {
					data.serie.watched = !data.serie.watched;
					serie.update(data.serie.id, { watched: data.serie.watched });
				}}
				disabled={!data.serie}
			>
				{data.serie.watched ? 'Als Nicht Gesehen markieren' : 'Als Gesehen markieren'}
			</button>
		{/if}
		<a
			href="https://www.themoviedb.org/tv/{data.serie.id}"
			class="btn btn-sm md:btn-md"
			target="_blank"
			rel="noopener noreferrer"
		>
			Bei TMDB öffnen
		</a>
	{/snippet}
</Navbar>

<main class="container mx-auto p-4">
	{#await image(data.serie.tmdb.backdrop_path, 'backdrops', true) then backdropImage}
		<div
			class="hero rounded-box bg-base-200"
			style={backdropImage?.src !== placeholderURL
				? `background-image: url(${backdropImage.src});`
				: ''}
		>
			<div class="hero-overlay rounded-box bg-opacity-90"></div>
			<div class="hero-content flex-col gap-4 lg:flex-row">
				<Img
					alt="Poster"
					params={[data.serie.tmdb.poster_path, 'posters', true]}
					class="max-w-xs rounded-lg shadow-2xl md:max-w-sm"
				/>
				<div class="text-center text-neutral-content lg:text-left">
					<h1 class="text-4xl font-bold md:text-5xl">{data.serie.tmdb.name}</h1>
					{#if data.serie.tmdb.tagline}
						<h2 class="mb-2 text-sm font-bold italic sm:text-base md:text-base">
							{data.serie.tmdb.tagline}
						</h2>
					{/if}
					<p
						class="py-6 text-lg {data.serie.tmdb.overview.length > 700
							? 'md:text-xl'
							: 'md:text-2xl'}"
					>
						{data.serie.tmdb.overview || 'Keine Beschreibung verfügbar'}
					</p>
				</div>
			</div>
		</div>
	{/await}

	<!-- Trailer -->
	{#if !data.pathExists && online.current && data.serie.tmdb.videos.results.some((trailer) => trailer.site === 'YouTube')}
		<h2 class="my-3 text-2xl font-bold">Trailer</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data.serie.tmdb.videos.results as trailer}
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
	{/if}

	<!-- Serienbesetzung -->
	{#if data.serie.tmdb.credits.cast.length > 0}
		<div>
			<h2 class="my-3 text-2xl font-bold">Serienbesetzung</h2>
			<div class="rounded-box bg-base-100 p-3">
				<div class="carousel carousel-center w-full space-x-3 rounded-box">
					{#each data.serie.tmdb.credits.cast as cast}
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
		</div>
	{/if}

	<!-- Beschreibung -->
	<div class="my-3 space-y-3">
		<div class="col-span-1 grid gap-3 md:grid-cols-2">
			<div>
				<h2 class="text-lg font-bold">Erstausstrahlung</h2>
				<p>
					{data.serie.tmdb.first_air_date
						? new Date(data.serie.tmdb.first_air_date).toLocaleDateString(
								window.navigator.language,
								{
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								}
							)
						: 'Keine Informationen verfügbar'}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">Letzte Episode</h2>
				<p>
					{data.serie.tmdb.last_air_date
						? new Date(data.serie.tmdb.last_air_date).toLocaleDateString(
								window.navigator.language,
								{
									year: 'numeric',
									month: 'long',
									day: 'numeric'
								}
							)
						: 'Noch nicht ausgestrahlt'}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">Staffeln & Episoden</h2>
				<p>
					{data.serie.tmdb.number_of_seasons
						? `${data.serie.tmdb.number_of_seasons} Staffeln`
						: 'Keine Informationen verfügbar'} /
					{data.serie.tmdb.number_of_episodes
						? `${data.serie.tmdb.number_of_episodes} Episoden`
						: 'Keine Informationen verfügbar'}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">Durchschnittliche Bewertung</h2>
				<p>
					{data.serie.tmdb.vote_average
						? `${Math.round(data.serie.tmdb.vote_average * 10) / 10}/10`
						: 'Keine Bewertungen'}
					{data.serie.tmdb.vote_count ? ` (${data.serie.tmdb.vote_count} Bewertungen)` : ''}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">Genres</h2>
				{#if data.serie.tmdb.genres}
					<div class="flex flex-wrap gap-1">
						{#each data.serie.tmdb.genres as genre}
							<span class="badge badge-outline">{genre.name}</span>
						{/each}
					</div>
				{:else}
					<p>Keine Informationen verfügbar</p>
				{/if}
			</div>

			<div>
				<h2 class="text-lg font-bold">Produktionsfirmen</h2>
				<p>
					{data.serie.tmdb.production_companies?.length
						? data.serie.tmdb.production_companies.map((c) => c.name).join(', ')
						: 'Keine Informationen verfügbar'}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">Produktionsländer</h2>
				<p>
					{data.serie.tmdb.production_countries?.length
						? data.serie.tmdb.production_countries.map((c) => c.name).join(', ')
						: 'Keine Informationen verfügbar'}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">Laufzeit (pro Episode)</h2>
				<p>
					{data.serie.tmdb.episode_run_time?.length
						? `${Math.round(data.serie.tmdb.episode_run_time.reduce((a, b) => a + b, 0) / data.serie.tmdb.episode_run_time.length)} Minuten`
						: 'Keine Informationen verfügbar'}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">Beliebtheit</h2>
				<p>{data.serie.tmdb.popularity || 'Keine Informationen verfügbar'}</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">Originalsprache</h2>
				<p>
					{data.serie.tmdb.original_language
						? new Intl.DisplayNames([window.navigator.language], { type: 'language' }).of(
								data.serie.tmdb.original_language
							)
						: 'Keine Informationen verfügbar'}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">Status</h2>
				<p>{data.serie.tmdb.status || 'Keine Informationen verfügbar'}</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">Offizielle Webseite</h2>
				{#if data.serie.tmdb.homepage}
					<a href={data.serie.tmdb.homepage} target="_blank" rel="noopener noreferrer" class="link">
						{data.serie.tmdb.homepage}
					</a>
				{:else}
					<p>Keine Informationen verfügbar</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Staffeln -->
	<section class="mb-8">
		<div class="flex flex-col items-end gap-4 md:flex-row">
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<h2 class="my-3 text-2xl font-bold">Staffel</h2>
				</div>
				<!-- Dropdown mit den sortierten Staffeln -->
				<select class="select select-bordered" bind:value={selectedSeason}>
					{#each sortedSeasons() as season (season.id)}
						<option value={season.tmdb.season_number}>
							{season.tmdb.name}
							{season.tmdb.season_number === 0 ? '(Extras)' : ''}
							{season.watched ? ' (Gesehen)' : ''}
						</option>
					{/each}
				</select>
			</label>
			<button class="btn" disabled={selectedSeason === undefined} onclick={toggleWatchedStatus}>
				{sortedSeasons().find((s) => s.tmdb.season_number === selectedSeason)?.watched
					? 'Als Nicht Gesehen markieren'
					: 'Als Gesehen markieren'}
			</button>
		</div>

		<!-- Episodenliste für die ausgewählte Staffel -->
		{#if episodesGrouped.has(selectedSeason)}
			{@const seasonObj = data.seasons.find((s) => s.tmdb.season_number === selectedSeason)!}
			<ul class="mt-4 space-y-2">
				{#each episodesGrouped.get(seasonObj.tmdb.season_number) ?? [] as episode (episode.id)}
					<li class="bg-base-200 hover:bg-base-300 relative cursor-pointer rounded p-1">
						<button
							class="flex w-full items-center"
							onclick={() => navigateToEpisode(seasonObj, episode)}
						>
							<Img
								alt={episode.tmdb.name}
								params={[episode.tmdb.still_path, 'backdrops', true]}
								class="mr-4 h-auto w-1/3 rounded"
							/>
							<div class="w-full">
								<h3 class="text-xl font-medium">
									{episode.tmdb.name ? episode.tmdb.name : `Episode ${episode.tmdb.episode_number}`}
								</h3>
								{#if episode.tmdb.overview}
									<p class="text-sm text-gray-600">{episode.tmdb.overview}</p>
								{/if}
							</div>
							{#if episode.watched}
								<div class="badge badge-accent badge-outline absolute left-3 top-3 bg-base-300">
									{$_('main.movies.badgeWatched')}
								</div>
							{/if}
							{#if episode.path !== null}
								<div class="badge badge-accent badge-outline absolute right-3 top-3 bg-base-300">
									In deiner Sammlung
								</div>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="mt-2 text-gray-500">Keine Episoden gefunden</p>
		{/if}
	</section>
</main>

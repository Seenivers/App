<script lang="ts">
	import { goto } from '$app/navigation';
	import Navbar from '$lib/components/Navbar.svelte';
	import type { PageData } from './$types';
	import { openPath } from '@tauri-apps/plugin-opener';
	import Img from '$lib/image/Img.svelte';
	import { online } from 'svelte/reactivity/window';
	import { image } from '$lib/image/image';
	import { serie } from '$lib/utils/db/serie';
	import { season } from '$lib/utils/db/season';
	import { placeholderURL } from '$lib';
	import { m } from '$lib/paraglide/messages';
	import Bookmark from '$lib/assets/SVG/Bookmark.svelte';
	import BookmarkSlash from '$lib/assets/SVG/BookmarkSlash.svelte';
	import Rating from '$lib/components/rating.svelte';
	import { postWatchlist } from '$lib/utils/tmdb';

	// Seite-Daten, z. B. aus load()
	let { data }: { data: PageData } = $props();
	let isBookmarked = $derived(data.serie.wantsToWatch || false);
	let watched: boolean = $derived(data.serie.watched ?? false);

	// Erstelle eine reaktive Kopie der Staffeln, die lokal bearbeitet wird
	let seasons = $derived(data.seasons);

	// Ableiten der sortierten Staffeln; Extras (season_number 0) kommen immer ans Ende, ansonsten aufsteigend
	let sortedSeasons = $derived(() =>
		seasons.slice().sort((a, b) => {
			if (a.tmdb.season_number === 0) return 1;
			if (b.tmdb.season_number === 0) return -1;
			return a.tmdb.season_number - b.tmdb.season_number;
		})
	);

	// Der ausgewählte Staffelwert entspricht dem TMDB season_number (nicht dem Array-Index)
	let selectedSeason: number = $state(getLastUnwatchedSeasonNumber());
	// let modal = $state(false);

	function getLastUnwatchedSeasonNumber() {
		const unwatched = sortedSeasons().filter((s) => !s.watched);
		// Wenn alle gesehen, nimm die erste Staffel
		const last = unwatched.length > 0 ? unwatched[0] : sortedSeasons()[0];
		return last.tmdb.season_number;
	}

	// Gruppiere alle Episoden anhand der Staffeln (über tmdb.season_number)
	let episodesGrouped = $derived(() => {
		const map = new Map<number, (typeof data.episodes)[0][]>();

		for (const ep of data.episodes) {
			const seasonNumber = ep.tmdb.season_number;
			if (!map.has(seasonNumber)) {
				map.set(seasonNumber, []);
			}
			map.get(seasonNumber)!.push(ep);
		}

		// Episoden je Staffel sortieren
		for (const episodes of map.values()) {
			episodes.sort((a, b) => a.tmdb.episode_number - b.tmdb.episode_number);
		}

		return map;
	});

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
			console.error('Failed to open Path: ' + err);
		}
	}
</script>

<Navbar back={true}>
	{#snippet right()}
		{#if data.serie.path}
			<button class="btn btn-sm md:btn-md" onclick={openSeriePath} disabled={!data.pathExists}>
				{m.openFolder()}
			</button>
			<div class="tooltip tooltip-bottom" data-tip={m.doubleClickDelete()}>
				<button
					class="btn btn-sm hover:btn-error md:btn-md"
					ondblclick={removeElementById}
					disabled={!data.serie}
				>
					{m.delete()}
				</button>
			</div>
			<!-- <button class="btn btn-sm md:btn-md" disabled={!data.serie} onclick={() => (modal = true)}>{m.edit()}</button> -->
			<button
				class="btn btn-sm md:btn-md"
				onclick={() => {
					watched = !watched;
					serie.update(data.serie.id, { watched: watched, wantsToWatch: false });
				}}
				disabled={!data.serie}
			>
				{watched ? m['marked.asWatched']() : m['marked.notWatched']()}
			</button>
		{/if}
		<button
			class="btn btn-sm md:btn-md"
			title={isBookmarked ? m.bookmarkRemove() : m.bookmarkAdd()}
			onclick={() => {
				isBookmarked = !isBookmarked;
				serie.update(data.id, { wantsToWatch: isBookmarked });

				// TMDB liefert bei manchen Serien nur einen "Rumored"-Eintrag.
				// Diese Serie existieren nicht offiziell, daher würde ein API-Aufruf zur Watchlist einen 404-Fehler erzeugen.
				// Deshalb überspringen wir diese Serie, um Fehler zu vermeiden.
				if (data.serie.tmdb.status === 'Rumored') return;
				postWatchlist({ media_type: 'tv', media_id: data.id, watchlist: isBookmarked });
			}}
			disabled={data.pathExists}
		>
			{#if isBookmarked}
				<BookmarkSlash class="h-6 w-6" />
			{:else}
				<Bookmark class="h-6 w-6" />
			{/if}
		</button>

		<a
			href="https://www.themoviedb.org/tv/{data.serie.id}"
			class="btn btn-sm md:btn-md"
			target="_blank"
			rel="noopener noreferrer"
		>
			{m.openOnTMDB()}
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
					alt={m.posterAlt({ title: data.serie.tmdb.name })}
					params={[data.serie.tmdb.poster_path, 'posters', true]}
					class="max-w-xs rounded-lg shadow-2xl md:max-w-sm"
				/>
				<div class="text-neutral-content text-center lg:text-left">
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
						{data.serie.tmdb.overview || m.noInformationAvailable()}
					</p>
				</div>
			</div>
		</div>
	{/await}

	<!-- Trailer -->
	{#if !data.pathExists && online.current && data.serie.tmdb.videos.results.some((trailer) => trailer.site === 'YouTube')}
		<h2 class="my-3 text-2xl font-bold">{m.trailer()}</h2>
		<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			{#each data.serie.tmdb.videos.results as trailer (trailer.id)}
				{#if trailer.site === 'YouTube'}
					<div class="card bg-base-200 shadow-lg transition-shadow duration-300 hover:shadow-xl">
						<img
							src={`https://i.ytimg.com/vi/${trailer.key}/0.jpg`}
							alt={m.thumbnailAlt({ title: trailer.name })}
							referrerpolicy="no-referrer"
							draggable="false"
							class="h-48 w-full rounded-t-lg object-cover"
						/>
						<div class="card-body">
							<h3 class="card-title text-lg font-bold">{trailer.name}</h3>
							<a
								href={`https://www.youtube-nocookie.com/watch?v=${trailer.key}`}
								target="_blank"
								class="btn btn-primary mt-2"
								rel="noopener noreferrer"
							>
								{m.watchOnYouTube()}
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
			<h2 class="my-3 text-2xl font-bold">{m.seriesCast()}</h2>
			<div class="rounded-box bg-base-100 p-3">
				<div class="carousel carousel-center rounded-box w-full space-x-3">
					{#each data.serie.tmdb.credits.cast as cast}
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
	<div class="my-3 space-y-3">
		<div class="col-span-1 grid gap-3 md:grid-cols-2">
			<div>
				<h2 class="text-lg font-bold">{m.firstBroadcast()}</h2>
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
						: m.noInformationAvailable()}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">{m.lastEpisode()}</h2>
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
						: m.notAired()}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">{m.seasons()} & {m.episodes()}</h2>
				<p>
					{data.serie.tmdb.number_of_seasons
						? `${data.serie.tmdb.number_of_seasons} ${m.seasons()}`
						: m.noInformationAvailable()} /
					{data.serie.tmdb.number_of_episodes
						? `${data.serie.tmdb.number_of_episodes} ${m.episodes()}`
						: m.noInformationAvailable()}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">{m.rating()}</h2>
				<p>
					{#if data.serie.tmdb.vote_average}
						{m.ratingSummary({
							average: Math.round(data.serie.tmdb.vote_average * 10) / 10,
							count: data.serie.tmdb.vote_count ?? 0
						})}
					{:else}
						{m.noInformationAvailable()}
					{/if}
					| {m.yourRating()}: {data.serie.rating}
				</p>

				<Rating
					value={data.serie.rating}
					update={async () => await serie.update(data.id, { rating: data.serie.rating })}
				/>
			</div>

			<div>
				<h2 class="text-lg font-bold">{m.genres()}</h2>
				{#if data.serie.tmdb.genres}
					<div class="flex flex-wrap gap-1">
						{#each data.serie.tmdb.genres as genre (genre.id)}
							<span class="badge badge-outline">{genre.name}</span>
						{/each}
					</div>
				{:else}
					<p>{m.noInformationAvailable()}</p>
				{/if}
			</div>

			<div>
				<h2 class="text-lg font-bold">{m.productionCompanies()}</h2>
				<p>
					{data.serie.tmdb.production_companies?.length
						? data.serie.tmdb.production_companies.map((c) => c.name).join(', ')
						: m.noInformationAvailable()}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">{m.productionCountries()}</h2>
				<p>
					{data.serie.tmdb.production_countries?.length
						? data.serie.tmdb.production_countries.map((c) => c.name).join(', ')
						: m.noInformationAvailable()}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">{m.runtimePerEpisode()}</h2>
				<p>
					{data.serie.tmdb.episode_run_time?.length
						? `${Math.round(data.serie.tmdb.episode_run_time.reduce((a, b) => a + b, 0) / data.serie.tmdb.episode_run_time.length)} Minuten`
						: m.noInformationAvailable()}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">{m.popularity()}</h2>
				<p>{data.serie.tmdb.popularity || m.noInformationAvailable()}</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">{m.originalLanguage()}</h2>
				<p>
					{data.serie.tmdb.original_language
						? new Intl.DisplayNames([window.navigator.language], { type: 'language' }).of(
								data.serie.tmdb.original_language
							)
						: m.noInformationAvailable()}
				</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">{m.status()}</h2>
				<p>{data.serie.tmdb.status || m.noInformationAvailable()}</p>
			</div>

			<div>
				<h2 class="text-lg font-bold">{m.homepage()}</h2>
				{#if data.serie.tmdb.homepage}
					<a href={data.serie.tmdb.homepage} target="_blank" rel="noopener noreferrer" class="link">
						{data.serie.tmdb.homepage}
					</a>
				{:else}
					<p>{m.noInformationAvailable()}</p>
				{/if}
			</div>
		</div>
	</div>

	<!-- Staffeln -->
	<section class="mb-8">
		<div class="flex flex-col items-end gap-4 md:flex-row">
			<label class="form-control w-full max-w-xs">
				<div class="label">
					<h2 class="my-3 text-2xl font-bold">{m.season()}</h2>
				</div>
				<!-- Dropdown mit den sortierten Staffeln -->
				<select class="select select-bordered" bind:value={selectedSeason}>
					{#each sortedSeasons() as season (season.id)}
						<option value={season.tmdb.season_number}>
							{season.tmdb.name}
							{season.tmdb.season_number === 0 ? ` (${m.extras()})` : ''}
							{season.watched ? ` (${m['badge.watched']()})` : ''}
						</option>
					{/each}
				</select>
			</label>
			<button class="btn" disabled={selectedSeason === undefined} onclick={toggleWatchedStatus}>
				{sortedSeasons().find((s) => s.tmdb.season_number === selectedSeason)?.watched
					? m['marked.asWatched']()
					: m['marked.notWatched']()}
			</button>
		</div>

		<!-- Episodenliste für die ausgewählte Staffel -->
		{#if episodesGrouped().has(selectedSeason)}
			{@const seasonObj = data.seasons.find((s) => s.tmdb.season_number === selectedSeason)!}
			<ul class="mt-4 space-y-2">
				{#each episodesGrouped().get(seasonObj.tmdb.season_number) ?? [] as episode (episode.id)}
					<li class="bg-base-200 hover:bg-base-300 relative cursor-pointer rounded p-1">
						<button
							class="flex w-full items-center"
							onclick={() => navigateToEpisode(seasonObj, episode)}
						>
							<Img
								alt={m.backdropAlt({ title: episode.tmdb.name })}
								params={[episode.tmdb.still_path, 'backdrops', true]}
								class="mr-4 h-auto w-1/3 rounded"
							/>
							<div class="w-full">
								<h3 class="text-xl font-medium">
									{episode.tmdb.name
										? episode.tmdb.name
										: m['tv.episode']({
												name: episode.tmdb.name,
												number: episode.tmdb.episode_number
											})}
								</h3>
								{#if episode.tmdb.overview}
									<p class="text-sm text-gray-600">{episode.tmdb.overview}</p>
								{/if}
							</div>
							{#if episode.watched}
								<div class="badge badge-accent badge-outline bg-base-300 absolute top-3 left-3">
									{m['badge.watched']()}
								</div>
							{/if}
							{#if episode.path !== null}
								<div class="badge badge-accent badge-outline bg-base-300 absolute top-3 right-3">
									{m['badge.collection']()}
								</div>
							{/if}
						</button>
					</li>
				{/each}
			</ul>
		{:else}
			<p class="mt-2 text-gray-500">
				{m['tv.noEpisodes']()}
			</p>
		{/if}
	</section>
</main>

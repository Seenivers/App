<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import type { PageData } from './$types';

	import { openPath } from '@tauri-apps/plugin-opener';
	import Img from '$lib/image/Img.svelte';
	import { image } from '$lib/image/image';
	import { convertFileSrc } from '@tauri-apps/api/core';
	import Vidstack from '$lib/player/Vidstack.svelte';
	import Plyr from '$lib/player/Plyr.svelte';
	import { online } from 'svelte/reactivity/window';
	import { episode } from '$lib/utils/db/episode';
	import { goto, invalidate } from '$app/navigation';
	import { m } from '$lib/paraglide/messages';
	import Rating from '$lib/components/rating.svelte';
	import { getSettings } from '$lib/utils/settings/state';

	let { data }: { data: PageData } = $props();

	let watched: boolean = $derived(data.result.watched ?? false);

	// let modal = $state(false);

	// Markiere Film als gesehen/ungesehen
	async function toggleWatchedStatus() {
		watched = !watched;
		await episode.update(data.episodeID, { watched });
	}

	// Entferne Film anhand der ID
	async function removeElementById() {
		await episode.update(data.episodeID, { path: null });
		data.pathExists = false;
		data.result.path = null;
	}

	// Öffne die Datei mit dem Standardplayer
	async function openSeriePath() {
		if (!data.result || !data.result.path) return;
		try {
			// Öffne die Datei mit dem Standardplayer
			await openPath(data.result.path);
		} catch (err) {
			console.error('Failed to open Path: ' + err);
		}
	}

	async function navigateToNextEpisode() {
		if (!data.nextEpisodeURL) return;
		await invalidate('app:episode');
		await goto(data.nextEpisodeURL, { replaceState: true });
	}
</script>

<Navbar back={true}>
	{#snippet right()}
		{#if data.result.path}
			<button class="btn btn-sm md:btn-md" onclick={openSeriePath} disabled={!data.pathExists}>
				{m.startExternalPlayer()}
			</button>
			<div class="tooltip tooltip-bottom" data-tip={m.doubleClickDelete()}>
				<button
					class="btn btn-sm hover:btn-error md:btn-md"
					ondblclick={removeElementById}
					disabled={!data.result}
				>
					{m.delete()}
				</button>
			</div>
			<!-- <button class="btn btn-sm md:btn-md" disabled={!data.result} onclick={() => (modal = true)}>{m.edit()}</button> -->
		{/if}
		<button class="btn btn-sm md:btn-md" onclick={toggleWatchedStatus} disabled={!data.result}>
			{watched ? m['marked.asWatched']() : m['marked.notWatched']()}
		</button>
		<button class="btn" disabled={data.nextEpisodeURL === null} onclick={navigateToNextEpisode}>
			{m.nextEpisode()}
		</button>
		<a
			href="https://www.themoviedb.org/tv/{data.tvShowID}/season/{data.result.tmdb
				.season_number}/episode/{data.id}"
			class="btn btn-sm md:btn-md"
			target="_blank"
			rel="noopener noreferrer">{m.openOnTMDB()}</a
		>
	{/snippet}
</Navbar>

<!-- Main -->
<main class="z-0">
	{#if data.result}
		<div class="mx-auto w-full space-y-4 py-5 md:w-[80%] lg:w-[70%]">
			<h1 class="text-x1 font-bold sm:text-2xl md:text-3xl">{data.result.tmdb.name}</h1>

			{#if data.result.path && data.pathExists}
				{#await image(data.result.tmdb.still_path, null, false) then poster}
					{#if getSettings().player === 'Plyr'}
						<Plyr
							src={convertFileSrc(data.result.path)}
							poster={poster.src}
							id={data.episodeID}
							type="tv"
						/>
					{:else}
						<Vidstack
							src={convertFileSrc(data.result.path)}
							poster={poster.src}
							id={data.episodeID}
							type="tv"
						/>
					{/if}
				{/await}
			{:else if data.result.path}
				<p class="text-error text-lg font-bold underline md:text-2xl">{m.videoFileNotFound()}</p>
				<p class="text-xs">{data.result.path}</p>
			{/if}

			<!-- Trailer -->
			{#if !data.pathExists && data.result.tmdb.videos.results.length > 0 && online.current}
				<h2 class="my-3 text-2xl font-bold">{m.trailer()}</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each data.result.tmdb.videos.results as trailer (trailer.id)}
						{#if trailer.site === 'YouTube'}
							<div
								class="card bg-base-200 shadow-lg transition-shadow duration-300 hover:shadow-xl"
							>
								<figure>
									<img
										src={`https://i.ytimg.com/vi/${trailer.key}/0.jpg`}
										alt={m.thumbnailAlt({ title: trailer.name })}
										referrerpolicy="no-referrer"
										draggable="false"
										class="h-48 w-full rounded-t-lg object-cover"
									/>
								</figure>
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

			<!-- Gastdarsteller -->
			{#if data.result.tmdb.credits.guest_stars.length > 0}
				<div>
					<h2 class="my-2 text-2xl font-bold">{m.guestStars()}</h2>
					<div class="rounded-box bg-base-100 p-3">
						<div class="carousel carousel-center rounded-box w-full space-x-3">
							{#each data.result.tmdb.credits.guest_stars as guestStars (guestStars.id)}
								<a
									href="./actor?id={guestStars.id}"
									class="carousel-item flex flex-col items-center"
									data-sveltekit-preload-data="tap"
								>
									<Img
										params={[guestStars.profile_path, 'actors', false]}
										alt={guestStars.name}
										class="rounded-box max-w-40 sm:max-w-60"
									/>
									<p class="text-center text-lg">{guestStars.name}</p>
									<p class="text-base italic">{guestStars.character}</p>
								</a>
							{/each}
						</div>
					</div>
				</div>
			{/if}

			<!-- Beschreibung -->
			<div class="space-y-3">
				<div>
					<h2 class="text-lg font-bold">{m.plot()}</h2>
					<p>{data.result.tmdb.overview || m.noInformationAvailable()}</p>
				</div>

				<div class="col-span-1 grid gap-3 md:grid-cols-2">
					<div>
						<h2 class="text-lg font-bold">{m.firstBroadcast()}</h2>
						<p>
							{data.result.tmdb.air_date
								? new Date(data.result.tmdb.air_date).toLocaleDateString(
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
						<h2 class="text-lg font-bold">{m.episodeNumber()}</h2>
						<p>
							{data.result.tmdb.episode_number !== undefined
								? m.episodeNumberwithValue({ number: data.result.tmdb.episode_number })
								: m.noInformationAvailable()}
						</p>
					</div>

					<div>
						<h2 class="text-lg font-bold">{m.season()}</h2>
						<p>
							{data.result.tmdb.season_number !== undefined
								? m.seasonwithValue({ number: data.result.tmdb.season_number })
								: m.noInformationAvailable()}
						</p>
					</div>

					<div>
						<h2 class="text-lg font-bold">{m.runtime()}</h2>
						<p>
							{#if data.result.tmdb.runtime}
								<time
									datetime={`PT${Math.floor(data.result.tmdb.runtime / 60)}H${data.result.tmdb.runtime % 60}M`}
								>
									{m.runtimeFormatted({
										hours: Math.floor(data.result.tmdb.runtime / 60),
										minutes: data.result.tmdb.runtime % 60
									})}
								</time>
							{:else}
								<span>{m.noInformationAvailable()}</span>
							{/if}
						</p>
					</div>

					<div>
						<h2 class="text-lg font-bold">{m.rating()}</h2>
						<p>
							{#if data.result.tmdb.vote_average}
								{m.ratingSummary({
									average: Math.round(data.result.tmdb.vote_average * 10) / 10,
									count: data.result.tmdb.vote_count ?? 0
								})}
							{:else}
								{m.noInformationAvailable()}
							{/if}
							| {m.yourRating()}: {data.result.rating}
						</p>
						<Rating
							value={data.result.rating}
							update={async (rating) => await episode.update(data.episodeID, { rating: rating })}
						/>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex justify-center p-5">
			<p class="text-4xl md:text-5xl">{m.noDataFound()}</p>
		</div>
	{/if}
</main>

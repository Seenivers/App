<script lang="ts">
	import { settings } from '$lib/stores.svelte';
	import Navbar from '$lib/Navbar.svelte';
	import type { PageData } from './$types';
	import { error } from '@tauri-apps/plugin-log';
	import { openPath } from '@tauri-apps/plugin-opener';
	import Img from '$lib/image/Img.svelte';
	import { image } from '$lib/image/image';
	import { convertFileSrc } from '@tauri-apps/api/core';
	import Vidstack from '$lib/player/Vidstack.svelte';
	import Plyr from '$lib/player/Plyr.svelte';
	import { online } from 'svelte/reactivity/window';
	import { episode } from '$lib/utils/db/episode';
	import { goto, invalidate } from '$app/navigation';
	import { _ } from 'svelte-i18n';

	let { data }: { data: PageData } = $props();

	let watched: boolean = $derived(data.result.watched ?? false);

	let modal = $state(false);

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
			error('Failed to open Path: ' + err);
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
				{$_('startExternalPlayer')}
			</button>
			<div class="tooltip tooltip-bottom" data-tip="Doppel klicken zum löschen">
				<button
					class="btn btn-sm hover:btn-error md:btn-md"
					ondblclick={removeElementById}
					disabled={!data.result}
				>
					{$_('delete')}
				</button>
			</div>
			<button class="btn btn-sm md:btn-md" disabled={!data.result} onclick={() => (modal = true)}>
				Bearbeiten
			</button>
			<button class="btn btn-sm md:btn-md" onclick={toggleWatchedStatus} disabled={!data.result}>
				{watched ? $_('marked.asWatched') : $_('marked.notWatched')}
			</button>
		{/if}
		<button class="btn" disabled={data.nextEpisodeURL === null} onclick={navigateToNextEpisode}>
			Nächste Episode
		</button>
		<a
			href="https://www.themoviedb.org/tv/{data.tvShowID}/season/{data.result.tmdb
				.season_number}/episode/{data.id}"
			class="btn btn-sm md:btn-md"
			target="_blank"
			rel="noopener noreferrer">{$_('openOnTMDB')}</a
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
					{#if settings.player === 'Plyr'}
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
				<p class="text-error text-lg font-bold underline md:text-2xl">Video Datei Nicht gefunden</p>
				<p class="text-xs">{data.result.path}</p>
			{/if}

			<!-- Trailer -->
			{#if data.pathExists && online.current}
				<h2 class="my-3 text-2xl font-bold">{$_('trailer')}</h2>
				<div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
					{#each data.result.tmdb.videos.results as trailer}
						{#if trailer.site === 'YouTube'}
							<div
								class="card bg-base-200 shadow-lg transition-shadow duration-300 hover:shadow-xl"
							>
								<figure>
									<img
										src={`https://img.youtube.com/vi/${trailer.key}/0.jpg`}
										alt={$_('thumbnailAlt', { values: { title: trailer.name } })}
										draggable="false"
										class="h-48 w-full rounded-t-lg object-cover"
									/>
								</figure>
								<div class="card-body">
									<h3 class="card-title text-lg font-bold">{trailer.name}</h3>
									<a
										href={`https://www.youtube.com/watch?v=${trailer.key}`}
										target="_blank"
										class="btn btn-primary mt-2"
										rel="noopener noreferrer"
									>
										{$_('watchOnYouTube')}
									</a>
								</div>
							</div>
						{/if}
					{/each}
				</div>
			{/if}

			<!-- Serienbesetzung -->
			{#if data.result.tmdb.credits.cast.length > 0}
				<div>
					<h2 class="my-2 text-2xl font-bold">{$_('seriesCast')}</h2>
					<div class="rounded-box bg-base-100 p-3">
						<div class="carousel carousel-center rounded-box w-full space-x-3">
							{#each data.result.tmdb.credits.cast as cast}
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
					<h2 class="text-lg font-bold">{$_('plot')}</h2>
					<p>{data.result.tmdb.overview || $_('noInformationAvailable')}</p>
				</div>

				<div class="col-span-1 grid gap-3 md:grid-cols-2">
					<div>
						<h2 class="text-lg font-bold">{$_('firstBroadcast')}</h2>
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
								: $_('noInformationAvailable')}
						</p>
					</div>

					<div>
						<h2 class="text-lg font-bold">{$_('episodeNumber')}</h2>
						<p>
							{data.result.tmdb.episode_number !== undefined
								? $_('episodeNumberwithValue', {
										values: { number: data.result.tmdb.episode_number }
									})
								: $_('noInformationAvailable')}
						</p>
					</div>

					<div>
						<h2 class="text-lg font-bold">{$_('season')}</h2>
						<p>
							{data.result.tmdb.season_number !== undefined
								? $_('seasonwithValue', { values: { number: data.result.tmdb.season_number } })
								: $_('noInformationAvailable')}
						</p>
					</div>

					<div>
						<h2 class="text-lg font-bold">{$_('runtime')}</h2>
						<p>
							{#if data.result.tmdb.runtime}
								<time
									datetime={`PT${Math.floor(data.result.tmdb.runtime / 60)}H${data.result.tmdb.runtime % 60}M`}
								>
									{$_('runtimeFormatted', {
										values: {
											hours: Math.floor(data.result.tmdb.runtime / 60),
											minutes: data.result.tmdb.runtime % 60
										}
									})}
								</time>
							{:else}
								<span>{$_('noInformationAvailable')}</span>
							{/if}
						</p>
					</div>

					<div>
						<h2 class="text-lg font-bold">{$_('rating')}</h2>
						<p>
							{data.result.tmdb.vote_average
								? $_('ratingSummary', {
										values: {
											average: Math.round(data.result.tmdb.vote_average * 10) / 10,
											count: data.result.tmdb.vote_count ?? 0
										}
									})
								: $_('noInformationAvailable')}
						</p>
					</div>
				</div>
			</div>
		</div>
	{:else}
		<div class="flex justify-center p-5">
			<p class="text-4xl md:text-5xl">{$_('noDataFound')}</p>
		</div>
	{/if}
</main>

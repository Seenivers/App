<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { m } from '$lib/paraglide/messages';
	import { postWatchlist } from '$lib/utils/tmdb';
	import type { PageData } from './$types';
	import { syncWatchlist } from '$lib/utils/tmdb/watchlist';
	import Img from '$lib/image/Img.svelte';
	import { movie } from '$lib/utils/db/movie';
	import { serie } from '$lib/utils/db/serie';
	import Close from '$lib/assets/SVG/Close.svelte';
	import { online } from 'svelte/reactivity/window';
	import { getSettings } from '$lib/utils/settings/state';
	import { newToast } from '$lib/toast/toast';

	let { data }: { data: PageData } = $props();

	let movies = $derived(data.movie);
	let series = $derived(data.serie);

	const removeFromWatchlist = async (mediaType: 'movie' | 'tv', mediaId: number) => {
		await postWatchlist({
			media_type: mediaType,
			media_id: mediaId,
			watchlist: false
		});

		if (mediaType === 'movie') {
			movies = movies.filter((item) => item.id !== mediaId);
			movie.update(mediaId, {
				wantsToWatch: false
			});
		} else if (mediaType === 'tv') {
			series = series.filter((item) => item.id !== mediaId);
			serie.update(mediaId, {
				wantsToWatch: false
			});
		}
	};
</script>

<Navbar back={true}>
	{#snippet right()}
		<div
			class={!online.current || !getSettings().tmdbAccessToken ? 'tooltip tooltip-left' : ''}
			data-tip={!online.current
				? m['networkStatus.offline']()
				: !getSettings().tmdbAccessToken
					? m.noTMDBAccessToken()
					: ''}
		>
			<button
				class="btn"
				onclick={async () => {
					const result = await syncWatchlist();
					newToast('success', 'Watchlist synchronized');
					if (!result) return;

					movies = result.movie;
					series = result.serie;
				}}
				disabled={!getSettings().tmdbAccessToken || !online.current}>{m.watchlistSync()}</button
			>
		</div>
	{/snippet}
</Navbar>

<main class="container mx-auto w-full grow space-y-8 px-4 py-6 lg:w-4/5 xl:w-2/3">
	<h1 class="mb-4 text-3xl font-bold">{m.watchlist()}</h1>

	<div role="tablist" class="tabs tabs-lift">
		<!-- Filme Tab -->
		<input
			type="radio"
			name="tabs"
			role="tab"
			class="tab"
			aria-label="{m.movies()} - {movies.length}"
			checked
		/>
		<div role="tabpanel" class="tab-content bg-base-100 space-y-2 p-4">
			{#if movies.length > 0}
				<ul class="space-y-2">
					{#each movies as item (item.id)}
						<li class="hover:bg-base-300 flex items-center gap-3 rounded-lg p-2 transition">
							<a href={`/movie?id=${item.id}`} class="flex flex-1 items-center gap-3">
								<Img
									params={[item.tmdb.poster_path, 'posters', false]}
									class="h-48 w-auto rounded-lg object-cover"
									alt={m.posterAlt({ title: item.tmdb.title })}
								/>
								<div>
									<p class="font-medium">{item.tmdb.title}</p>
									<p class="text-base-content/60 text-sm">
										{item.tmdb.release_date
											? new Date(item.tmdb.release_date).toLocaleDateString(
													window.navigator.language
												)
											: m.noInformationAvailable()}
									</p>
									<p class="text-sm">{item.tmdb.overview}</p>
								</div>
							</a>
							<div class="tooltip tooltip-bottom" data-tip={m.doubleClickDelete()}>
								<button
									class="btn btn-error btn-circle"
									ondblclick={() => removeFromWatchlist('movie', item.id)}
								>
									<Close class="h-8 w-8" />
								</button>
							</div>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-base-content/70">{m.noInformationAvailable()}</p>
			{/if}
		</div>

		<!-- TV Tab -->
		<input
			type="radio"
			name="tabs"
			role="tab"
			class="tab"
			aria-label="{m.series()} - {series.length}"
		/>
		<div role="tabpanel" class="tab-content bg-base-100 space-y-2 p-4">
			{#if series.length > 0}
				<ul class="space-y-2">
					{#each series as item (item.id)}
						<li class="hover:bg-base-300 flex items-center gap-3 rounded-lg p-2 transition">
							<a href={`/tv?id=${item.id}`} class="flex flex-1 items-center gap-3">
								<Img
									params={[item.tmdb.poster_path, 'posters', false]}
									class="h-48 w-auto rounded-lg object-cover"
									alt={m.posterAlt({ title: item.tmdb.name })}
								/>
								<div>
									<p class="font-medium">{item.tmdb.name}</p>
									<p class="text-base-content/60 text-sm">
										{item.tmdb.first_air_date
											? new Date(item.tmdb.first_air_date).toLocaleDateString(
													window.navigator.language
												)
											: m.noInformationAvailable()}
									</p>
									<p class="text-sm">{item.tmdb.overview}</p>
								</div>
							</a>
							<div class="tooltip tooltip-bottom" data-tip={m.doubleClickDelete()}>
								<button
									class="btn btn-error btn-circle"
									ondblclick={() => removeFromWatchlist('tv', item.id)}
								>
									<Close class="h-8 w-8" />
								</button>
							</div>
						</li>
					{/each}
				</ul>
			{:else}
				<p class="text-base-content/70">{m.noInformationAvailable()}</p>
			{/if}
		</div>
	</div>
</main>

<script lang="ts">
	import Navbar from '$lib/components/Navbar.svelte';
	import { _ } from 'svelte-i18n';
	import { postWatchlist } from '$lib/utils/tmdb';
	import type { PageData } from './$types';
	import { syncWatchlist } from '$lib/utils/tmdb/watchlist';
	import Img from '$lib/image/Img.svelte';
	import { movie } from '$lib/utils/db/movie';
	import { serie } from '$lib/utils/db/serie';
	import Close from '$lib/SVG/Close.svelte';
	import { online } from 'svelte/reactivity/window';
	import { settings } from '$lib/stores.svelte';

	export let data: PageData;

	const removeFromWatchlist = async (mediaType: 'movie' | 'tv', mediaId: number) => {
		await postWatchlist({
			media_type: mediaType,
			media_id: mediaId,
			watchlist: false
		});

		if (mediaType === 'movie') {
			data.movie = data.movie.filter((item) => item.id !== mediaId);
			movie.update(mediaId, {
				wantsToWatch: false
			});
		} else if (mediaType === 'tv') {
			data.serie = data.serie.filter((item) => item.id !== mediaId);
			serie.update(mediaId, {
				wantsToWatch: false
			});
		}

		location.reload();
	};
</script>

<Navbar back={true}>
	{#snippet right()}
		<div
			class={!online.current || !settings.tmdbAccessToken ? 'tooltip tooltip-left' : ''}
			data-tip={!online.current
				? $_('networkStatus.offline')
				: !settings.tmdbAccessToken
					? $_('noTMDBAccessToken')
					: ''}
		>
			<button
				class="btn"
				onclick={syncWatchlist}
				disabled={!settings.tmdbAccessToken || !online.current}>{$_('watchlistSync')}</button
			>
		</div>
	{/snippet}
</Navbar>

<main class="container mx-auto w-full grow space-y-8 px-4 py-6 lg:w-4/5 xl:w-2/3">
	<h1 class="mb-4 text-3xl font-bold">{$_('watchlist')}</h1>

	<div role="tablist" class="tabs tabs-lift">
		<!-- Filme Tab -->
		<input
			type="radio"
			name="tabs"
			role="tab"
			class="tab"
			aria-label="{$_('movies')} - {data.movie.length}"
			checked
		/>
		<div role="tabpanel" class="tab-content bg-base-100 space-y-2 p-4">
			{#if data.movie.length > 0}
				<ul class="space-y-2">
					{#each data.movie as item (item.id)}
						<li class="hover:bg-base-300 flex items-center gap-3 rounded-lg p-2 transition">
							<a href={`/movie?id=${item.id}`} class="flex flex-1 items-center gap-3">
								<Img
									params={[item.tmdb.poster_path, 'posters', false]}
									class="h-48 w-auto rounded-lg object-cover"
									alt={$_('posterAlt', { values: { title: item.tmdb.title } })}
								/>
								<div>
									<p class="font-medium">{item.tmdb.title}</p>
									<p class="text-base-content/60 text-sm">
										{item.tmdb.release_date
											? new Date(item.tmdb.release_date).toLocaleDateString(
													window.navigator.language
												)
											: $_('noInformationAvailable')}
									</p>
									<p class="text-sm">{item.tmdb.overview}</p>
								</div>
							</a>
							<div class="tooltip tooltip-bottom" data-tip={$_('doubleClickDelete')}>
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
				<p class="text-base-content/70">{$_('noInformationAvailable')}</p>
			{/if}
		</div>

		<!-- TV Tab -->
		<input
			type="radio"
			name="tabs"
			role="tab"
			class="tab"
			aria-label="{$_('series')} - {data.serie.length}"
		/>
		<div role="tabpanel" class="tab-content bg-base-100 space-y-2 p-4">
			{#if data.serie.length > 0}
				<ul class="space-y-2">
					{#each data.serie as item (item.id)}
						<li class="hover:bg-base-300 flex items-center gap-3 rounded-lg p-2 transition">
							<a href={`/tv?id=${item.id}`} class="flex flex-1 items-center gap-3">
								<Img
									params={[item.tmdb.poster_path, 'posters', false]}
									class="h-48 w-auto rounded-lg object-cover"
									alt={$_('posterAlt', { values: { title: item.tmdb.name } })}
								/>
								<div>
									<p class="font-medium">{item.tmdb.name}</p>
									<p class="text-base-content/60 text-sm">
										{item.tmdb.first_air_date
											? new Date(item.tmdb.first_air_date).toLocaleDateString(
													window.navigator.language
												)
											: $_('noInformationAvailable')}
									</p>
									<p class="text-sm">{item.tmdb.overview}</p>
								</div>
							</a>
							<div class="tooltip tooltip-bottom" data-tip={$_('doubleClickDelete')}>
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
				<p class="text-base-content/70">{$_('noInformationAvailable')}</p>
			{/if}
		</div>
	</div>
</main>

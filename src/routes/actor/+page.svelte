<script lang="ts">
	import type { PageData } from './$types';
	import Navbar from '$lib/components/Navbar.svelte';
	import Img from '$lib/image/Img.svelte';
	import { m } from '$lib/paraglide/messages';
	import { onMount } from 'svelte';
	import { discord } from '$lib/utils/discord';
	import Movie from '$lib/assets/SVG/movie.svelte';
	import Tv from '$lib/assets/SVG/tv.svelte';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const genderMapping = {
		1: m.female(),
		2: m.male(),
		3: m.nonBinary(),
		0: m.unknown()
	};

	// Sortiere die Einträge nach Datum (ohne Datum zuerst)
	function sortByDate<
		T extends {
			release_date?: string | null;
		}
	>(items: T[]): T[] {
		return items.slice().sort((a, b) => {
			const dateA = new Date(a.release_date || 0).getTime();
			const dateB = new Date(b.release_date || 0).getTime();
			return dateA === 0 ? -1 : dateB === 0 ? 1 : dateA - dateB;
		});
	}

	onMount(() => {
		discord();
	});
</script>

<Navbar back={true}>
	{#snippet right()}
		<a
			href="https://www.themoviedb.org/person/{data.result.id}"
			class="btn btn-ghost"
			target="_blank"
			rel="noopener noreferrer">{m.openOnTMDB()}</a
		>
	{/snippet}
</Navbar>

<main class="flex flex-col items-center gap-6 px-4 py-6 md:px-6 lg:px-8">
	{#if data.result}
		{@const actor = data.result}
		<div class="grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-6 lg:grid-cols-[350px_1fr]">
			<!-- Sidebar: Actor Infos -->
			<aside class="card bg-base-200 h-fit w-full p-5 shadow-md">
				<div class="flex flex-col items-center gap-4">
					<Img
						params={[actor.profile_path, 'actors', false]}
						alt={actor.name}
						class="w-full max-w-62.5 rounded-lg object-cover shadow-lg"
					/>

					<!-- Social media -->
					{#if actor.external_ids}
						<div class="w-full space-y-2">
							<h2 class="text-lg font-semibold">{m.socialMedia()}</h2>
							<div class="flex flex-wrap gap-2">
								{#if actor.external_ids.imdb_id}
									<a
										href={`https://www.imdb.com/name/${actor.external_ids.imdb_id}`}
										target="_blank"
										rel="noopener noreferrer"
										class="btn btn-outline btn-sm transition hover:bg-yellow-500 hover:text-white"
									>
										IMDb
									</a>
								{/if}
								{#if actor.external_ids.instagram_id}
									<a
										href={`https://www.instagram.com/${actor.external_ids.instagram_id}`}
										target="_blank"
										rel="noopener noreferrer"
										class="btn btn-outline btn-sm transition hover:bg-linear-to-r hover:from-pink-500 hover:to-yellow-500 hover:text-white"
									>
										Instagram
									</a>
								{/if}
								{#if actor.external_ids.tiktok_id}
									<a
										href={`https://www.tiktok.com/@${actor.external_ids.tiktok_id}`}
										target="_blank"
										rel="noopener noreferrer"
										class="btn btn-outline btn-sm transition hover:bg-black hover:text-white"
									>
										TikTok
									</a>
								{/if}
								{#if actor.external_ids.facebook_id}
									<a
										href={`https://www.facebook.com/${actor.external_ids.facebook_id}`}
										target="_blank"
										rel="noopener noreferrer"
										class="btn btn-outline btn-sm transition hover:bg-blue-600 hover:text-white"
									>
										Facebook
									</a>
								{/if}
								{#if actor.external_ids.twitter_id}
									<a
										href={`https://twitter.com/${actor.external_ids.twitter_id}`}
										target="_blank"
										rel="noopener noreferrer"
										class="btn btn-outline btn-sm transition hover:bg-blue-400 hover:text-white"
									>
										Twitter
									</a>
								{/if}
								{#if actor.external_ids.youtube_id}
									<a
										href={`https://www.youtube-nocookie.com/${actor.external_ids.youtube_id}`}
										target="_blank"
										rel="noopener noreferrer"
										class="btn btn-outline btn-sm transition hover:bg-red-600 hover:text-white"
									>
										YouTube
									</a>
								{/if}
							</div>
						</div>
					{/if}

					<!-- Infos -->
					<div class="w-full space-y-4 text-sm">
						<div>
							<span class="font-semibold">{m.knownFor()}:</span>
							<p>{actor.known_for_department || 'Keine Angabe'}</p>
						</div>
						<div>
							<span class="font-semibold">{m.gender()}:</span>
							<p>{genderMapping[actor.gender]}</p>
						</div>
						<div>
							<span class="font-semibold">{m.birthdate()}:</span>
							<p>
								{#if actor.birthday}
									{@const birthDate = new Date(actor.birthday)}
									{@const deathDate = actor.deathday ? new Date(actor.deathday) : new Date()}
									{@const age = deathDate.getFullYear() - birthDate.getFullYear()}
									{birthDate.toLocaleDateString()} ({age} Jahre alt)
								{:else}
									{m.noInformationAvailable()}
								{/if}
							</p>
						</div>
						{#if actor.deathday}
							<div>
								<span class="font-semibold">{m.deathdate()}:</span>
								<p>{new Date(actor.deathday).toLocaleDateString()}</p>
							</div>
						{/if}
						<div>
							<span class="font-semibold">{m.birthplace()}:</span>
							<p>{actor.place_of_birth || m.noInformationAvailable()}</p>
						</div>
						{#if actor.also_known_as.length > 0}
							<div>
								<span class="font-semibold">{m.aliases()}:</span>
								<ul class="list-inside list-disc space-y-1">
									{#each actor.also_known_as as alias (alias)}
										<li>{alias}</li>
									{/each}
								</ul>
							</div>
						{/if}
					</div>
				</div>
			</aside>

			<!-- Main Content -->
			<section class="card bg-base-200 w-full p-5 shadow-md">
				<h1 class="text-3xl font-bold">{actor.name}</h1>

				<!-- Biografie -->
				<div class="mt-6 space-y-2">
					<h2 class="text-xl font-semibold">{m.biography()}</h2>
					{#if actor.biography}
						<p class="text-base-content leading-relaxed whitespace-pre-wrap">{actor.biography}</p>
					{:else}
						<p class="text-base-content/80 mt-6 italic">{m.noInformationAvailable()}</p>
					{/if}
				</div>

				<!-- Cast und Crew -->
				{#each ['cast', 'crew'] as const as type (type)}
					{#if actor.combined_credits[type].length > 0}
						<div class="mt-8 space-y-3">
							<h2 class="text-xl font-semibold">
								{type === 'cast' ? m.filmography() : m.crew()}
							</h2>
							<ul class="space-y-2">
								{#each sortByDate(actor.combined_credits[type]) as item (item.credit_id)}
									<li class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
										<div class="flex items-center gap-2">
											<a
												href={`${item.media_type}?id=${item.id}`}
												class="inline-flex items-center gap-2 font-medium hover:underline"
												data-sveltekit-preload-data="tap"
											>
												{#if item.media_type === 'movie'}
													<Movie class="text-base-content/80 h-5 w-5 shrink-0" />
												{:else}
													<Tv class="text-base-content/80 h-5 w-5 shrink-0" />
												{/if}
												<span>{item.title || item.name}</span>
											</a>
											<span class="text-base-content/70 text-sm">–</span>
											<span class="text-base-content/70 text-sm">
												{type === 'cast' ? item.character || m.noInformationAvailable() : item.job}
											</span>
										</div>
										<span class="badge badge-outline min-w-fit">
											{item.release_date
												? new Date(item.release_date).getFullYear()
												: m.noInformationAvailable()}
										</span>
									</li>
								{/each}
							</ul>
						</div>
					{/if}
				{/each}
			</section>
		</div>
	{/if}
</main>

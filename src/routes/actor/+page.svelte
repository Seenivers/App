<script lang="ts">
	import type { PageData } from './$types';
	import Navbar from '$lib/Navbar.svelte';
	import Img from '$lib/image/Img.svelte';
	import { _ } from 'svelte-i18n';
	import { onMount } from 'svelte';
	import { discord } from '$lib/discord';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const genderMapping = {
		1: $_('actor.gendertypes.female'),
		2: $_('actor.gendertypes.male'),
		3: $_('actor.gendertypes.nonBinary'),
		0: $_('actor.gendertypes.unknown')
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
		discord({
			details: `Schaut gerade ${data.result.name} an`,
			state: `${data.result.combined_credits.cast.length + data.result.combined_credits.crew.length} Filme & Serien`
		});
	});
</script>

<Navbar back={true}>
	{#snippet right()}
		<a
			href="https://www.themoviedb.org/person/{data.result.id}"
			class="btn btn-ghost"
			target="_blank"
			rel="noopener noreferrer">{$_('actor.nav.openTmdb')}</a
		>
	{/snippet}
</Navbar>

<main class="flex flex-col items-center gap-6 px-4 py-6 md:px-6 lg:px-8">
	{#if data.result}
		{@const actor = data.result}
		<div class="grid w-full max-w-screen-xl grid-cols-1 gap-6 lg:grid-cols-[350px_1fr]">
			<!-- Sidebar: Actor Infos -->
			<aside class="card bg-base-200 h-fit w-full p-5 shadow-md">
				<div class="flex flex-col items-center gap-4">
					<Img
						params={[actor.profile_path, 'actors', false]}
						alt={actor.name}
						class="w-full max-w-[250px] rounded-lg object-cover shadow-lg"
					/>

					<!-- Social Links -->
					{#if actor.external_ids}
						<div class="w-full space-y-2">
							<h2 class="text-lg font-semibold">{$_('actor.socialLinks')}</h2>
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
										class="btn btn-outline btn-sm transition hover:bg-gradient-to-r hover:from-pink-500 hover:to-yellow-500 hover:text-white"
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
										href={`https://www.youtube.com/${actor.external_ids.youtube_id}`}
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
							<span class="font-semibold">{$_('actor.knownFor')}:</span>
							<p>{actor.known_for_department || 'Keine Angabe'}</p>
						</div>
						<div>
							<span class="font-semibold">{$_('actor.gender')}:</span>
							<p>{$_(genderMapping[actor.gender])}</p>
						</div>
						<div>
							<span class="font-semibold">{$_('actor.birthdate.label')}:</span>
							<p>
								{#if actor.birthday}
									{@const birthDate = new Date(actor.birthday)}
									{@const deathDate = actor.deathday ? new Date(actor.deathday) : new Date()}
									{@const age = deathDate.getFullYear() - birthDate.getFullYear()}
									{birthDate.toLocaleDateString()} ({age} Jahre alt)
								{:else}
									{$_('actor.birthdate.unknown')}
								{/if}
							</p>
						</div>
						{#if actor.deathday}
							<div>
								<span class="font-semibold">{$_('actor.deathdate.label')}:</span>
								<p>{new Date(actor.deathday).toLocaleDateString()}</p>
							</div>
						{/if}
						<div>
							<span class="font-semibold">{$_('actor.birthplace.label')}:</span>
							<p>{actor.place_of_birth || $_('actor.birthplace.unknown')}</p>
						</div>
						<div>
							<span class="font-semibold">{$_('actor.aliases.label')}:</span>
							<ul class="list-inside list-disc space-y-1">
								{#if actor.also_known_as.length > 0}
									{#each actor.also_known_as as alias}
										<li>{alias}</li>
									{/each}
								{:else}
									<li>{$_('actor.aliases.none')}</li>
								{/if}
							</ul>
						</div>
					</div>
				</div>
			</aside>

			<!-- Main Content -->
			<section class="card bg-base-200 w-full p-5 shadow-md">
				<h1 class="text-3xl font-bold">{actor.name}</h1>

				<!-- Biografie -->
				{#if actor.biography}
					<div class="mt-6 space-y-2">
						<h2 class="text-xl font-semibold">{$_('actor.biography.label')}</h2>
						<p class="text-base-content whitespace-pre-wrap leading-relaxed">{actor.biography}</p>
					</div>
				{:else}
					<p class="text-base-content/80 mt-6 italic">{$_('actor.biography.none')}</p>
				{/if}

				<!-- Cast und Crew -->
				{#each ['cast', 'crew'] as const as type}
					{#if actor.combined_credits[type].length > 0}
						<div class="mt-8 space-y-3">
							<h2 class="text-xl font-semibold">
								{$_(`actor.${type === 'cast' ? 'filmography' : 'crew'}.title`)}
							</h2>
							<ul class="space-y-2">
								{#each sortByDate(actor.combined_credits[type]) as item}
									<li class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
										<div>
											<a
												href={`${item.media_type}?id=${item.id}`}
												class="font-medium hover:underline"
												data-sveltekit-preload-data="tap"
											>
												{item.title || item.name}
											</a>
											<span class="text-base-content/70 text-sm">
												– {type === 'cast'
													? item.character || $_('actor.filmography.roleUnknown')
													: item.job}
											</span>
										</div>
										<span class="badge badge-outline">
											{item.release_date
												? new Date(item.release_date).getFullYear()
												: $_(`actor.filmography.releaseUnknown`)}
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

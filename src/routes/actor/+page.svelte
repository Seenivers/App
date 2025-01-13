<script lang="ts">
	import type { PageData } from './$types';
	import Navbar from '$lib/Navbar.svelte';
	import Img from '$lib/image/Img.svelte';
	import type { Cast, Crew } from '$lib/types/actor';
	import { _ } from 'svelte-i18n';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const genderMapping = {
		1: $_('actor.gendertypes.male'),
		2: $_('actor.gendertypes.female'),
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

<main class="flex flex-col items-center p-3 md:p-5">
	{#if data.result}
		{@const actor = data.result}
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-3">
			<!-- Linke Spalte: Bild, Grunddaten und Social Links -->
			<div class="card sticky top-24 h-fit w-full bg-base-200 p-5 shadow-md">
				<div class="flex justify-center">
					<Img
						params={[actor.profile_path, 'actors', false]}
						alt={actor.name}
						class="h-auto w-full max-w-xs rounded-lg object-cover shadow-lg"
					/>
				</div>
				<div class="mt-5 space-y-4">
					<!-- Social Links -->
					{#if actor.external_ids}
						<div>
							<h2 class="mb-2 text-2xl font-semibold">{$_('actor.socialLinks')}</h2>
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
					<!-- Grunddaten -->
					<div>
						<h2 class="text-2xl font-semibold">{$_('actor.knownFor')}</h2>
						<p>{actor.known_for_department || 'Keine Angabe'}</p>
					</div>
					<div>
						<h2 class="text-2xl font-semibold">{$_('actor.gender')}</h2>
						<p>{$_(genderMapping[actor.gender])}</p>
					</div>
					<div>
						<h2 class="text-2xl font-semibold">{$_('actor.birthdate.label')}</h2>
						<p>
							{actor.birthday
								? `${new Date(actor.birthday).toLocaleDateString()} (${
										new Date().getFullYear() - new Date(actor.birthday).getFullYear()
									} Jahre alt)`
								: $_('actor.birthdate.unknown')}
						</p>
					</div>
					{#if actor.deathday}
						<div>
							<h2 class="text-2xl font-semibold">{$_('actor.deathdate.label')}</h2>
							<p>{new Date(actor.deathday).toLocaleDateString()}</p>
						</div>
					{/if}
					<div>
						<h2 class="text-2xl font-semibold">{$_('actor.birthplace.label')}</h2>
						<p>{actor.place_of_birth || $_('actor.birthplace.unknown')}</p>
					</div>
					<div>
						<h2 class="text-2xl font-semibold">{$_('actor.aliases.label')}</h2>
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

			<!-- Mittlere Spalte: Name und Biografie -->
			<div class="card w-full bg-base-200 p-5 shadow-md lg:col-span-2">
				<h1 class="text-3xl font-bold">{actor.name}</h1>
				<div class="mt-5">
					<h2 class="text-2xl font-semibold">{$_('actor.biography.label')}</h2>
					<p class="whitespace-pre-wrap text-base-content">
						{actor.biography || $_('actor.biography.none')}
					</p>
				</div>
				<div class="mt-5">
					<h2 class="text-2xl font-semibold">{$_('actor.filmography.title')}</h2>
					<ul class="mt-2 grid gap-2">
						{#each sortByDate<Cast>(actor.combined_credits.cast) as movie}
							<li class="flex items-center gap-2">
								<span class="badge badge-accent"
									>{movie.release_date
										? new Date(movie.release_date).getFullYear()
										: $_('actor.filmography.releaseUnknown')}</span
								>
								<div>
									<span class="font-semibold">{movie.title || movie.name}</span>
									- {movie.character || $_('actor.filmography.roleUnknown')}
								</div>
							</li>
						{/each}
					</ul>
				</div>
				<div class="mt-5">
					<h2 class="text-2xl font-semibold">{$_('actor.crew.title')}</h2>
					<ul class="mt-2 grid gap-2">
						{#each sortByDate<Crew>(actor.combined_credits.crew) as crewItem}
							<li class="flex items-center gap-2">
								<span class="badge badge-secondary"
									>{crewItem.release_date
										? new Date(crewItem.release_date).getFullYear()
										: $_('actor.crew.releaseUnknown')}</span
								>
								<div>
									<span class="font-semibold">{crewItem.title || crewItem.name}</span>
									- {crewItem.job}
								</div>
							</li>
						{/each}
					</ul>
				</div>
			</div>
		</div>
	{/if}
</main>

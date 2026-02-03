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

	/* -----------------------------
	   Datum & Sortierung nach Jahr
	------------------------------ */

	function getItemDate(item: {
		release_date?: string | null;
		first_air_date?: string | null;
	}): Date | null {
		const date = item.release_date ?? item.first_air_date;
		if (!date) return null;

		const parsed = new Date(date);
		return isNaN(parsed.getTime()) ? null : parsed;
	}

	function sortByYearDesc<
		T extends {
			release_date?: string | null;
			first_air_date?: string | null;
		}
	>(items: T[]): T[] {
		return items.slice().sort((a, b) => {
			const dateA = getItemDate(a);
			const dateB = getItemDate(b);

			if (!dateA && !dateB) return 0;
			if (!dateA) return -1;
			if (!dateB) return 1;

			return dateB.getFullYear() - dateA.getFullYear();
		});
	}

	function groupByYear<
		T extends {
			release_date?: string | null;
			first_air_date?: string | null;
		}
	>(items: T[]) {
		const map = new Map<number | 'unknown', T[]>();

		for (const item of sortByYearDesc(items)) {
			const date = getItemDate(item);
			const year = date ? date.getFullYear() : 'unknown';

			if (!map.has(year)) map.set(year, []);
			map.get(year)!.push(item);
		}

		return map;
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
			rel="noopener noreferrer"
		>
			{m.openOnTMDB()}
		</a>
	{/snippet}
</Navbar>

<main class="flex flex-col items-center gap-6 px-4 py-6 md:px-6 lg:px-8">
	{#if data.result}
		{@const actor = data.result}

		<div class="grid w-full max-w-(--breakpoint-xl) grid-cols-1 gap-6 lg:grid-cols-[350px_1fr]">
			<!-- Sidebar -->
			<aside class="card bg-base-200 h-fit w-full p-5 shadow-md">
				<div class="flex flex-col items-center gap-4">
					<Img
						params={[actor.profile_path, 'actors', false]}
						alt={actor.name}
						class="w-full max-w-62.5 rounded-lg object-cover shadow-lg"
					/>

					<div class="w-full space-y-4 text-sm">
						<div>
							<span class="font-semibold">{m.knownFor()}:</span>
							<p>{actor.known_for_department || m.noInformationAvailable()}</p>
						</div>
						<div>
							<span class="font-semibold">{m.gender()}:</span>
							<p>{genderMapping[actor.gender]}</p>
						</div>
						<div>
							<span class="font-semibold">{m.birthdate()}:</span>
							<p>
								{#if actor.birthday}
									{@const birth = new Date(actor.birthday)}
									{@const end = actor.deathday ? new Date(actor.deathday) : new Date()}
									{@const age = end.getFullYear() - birth.getFullYear()}
									{birth.toLocaleDateString()} ({age})
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
					</div>
				</div>
			</aside>

			<!-- Main -->
			<section class="card bg-base-200 w-full p-5 shadow-md">
				<h1 class="text-3xl font-bold">{actor.name}</h1>

				<div class="mt-6 space-y-2">
					<h2 class="text-xl font-semibold">{m.biography()}</h2>
					{#if actor.biography}
						<p class="leading-relaxed whitespace-pre-wrap">{actor.biography}</p>
					{:else}
						<p class="text-base-content/70 italic">{m.noInformationAvailable()}</p>
					{/if}
				</div>

				<!-- Filmografie nach Jahr -->
				{#each ['cast', 'crew'] as const as type (type)}
					{@const grouped = groupByYear(actor.combined_credits[type])}

					{#if grouped.size > 0}
						<div class="mt-8 space-y-4">
							<h2 class="text-xl font-semibold">
								{type === 'cast' ? m.filmography() : m.crew()}
							</h2>

							{#each Array.from(grouped.entries()) as [year, items]}
								<h3 class="mt-4 text-lg font-semibold">
									{year === 'unknown' ? m.noInformationAvailable() : year}
								</h3>

								<ul class="space-y-2">
									{#each items as item (item.credit_id)}
										<li class="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
											<div class="flex items-center gap-2">
												<a
													href={`${item.media_type}?id=${item.id}`}
													class="inline-flex items-center gap-2 font-medium hover:underline"
													data-sveltekit-preload-data="tap"
												>
													{#if item.media_type === 'movie'}
														<Movie class="h-5 w-5" />
													{:else}
														<Tv class="h-5 w-5" />
													{/if}
													<span>{item.title || item.name}</span>
												</a>
												<span class="text-base-content/70 text-sm">–</span>
												<span class="text-base-content/70 text-sm">
													{type === 'cast'
														? item.character || m.noInformationAvailable()
														: item.job}
												</span>
											</div>
										</li>
									{/each}
								</ul>
							{/each}
						</div>
					{/if}
				{/each}
			</section>
		</div>
	{/if}
</main>

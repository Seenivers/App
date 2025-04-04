<script lang="ts">
	import { schema } from '$lib/db/schema';
	import Img from '$lib/image/Img.svelte';
	import Navbar from '$lib/Navbar.svelte';
	import type { Cardscale } from '$lib/types/cardscale';
	import type { PageData } from './$types';
	import { isMovieEntry } from '$lib/utils/is';
	import Card from '$lib/utils/card.svelte';
	import { _ } from 'svelte-i18n';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	let CARDSCALE: Cardscale = $state({
		aktiv: 2,
		sizes: [
			{ number: 1, size: 'Small' },
			{ number: 2, size: 'Medium' },
			{ number: 3, size: 'Large' }
		]
	});
</script>

<Navbar>
	{#snippet left()}
		<a href="./add" class="btn btn-ghost">{$_('main.nav.add')}</a>
	{/snippet}
	{#snippet right()}
		<a href="./settings" class="btn btn-ghost">{$_('main.nav.settings')}</a>
	{/snippet}
</Navbar>

<main class="z-0 flex-grow flex-col p-5">
	{#if data}
		<div class="flex flex-wrap justify-center gap-5 p-5 pb-20">
			{#each [data.collections, data.movies, data.series] as category}
				{#each category as item}
					{@const isCollection = 'parts' in item}
					{@const title = isMovieEntry(item) ? item.tmdb.title : item.tmdb?.name}
					{@const alt = $_('main.movies.posterAlt', { values: { title } })}

					{@const href = isCollection
						? `./collection?id=${item.id}`
						: `${isMovieEntry(item) ? './movie?id=' : './tv?id='}${item.id}`}

					<Card
						bind:CARDSCALE
						{title}
						{href}
						params={[isCollection ? item.poster_path : item.tmdb?.poster_path, 'posters', true]}
						{alt}
					/>
				{/each}
			{/each}
		</div>
	{:else}
		<div class="flex flex-col items-center space-y-4">
			<p>{$_('main.movies.noneAdded')}</p>
			<a href="./add" class="btn">Hinzufügen</a>
		</div>
	{/if}
</main>

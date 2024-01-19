<script lang="ts">
	import Navbar from '$lib/navbar.svelte';
	import { mediaLibrary } from '../ts/db';
	import { imageURL, placeholderURL } from '../ts/tmdb';
</script>

<Navbar />

<main class="flex gap-5 p-5 pb-36 flex-wrap h-fit">
	{#await $mediaLibrary}
		<p>Loading...</p>
	{:then element}
		{#if element && element.length > 0}
			{#each element as { tmdb, watched } (tmdb.id)}
				<a
					href="/{tmdb.id}"
					draggable="false"
					class="relative hover:bg-base-content/20 transition-all bg-base-100 h-fit w-72 rounded-2xl px-2 pt-2 duration-300 hover:scale-105"
				>
					{#if watched}
						<div class="z-9 absolute left-2 top-2 rounded-2xl bg-red-950 bg-opacity-90 px-2">
							<span>Angesehen</span>
						</div>
					{/if}
					<img
						src={tmdb.poster_path ? imageURL + tmdb.poster_path : placeholderURL}
						draggable="false"
						class="rounded-xl"
						alt="Cover"
					/>
					<span class=" w-72 text-lg text-balance text-center flex justify-center px-5">
						{tmdb.title}
					</span>
				</a>
			{/each}
		{:else}
			<div>
				<p>Keine Filme vorhanden</p>
				<br />
				<a href="add" class="btn">Füge jetzt welche hinzu</a>
			</div>
		{/if}
	{/await}
</main>

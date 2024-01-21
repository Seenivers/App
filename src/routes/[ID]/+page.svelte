<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { mediaLibrary } from '../../ts/db';
	import { open } from '@tauri-apps/api/shell';
	import { convertFileSrc } from '@tauri-apps/api/tauri';
	import { getMovie, imageURL } from '../../ts/tmdb';
	import { save } from '../../ts/dir';
	import Videoplayer from '$lib/videoplayer.svelte';

	let id: number = parseInt($page.params.ID);
	let data: Media;
	let newID: number = id;

	const unsubscribe = mediaLibrary.subscribe(async (value: Medias) => {
		if (id && value !== undefined) {
			// @ts-ignore
			data = value.find((value: Media) => value.tmdb.id === id);
		}
	});

	onDestroy(() => {
		unsubscribe();
	});

	function removeElementById() {
		mediaLibrary.update((library) => library.filter((item) => item.tmdb.id !== id));
		save();
		window.location.href = '/';
	}
</script>

<main class="h-fit w-full p-3 sm:p-10">
	{#if data}
		<div class="mx-auto w-full lg:w-[80%] xl:w-[50%]">		
				<Videoplayer src={convertFileSrc(data.path)} poster={imageURL + data.tmdb.backdrop_path}></Videoplayer>			
			<div>
				<a href="/" class="btn mb-2">Zurück</a>
				<button
					class="btn my-2"
					on:click={async () => {
						await open(data.path);
					}}
				>
					Starte Externen Player
				</button>
				<button class="btn" on:dblclick={removeElementById}>Löschen</button>
				<!-- svelte-ignore missing-declaration -->
				<button
					class="btn"
					on:click={() => {
						//@ts-ignore
						editModal.showModal();
					}}>Bearbeiten</button
				>
				<button
					class="btn"
					on:click={() => {
						mediaLibrary.update((library) => {
							return library.map((item) => {
								if (item.tmdb.id === id) {
									item.watched = !item.watched;
								}
								return item;
							});
						});
					}}>{data.watched ? 'Als Gesehen markieren' : 'Als Nicht Gesehen markieren'}</button
				>
			</div>

			<div>
				<h1 class="mb-2 text-2xl font-bold">{data.tmdb.title}</h1>
				{#if data.tmdb.tagline}
					<h2 class="mb-2 text-base font-bold">{data.tmdb.tagline}</h2>
				{/if}
				<br />
				{#if data.tmdb.vote_count}
					<div class="mb-2">
						<span class="font-bold">Stimmenanzahl:</span>
						<p>{data.tmdb.vote_count}</p>
					</div>
				{/if}
				{#if data.tmdb.vote_average}
					<div class="mb-2">
						<span class="font-bold">Durchschnittliche Bewertung:</span>
						<p>{data.tmdb.vote_average}</p>
					</div>
				{/if}
				<div class="mb-2 flex">
					<span class="mr-2 font-bold">Genres:</span>
					{#if data.tmdb.genres && data.tmdb.genres.length > 0}
						{#each data.tmdb.genres as genre (genre.id)}
							<span class="mr-2">{genre.name}</span>
						{/each}
					{:else}
						<span>Keine Informationen verfügbar</span>
					{/if}
				</div>
				<div class="mb-2">
					<span class="font-bold">Produktionsfirmen:</span>
					<ul>
						{#if data.tmdb.production_companies && data.tmdb.production_companies.length > 0}
							{#each data.tmdb.production_companies as company}
								<li>{company.name}</li>
							{/each}
						{:else}
							<li>Keine Informationen verfügbar</li>
						{/if}
					</ul>
				</div>
				<div class="mb-2">
					<span class="font-bold">Produktionsländer:</span>
					<ul>
						{#if data.tmdb.production_countries && data.tmdb.production_countries.length > 0}
							{#each data.tmdb.production_countries as country}
								<li>{country.name}</li>
							{/each}
						{:else}
							<li>Keine Informationen verfügbar</li>
						{/if}
					</ul>
				</div>
				{#if data.tmdb.release_date}
					<div class="mb-2">
						<span class="font-bold">Veröffentlichungsdatum:</span>
						<p>{data.tmdb.release_date}</p>
					</div>
				{/if}
				{#if data.tmdb.runtime}
					<div class="mb-2">
						<span class="font-bold">Laufzeit:</span>
						<p>{data.tmdb.runtime} Minuten</p>
					</div>
				{/if}
				{#if data.tmdb.popularity}
					<div class="mb-2">
						<span class="font-bold">Beliebtheit:</span>
						<p>{data.tmdb.popularity}</p>
					</div>
				{/if}
				{#if data.tmdb.overview}
					<div class="mb-2">
						<span class="font-bold">Handlung:</span>
						<p>{data.tmdb.overview}</p>
					</div>
				{/if}
			</div>
		</div>
	{:else}
		<div class="justify-center flex w-full h-full">
			<div class="grid gap-8">
				<span class=" text-5xl">Keine Daten</span>
				<a href="/" class="btn text-3xl">Zurück</a>
			</div>
		</div>
	{/if}
</main>

<dialog id="editModal" class="modal">
	<div class="modal-box">
		<form method="dialog">
			<button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
		</form>
		<h3 class="font-bold text-lg">Neue TMDB ID</h3>
		<!-- svelte-ignore missing-declaration -->
		<form
			on:submit={async () => {
				try {
					const newMovie = await getMovie(newID);
					const currentIndex = $mediaLibrary.findIndex((item) => item.tmdb.id === id);

					if (currentIndex !== -1) {
						mediaLibrary.update((library) => {
							library[currentIndex].tmdb = newMovie;
							return [...library];
						});

						save();

						// @ts-ignore
						editModal.close();
						window.location.href = newID.toString();
					}
				} catch (error) {
					alert('Diese TMDB ID ist falsch');
				}
			}}
			class="join"
		>
			<input
				class="input input-bordered join-item"
				type="number"
				placeholder="TMDB ID"
				id={id.toString()}
				bind:value={newID}
				required
			/>
			<button class="btn join-item" type="submit">Speichern</button>
		</form>
	</div>
</dialog>

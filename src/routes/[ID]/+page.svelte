<script lang="ts">
	import { page } from '$app/stores';
	import { onDestroy } from 'svelte';
	import { mediaLibrary } from '../../ts/db';
	import { open } from '@tauri-apps/api/shell';
	import { convertFileSrc } from '@tauri-apps/api/tauri';
	import { getMovie, imageURL } from '../../ts/tmdb';
	import { save } from '../../ts/dir';

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
			<div class="flex justify-center">
				<!-- svelte-ignore a11y-media-has-caption -->
				<video
					src={convertFileSrc(data.path)}
					poster={imageURL + data.tmdb.backdrop_path}
					controls
					controlsList="nodownload noremoteplayback"
				>
					Your browser does not support the video tag.
				</video>
			</div>
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
			</div>

			<div>
				<h1 class="mb-2 text-2xl font-bold">{data.tmdb.title}</h1>
				<h2 class="mb-2 text-base font-bold">{data.tmdb.tagline}</h2>
				<br />
				<div class="mb-2">
					<span class="font-bold">Stimmenanzahl:</span>
					<p>{data.tmdb.vote_count}</p>
				</div>
				<div class="mb-2">
					<span class="font-bold">Durchschnittliche Bewertung:</span>
					<p>{data.tmdb.vote_average}</p>
				</div>
				<div class="mb-2 flex">
					<span class="mr-2 font-bold">Genres:</span>
					{#each data.tmdb.genres as genre (genre.id)}
						<span class="mr-2">{genre.name}</span>
					{/each}
				</div>
				<div class="mb-2">
					<span class="font-bold">Produktionsfirmen:</span>
					<ul>
						{#each data.tmdb.production_companies ?? [] as company}
							<li>{company.name}</li>
						{/each}
					</ul>
				</div>
				<div class="mb-2">
					<span class="font-bold">Produktionsländer:</span>
					<ul>
						{#each data.tmdb.production_countries ?? [] as country}
							<li>{country.name}</li>
						{/each}
					</ul>
				</div>
				<div class="mb-2">
					<span class="font-bold">Veröffentlichungsdatum:</span>
					<p>{data.tmdb.release_date}</p>
				</div>
				<div class="mb-2">
					<span class="font-bold">Laufzeit:</span>
					<p>{data.tmdb.runtime} Minuten</p>
				</div>
				<div class="mb-2">
					<span class="font-bold">Beliebtheit:</span>
					<p>{data.tmdb.popularity}</p>
				</div>
				<div class="mb-2">
					<span class="font-bold">Handlung:</span>
					<p>{data.tmdb.overview}</p>
				</div>
			</div>
		</div>
	{:else}
		<span class="justify-center flex text-3xl w-full">Lade Daten</span>
		<a href="/" class="btn">Zurück</a>
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
				id="{id.toString()}"
				bind:value={newID}
				required
			/>
			<button class="btn join-item" type="submit">Speichern</button>
		</form>
	</div>
</dialog>

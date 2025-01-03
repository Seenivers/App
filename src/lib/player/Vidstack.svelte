<script lang="ts">
	import { eq } from 'drizzle-orm';
	import { db } from '../db/database';
	import { schema } from '../db/schema';
	import { onDestroy, onMount } from 'svelte';
	import { getMovie } from '$lib/db/funktion';
	import 'vidstack/bundle';
	import type { MediaPlayerElement } from 'vidstack/elements';
	import 'vidstack/player/styles/default/theme.css';
	import 'vidstack/player/styles/default/layouts/video.css';
	import { VidstackPlayer, VidstackPlayerLayout } from 'vidstack/global/player';

	interface Props {
		id: number;
		src: string;
		poster: string;
	}

	let { id, src, poster }: Props = $props(); // mp4, ogg, ogv, webm, mov, m4v
	let videoElement: HTMLVideoElement;
	let player: MediaPlayerElement;

	onMount(async () => {
		if (videoElement) {
			const movie = await getMovie(id); // Hole die Film-Daten
			console.log(movie?.watchTime ?? 0);

			player = await VidstackPlayer.create({
				target: videoElement,
				src,
				poster,
				load: 'idle',
				posterLoad: 'visible',
				currentTime: movie?.watchTime ?? 0,
				layout: new VidstackPlayerLayout({
					seekStep: 10
				}),
				logLevel: 'error',
				storage: 'vidstack'
			});
		}

		player.addEventListener('loaded-metadata', async (e) => {
			const movie = await getMovie(id); // Hole die Film-Daten
			if (movie && e.target && movie.watchTime && movie.watchTime > 0) {
				e.target.currentTime = movie?.watchTime ?? 0;
			}
		});

		player.addEventListener('pause', async () => {
			await save(); // Speichere den Status beim Pausieren
		});

		player.addEventListener('ended', async () => {
			await db
				.update(schema.movies)
				.set({ watched: true, watchTime: 0 })
				.where(eq(schema.movies.id, id));
		});
	});

	// Speicherlogik beim Verlassen der Komponente
	async function save() {
		if (player && player.currentTime && player.duration) {
			const watchTime = Math.max(0, Math.round(player.currentTime) - 2);

			// Datenbank aktualisieren
			await db.update(schema.movies).set({ watchTime }).where(eq(schema.movies.id, id));

			// Setzt "watched" auf true, wenn zu 85 % gesehen
			if (Math.round((player.currentTime / player.duration) * 100) >= 85) {
				await db.update(schema.movies).set({ watched: true }).where(eq(schema.movies.id, id));
			}
		}
	}

	onDestroy(() => {
		// This call will destroy the player and all child instances.
		player.destroy();
	});
</script>

<div class="select-none">
	<!-- svelte-ignore a11y_media_has_caption -->
	<!-- https://github.com/sveltejs/svelte/issues/5967#issuecomment-775297424 -->
	<video bind:this={videoElement} {src} {poster}>
		The video tag does not support from you device.
	</video>
</div>

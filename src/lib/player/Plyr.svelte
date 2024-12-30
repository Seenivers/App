<script lang="ts">
	import { eq } from 'drizzle-orm';
	import { db } from '../db/database';
	import { schema } from '../db/schema';
	import { onDestroy, onMount } from 'svelte';
	import { getMovie } from '$lib/db/funktion';
	import Plyr from 'plyr';
	import 'plyr/dist/plyr.css';
	import plyrSVG from '$lib/SVG/plyr.svg';
	import blankVideo from '$lib/videos/blank.mp4';

	interface Props {
		id: number;
		src: string;
		poster: string;
	}

	let { id, src, poster }: Props = $props();
	let videoElement: HTMLVideoElement;
	let player: Plyr;

	onMount(() => {
		player = new Plyr(videoElement, {
			controls: [
				'play-large', // The large play button in the center
				'play', // Play/pause playback
				'rewind', // Rewind by the seek time (default 10 seconds)
				'fast-forward', // Fast forward by the seek time (default 10 seconds)
				'progress', // The progress bar and scrubber for playback and buffering
				'current-time', // The current time of playback
				'duration', // The full duration of the media
				'mute', // Toggle mute
				'volume', // Volume control
				'captions', // Toggle captions
				'settings', // Settings menu
				'pip', // Picture-in-picture (currently Safari only)
				'airplay', // Airplay (currently Safari only)
				'fullscreen' // Toggle fullscreen
			],
			invertTime: false,
			keyboard: {
				focused: true,
				global: true
			},
			seekTime: 10,
			tooltips: { controls: true, seek: true },
			loadSprite: false,
			iconUrl: plyrSVG,
			settings: ['captions', 'quality', 'speed'],
			blankVideo: blankVideo
		});

		player.on('loadedmetadata', async () => {
			const movie = await getMovie(id); // Hole die Film-Daten
			if (movie && movie.watchTime && movie.watchTime > 0) {
				player.currentTime = movie.watchTime;
			}
		});

		player.on('pause', async () => {
			await save(); // Speichere den Status beim Pausieren
		});

		player.on('ended', async () => {
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

	// Ressourcen beim Zerstören der Komponente bereinigen
	onDestroy(() => {
		if (player) {
			save().then(() => {
				player.destroy();
			});
		}
	});
</script>

<div class="select-none">
	<!-- svelte-ignore a11y_media_has_caption -->
	<!-- https://github.com/sveltejs/svelte/issues/5967#issuecomment-775297424 -->
	<video bind:this={videoElement} {src} {poster}>
		The video tag does not support from you device.
	</video>
</div>

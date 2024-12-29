<script lang="ts">
	import { eq } from 'drizzle-orm';
	import { db } from '../db/database';
	import { schema } from '../db/schema';
	import { onDestroy, onMount } from 'svelte';
	import { getMovie } from '$lib/db/funktion';
	import Plyr from 'plyr';
	import 'plyr/dist/plyr.css';

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
			autopause: true,
			autoplay: false,
			controls: [
				'play-large',
				'play',
				'progress',
				'current-time',
				'mute',
				'volume',
				'captions',
				'settings',
				'pip',
				'airplay',
				'fullscreen'
			],
			hideControls: false,
			clickToPlay: true,
			disableContextMenu: true,
			displayDuration: true,
			iconPrefix: 'plyr',
			invertTime: false,
			keyboard: {
				focused: true,
				global: true
			},
			loop: { active: false },
			seekTime: 10,
			storage: { enabled: true, key: 'plyr' },
			tooltips: { controls: true, seek: true }
		});

		player.on('ready', async () => {
			const movie = await getMovie(id); // Hole die Film-Daten
			if (movie && movie.watchTime && movie.watchTime > 0) {
				videoElement.currentTime = movie.watchTime;
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

<!-- svelte-ignore a11y_media_has_caption -->
<!-- https://github.com/sveltejs/svelte/issues/5967#issuecomment-775297424 -->
<video bind:this={videoElement} {src} {poster}>
	The video tag does not support from you device.
</video>

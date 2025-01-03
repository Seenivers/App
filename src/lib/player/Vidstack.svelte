<script lang="ts">
	import { loadWatchTime, saveWatchTime, markAsWatched } from './videoUtils';
	import { onDestroy, onMount } from 'svelte';
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
			player = await VidstackPlayer.create({
				target: videoElement,
				src,
				poster,
				layout: new VidstackPlayerLayout({
					seekStep: 10
				}),
				logLevel: 'error',
				storage: 'vidstack'
			});

			player.addEventListener('loaded-metadata', async () => {
				await loadWatchTime(id, (time) => (player.currentTime = time));
			});

			player.addEventListener('pause', async () => {
				await saveWatchTime(id, player.currentTime, player.duration);
			});

			player.addEventListener('ended', async () => {
				await markAsWatched(id);
			});
		}
	});

	onDestroy(() => {
		saveWatchTime(id, player.currentTime, player.duration).finally(() => player.destroy());
	});
</script>

<div class="select-none">
	<!-- svelte-ignore a11y_media_has_caption -->
	<!-- https://github.com/sveltejs/svelte/issues/5967#issuecomment-775297424 -->
	<video bind:this={videoElement} {src} {poster}>
		The video tag does not support from you device.
	</video>
</div>

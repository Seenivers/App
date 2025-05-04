<script lang="ts">
	import Plyr from 'plyr';
	import 'plyr/dist/plyr.css';
	import plyrSVG from '$lib/SVG/plyr.svg';
	import blankVideo from '$lib/videos/blank.mp4';
	import { onMount, onDestroy } from 'svelte';
	import { loadWatchTime, saveWatchTime, markAsWatched } from './videoUtils';
	import type { MediaType } from '$lib/types/add';
	import { json } from 'svelte-i18n';

	interface Props {
		id: number;
		src: string;
		poster: string;
		type: MediaType;
	}

	let { id, src, poster, type }: Props = $props();
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
			blankVideo: blankVideo,
			i18n: $json('plyr')
		});

		player.on('loadedmetadata', async () => {
			await loadWatchTime(id, type, (time) => (player.currentTime = time));
		});

		player.on('pause', async () => {
			await saveWatchTime(id, type, player.currentTime, player.duration);
		});

		player.on('ended', async () => {
			await markAsWatched(id, type);
		});
	});

	onDestroy(() => {
		if (player) {
			saveWatchTime(id, type, player.currentTime, player.duration).finally(() => player.destroy());
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

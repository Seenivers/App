<script lang="ts">
	import { data } from './db';
	import { Back, Before, Fullscreen, Loudness, Paused, PictureInPicture, Play } from './SVG/index';
	import { newToast } from './toast/toast';

	export let index: number;
	let duration: number;
	export let src: string;
	export let poster: string;
	let currentTime = 0;
	let paused = true;
	let muted = false;
	let player: HTMLDivElement;
	let videoElement: HTMLVideoElement;
	let steuerElemente: boolean = false;
	let timeoutHandle: ReturnType<typeof setTimeout> | null = null;

	function format(seconds: number) {
		if (isNaN(seconds)) return '...';

		let hours = Math.floor(seconds / 60 / 60);
		let minutes = Math.floor((seconds / 60) % 60);
		seconds = Math.floor(seconds % 60);

		// Format using padStart to add leading zeros
		const formattedMinutes = minutes.toString().padStart(2, '0');
		const formattedSeconds = seconds.toString().padStart(2, '0');

		if (hours > 0) {
			const formattedHours = hours.toString().padStart(2, '0');
			return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
		} else {
			return `${formattedMinutes}:${formattedSeconds}`;
		}
	}

	function fullscreen() {
		if (document.fullscreenElement) {
			document.exitFullscreen().catch((err) => {
				console.error(err);
				newToast('error', 'Fehler beim Vollbildmodus verlassen.' + err);
			});
		} else {
			player.requestFullscreen();
		}
	}

	async function pictureInPicture() {
		if (document.pictureInPictureElement) {
			document.exitPictureInPicture().catch((err) => {
				console.error(err);
				newToast('error', 'Fehler beim Bild in Bild verlassen.' + err);
			});
		} else if (document.pictureInPictureEnabled) {
			videoElement.requestPictureInPicture();
		}
	}

	function elemente(player: MouseEvent) {
		// Aktiviert Steuerungs-Elemente
		steuerElemente = true;

		if (videoElement.ended || videoElement.paused) return;

		// Löscht den vorherigen Timer, falls vorhanden
		if (timeoutHandle) clearTimeout(timeoutHandle);

		// Setzt einen neuen Timer, der nach 3 Sekunden die Steuerungselemente deaktiviert
		timeoutHandle = setTimeout(() => {
			steuerElemente = false;
		}, 1000);
	}

	function save() {
		// Aktualisiert die aktuelle Wiedergabezeit
		$data.movies[index].watchTime = Math.round(currentTime) - 2;

		// Setzt 'watched' auf true, wenn der Film zu 85 % gesehen wurde
		if ($data.movies[index].watchTime > Math.round(0.85 * duration)) {
			$data.movies[index].watched = true;
		}

		$data.save();
	}

	function ended() {
		if (document.fullscreenElement) fullscreen();
		steuerElemente = true;
		$data.movies[index].watched = true;
		$data.movies[index].watchTime = 0;
		$data.save();
	}
</script>

<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
	class="relative z-0 flex select-none justify-center text-white"
	bind:this={player}
	on:mousemove={elemente}
>
	<!-- svelte-ignore a11y-media-has-caption https://github.com/sveltejs/svelte/issues/5967#issuecomment-775297424 -->
	<video
		bind:duration
		bind:currentTime
		bind:paused
		bind:muted
		bind:this={videoElement}
		on:pause={save}
		on:ended={ended}
		on:loadedmetadata={() => {
			videoElement.currentTime = $data.movies[index]?.watchTime;
		}}
		class="-z-50"
		{src}
		{poster}
	>
		The video tag does not support from you device.
	</video>
	<div
		class="absolute top-0 -z-40 h-full w-full transition-opacity duration-300 ease-in-out"
		class:opacity-0={!steuerElemente}
	>
		<div class="flex h-full w-full">
			<!-- ZURÜCK -->
			<div
				class="flex h-full w-5/12 place-items-center justify-center"
				on:dblclick={() => {
					currentTime -= 10;
				}}
			>
				<Back /> -10 zurück
			</div>
			<!-- PAUSE/PLAY -->
			<div class="flex h-full w-2/12 place-items-center justify-center">
				<div class=" flex h-20 w-20 scale-150 place-items-center justify-center rounded-full">
					<label class="swap">
						<input type="checkbox" id="pause" name="pause" bind:checked={paused} />
						<Paused />
						<Play />
					</label>
				</div>
			</div>
			<!-- VOR -->
			<div
				class="flex h-full w-5/12 place-items-center justify-center"
				on:dblclick={() => {
					currentTime += 30;
				}}
			>
				+30 vor
				<Before />
			</div>
		</div>
		<!-- LEISTE -->
		<div
			class="absolute bottom-0 h-fit w-full bg-gradient-to-t from-black/90 to-transparent px-2 pt-1"
		>
			<div class="flex items-center justify-between">
				<div>
					<span>{format(currentTime)}</span> / <span>{format(duration)}</span>
				</div>
				<div class="flex gap-2">
					<!-- Laustärke -->
					<button class="flex items-center">
						<label class="swap">
							<input type="checkbox" id="muted" name="muted" bind:checked={muted} />
							<Loudness />
						</label>
					</button>
					<!-- Bild in Bild -->
					<button class="flex cursor-pointer items-center" on:click={pictureInPicture}>
						<PictureInPicture />
					</button>
					<!-- Fullscreen -->
					<button class="flex items-center">
						<label class="swap">
							<input type="checkbox" id="fullscreen" name="fullscreen" on:change={fullscreen} />
							<Fullscreen />
						</label>
					</button>
				</div>
			</div>
			<!-- Leiste -->
			<input
				type="range"
				min="0"
				step="0.000001"
				max={duration}
				class="range range-xs"
				bind:value={currentTime}
			/>
		</div>
	</div>
</div>

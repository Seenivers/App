<script lang="ts">
	import { eq } from 'drizzle-orm';
	import { db } from '../db/database';
	import { schema } from '../db/schema';
	import { Back, Before, Fullscreen, Loudness, Paused, PictureInPicture, Play } from '../SVG/index';
	import { format, fullscreen, pictureInPicture } from '.';
	import { onDestroy } from 'svelte';

	let duration: number = $state(0);
	interface Props {
		id: number;
		src: string;
		poster: string;
	}

	let { id, src, poster }: Props = $props();
	let currentTime = $state(0);
	let paused = $state(true);
	let muted = $state(false);
	let player: HTMLDivElement;
	let videoElement: HTMLVideoElement;
	let steuerElemente: boolean = $state(false);
	let timeoutHandle: ReturnType<typeof setTimeout> | null = $state(null);

	function elemente() {
		if (!videoElement) return;

		// Aktiviert Steuerungs-Elemente
		steuerElemente = true;

		if (videoElement.ended || paused) return;

		// Löscht den vorherigen Timer, falls vorhanden
		if (timeoutHandle) clearTimeout(timeoutHandle);

		// Setzt einen neuen Timer, der nach 3 Sekunden die Steuerungselemente deaktiviert
		timeoutHandle = setTimeout(() => {
			steuerElemente = paused;
		}, 2000);
	}

	async function save() {
		// Berechnet die aktuelle Wiedergabezeit, mindestens 0
		const watchTime = Math.max(0, Math.round(currentTime) - 2);

		// Aktualisiert die aktuelle Wiedergabezeit
		await db.update(schema.movies).set({ watchTime }).where(eq(schema.movies.id, id));

		// Setzt 'watched' auf true, wenn der Film zu 85 % gesehen wurde
		if (Math.round(currentTime / duration) > 0.85) {
			await db.update(schema.movies).set({ watched: true }).where(eq(schema.movies.id, id));
		}
	}

	async function ended() {
		if (!player) return;
		if (document.fullscreenElement) fullscreen(player);
		steuerElemente = true;
		await db
			.update(schema.movies)
			.set({ watched: true, watchTime: 0 })
			.where(eq(schema.movies.id, id));
	}

	onDestroy(async () => {
		paused = true;
		// await save(); // da paused schon save() triggert
		muted = true;
	});
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="relative z-0 flex select-none justify-center text-white"
	bind:this={player}
	onmousemove={elemente}
>
	<!-- svelte-ignore a11y_media_has_caption -->
	<!-- https://github.com/sveltejs/svelte/issues/5967#issuecomment-775297424 -->
	<video
		bind:duration
		bind:currentTime
		bind:paused
		bind:muted
		bind:this={videoElement}
		onpause={save}
		onended={ended}
		onloadedmetadata={async () => {
			const watchTime = (await db.select().from(schema.movies).where(eq(schema.movies.id, id)))[0]
				.watchTime;

			if (watchTime > 0) {
				currentTime = watchTime;
			}
		}}
		class="-z-50"
		{src}
		{poster}
	>
		The video tag does not support from you device.
	</video>
	<div class="absolute top-0 -z-40 h-full w-full" class:hidden={!steuerElemente}>
		<div class="flex h-full w-full">
			<!-- ZURÜCK -->
			<div
				class="flex h-full w-5/12 place-items-center justify-center"
				ondblclick={() => {
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
				ondblclick={() => {
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
					<button
						class="flex cursor-pointer items-center"
						onclick={() => {
							if (videoElement) {
								pictureInPicture(videoElement);
							}
						}}
					>
						<PictureInPicture />
					</button>
					<!-- Fullscreen -->
					<button class="flex items-center">
						<label class="swap">
							<input
								type="checkbox"
								id="fullscreen"
								name="fullscreen"
								onchange={() => {
									if (player) {
										fullscreen(player);
									}
								}}
							/>
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

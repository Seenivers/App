<script lang="ts">
	let duration: number;
	export let src: string;
	export let poster: string;
	let time = 0;
	let paused = true;
	let muted = false;
	let player: HTMLDivElement;
	let video: HTMLVideoElement;
	let steuerElemente: boolean = false;
	let lastExecutionTime: number = 0;

	function format(seconds: number) {
		if (isNaN(seconds)) return '...';

		let stunden = Math.floor(seconds / 60 / 60);
		let minutes = Math.floor(seconds / 60 - 60 * stunden);
		seconds = Math.floor(seconds % 60);
		// @ts-ignore
		if (seconds < 10) seconds = '0' + seconds;
		// @ts-ignore
		if (minutes < 10) minutes = '0' + minutes;
		// @ts-ignore
		if (stunden < 10) stunden = '0' + stunden;

		return `${stunden}:${minutes}:${seconds}`;
	}

	function Fullscreen() {
		if (document.fullscreenElement) {
			document
				.exitFullscreen()
				.catch((err) => console.error(err));
		} else {
			player.requestFullscreen();
		}
	}

	async function PictureInPicture() {
		if (document.pictureInPictureElement) {
			document.exitPictureInPicture();
		} else if (document.pictureInPictureEnabled) {
			video.requestPictureInPicture();
		}
	}

	function elemente(player: MouseEvent) {
		const currentTime = player.timeStamp;
		if ((lastExecutionTime = 0)) {
			lastExecutionTime = currentTime - 1;
		}

		if (currentTime - lastExecutionTime >= 3000) {
			steuerElemente = false;

			setTimeout(() => {
				steuerElemente = true;
			}, 3000);

		}
    lastExecutionTime = currentTime;
	}
</script>

<div class="relative z-0 flex justify-center select-none" bind:this={player} on:mousemove={(e)=>{elemente(e);}}>
  <!-- svelte-ignore a11y-media-has-caption -->
  <video bind:duration bind:currentTime={time} bind:paused bind:muted bind:this={video} class="-z-50" src="{src}" poster="{poster}}">The video tag does not support from you device.</video>
  <div class="absolute top-0 -z-40 h-full w-full transition-opacity ease-in-out duration-300" class:opacity-0={steuerElemente}>
    <div class="flex h-full w-full">
      <!-- ZURÜCK -->
      <div class="flex h-full w-5/12 place-items-center justify-center" on:dblclick={()=>{time -= 10}}>
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mx-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061A1.125 1.125 0 0 1 21 8.689v8.122ZM11.25 16.811c0 .864-.933 1.406-1.683.977l-7.108-4.061a1.125 1.125 0 0 1 0-1.954l7.108-4.061a1.125 1.125 0 0 1 1.683.977v8.122Z" />
        </svg>10 zurück</div>
      <!-- PAUSE/PLAY -->
      <div class="flex h-full w-2/12 place-items-center justify-center"><div class=" w-20 h-20 scale-150 flex place-items-center justify-center rounded-full">
        <label class="swap">
          <input type="checkbox" bind:checked={paused} />
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="swap-on h-6 w-6 scale-150">
            <path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.347a1.125 1.125 0 0 1 0 1.972l-11.54 6.347a1.125 1.125 0 0 1-1.667-.986V5.653Z" />
          </svg>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="swap-off h-6 w-6 scale-150">
            <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 5.25v13.5m-7.5-13.5v13.5" />
          </svg>
        </label>
      </div></div>
      <!-- VOR -->
      <div class="flex h-full w-5/12 place-items-center justify-center" on:dblclick={()=>{time += 30}}>30 vor
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6 mx-1">
          <path stroke-linecap="round" stroke-linejoin="round" d="M3 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061A1.125 1.125 0 0 1 3 16.811V8.69ZM12.75 8.689c0-.864.933-1.406 1.683-.977l7.108 4.061a1.125 1.125 0 0 1 0 1.954l-7.108 4.061a1.125 1.125 0 0 1-1.683-.977V8.69Z" />
        </svg>
      </div>
    </div>
    <!-- footer -->
    <div class="absolute bottom-0 h-fit w-full px-2 pt-1 from-black/90 bg-gradient-to-t to-transparent">
      <div class="flex items-center justify-between">
        <div>
          <span>{format(time)}</span> / <span>{format(duration)}</span>
        </div>
        <div class="flex gap-2">
          <!-- Laustärke -->
          <button class="flex items-center">
            <label class="swap">
              <input type="checkbox" bind:checked={muted} />
              <svg class="swap-off h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M14,3.23V5.29C16.89,6.15 19,8.83 19,12C19,15.17 16.89,17.84 14,18.7V20.77C18,19.86 21,16.28 21,12C21,7.72 18,4.14 14,3.23M16.5,12C16.5,10.23 15.5,8.71 14,7.97V16C15.5,15.29 16.5,13.76 16.5,12M3,9V15H7L12,20V4L7,9H3Z" /></svg>
              <svg class="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M3,9H7L12,4V20L7,15H3V9M16.59,12L14,9.41L15.41,8L18,10.59L20.59,8L22,9.41L19.41,12L22,14.59L20.59,16L18,13.41L15.41,16L14,14.59L16.59,12Z" /></svg>
            </label>
          </button>
          <!-- Fullscreen -->
          <button class="flex items-center"  >
            <label class="swap">
              <input type="checkbox" on:change={Fullscreen}/>
              <svg class="swap-off h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
              <svg class="swap-on h-6 w-6 fill-current" xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px">
                <path d="M0 0h24v24H0z" fill="none" />
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            </label>
          </button>
          <!-- Bild in Bild -->
          <button class="flex items-center cursor-pointer" on:click={PictureInPicture}>
            <svg class="h- w-6 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <path d="M0 0h24v24H0V0z" fill="none" />
              <path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z" />
            </svg>
          </button>
        </div>
      </div>
      <!-- Leiste -->
      <input type="range" min="0" max="{duration}" class="range range-xs" bind:value={time} />
    </div>
  </div>
</div>
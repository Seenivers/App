<script async script lang="ts">
	import {
		checkUpdate,
		installUpdate,
		onUpdaterEvent,
		type UpdateResult
	} from '@tauri-apps/api/updater';
	import { relaunch } from '@tauri-apps/api/process';
	import { onMount } from 'svelte';

	let update: boolean = false;
	let data: UpdateResult;

	onMount(async () => {
		if (window.navigator.onLine) {
			data = await checkUpdate();

			if (data.shouldUpdate) {
				update = true;
			}
		} else {
			console.log('No internet connection');
		}
	});

	async function updateInstall() {
		const unlisten = await onUpdaterEvent(({ error, status }) => {
			console.log('Updater event', error, status);
		});

		try {
			await installUpdate();
			await relaunch();
		} catch (error) {
			console.error(error);
		}

		unlisten();
	}
</script>

{#if update && data}
	<div
		class="fixed bottom-5 right-5 h-fit w-80 rounded-md border border-neutral bg-neutral-content text-black z-10"
	>
		<span class="mx-3 text-lg">Eine neue Version ist Verfügbar</span>
		<div class="p-3">
			<div class="mb-3 grid">
				<span>Version: {data.manifest?.version}</span>
				<span>Hinweise zur Veröffentlichung: <br />{data.manifest?.body}</span>
			</div>
			<div>
				<span>Updatet Herunterladen</span>
				<div class="flex gap-2 w-fit">
					<button class="btn w-full" on:click={updateInstall}>JA</button>
					<button
						class="btn w-full"
						on:click={() => {
							update = false;
						}}>NEIN</button
					>
				</div>
			</div>
		</div>
	</div>
{/if}

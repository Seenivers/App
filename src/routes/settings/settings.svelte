<script lang="ts">
	import { schema } from '$lib/db/schema';
	import { settings } from '$lib/stores.svelte';
	import { newToast } from '$lib/toast/toast';
	import { themes } from '$lib';
	import { setTheme } from '$lib/utils/themeUtils';
	import { onDestroy } from 'svelte';
	import { settingsDB } from '$lib/utils/db/settings';
	import { _, locale, locales } from 'svelte-i18n';
	import { message, open } from '@tauri-apps/plugin-dialog';
	import { videoDir } from '@tauri-apps/api/path';
	import FolderOpen from '$lib/SVG/FolderOpen.svelte';
	import FolderAdd from '$lib/SVG/FolderAdd.svelte';
	import Close from '$lib/SVG/Close.svelte';
	import { auth } from '$lib/utils/authentication';
	import { exists } from '@tauri-apps/plugin-fs';
	import { confirm } from '@tauri-apps/plugin-dialog';

	let settingsTemp: typeof schema.settings.$inferSelect = $state({ ...settings });
	let isDirty = $state(false); // Überwachungsvariable für Änderungen

	// Schlüsselwörter verarbeiten und Änderung tracken
	function handleInput(event: Event, type: 'keywords' | 'ignoredKeywords') {
		const target = event.currentTarget as HTMLTextAreaElement | null;
		if (!target) return; // Falls target null ist, direkt beenden

		settingsTemp[type] = [...new Set(target.value.split(',').map((kw) => kw.trim()))];

		markDirty(); // Eine Änderung wurde vorgenommen
	}

	// Änderungen tracken für andere Formularelemente
	function markDirty() {
		isDirty = true;
	}

	onDestroy(async () => {
		if (isDirty) {
			Object.assign(settings, settingsTemp); // Eigenschaften von settingsTemp in settings kopieren
			await settingsDB.update(settings);
			isDirty = false; // Änderungen wurden gespeichert
			newToast('info', $_('settings.saved'));
		}
	});
</script>

<h1 class="mb-6 text-center text-xl font-bold md:text-left md:text-2xl">{$_('settings.title')}</h1>
<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
	<!-- Spracheinstellung -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.language')}</span>
		</div>
		<select
			class="select select-bordered w-full"
			bind:value={settingsTemp.language}
			onchange={() => {
				locale.set(settingsTemp.language);
				markDirty();
			}}
		>
			{#each $locales as lang}
				<option value={lang}>
					{new Intl.DisplayNames([settings.language, window.navigator.language], {
						type: 'language'
					}).of(lang)}
				</option>
			{/each}
		</select>
	</label>

	<!-- Inhalte für Erwachsene -->
	<label class="form-control flex w-full items-center justify-between">
		<span class=" label font-semibold">{$_('settings.adultContent')}</span>
		<input
			type="checkbox"
			class="toggle toggle-primary"
			bind:checked={settingsTemp.adult}
			onchange={markDirty}
		/>
	</label>

	<!-- Toast-Position (Horizontal) -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.toastPositionHorizontal')}</span>
		</div>
		<select
			class="select select-bordered w-full"
			bind:value={settingsTemp.toastPosition.horizontal}
			onchange={markDirty}
		>
			<option value="start">{$_('settings.left')}</option>
			<option value="center">{$_('settings.center')}</option>
			<option value="end">{$_('settings.right')}</option>
		</select>
	</label>

	<!-- Toast-Position (Vertikal) -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.toastPositionVertical')}</span>
		</div>
		<select
			class="select select-bordered w-full"
			bind:value={settingsTemp.toastPosition.vertical}
			onchange={markDirty}
		>
			<option value="top">{$_('settings.top')}</option>
			<option value="middle">{$_('settings.middle')}</option>
			<option value="bottom">{$_('settings.bottom')}</option>
		</select>
	</label>

	<!-- Video Player -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.videoPlayer')}</span>
		</div>
		<select
			class="select select-bordered w-full"
			bind:value={settingsTemp.player}
			onchange={markDirty}
		>
			<option value="Plyr">Plyr</option>
			<option value="Vidstack">Vidstack</option>
		</select>
	</label>

	<!-- Themen -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.theme')}</span>
		</div>
		<select
			class="select select-bordered w-full"
			bind:value={settingsTemp.theme}
			onchange={() => {
				setTheme(settingsTemp.theme);
				markDirty();
			}}
		>
			{#each themes as theme}
				<option value={theme.toLowerCase()}>{theme}</option>
			{/each}
		</select>
	</label>

	<!-- Auto Backup -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.autoBackup')}</span>
		</div>
		<select
			class="select select-bordered w-full"
			bind:value={settingsTemp.backupInterval}
			onchange={markDirty}
		>
			<option value="manual">{$_('manual')}</option>
			<option value="onStartup">{$_('onStartup')}</option>
			<option value="daily">{$_('daily')}</option>
			<option value="weekly">{$_('weekly')}</option>
			<option value="monthly">{$_('monthly')}</option>
		</select>
	</label>

	<!-- Maximales Alter der Backups (Tage) -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.backupMaxAgeDays')}</span>
		</div>
		<input
			type="number"
			class="input input-bordered w-full"
			bind:value={settingsTemp.backupConfig.maxAgeDays}
			onchange={markDirty}
			min="0"
			step="1"
		/>
	</label>

	<!-- Maximale Anzahl an Backups -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.backupMaxBackups')}</span>
		</div>
		<input
			type="number"
			class="input input-bordered w-full"
			bind:value={settingsTemp.backupConfig.maxBackups}
			onchange={markDirty}
			min="0"
			step="1"
		/>
	</label>

	<!-- Maximale Backup-Größe (MB) -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.backupMaxSizeMB')}</span>
		</div>
		<input
			type="number"
			class="input input-bordered w-full"
			bind:value={settingsTemp.backupConfig.maxSizeMB}
			onchange={markDirty}
			min="0"
			max="10000"
			step="50"
		/>
	</label>

	<!-- Anzahl der heruntergeladenen Schauspielerbilder -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.castImages')}</span>
		</div>
		<input
			type="range"
			min="-1"
			max="20"
			bind:value={settingsTemp.castImages}
			onchange={markDirty}
			class="range range-primary w-full"
			step="1"
		/>
		<div class="flex w-full justify-between px-2 text-xs">
			<span>
				{settingsTemp.castImages === -1
					? $_('settings.none')
					: settingsTemp.castImages === 0
						? $_('settings.all')
						: settingsTemp.castImages}
			</span>
		</div>
	</label>

	<!-- Discord RPC -->
	<label class="form-control flex w-full items-center justify-between">
		<span class="label font-semibold">{$_('settings.discordRpc')}</span>
		<input
			type="checkbox"
			class="toggle toggle-primary"
			bind:checked={settingsTemp.discordAktiv}
			onchange={markDirty}
		/>
	</label>

	<!-- TMDB Auth Sesson -->
	<label for="tmdbAuth" class="flex w-full items-center justify-between">
		<span class="label font-semibold">{$_('settings.tmdbAuthLabel')}</span>
		<button
			id="tmdbAuth"
			name="tmdbAuth"
			class="btn {settings.tmdbAccessToken ? 'btn-success' : 'btn-primary'}"
			onclick={async () => {
				if (settings.tmdbAccessToken) {
					if (!(await confirm($_('settings.confirmReauth'), { kind: 'warning' }))) return;
				}
				await auth();
				markDirty();
			}}
		>
			{settings.tmdbAccessToken ? $_('settings.reauthenticate') : $_('settings.tmdbAuthButton')}
		</button>
	</label>

	<!-- Schlüsselwörter -->
	<label class="form-control w-full lg:col-span-2">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.keywords')}</span>
		</div>
		<textarea
			class="textarea textarea-bordered h-20 w-full"
			placeholder={$_('settings.keywordsPlaceholder')}
			bind:value={settingsTemp.keywords}
			onchange={(event) => handleInput(event, 'keywords')}
		></textarea>
	</label>

	<!-- Ignorierte Schlüsselwörter -->
	<label class="form-control w-full lg:col-span-2">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.ignoredKeywords')}</span>
		</div>
		<textarea
			class="textarea textarea-bordered h-20 w-full"
			placeholder={$_('settings.keywordsPlaceholder')}
			bind:value={settingsTemp.ignoredKeywords}
			onchange={(event) => handleInput(event, 'ignoredKeywords')}
		></textarea>
	</label>

	<hr class="border-base-content col-span-2 m-0 w-full" />

	<div class="form-control col-span-2 w-full">
		<label for="watchPaths" class="label">
			<span class="label-text font-semibold">{$_('settings.watchPaths')}</span>
		</label>
		<p class="text-sm">{$_('settings.watchPathsHint')}</p>

		{#each settingsTemp.watchPaths, index}
			<div class="mb-2 flex items-center gap-2">
				<input
					type="text"
					class="input input-bordered flex-1 {settingsTemp.watchPaths[index].length === 0
						? 'input-error'
						: ''}"
					bind:value={settingsTemp.watchPaths[index]}
					onchange={async () => {
						if (
							settingsTemp.watchPaths[index].length !== 0 &&
							!(await exists(settingsTemp.watchPaths[index]))
						) {
							await message($_('folderNotFound'), {
								kind: 'error',
								title: $_('folderNotFoundTitle')
							});
						} else {
							markDirty();
						}
					}}
					placeholder="/path/to/folder"
				/>

				<button
					type="button"
					class="btn btn-square btn-sm btn-primary"
					title="Ordner auswählen"
					onclick={async () => {
						const folder = await open({
							multiple: false,
							directory: true,
							defaultPath: settingsTemp.watchPaths[index] ?? (await videoDir())
						});
						if (folder) {
							settingsTemp.watchPaths[index] = folder;
							markDirty();
						}
					}}
				>
					<FolderOpen class="stroke-base-var(--btn-fg) h-5 w-5" />
				</button>

				<button
					type="button"
					class="btn btn-square btn-sm btn-soft btn-error"
					title="Pfad entfernen"
					ondblclick={() => settingsTemp.watchPaths.splice(index, 1)}
				>
					<Close class="stroke-base-content h-6 w-6" />
				</button>
			</div>
		{/each}

		<button
			type="button"
			id="watchPaths"
			name="watchPaths"
			class="btn btn-primary"
			onclick={() => {
				settingsTemp.watchPaths.push('');
				markDirty();
			}}
		>
			<FolderAdd class="stroke-base-var(--btn-fg) h-6 w-6" />
			{$_('settings.addWatchPath')}
		</button>
	</div>
</div>

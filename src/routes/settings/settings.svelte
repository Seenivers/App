<script lang="ts">
	import { schema } from '$lib/db/schema';
	import { settings } from '$lib/stores.svelte';
	import { newToast } from '$lib/toast/toast';
	import { themes } from '$lib';
	import { setTheme } from '$lib/utils/themeUtils';
	import { onDestroy } from 'svelte';
	import { settingsDB } from '$lib/utils/db/settings';
	import { _, locale, locales } from 'svelte-i18n';

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
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.adultContent')}</span>
		</div>
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
			class="range"
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
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.discordRpc')}</span>
		</div>
		<input
			type="checkbox"
			class="toggle toggle-primary"
			bind:checked={settingsTemp.discordAktiv}
			onchange={markDirty}
		/>
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

	<!-- Schlüsselwörter -->
	<label class="form-control w-full lg:col-span-2">
		<div class="label">
			<span class="label-text font-semibold">{$_('settings.keywords')}</span>
		</div>
		<textarea
			class="textarea textarea-bordered h-32 w-full"
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
			class="textarea textarea-bordered h-32 w-full"
			placeholder={$_('settings.keywordsPlaceholder')}
			bind:value={settingsTemp.ignoredKeywords}
			onchange={(event) => handleInput(event, 'ignoredKeywords')}
		></textarea>
	</label>
</div>

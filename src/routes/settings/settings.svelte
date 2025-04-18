<script lang="ts">
	import { schema } from '$lib/db/schema';
	import { settings } from '$lib/stores.svelte';
	import { newToast } from '$lib/toast/toast';
	import { themes } from '$lib';
	import { setTheme } from '$lib/utils/themeUtils';
	import { onDestroy } from 'svelte';

	let settingsTemp: typeof schema.settings.$inferSelect = $state({ ...settings });
	let isDirty = $state(false); // Überwachungsvariable für Änderungen

	const languageSuggestions = Array.from(
		new Set(navigator.languages.map((lang) => lang.split('-')[0]))
	);

	// Schlüsselwörter verarbeiten und Änderung tracken
	function handleInput(event: Event, type: 'keywords' | 'ignoredKeywords') {
		const target = event.currentTarget as HTMLTextAreaElement | null;
		if (!target) return; // Falls target null ist, direkt beenden

		settingsTemp[type] = [...new Set(target.value.split(',').map((kw) => kw.trim()))];

		isDirty = true; // Eine Änderung wurde vorgenommen
	}

	// Änderungen tracken für andere Formularelemente
	function markDirty() {
		isDirty = true;
	}

	onDestroy(() => {
		// Automatisch Vorschläge aus navigator.languages generieren
		Object.assign(settings, settingsTemp); // Eigenschaften von settingsTemp in settings kopieren
		newToast('info', 'Einstellungen gespeichert!');
		isDirty = false; // Änderungen wurden gespeichert
	});
</script>

<h1 class="mb-6 text-center text-xl font-bold md:text-left md:text-2xl">Einstellungen</h1>
<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
	<!-- Spracheinstellung -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">Sprache</span>
		</div>
		<select
			class="select select-bordered w-full"
			bind:value={settingsTemp.language}
			onchange={markDirty}
		>
			{#each languageSuggestions as lang}
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
			<span class="label-text font-semibold">Inhalte für Erwachsene erlauben</span>
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
			<span class="label-text font-semibold">Alert-Position (Horizontal)</span>
		</div>
		<select
			class="select select-bordered w-full"
			bind:value={settingsTemp.toastPosition.horizontal}
			onchange={markDirty}
		>
			<option value="start">Links</option>
			<option value="center">Mitte</option>
			<option value="end">Rechts</option>
		</select>
	</label>

	<!-- Toast-Position (Vertikal) -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">Alert-Position (Vertikal)</span>
		</div>
		<select
			class="select select-bordered w-full"
			bind:value={settingsTemp.toastPosition.vertical}
			onchange={markDirty}
		>
			<option value="top">Oben</option>
			<option value="middle">Mitte</option>
			<option value="bottom">Unten</option>
		</select>
	</label>

	<!-- Video Player -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">Video Player</span>
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

	<!-- Anzahl der heruntergeladenen Schauspielerbilder -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">
				Anzahl der herunterzuladenden Schauspielerbilder
			</span>
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
					? 'Keine'
					: settingsTemp.castImages === 0
						? 'Alle'
						: settingsTemp.castImages}
			</span>
		</div>
	</label>

	<!-- Discord RPC -->
	<label class="form-control w-full">
		<div class="label">
			<span class="label-text font-semibold">Discord RPC aktivieren</span>
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
			<span class="label-text font-semibold">Themen</span>
		</div>
		<select
			class="select select-bordered"
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
			<span class="label-text font-semibold">Schlüsselwörter</span>
		</div>
		<textarea
			class="textarea textarea-bordered h-32 w-full"
			placeholder="Schlüsselwörter (kommagetrennt)"
			bind:value={settingsTemp.keywords}
			onchange={(event) => handleInput(event, 'keywords')}
		></textarea>
	</label>

	<!-- Ignorierte Schlüsselwörter -->
	<label class="form-control w-full lg:col-span-2">
		<div class="label">
			<span class="label-text font-semibold">Ignorierte Schlüsselwörter</span>
		</div>
		<textarea
			class="textarea textarea-bordered h-32 w-full"
			placeholder="Schlüsselwörter (kommagetrennt)"
			bind:value={settingsTemp.ignoredKeywords}
			onchange={(event) => handleInput(event, 'ignoredKeywords')}
		></textarea>
	</label>
</div>

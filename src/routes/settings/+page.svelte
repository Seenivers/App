<script lang="ts">
	import { db } from '$lib/db/database';
	import { schema } from '$lib/db/schema';
	import { eq } from 'drizzle-orm';
	import { settings as dbSettings } from '$lib/db/funktion';
	import { newToast } from '$lib/toast/toast';
	import { app } from '@tauri-apps/api';
	import Navbar from '$lib/Navbar.svelte';
	import { confirm } from '@tauri-apps/plugin-dialog';
	import { onMount } from 'svelte';
	import { discord } from '$lib/discord';
	import { themes } from '$lib';
	import { setTheme } from '$lib/themeUtils';

	let settings: typeof schema.settings.$inferSelect = $state(dbSettings);
	let isDirty = false; // Überwachungsvariable für Änderungen

	// Automatisch Vorschläge aus navigator.languages generieren
	const languageSuggestions = Array.from(
		new Set(navigator.languages.map((lang) => lang.split('-')[0]))
	);

	// Standard-Sprache auswählen
	settings.language = settings.language || languageSuggestions[0] || 'en'; // Fallback auf Englisch

	// Funktion zum Speichern der geänderten Einstellungen
	async function saveSettings() {
		await db.update(schema.settings).set(settings).where(eq(schema.settings.id, 1));
		newToast('info', 'Einstellungen gespeichert!');
		isDirty = false; // Änderungen wurden gespeichert
	}

	// Schlüsselwörter verarbeiten und Änderung tracken
	function handleInput(event: Event) {
		const target = event.currentTarget as HTMLTextAreaElement | null;
		if (target) {
			settings.keywords = target.value.split(',').map((kw) => kw.trim());
			isDirty = true; // Eine Änderung wurde vorgenommen
		}
	}

	// Änderungen tracken für andere Formularelemente
	function markDirty() {
		isDirty = true;
	}

	onMount(() => {
		discord();
	});
</script>

<Navbar
	back={true}
	onclick={async () => {
		if (isDirty) {
			if (!(await confirm('Du hast ungespeicherte Änderungen. Wirklich verlassen?'))) {
				return;
			}
		}
		window.history.length > 1 ? window.history.back() : (window.location.href = '/');
	}}
>
	{#snippet left()}
		<button class="btn btn-primary" onclick={saveSettings}>Speichern</button>
	{/snippet}
</Navbar>

<main class="xl:2/3 container z-0 mx-auto w-full flex-grow flex-col px-4 py-6 lg:w-4/5">
	<div class="card bg-base-100 p-6 shadow-lg md:p-8">
		<h1 class="mb-6 text-center text-xl font-bold md:text-left md:text-2xl">Einstellungen</h1>
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<!-- Spracheinstellung -->
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">Sprache</span>
				</div>
				<select
					class="select select-bordered w-full"
					bind:value={settings.language}
					onchange={markDirty}
				>
					{#each languageSuggestions as lang}
						<option value={lang}>{lang}</option>
					{/each}
				</select>
			</label>

			<!-- Inhalte für Erwachsene -->
			<div class="form-control justify-center">
				<label class="label cursor-pointer">
					<span class="label-text font-semibold">Inhalte für Erwachsene erlauben</span>
					<input
						type="checkbox"
						class="toggle toggle-primary"
						bind:checked={settings.adult}
						onchange={markDirty}
					/>
				</label>
			</div>

			<!-- Toast Position (Horizontal) -->
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">Alert-Position (Horizontal)</span>
				</div>
				<select
					class="select select-bordered w-full"
					bind:value={settings.toastPosition.horizontal}
					onchange={markDirty}
				>
					<option value="start">Links</option>
					<option value="center">Mitte</option>
					<option value="end">Rechts</option>
				</select>
			</label>

			<!-- Toast Position (Vertikal) -->
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">Alert-Position (Vertikal)</span>
				</div>
				<select
					class="select select-bordered w-full"
					bind:value={settings.toastPosition.vertical}
					onchange={markDirty}
				>
					<option value="top">Oben</option>
					<option value="middle">Mitte</option>
					<option value="bottom">Unten</option>
				</select>
			</label>

			<!-- Player -->
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">Video Player</span>
				</div>
				<select
					class="select select-bordered w-full"
					bind:value={settings.player}
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
					bind:value={settings.castImages}
					onchange={markDirty}
					class="range"
					step="1"
				/>
				<div class="flex w-full justify-between px-2 text-xs">
					<span>
						{settings.castImages === -1
							? 'Keine'
							: settings.castImages === 0
								? 'Alle'
								: settings.castImages}
					</span>
				</div>
			</label>

			<!-- Discord RPC -->
			<!-- if abfrage weil es db seitig noch nicht gibt -->
			{#if settings.discordAktiv}
				<div class="form-control justify-center">
					<label class="label cursor-pointer">
						<span class="label-text font-semibold">Discord RPC aktivieren</span>
						<input
							type="checkbox"
							class="toggle toggle-primary"
							bind:checked={settings.discordAktiv}
							onchange={markDirty}
						/>
					</label>
				</div>
			{/if}

			<!-- Themen -->
			{#if themes.map((theme) => theme).includes(settings.theme)}
				<label class="form-control w-full">
					<div class="label">
						<span class="label-text">Themen</span>
					</div>
					<select
						class="select select-bordered"
						onchange={() => {
							setTheme(settings.theme);
							markDirty();
						}}
						bind:value={settings.theme}
					>
						{#each themes as theme}
							<option value={theme.toLowerCase()}>{theme}</option>
						{/each}
					</select>
				</label>
			{/if}

			<!-- Schlüsselwörter -->
			<label class="form-control w-full lg:col-span-2">
				<div class="label">
					<span class="label-text font-semibold">Schlüsselwörter</span>
				</div>
				<textarea
					class="textarea textarea-bordered h-32 w-full"
					placeholder="Schlüsselwörter (kommagetrennt)"
					bind:value={settings.keywords}
					onchange={handleInput}
				></textarea>
			</label>
		</div>
	</div>
</main>

<footer class="footer footer-center bg-base-200 p-4 text-base-content">
	<aside>
		{#await app.getVersion() then version}
			<p>v{version}</p>
		{/await}
	</aside>
</footer>

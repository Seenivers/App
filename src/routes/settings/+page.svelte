<script lang="ts">
	import { db } from '$lib/db/database';
	import { schema } from '$lib/db/schema';
	import { eq } from 'drizzle-orm';
	import { settings as dbSettings } from '$lib/db/funktion';
	import { newToast } from '$lib/toast/toast';
	import { app } from '@tauri-apps/api';
	import Navbar from '$lib/Navbar.svelte';
	import { confirm } from '@tauri-apps/plugin-dialog';

	let settings: typeof schema.settings.$inferSelect = $state(dbSettings);
	let isDirty = false; // Überwachungsvariable für Änderungen

	// Automatisch Vorschläge aus navigator.languages generieren
	const languageSuggestions = Array.from(
		new Set(navigator.languages.map((lang) => lang.split('-')[0]))
	);

	// Standard-Sprache auswählen
	settings.language = settings.language || languageSuggestions[0] || 'en'; // Fallback auf Englisch

	// Einstellungen in der Datenbank aktualisieren
	async function updateSettings(newSettings: typeof schema.settings.$inferSelect) {
		await db.update(schema.settings).set(newSettings).where(eq(schema.settings.id, 1));
	}

	// Funktion zum Speichern der geänderten Einstellungen
	async function saveSettings() {
		await updateSettings(settings);
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
</script>

<Navbar
	back={true}
	onclick={async () => {
		if (isDirty) {
			if (!(await confirm('Du hast ungespeicherte Änderungen. Wirklich verlassen?'))) {
				return;
			}
		}
		window.location.href = '/';
	}}
>
	{#snippet left()}
		<button class="btn btn-primary" onclick={saveSettings}>Speichern</button>
	{/snippet}
</Navbar>

<main class="container z-0 mx-auto max-w-screen-md flex-grow flex-col px-4 py-6">
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

			<!-- Einstellung für Inhalte für Erwachsene -->
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

			<!-- Toast Position Einstellung (Horizontal) -->
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

			<!-- Toast Position Einstellung (Vertikal) -->
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

			<!-- Schlüsselwörter für Keywords -->
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

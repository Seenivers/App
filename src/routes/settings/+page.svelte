<script lang="ts">
	import { db } from '$lib/db/database';
	import { schema } from '$lib/db/schema';
	import { eq } from 'drizzle-orm';
	import { settings as dbSettings } from '$lib/db/funktion';
	import { newToast } from '$lib/toast/toast';

	let settings: typeof schema.settings.$inferSelect = dbSettings;

	// Einstellungen aktualisieren
	async function updateSettings(newSettings: typeof schema.settings.$inferSelect) {
		await db.update(schema.settings).set(newSettings).where(eq(schema.settings.id, 1));
	}

	// Funktion zum Speichern der geänderten Einstellungen
	async function saveSettings() {
		await updateSettings(settings);
		newToast('info', 'Einstellungen gespeichert!');
	}

	function handleInput(event: Event) {
		const target = event.currentTarget as HTMLTextAreaElement | null;
		if (target) {
			settings.keywords = target.value.split(',').map((kw) => kw.trim());
		}
	}
</script>

<nav class="navbar mb-4 bg-base-200 shadow-lg">
	<div class="px-4">
		<div class="flex items-center justify-between gap-3">
			<a href="/" class="btn btn-ghost text-lg font-semibold">Zurück</a>
			<button class="btn btn-primary" on:click={saveSettings}>Speichern</button>
		</div>
	</div>
</nav>

<main class="container mx-auto max-w-screen-md px-4 py-6">
	<div class="card bg-base-100 p-6 shadow-lg md:p-8">
		<h1 class="mb-6 text-center text-xl font-bold md:text-left md:text-2xl">Einstellungen</h1>
		<div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
			<!-- Spracheinstellung -->
			<label class="form-control w-full">
				<div class="label">
					<span class="label-text font-semibold">Sprache</span>
				</div>
				<select class="select select-bordered w-full" bind:value={settings.language}>
					<option value="en">Englisch</option>
					<option value="de">Deutsch</option>
				</select>
			</label>

			<!-- Einstellung für Inhalte für Erwachsene -->
			<div class="form-control justify-center">
				<label class="label cursor-pointer">
					<span class="label-text font-semibold">Inhalte für Erwachsene erlauben</span>
					<input type="checkbox" class="toggle toggle-primary" bind:checked={settings.adult} />
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
				<select class="select select-bordered w-full" bind:value={settings.toastPosition.vertical}>
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
					on:input={handleInput}
				></textarea>
			</label>
		</div>
	</div>
</main>

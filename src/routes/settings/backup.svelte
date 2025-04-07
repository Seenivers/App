<script lang="ts">
	import type { schema } from '$lib/db/schema';
	import { backup as backupfn } from '$lib/utils/backup';
	import { sep } from '@tauri-apps/api/path';
	import { onMount } from 'svelte';

	let backups: (typeof schema.backups.$inferSelect)[] = [];
	let separator: string = sep();

	// Backup-Liste beim Laden abrufen
	async function loadBackups() {
		backups = await backupfn.getAll();
	}

	// Neues Backup erstellen und Liste aktualisieren
	async function createBackup() {
		if (await backupfn.create()) {
			await loadBackups();
		}
	}

	// Backups validieren und Liste aktualisieren
	async function validateBackups() {
		if (await backupfn.validateBackups()) {
			await loadBackups();
		}
	}

	// Backup löschen und Liste aktualisieren
	async function deleteBackup(id: number) {
		if (await backupfn.delete(id)) {
			await loadBackups();
		}
	}

	// Extrahiert den Dateinamen aus einem Pfad
	function extractFileName(path: string) {
		return path.split(separator).pop();
	}

	// Helper-Funktion zur Prüfung, ob der Delete-Button deaktiviert sein soll
	function deleteDisabled(backup: { path: string }): boolean {
		return import.meta.env.DEV && !backup.path.includes('DEV-');
	}

	onMount(loadBackups);
</script>

<div class="flex items-center justify-between">
	<h1 class="mb-6 text-center text-xl font-bold md:text-left md:text-2xl">Backups</h1>
	<div class="flex gap-2">
		<button class="btn" onclick={validateBackups}>Backups validieren</button>
		<button class="btn" onclick={createBackup}>Backup erstellen</button>
	</div>
</div>

<div class="overflow-x-auto">
	<table class="table w-full">
		<thead>
			<tr>
				<th>ID</th>
				<th>Dateiname</th>
				<th>Erstellungsdatum</th>
				<th>Aktionen</th>
			</tr>
		</thead>
		<tbody>
			{#each backups as backup (backup.id)}
				<tr class="hover">
					<th>{backup.id}</th>
					<td>{extractFileName(backup.path)}</td>
					<td>{new Date(backup.createdAt).toLocaleString()}</td>
					<td class="flex gap-2">
						<button class="btn btn-sm" onclick={() => backupfn.restore(backup.id)}>
							Wiederherstellen
						</button>
						<button
							class="btn btn-sm hover:btn-error"
							disabled={deleteDisabled(backup)}
							onclick={() => deleteBackup(backup.id)}
						>
							Löschen
						</button>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

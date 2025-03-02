<script lang="ts">
	import type { schema } from '$lib/db/schema';
	import { backup as backupfn } from '$lib/utils/backup';
	import { onMount } from 'svelte';

	let backups: (typeof schema.backups.$inferSelect)[] = [];

	// Backup-Liste beim Laden abrufen
	async function loadBackups() {
		backups = await backupfn.getAll();
	}

	async function createBackup() {
		if (await backupfn.create()) {
			await loadBackups(); // Backup-Liste aktualisieren
		}
	}

	async function restoreBackup(id: number) {
		if (await backupfn.restore(id)) {
			await loadBackups(); // Optional: Nach Wiederherstellung Liste aktualisieren
		}
	}

	async function deleteBackup(id: number) {
		if (await backupfn.delete(id)) {
			await loadBackups(); // Backup-Liste aktualisieren
		}
	}

	function extractFileName(path: string) {
		const separator = path.includes('\\') ? '\\' : '/';
		return path.split(separator).pop();
	}

	onMount(loadBackups);
</script>

<div class="flex items-center justify-between">
	<h1 class="mb-6 text-center text-xl font-bold md:text-left md:text-2xl">Backup</h1>
	<button class="btn" on:click={createBackup}>Erstelle Backup</button>
</div>

<div class="overflow-x-auto">
	<table class="table">
		<thead>
			<tr>
				<th>ID</th>
				<th>Name</th>
				<th>Datum</th>
				<th></th>
			</tr>
		</thead>
		<tbody>
			{#each backups as backup}
				<tr class="hover">
					<th>{backup.id}</th>
					<td>{extractFileName(backup.path)}</td>
					<td>{new Date(backup.createdAt).toLocaleString()}</td>
					<td>
						<button class="btn btn-sm" on:click={() => restoreBackup(backup.id)}
							>Wiederherstellen</button
						>
						<button class="btn btn-sm hover:btn-error" on:click={() => deleteBackup(backup.id)}
							>Löschen</button
						>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

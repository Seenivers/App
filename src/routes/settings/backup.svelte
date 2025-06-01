<script lang="ts">
	import type { schema } from '$lib/db/schema';
	import { backup as backupfn, newDB } from '$lib/utils/backup';
	import { formatBytes } from '$lib/utils/utils';
	import { sep } from '@tauri-apps/api/path';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	let backups: (typeof schema.backups.$inferSelect)[] = [];
	let separator: string = sep();

	// Ruft die Backup-Liste beim Laden ab
	async function loadBackups() {
		backups = await backupfn.getAll();
	}

	// Erstellt ein neues Backup und aktualisiert die Liste
	async function createBackup() {
		if (await backupfn.create()) {
			await loadBackups();
		}
	}

	// Validiert alle Backups und aktualisiert die Liste
	async function validateBackups() {
		if (await backupfn.validateBackups()) {
			await loadBackups();
		}
	}

	// Löscht ein Backup anhand der ID und aktualisiert die Liste
	async function deleteBackup(id: number) {
		if (await backupfn.delete(id)) {
			await loadBackups();
		}
	}

	// Extrahiert den Dateinamen aus einem Pfad
	function extractFileName(path: string) {
		return path.split(separator).pop();
	}

	// Prüft, ob der Löschen-Button deaktiviert sein soll
	function deleteDisabled(backup: { path: string }): boolean {
		return import.meta.env.DEV && !backup.path.includes('DEV-');
	}

	onMount(loadBackups);
</script>

<div class="flex items-center justify-between">
	<h1 class="mb-6 text-center text-xl font-bold md:text-left md:text-2xl">{$_('backups.title')}</h1>
	<div class="flex gap-2">
		{#if import.meta.env.DEV}
			<button class="btn hover:btn-error" ondblclick={newDB}>{$_('backups.newDatabase')}</button>
		{/if}
		<button class="btn" onclick={validateBackups}>{$_('backups.validateBackups')}</button>
		<button class="btn" onclick={createBackup}>{$_('backups.createBackup')}</button>
	</div>
</div>

<div class="overflow-x-auto">
	<table class="table w-full">
		<thead>
			<tr>
				<th>{$_('id')}</th>
				<th>{$_('fileName')}</th>
				<th>{$_('creationDate')}</th>
				<th>{$_('size')}</th>
				<th>{$_('actions')}</th>
			</tr>
		</thead>
		<tbody>
			{#each backups as backup (backup.id)}
				<tr class="hover:bg-base-200">
					<th>{backup.id}</th>
					<td>{extractFileName(backup.path)}</td>
					<td>{new Date(backup.createdAt).toLocaleString()}</td>
					<td>{formatBytes(backup.size)}</td>
					<td>
						<div class="flex gap-2">
							<button class="btn btn-sm" onclick={() => backupfn.restore(backup.id)}>
								{$_('restore')}
							</button>
							<button
								class="btn btn-sm hover:btn-error"
								disabled={deleteDisabled(backup)}
								ondblclick={() => deleteBackup(backup.id)}
							>
								{$_('delete')}
							</button>
						</div>
					</td>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

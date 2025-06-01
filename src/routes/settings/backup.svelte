<script lang="ts">
	import type { schema } from '$lib/db/schema';
	import { backup as backupfn, newDB } from '$lib/utils/backup';
	import { formatBytes } from '$lib/utils/utils';
	import { sep } from '@tauri-apps/api/path';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	let backups: (typeof schema.backups.$inferSelect)[] = [];
	let separator: string = sep();

	// Sortier-Status
	let sortBy: 'id' | 'createdAt' | 'size' = 'id';
	let sortAsc = true;

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

	// Sortier-Funktion
	function sortBackups(by: 'id' | 'createdAt' | 'size') {
		if (sortBy === by) {
			sortAsc = !sortAsc;
		} else {
			sortBy = by;
			sortAsc = true;
		}
	}

	// Sortierte Kopie der Backups für die Anzeige
	$: sortedBackups = [...backups].sort((a, b) => {
		let result = 0;
		if (sortBy === 'id') result = a.id - b.id;
		if (sortBy === 'createdAt')
			result = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
		if (sortBy === 'size') result = (a.size ?? 0) - (b.size ?? 0);
		return sortAsc ? result : -result;
	});

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
				<th class="cursor-pointer" onclick={() => sortBackups('id')}>
					{$_('id')}
					{#if sortBy === 'id'}
						<span>{sortAsc ? '▲' : '▼'}</span>
					{/if}
				</th>
				<th>{$_('fileName')}</th>
				<th class="cursor-pointer" onclick={() => sortBackups('createdAt')}>
					{$_('creationDate')}
					{#if sortBy === 'createdAt'}
						<span>{sortAsc ? '▲' : '▼'}</span>
					{/if}
				</th>
				<th class="cursor-pointer" onclick={() => sortBackups('size')}>
					{$_('size')}
					{#if sortBy === 'size'}
						<span>{sortAsc ? '▲' : '▼'}</span>
					{/if}
				</th>
				<th>{$_('actions')}</th>
			</tr>
		</thead>
		<tbody>
			{#each sortedBackups as backup (backup.id)}
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

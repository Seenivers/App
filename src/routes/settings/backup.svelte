<script lang="ts">
	import type { BackupFile } from '$lib/utils/backup';
	import { backup as backupfn, newDB } from '$lib/utils/backup';
	import { formatBytes } from '$lib/utils/utils';
	import { onMount } from 'svelte';
	import { _ } from 'svelte-i18n';

	let backups: BackupFile[] = [];

	// Sortier-Status
	let sortBy: 'name' | 'createdAt' | 'size' = 'createdAt';
	let sortAsc = false;

	// Backups laden
	async function loadBackups() {
		backups = await backupfn.getAll();
	}

	// Backup erstellen
	async function createBackup() {
		if (await backupfn.create()) {
			await loadBackups();
		}
	}

	// Backup löschen (per Dateiname)
	async function deleteBackup(fileName: string) {
		if (await backupfn.delete(fileName)) {
			await loadBackups();
		}
	}

	// Restore (per Dateiname)
	async function restoreBackup(fileName: string) {
		await backupfn.restore(fileName);
	}

	// Löschen in DEV nur für DEV-Backups erlauben
	function deleteDisabled(backup: BackupFile): boolean {
		return import.meta.env.DEV && !backup.name.startsWith('DEV-');
	}

	// Sortierung umschalten
	function sortBackups(by: 'name' | 'createdAt' | 'size') {
		if (sortBy === by) {
			sortAsc = !sortAsc;
		} else {
			sortBy = by;
			sortAsc = true;
		}
	}

	// Sortierte Ansicht
	$: sortedBackups = [...backups].sort((a, b) => {
		let result = 0;

		if (sortBy === 'name') {
			result = a.name.localeCompare(b.name);
		}

		if (sortBy === 'createdAt') {
			result = a.createdAt.getTime() - b.createdAt.getTime();
		}

		if (sortBy === 'size') {
			result = a.size - b.size;
		}

		return sortAsc ? result : -result;
	});

	onMount(loadBackups);
</script>

<div class="flex items-center justify-between">
	<h1 class="mb-6 text-xl font-bold md:text-2xl">
		{$_('backups.title')}
	</h1>

	<div class="flex gap-2">
		{#if import.meta.env.DEV}
			<button class="btn hover:btn-error" ondblclick={newDB}>
				{$_('backups.newDatabase')}
			</button>
		{/if}

		<button class="btn" onclick={createBackup}>
			{$_('backups.createBackup')}
		</button>
	</div>
</div>

<div class="overflow-x-auto">
	<table class="table w-full">
		<thead>
			<tr>
				<th class="cursor-pointer" onclick={() => sortBackups('name')}>
					{$_('fileName')}
					{#if sortBy === 'name'}
						<span>{sortAsc ? '▲' : '▼'}</span>
					{/if}
				</th>

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
			{#each sortedBackups as backup (backup.name)}
				<tr class="hover:bg-base-200">
					<td>{backup.name}</td>
					<td>{backup.createdAt.toLocaleString()}</td>
					<td>{formatBytes(backup.size)}</td>
					<td>
						<div class="flex gap-2">
							<button class="btn btn-sm" onclick={() => restoreBackup(backup.name)}>
								{$_('restore')}
							</button>

							<button
								class="btn btn-sm hover:btn-error"
								disabled={deleteDisabled(backup)}
								ondblclick={() => deleteBackup(backup.name)}
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

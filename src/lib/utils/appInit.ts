import { getCurrentWebview } from '@tauri-apps/api/webview';
import { listen, type UnlistenFn } from '@tauri-apps/api/event';
import { settings } from '$lib/stores.svelte';
import { networkStatus } from '$lib/utils/networkStatus';
import { discord } from '$lib/utils/discord';
import { stop as stopDrpc } from 'tauri-plugin-drpc';
import { handleElements } from '$lib/utils/utils';
import { setTheme } from '$lib/utils/themeUtils';
import {
	collectAndProcessWatchedFiles,
	updateActors,
	updateCollections,
	updateMovies,
	updateOldDB
} from '$lib/db/update';
import { autoBackup, cleanupBackups } from '$lib/utils/autoBackup';
import { syncWatchlist } from '$lib/utils/tmdb/watchlist';
import { endClientSession, startClientSession } from '$lib/utils/telemetry';
import { online } from 'svelte/reactivity/window';

let handleCloseRequested: UnlistenFn | undefined;

export async function initApp() {
	const mainWindow = getCurrentWebview().label === 'main';

	if (settings) {
		setTheme(settings.theme);

		if (mainWindow) {
			await discord();
			startClientSession();
		}

		if (import.meta.env.PROD && mainWindow) {
			await autoBackup();
			await cleanupBackups();

			if (online.current) {
				await syncWatchlist();
				await updateOldDB();
				await updateMovies();
				await updateCollections();
				await updateActors();
				await collectAndProcessWatchedFiles();
			}
		}
	}

	networkStatus();

	handleElements();
	const observer = new MutationObserver(() => handleElements());
	observer.observe(document.body, { childList: true, subtree: true });

	console.debug('App loaded');

	handleCloseRequested = await listen('tauri://close-requested', destroyApp);
}

export async function destroyApp() {
	endClientSession();
	await stopDrpc();
	handleCloseRequested?.(); // Listener sauber entfernen
	console.debug('App closed');
}

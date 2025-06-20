import { online } from 'svelte/reactivity/window';
import { postAccessToken, postToken } from './tmdb';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { settingsDB } from './db/settings';
import { settings } from '$lib/stores.svelte';
import { error } from '@tauri-apps/plugin-log';
import { newToast } from '$lib/toast/toast';

const TMDB_AUTH_EVENT = 'tmdb-auth';

/**
 * Führt den TMDB-Authentifizierungs-Flow über ein Webview durch.
 */
export async function auth() {
	if (!online.current) return;

	const tokenResponse = await postToken();
	if (!tokenResponse.success) {
		error('Token konnte nicht erstellt werden.');
		newToast('error', 'Token konnte nicht erstellt werden.');
		return;
	}

	const webview = new WebviewWindow('tmdb-auth', {
		url: `https://www.themoviedb.org/auth/access?request_token=${tokenResponse.request_token}`,
		width: 1000,
		height: 800,
		title: 'TMDB Authentication'
	});

	webview.once('tauri://error', (e) => {
		error('WebviewWindow error: ' + JSON.stringify(e));
	});

	webview.emit(TMDB_AUTH_EVENT, 'data');

	const unlisten = await webview.listen(TMDB_AUTH_EVENT, async (e) => {
		if (e.event !== TMDB_AUTH_EVENT) return;

		const accessToken = await postAccessToken(tokenResponse.request_token);

		if (!accessToken.success || !accessToken.access_token) {
			newToast('error', 'TMDB Access Token konnte nicht erstellt werden.');
			return;
		}

		settingsDB.update({
			tmdbAccessToken: accessToken.access_token,
			tmdbAccountID: accessToken.account_id
		});

		settings.tmdbAccessToken = accessToken.access_token;
		settings.tmdbAccountID = accessToken.account_id;
		newToast('success', 'TMDB-Authentifizierung erfolgreich abgeschlossen.');
	});

	webview.once('tauri://destroyed', () => {
		unlisten();
	});
}

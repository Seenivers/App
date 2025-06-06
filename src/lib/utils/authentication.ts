import { online } from 'svelte/reactivity/window';
import { getToken } from './tmdb';
import { WebviewWindow } from '@tauri-apps/api/webviewWindow';
import { settingsDB } from './db/settings';
import { settings } from '$lib/stores.svelte';
import type { Session } from '$lib/types/authentication';
import { error, warn } from '@tauri-apps/plugin-log';
import { newToast } from '$lib/toast/toast';

/**
 * Führt den TMDB-Authentifizierungs-Flow über ein Webview durch.
 */
export async function auth() {
	if (!online.current) return;

	const tokenResponse = await getToken();

	if (!tokenResponse.success) {
		error('Token konnte nicht erstellt werden.');
		return;
	}

	const redirect = `${location.origin}/tmdb-auth`;

	const webview = new WebviewWindow('tmdb-auth', {
		url: `https://www.themoviedb.org/authenticate/${tokenResponse.request_token}?redirect_to=${redirect}`,
		width: 1000,
		height: 800,
		title: 'TMDB Authentication'
	});

	webview.once('tauri://error', (e) => {
		error('WebviewWindow error: ' + JSON.stringify(e));
	});

	// Beispiel-Emit an Backend (falls nötig, sonst weglassen)
	await webview.emit('tmdb-auth', 'data');

	// Event-Listener für auth-event
	const unlisten = await webview.listen<Session>('tmdb-auth', (event) => {
		const payload = event.payload;

		if (payload.success && payload.session_id) {
			settingsDB.update({ tmdbSessionId: payload.session_id });
			settings.tmdbSessionId = payload.session_id;
			newToast('success', 'TMDB-Authentifizierung erfolgreich abgeschlossen.');
		} else {
			warn('Ungültiges Session-Payload erhalten: ' + JSON.stringify(payload));
		}
	});

	webview.once('tauri://destroyed', () => {
		unlisten(); // Event-Listener entfernen
	});
}

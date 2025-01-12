import { newToast } from '$lib/toast/toast';
import { trace } from '@tauri-apps/plugin-log';
import { isOnline } from './stores.svelte';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

// Online-Status überwachen und Einstellungen aktualisieren
export function networkStatus() {
	ononline = () => {
		const message = get(_)('networkStatus.online');
		newToast('success', message);
		trace(message);
		isOnline.set(true);
	};

	onoffline = () => {
		const message = get(_)('networkStatus.offline');
		newToast('error', message);
		trace(message);
		isOnline.set(false);
	};
}

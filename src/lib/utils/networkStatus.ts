import { newToast } from '$lib/toast/toast';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

// Online-Status überwachen und Einstellungen aktualisieren
export function networkStatus() {
	ononline = () => {
		const message = get(_)('networkStatus.online');
		newToast('success', message);
		console.debug(message);
	};

	onoffline = () => {
		const message = get(_)('networkStatus.offline');
		newToast('error', message);
		console.debug(message);
	};
}

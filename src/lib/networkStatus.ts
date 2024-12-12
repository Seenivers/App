import { newToast } from '$lib/toast/toast';
import { trace } from '@tauri-apps/plugin-log';
import { isOnline } from './stores';

// Online-Status überwachen und Einstellungen aktualisieren
export function networkStatus() {
	ononline = () => {
		const message = 'You are connected to the internet.';
		newToast('success', message);
		trace(message);
		isOnline.set(true);
	};

	onoffline = () => {
		const message = 'You are not connected to the internet.';
		newToast('error', message);
		trace(message);
		isOnline.set(false);
	};
}

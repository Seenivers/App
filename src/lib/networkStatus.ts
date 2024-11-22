import { newToast } from './toast/toast';
import { trace } from '@tauri-apps/plugin-log';

// Online-Status überwachen und Einstellungen aktualisieren
export function networkStatus() {
	ononline = () => {
		const message = 'You are connected to the internet.';
		newToast('success', message);
		trace(message);
	};

	onoffline = () => {
		const message = 'You are not connected to the internet.';
		newToast('error', message);
		trace(message);
	};
}

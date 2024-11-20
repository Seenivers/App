import { newToast } from './toast/toast';

// Online-Status überwachen und Einstellungen aktualisieren
export function networkStatus() {
	ononline = () => {
		newToast('success', 'You are connected to the internet.');
	};

	onoffline = () => {
		newToast('error', 'You are not connected to the internet.');
	};
}

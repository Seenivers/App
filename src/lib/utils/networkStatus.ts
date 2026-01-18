import { newToast } from '$lib/toast/toast';
import { m } from '$lib/paraglide/messages';

// Online-Status überwachen und Einstellungen aktualisieren
export function networkStatus() {
	ononline = () => {
		const message = m['networkStatus.online']();
		newToast('success', message);
		console.debug(message);
	};

	onoffline = () => {
		const message = m['networkStatus.offline']();
		newToast('error', message);
		console.debug(message);
	};
}

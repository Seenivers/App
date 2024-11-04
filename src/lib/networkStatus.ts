import { data } from './db';
import { newToast } from './toast/toast';

// Online-Status überwachen und Einstellungen aktualisieren
export const onlineHandler = () => {
	newToast('success', 'You are connected to the internet.');
	data.update((currentData) => ({
		...currentData,
		settings: { ...currentData.settings, online: true } // Online-Status aktualisieren
	}));
};

export const offlineHandler = () => {
	newToast('error', 'You are not connected to the internet.');
	data.update((currentData) => ({
		...currentData,
		settings: { ...currentData.settings, online: false } // Online-Status aktualisieren
	}));
};

// Event-Listener für Online/Offline-Status hinzufügen
export async function addCustomEventListener() {
	window.addEventListener('online', onlineHandler);
	window.addEventListener('offline', offlineHandler);
}

// Aufräumen der Abonnements und Event-Listener beim Zerstören der Komponente
export function removeCustomEventListener() {
	window.removeEventListener('online', onlineHandler);
	window.removeEventListener('offline', offlineHandler);
}

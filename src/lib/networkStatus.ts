import { newToast } from './toast/toast';

// Online-Status überwachen und Einstellungen aktualisieren
export const onlineHandler = () => {
	newToast('success', 'You are connected to the internet.');
};

export const offlineHandler = () => {
	newToast('error', 'You are not connected to the internet.');
};

// Event-Listener für Online/Offline-Status hinzufügen
export function addCustomEventListener() {
	window.addEventListener('online', onlineHandler);
	window.addEventListener('offline', offlineHandler);
}

// Aufräumen der Abonnements und Event-Listener beim Zerstören der Komponente
export function removeCustomEventListener() {
	window.removeEventListener('online', onlineHandler);
	window.removeEventListener('offline', offlineHandler);
}

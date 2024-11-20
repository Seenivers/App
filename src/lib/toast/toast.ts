import { writable } from 'svelte/store';

type AlertType = 'info' | 'success' | 'warning' | 'error';

export const messages = writable<{ id: number; type: AlertType; text: string }[]>([]);
let messageIdCounter = 0; // Counter for unique message IDs

export function newToast(type: AlertType, text: string, duration: number = 30000) {
	// Füge zusätzliche Argumente an den Text an, falls vorhanden
	const newMessage = { id: messageIdCounter++, type, text: text };

	// Füge die neue Nachricht mit einer eindeutigen ID hinzu
	messages.update((messages) => [...messages, newMessage]);

	// Automatisch nach x oder 5 Sekunden entfernen
	setTimeout(() => {
		messages.update((messages) => messages.filter((message) => message.id !== newMessage.id));
	}, duration);
}

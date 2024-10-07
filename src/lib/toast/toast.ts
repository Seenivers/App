import { writable } from 'svelte/store';

type AlertType = 'info' | 'success' | 'warning' | 'error';

export const messages = writable<{ id: number; type: AlertType; text: string }[]>([]);
let messageIdCounter = 0; // Counter for unique message IDs

export function newToast(type: AlertType, text: string) {
	// Füge die neue Nachricht mit einer eindeutigen ID hinzu
	const newMessage = { id: messageIdCounter++, type, text };
	messages.update((messages) => [...messages, newMessage]);

	// Automatisch nach 3 Sekunden entfernen
	setTimeout(() => {
		messages.update((messages) => messages.filter((message) => message.id !== newMessage.id));
	}, 5000);
}

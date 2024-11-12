import { writable } from 'svelte/store';

type AlertType = 'info' | 'success' | 'warning' | 'error';

export const messages = writable<{ id: number; type: AlertType; text: string }[]>([]);
let messageIdCounter = 0; // Counter for unique message IDs

export function newToast(type: AlertType, text: string, ...args: string[]) {
	// Füge zusätzliche Argumente an den Text an, falls vorhanden
	const fullText = args.length > 0 ? `${text} ${args.join(' ')}` : text;
	const newMessage = { id: messageIdCounter++, type, text: fullText };

	// Füge die neue Nachricht mit einer eindeutigen ID hinzu
	messages.update((messages) => [...messages, newMessage]);

	// Automatisch nach 5 Sekunden entfernen
	setTimeout(() => {
		messages.update((messages) => messages.filter((message) => message.id !== newMessage.id));
	}, 5000);
}

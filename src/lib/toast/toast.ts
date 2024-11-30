import { writable } from 'svelte/store';

type AlertType = 'info' | 'success' | 'warning' | 'error';

interface Message {
	id: number;
	type: AlertType;
	text: string;
	duration: number;
}

export const messages = writable<Message[]>([]);
let messageIdCounter = 0; // Zähler für eindeutige Nachrichten-IDs

// Maximale Anzahl der gleichzeitig sichtbaren Nachrichten
const MAX_VISIBLE_MESSAGES = 20;
const queue: Message[] = [];

// Funktion zum Hinzufügen einer neuen Nachricht
export function newToast(type: AlertType, text: string, duration = 30000) {
	const newMessage: Message = { id: messageIdCounter++, type, text, duration };

	messages.update((currentMessages) => {
		if (currentMessages.length >= MAX_VISIBLE_MESSAGES) {
			// Nachricht in die Warteschlange verschieben, wenn das Limit erreicht ist
			queue.push(newMessage);
			return currentMessages;
		} else {
			// Neue Nachricht hinzufügen und Timeout starten
			timeout(newMessage);
			return [...currentMessages, newMessage];
		}
	});
}

// Funktion zum automatischen Entfernen der Nachricht nach der angegebenen Dauer
async function timeout(newMessage: Message) {
	await new Promise((resolve) => setTimeout(resolve, newMessage.duration));

	messages.update((currentMessages) => {
		const updatedMessages = currentMessages.filter((message) => message.id !== newMessage.id);

		// Zeige die nächste Nachricht aus der Warteschlange, falls Platz frei ist
		if (updatedMessages.length < MAX_VISIBLE_MESSAGES && queue.length > 0) {
			const nextMessage = queue.shift();
			if (nextMessage) {
				updatedMessages.push(nextMessage);
				timeout(nextMessage);
			}
		}

		return updatedMessages;
	});
}

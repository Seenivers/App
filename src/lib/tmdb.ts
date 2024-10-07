import { fetch } from '@tauri-apps/plugin-http';
import TMDB from '@blacktiger/tmdb';
import { data } from './db';
import { newToast } from './toast/toast';

const STATIC_KEY = '51baf525-2720-4c43-8d34-b759bb71ae88';
let apiKey: string | null = null; // Initialisiere apiKey als null
const language = () => {
	let lang = window.navigator.language; // Setze standardmäßige Sprache
	data.subscribe((data) => (lang = data.settings.language));
	return lang;
};

async function newApiKey() {
	const response = await fetch('https://seenivers.com/api/api-key', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ staticKey: STATIC_KEY }) // Verwende JSON.stringify
	});
	const result = await response.json();

	if (response.ok && result) {
		apiKey = result; // Weise den Wert von apiKey zu
		return true; // Erfolgreich abgerufen
	} else {
		console.error('Fehler beim Abrufen des API-Schlüssels:', result);
		newToast('error', 'Fehler beim Abrufen des API-Schlüssels.' + result);
		return false; // Fehler beim Abrufen
	}
}

// Definiere die tmdb-Instanz außerhalb der Funktion
let tmdb: TMDB;

// Stelle sicher, dass die Funktion aufgerufen wird
newApiKey().then((success) => {
	if (success && apiKey) {
		tmdb = new TMDB(apiKey, language()); // Initialisiere tmdb erst, wenn apiKey gesetzt ist
	} else {
		console.error('API-Key konnte nicht abgerufen werden.');
		newToast('error', 'API-Key konnte nicht abgerufen werden.');
	}
});

// Exportiere die tmdb-Instanz, wenn sie erfolgreich erstellt wurde
export { tmdb };

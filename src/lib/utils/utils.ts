import { openUrl } from '@tauri-apps/plugin-opener';

// Funktion, die Links mit target="_blank" mit der Tauri-Funktion "openUrl" behandelt und Bilder sowie Links nicht draggable macht
export function handleElements() {
	// Links mit target="_blank" behandeln
	document.querySelectorAll("a[target='_blank']").forEach((link) => {
		// Typen-Casting auf HTMLAnchorElement
		const anchorLink = link as HTMLAnchorElement;

		if (!anchorLink.dataset.tauriHandled) {
			// jetzt weiß TypeScript, dass anchorLink ein HTMLAnchorElement ist
			anchorLink.dataset.tauriHandled = 'true'; // Verhindert doppelte Event-Listener
			anchorLink.addEventListener('click', (event) => {
				event.preventDefault();
				openUrl(anchorLink.href); // Hier wird die href-Eigenschaft ohne Fehler verwendet
			});
		}

		// Sicherstellen, dass der Link nicht draggable ist
		anchorLink.setAttribute('draggable', 'false');
	});

	// Alle Bilder nicht draggable machen
	document.querySelectorAll('img').forEach((img) => {
		img.setAttribute('draggable', 'false');
	});
}

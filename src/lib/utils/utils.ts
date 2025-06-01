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

/**
 * Formatiert eine Byte-Größe in ein menschenlesbares Format.
 * @param bytes Anzahl der Bytes
 * @returns formatierte Größe (z.B. 2.3 MB)
 */
export function formatBytes(bytes: number): string {
	if (bytes === 0) return '0 B';
	const k = 1024;
	const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	const size = parseFloat((bytes / Math.pow(k, i)).toFixed(2));
	return `${size} ${sizes[i]}`;
}

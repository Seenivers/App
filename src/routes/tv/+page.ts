import { openUrl } from '@tauri-apps/plugin-opener';
import type { PageLoad } from './$types';
import { error } from '@sveltejs/kit';

export const load = (async ({ url }) => {
	const idParam = url.searchParams.get('id');

	// Überprüfe, ob die ID vorhanden ist
	if (!idParam) {
		error(302, 'Missing TV show ID');
	}

	try {
		// Öffne die URL mit der gegebenen ID
		await openUrl(`https://www.themoviedb.org/tv/${idParam}`);
	} catch (err) {
		// Fehlerbehandlung, falls die URL nicht geöffnet werden kann
		console.error('Error opening URL:', err);
	}

	// Gehe zurück oder leite auf die vorherige Seite weiter
	setTimeout(() => {
		window.history.back();
	}, 1000);
}) satisfies PageLoad;

import { openUrl } from '@tauri-apps/plugin-opener';
import type { PageLoad } from './$types';

export const load = (async ({ url }) => {
	const idParam = url.searchParams.get('id');
	openUrl(`https://www.themoviedb.org/tv/${idParam}`);
	setTimeout(() => {
		window.history.back();
	}, 100);
}) satisfies PageLoad;

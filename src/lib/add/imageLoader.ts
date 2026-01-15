import { image } from '$lib/image/image';
import type { Movie } from '$lib/types/movie';
import type { Episode } from '$lib/types/tv/episode';
import type { Season } from '$lib/types/tv/season';
import type { Serie } from '$lib/types/tv/serie';
import { getSettings } from '$lib/utils/settings/state';

export async function loadImages(result: Movie | Serie | Season | Episode) {
	// Helper-Funktion zum sicheren Laden eines Bildpfads
	async function loadImageIfExists(
		path: string | null | undefined,
		category: 'actors' | 'backdrops' | 'posters' | null
	) {
		if (path) {
			await image(path, category, true);
		}
	}

	// Poster und Backdrop laden, falls vorhanden
	await Promise.all([
		loadImageIfExists('poster_path' in result ? result.poster_path : null, 'posters'),
		loadImageIfExists('backdrop_path' in result ? result.backdrop_path : null, 'backdrops')
	]);

	// Cast-Bilder laden, begrenzt durch settings.castImages
	const castImagePaths = result.credits.cast
		.map((actor) => actor.profile_path)
		.filter(Boolean) as string[];

	const limit =
		getSettings().castImages === 0
			? castImagePaths.length
			: Math.min(getSettings().castImages, castImagePaths.length);

	// Paralleles Laden der Cast-Bilder für bessere Performance
	await Promise.all(castImagePaths.slice(0, limit).map((path) => image(path, 'actors', true)));
}

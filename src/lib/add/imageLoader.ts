import { image } from '$lib/image/image';
import { settings } from '$lib/stores.svelte';
import type { Movie } from '$lib/types/movie';
import type { Episode } from '$lib/types/tv/episode';
import type { Season } from '$lib/types/tv/season';
import type { Serie } from '$lib/types/tv/serie';

export async function loadImages(result: Movie | Serie | Season | Episode) {
	if ('poster_path' in result) {
		await image(result.poster_path, 'posters', true);
	}

	if ('backdrop_path' in result) {
		await image(result.backdrop_path, 'backdrops', true);
	}

	const castImagePaths = result.credits.cast
		.map((actor) => actor.profile_path)
		.filter((path) => path != null);

	const imagesToLoad =
		settings.castImages === 0
			? castImagePaths.length
			: Math.min(settings.castImages, castImagePaths.length);

	for (let i = 0; i < imagesToLoad; i++) {
		const path = castImagePaths[i];
		await image(path, 'actors', true);
	}
}

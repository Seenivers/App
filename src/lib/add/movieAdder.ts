import { online } from 'svelte/reactivity/window';
import { searchList } from '$lib/stores.svelte';
import { collection } from '$lib/utils/db/collection';
import { movie } from '$lib/utils/db/movie';
import { loadImages } from './imageLoader';
import { getCollectionDetails } from './mediaService';
import { updateSearchStatus } from './utils';
import { api } from '$lib/trpc';
import type { Movies } from '$lib/db/schema';
import { getLocale } from '$lib/paraglide/runtime';

export async function addNewMovies(entries: { id: number; index: number }[]) {
	if (!entries?.length || !online.current) return;

	const uniqueEntries: { id: number; index: number }[] = [];
	for (const { id, index } of entries) {
		if (await movie.isIDUnique(id)) {
			uniqueEntries.push({ id, index });
		} else {
			await movie.update(id, { path: searchList[index].options.path });
			updateSearchStatus(index, 'downloaded');
		}
	}

	if (uniqueEntries.length === 0) return;
	uniqueEntries.forEach(({ index }) => updateSearchStatus(index, 'downloading'));

	await Promise.all(
		uniqueEntries.map(async ({ id, index }) => {
			try {
				const result = await api.media.getMovieDetails.query({
					tmdbId: id,
					language: getLocale()
				});
				await addMovieToDatabase(result, index);
				updateSearchStatus(index, 'downloaded');
			} catch (err) {
				updateSearchStatus(index, 'notFound');
				console.error(
					`Fehler beim Abrufen von Film ${id}: ${err instanceof Error ? err.message : String(err)}`
				);
			}
		})
	);
}

export async function addMovieToDatabase(result: Movies['tmdb'], index: number) {
	await movie.add({
		id: result.id,
		path: searchList[index].options.path,
		tmdb: result
	});

	if (
		result.belongs_to_collection?.id &&
		(await collection.isIDUnique(result.belongs_to_collection.id))
	) {
		const collectionResult = await getCollectionDetails(result.belongs_to_collection.id);
		if (collectionResult) {
			await collection.add(collectionResult);
		}
	}

	await loadImages(result);
}

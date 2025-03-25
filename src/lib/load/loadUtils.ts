import { error } from '@sveltejs/kit';

/**
 * Parse and validate an ID from a URL.
 * @param url The URL object to extract the ID from.
 * @returns A valid numeric ID.
 * @throws An error if the ID is invalid or missing.
 */
export function parseId(url: URL): number {
	const idParam = url.searchParams.get('id');
	if (!idParam) {
		error(400, 'ID must be provided');
	}
	const parsedId = parseInt(idParam, 10);
	if (isNaN(parsedId)) {
		error(400, 'ID must be a valid number');
	}
	return parsedId;
}

export function parseSerieId(url: URL): number {
	const idParam = url.searchParams.get('tvShowID');
	if (!idParam) {
		error(400, 'Serien ID must be provided');
	}
	const parsedId = parseInt(idParam, 10);
	if (isNaN(parsedId)) {
		error(400, 'Serien ID must be a valid number');
	}
	return parsedId;
}

export function parseSeasonId(url: URL): number {
	const idParam = url.searchParams.get('seasonID');
	if (!idParam) {
		error(400, 'Season ID must be provided');
	}
	const parsedId = parseInt(idParam, 10);
	if (isNaN(parsedId)) {
		error(400, 'Season ID must be a valid number');
	}
	return parsedId;
}

export function parseSeasonNumber(url: URL): number {
	const idParam = url.searchParams.get('seasonNumber');
	if (!idParam) {
		error(400, 'Season Number must be provided');
	}
	const parsedId = parseInt(idParam, 10);
	if (isNaN(parsedId)) {
		error(400, 'Season Number must be a valid number');
	}
	return parsedId;
}

export function parseEpisodeId(url: URL): number {
	const idParam = url.searchParams.get('episodeID');
	if (!idParam) {
		error(400, 'Season ID must be provided');
	}
	const parsedId = parseInt(idParam, 10);
	if (isNaN(parsedId)) {
		error(400, 'Season ID must be a valid number');
	}
	return parsedId;
}

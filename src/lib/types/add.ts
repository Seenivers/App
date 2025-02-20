import type { Movie, Search } from './searchMovie';

/**
 * Represents the payload for a drag-and-drop operation,
 * including the file paths and the position where the drop occurs.
 */
export interface DropPayload {
	/** An array of file paths that are being dragged and dropped. */
	paths: string[];
	/** The position where the item is dropped, represented by x and y coordinates. */
	position: {
		/** The x-coordinate of the drop position. */
		x: number;
		/** The y-coordinate of the drop position. */
		y: number;
	};
}

type MediaType = 'movie' | 'tv';

/**
 * Represents the state of a movie search operation.
 * - `wait`: The search is on hold, waiting for the next action or condition to proceed.
 * - `searching`: The search is currently in progress.
 * - `notFound`: No results were found.
 * - `foundOne`: A single result was found.
 * - `foundMultiple`: Multiple results were found.
 * - `downloading`: Results are being downloaded.
 */
export type SearchStatus =
	| 'waitForSearching'
	| 'searching'
	| 'notFound'
	| 'foundMultiple'
	| 'waitForDownloading'
	| 'downloading'
	| 'downloaded';

/**
 * Options used to configure a movie search query.
 */
export interface SearchOptions {
	/** The API path or endpoint for the search. */
	path: string;
	/** The search file Name. */
	fileName: string;
	/** Whether to include adult content in the search results. */
	includeAdult: boolean;
	/** The primary release year of the movie (optional). */
	primaryReleaseYear?: string | number;
	/** The ID of the movie being searched for (optional). */
	id?: number;
}

/**
 * Represents the context of a movie search operation,
 * including its state, results, and search options.
 */
export interface SearchList {
	/** The current state of the search. */
	status: SearchStatus;
	/** The list of movie results returned by the search. */
	search: Search<Movie>; // <- `Movie` muss jetzt auch Serien unterstützen
	/** The search options used for the query. */
	options: SearchOptions;
	/** The type of media being searched for, either 'movie' or 'tv'. */
	mediaType: MediaType;
}

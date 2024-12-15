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

/**
 * Represents the state of a movie search operation.
 * - `wait`: The search is on hold, waiting for the next action or condition to proceed.
 * - `searching`: The search is currently in progress.
 * - `notFound`: No results were found.
 * - `foundOne`: A single result was found.
 * - `foundMultiple`: Multiple results were found.
 * - `downloading`: Results are being downloaded.
 */
export type MovieSearchState =
	| 'wait'
	| 'searching'
	| 'notFound'
	| 'foundOne'
	| 'foundMultiple'
	| 'downloading';

/**
 * Represents a single movie result from a search query.
 */
export interface MovieResult {
	/** Indicates if the movie is for adults only. */
	adult: boolean;
	/** The URL path to the movie's backdrop image (if available). */
	backdrop_path: string | null;
	/** Array of genre IDs associated with the movie. */
	genre_ids: number[];
	/** The unique identifier for the movie. */
	id: number;
	/** The original language of the movie. */
	original_language: string;
	/** The original title of the movie. */
	original_title: string;
	/** A brief summary or overview of the movie. */
	overview: string;
	/** The popularity score of the movie. */
	popularity: number;
	/** The URL path to the movie's poster image (if available). */
	poster_path: string | null;
	/** The release date of the movie in YYYY-MM-DD format. */
	release_date: string;
	/** The title of the movie. */
	title: string;
	/** Indicates if the movie is a video (e.g., a trailer or featurette). */
	video: boolean;
	/** The average vote score of the movie. */
	vote_average: number;
	/** The total number of votes for the movie. */
	vote_count: number;
}

/**
 * Options used to configure a movie search query.
 */
export interface SearchOptions {
	/** The API path or endpoint for the search. */
	path: string;
	/** The search query string (e.g., movie title). */
	query: string;
	/** Whether to include adult content in the search results. */
	includeAdult?: boolean;
	/** The primary release year of the movie (optional). */
	primaryReleaseYear?: string | number;
	/** The page number for paginated search results. */
	page: number;
	id?: number;
}

/**
 * Represents the context of a movie search operation,
 * including its state, results, and search options.
 */
export interface MovieSearchContext {
	/** The current state of the search. */
	state: MovieSearchState;
	/** The list of movie results returned by the search. */
	results: MovieResult[];
	/** The search options used for the query. */
	options: SearchOptions;
}

/**
 * Represents the scaling options for a movie card.
 * - `aktiv`: The active scale setting for the card.
 * - `sizes`: An array of size options for the card, each with a `number` and a corresponding `size` label.
 */
export interface Cardscale {
	/** The active scaling option for the card. Can be 1, 2, or 3. */
	aktiv: 1 | 2 | 3;
	/** An array of size options for the card, each with a `number` and a `size` label. */
	sizes: {
		/** The scale number (1, 2, or 3). */
		number: 1 | 2 | 3;
		/** The label for the card size, either 'Small', 'Medium', or 'Large'. */
		size: 'Small' | 'Medium' | 'Large';
	}[];
}

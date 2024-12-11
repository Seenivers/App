export interface DropPayload {
	paths: string[];
	position: {
		x: number;
		y: number;
	};
}

export type MovieSearchState =
	| 'notStarted'
	| 'searching'
	| 'notFound'
	| 'foundOne'
	| 'foundMultiple'
	| 'downloading';

export interface MovieResult {
	adult: boolean;
	backdrop_path: string | null;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string | null;
	release_date: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
}

export interface SearchOptions {
	path: string;
	query: string;
	includeAdult?: boolean;
	primaryReleaseYear?: string | number;
	page: number;
}

export interface MovieSearchContext {
	state: MovieSearchState;
	results: MovieResult[];
	options: SearchOptions;
}

export interface Cardscale {
	aktiv: 1 | 2 | 3;
	sizes: {
		number: 1 | 2 | 3;
		size: 'Small' | 'Medium' | 'Large';
	}[];
}

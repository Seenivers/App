export type DropPayload = {
	paths: string[];
	position: {
		x: number;
		y: number;
	};
};

export type SearchStatus = 'notStarted' | 'searching' | 'notFound' | 'foundOne' | 'foundMultiple';

export interface SearchResult {
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

export interface SearchParams {
	path: string;
	name: string;
	includeAdult?: boolean;
	primaryReleaseYear?: string | number;
	page: number;
}

export interface MovieSearchStatus {
	searchStatus: SearchStatus;
	searchResults: SearchResult[];
	searchParams: SearchParams;
}

export interface Search<T> {
	page: number;
	results: T[];
	total_pages: number;
	total_results: number;
}

export interface Movie {
	id: number;
	poster_path: string;
	adult: boolean;
	overview: string;
	release_date: string;
	genre_ids: number[];
	original_title: string;
	original_language: string;
	title: string;
	backdrop_path: string;
	popularity: number;
	vote_count: number;
	video: boolean;
	vote_average: number;
}

export interface TV {
	id: number;
	adult: boolean;
	name: string;
	first_air_date: string;
	backdrop_path: string;
	genre_ids: number[];
	origin_country: string[];
	original_language: string;
	original_name: string;
	overview: string;
	poster_path: string;
	popularity: number;
	vote_count: number;
	vote_average: number;
}

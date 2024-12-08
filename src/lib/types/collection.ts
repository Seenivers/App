import type { Movie } from '$lib/types/searchMovie';

export interface Collection {
	id: number;
	name: string;
	overview: string | null;
	poster_path: string;
	backdrop_path: string;
}
export interface CollectionDetails extends Collection {
	parts: Movie[];
}

export type Data = {
	settings: Settings;
	movies: Movie[];
	actors: Actor[];
	collections: Collection[];
	save: () => void;
};

export type Settings = {
	language: string;
	online: boolean;
	keywords: string[];
	adult: boolean;
	toastPosition: {
		horizontal: AlertPositionHorizontally;
		vertical: AlertPositionVertically;
	};
};

export type AlertPositionHorizontally =
	| 'start' // align horizontally to the left
	| 'center' // align horizontally to the center
	| 'end'; // align horizontally to the right (default)

export type AlertPositionVertically =
	| 'top' // align vertically to top
	| 'middle' // align vertically to middle
	| 'bottom'; // align vertically to bottom (default)

export type Movie = {
	path: string;
	watched: boolean;
	watchTime: number;
	adult: boolean;
	backdrop_path: string | null;
	belongs_to_collection: null | {
		id: number;
		name: string;
		poster_path: string | null;
		backdrop_path: string | null;
	};
	budget: number;
	genres: { id: number; name: string }[];
	homepage: string | null;
	id: number;
	imdb_id: string | null;
	original_language: string;
	original_title: string;
	overview: string | null;
	popularity: number;
	poster_path: string | null;
	production_companies: {
		id: number;
		logo_path: string | null;
		name: string;
		origin_country: string;
	}[];
	production_countries: {
		iso_3166_1: string;
		name: string;
	}[];
	release_date: string;
	revenue: number;
	runtime: number | null;
	spoken_languages: {
		english_name: string;
		iso_639_1: string;
		name: string;
	}[];
	status: string;
	tagline: string | null;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
};

export type Actor = {
	adult: boolean;
	also_known_as: string[];
	biography: string;
	birthday: null | string;
	deathday: null | string;
	/**
	 * Gender enumeration representing the following values:
	 *
	 * - `0`: Unknown - Geschlecht ist nicht angegeben oder unbekannt
	 * - `1`: Female - Weiblich
	 * - `2`: Male - Männlich
	 * - `3`: Non-binary - Nicht-binär
	 */
	gender: 0 | 1 | 2 | 3;
	homepage: null | string;
	id: number;
	imdb_id: string;
	known_for_department: string;
	name: string;
	place_of_birth: string;
	popularity: number;
	profile_path: string;
};

export type Collection = {
	id: number;
	name: string;
	overview: string;
	poster_path: string;
	backdrop_path: string;
	parts: [
		{
			adult: boolean;
			backdrop_path: string;
			id: number;
			title: string;
			original_language: string;
			original_title: string;
			overview: string;
			poster_path: string;
			media_type: string;
			genre_ids: number[];
			popularity: number;
			release_date: string;
			video: boolean;
			vote_average: number;
			vote_count: number;
		}
	];
};

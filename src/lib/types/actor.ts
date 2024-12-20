import type { Gender } from './movie';

export interface Actor {
	adult: boolean;
	also_known_as: string[];
	biography: string;
	birthday: Date | null;
	deathday: Date | null;
	gender: Gender;
	homepage: null | string;
	id: number;
	imdb_id: string;
	known_for_department: string;
	name: string;
	place_of_birth: null | string;
	popularity: number;
	profile_path: string;
	changes: Changes;
	combined_credits: CombinedCredits;
	external_ids: ExternalIDS;
}

interface Changes {
	changes: Change[];
}

interface Change {
	key: string;
	items: Item[];
}

interface Item {
	id: string;
	action: string;
	time: string;
	iso_639_1: string;
	iso_3166_1: string;
	value?: string;
	original_value?: string;
}

interface Cast {
	adult: boolean;
	backdrop_path: null | string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title?: string;
	overview: string;
	popularity: number;
	poster_path: null | string;
	release_date?: string;
	title?: string;
	video?: boolean;
	vote_average: number;
	vote_count: number;
	character?: string;
	credit_id: string;
	order?: number;
	media_type: string;
	origin_country?: string[];
	original_name?: string;
	first_air_date?: string;
	name?: string;
	episode_count?: number;
	department?: string;
	job?: string;
}

interface ExternalIDS {
	freebase_mid: null | string;
	freebase_id: null | string;
	imdb_id: null | string;
	tvrage_id: null | number;
	wikidata_id: null | string;
	facebook_id: null | string;
	instagram_id: null | string;
	tiktok_id: null | string;
	twitter_id: null | string;
	youtube_id: null | string;
}

interface CombinedCredits {
	cast: Cast[];
	crew: Crew[];
}

interface Crew {
	adult: boolean;
	backdrop_path: null | string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title?: string;
	overview: string;
	popularity: number;
	poster_path: null | string;
	release_date?: string;
	title?: string;
	video?: boolean;
	vote_average: number;
	vote_count: number;
	credit_id: string;
	department: string;
	job: string;
	media_type: string;
	origin_country?: string[];
	original_name?: string;
	first_air_date?: string;
	name?: string;
	episode_count?: number;
}

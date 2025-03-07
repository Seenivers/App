import type { Videos } from '../media_type';

export type Episode = {
	air_date: string;
	crew: Crew[];
	episode_number: number;
	guest_stars: Crew[];
	name: string;
	overview: string;
	id: number;
	production_code: string;
	runtime: number;
	season_number: number;
	still_path: string;
	vote_average: number;
	vote_count: number;
	credits: Credits;
	external_ids: ExternalIDS;
	images: Images;
	videos: Videos;
};

export type Credits = {
	cast: Crew[];
	crew: Crew[];
	guest_stars: Crew[];
};

export type Crew = {
	adult: boolean;
	gender: number;
	id: number;
	known_for_department: string;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: null | string;
	character?: string;
	credit_id: string;
	order?: number;
	job?: string;
	department?: string;
};

export type ExternalIDS = {
	imdb_id: string | null;
	freebase_mid: string | null;
	freebase_id: number | null;
	tvrage_id: string | null;
	wikidata_id: string | null;
};

export type Images = {
	stills: unknown[];
};

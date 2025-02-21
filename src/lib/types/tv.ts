import type { Gender, Department, ISO639_1, Videos, Genre, Status } from './media_type';

export type Serie = {
	adult: boolean;
	backdrop_path: string;
	created_by: CreatedBy[];
	episode_run_time: number[];
	first_air_date: string;
	genres: Genre[];
	homepage: string;
	id: number;
	in_production: boolean;
	languages: string[];
	last_air_date: string;
	last_episode_to_air: LastEpisodeToAir;
	name: string;
	next_episode_to_air: null;
	networks: Network[];
	number_of_episodes: number;
	number_of_seasons: number;
	origin_country: OriginCountry[];
	original_language: ISO639_1;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: Network[];
	production_countries: ProductionCountry[];
	seasons: Season[];
	spoken_languages: SpokenLanguage[];
	status: Status;
	tagline: string;
	type: string;
	vote_average: number;
	vote_count: number;
	aggregate_credits: Credits;
	credits: Credits;
	external_ids: ExternalIDS;
	keywords: Keywords;
	videos: Videos;
};

export type Credits = {
	cast: Cast[];
	crew: Cast[];
};

export type Cast = {
	adult: boolean;
	gender: Gender;
	id: number;
	known_for_department: Department;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: null | string;
	roles?: Role[];
	total_episode_count?: number;
	order?: number;
	jobs?: Job[];
	department?: Department;
	character?: string;
	credit_id?: string;
	job?: string;
};

export type Job = {
	credit_id: string;
	job: string;
	episode_count: number;
};

export type Role = {
	credit_id: string;
	character: string;
	episode_count: number;
};

export type CreatedBy = {
	id: number;
	credit_id: string;
	name: string;
	original_name: string;
	gender: Gender;
	profile_path: null | string;
};

export type ExternalIDS = {
	imdb_id: null | string;
	freebase_mid: null | string;
	freebase_id: null | string;
	tvdb_id: null | number;
	tvrage_id: null | string;
	wikidata_id: null | string;
	facebook_id: null | string;
	instagram_id: null | string;
	twitter_id: null | string;
};

export type Keywords = {
	results: Genre[];
};

export type LastEpisodeToAir = {
	id: number;
	name: string;
	overview: string;
	vote_average: number;
	vote_count: number;
	air_date: string;
	episode_number: number;
	episode_type: string;
	production_code: string;
	runtime: number;
	season_number: number;
	show_id: number;
	still_path: string;
};

export type Network = {
	id: number;
	logo_path: null | string;
	name: string;
	origin_country: OriginCountry;
};

export type OriginCountry = '' | 'US' | 'GB' | 'ZA';

export type ProductionCountry = {
	iso_3166_1: OriginCountry;
	name: string;
};

export type Season = {
	air_date: string | null;
	episode_count: number;
	id: number;
	name: string;
	overview: string;
	poster_path: string;
	season_number: number;
	vote_average: number;
};

export type SpokenLanguage = {
	english_name: string;
	iso_639_1: string;
	name: string;
};

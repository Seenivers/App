export type TopLevel = {
	adult: boolean;
	backdrop_path: string;
	created_by: CreatedBy[];
	episode_run_time: any[];
	first_air_date: Date;
	genres: Genre[];
	homepage: string;
	id: number;
	in_production: boolean;
	languages: string[];
	last_air_date: Date;
	last_episode_to_air: LastEpisodeToAir;
	name: string;
	next_episode_to_air: null;
	networks: Network[];
	number_of_episodes: number;
	number_of_seasons: number;
	origin_country: OriginCountry[];
	original_language: OriginalLanguage;
	original_name: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: Network[];
	production_countries: ProductionCountry[];
	seasons: Season[];
	spoken_languages: SpokenLanguage[];
	status: string;
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

/**
 * Gender enumeration representing the following values:
 *
 * - `0`: Unknown - Geschlecht ist nicht angegeben oder unbekannt
 * - `1`: Female - Weiblich
 * - `2`: Male - Männlich
 * - `3`: Non-binary - Nicht-binär
 */
export declare enum Gender {
	Unknown = 0,
	Female = 1,
	Male = 2,
	NonBinary = 3
}

export type Department =
	| 'Art'
	| 'Camera'
	| 'Costume & Make-Up'
	| 'Crew'
	| 'Directing'
	| 'Editing'
	| 'Production'
	| 'Sound'
	| 'Visual Effects'
	| 'Writing'
	| 'Acting'
	| 'Creator';

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

export type Genre = {
	id: number;
	name: string;
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
	air_date: Date;
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

export type OriginalLanguage = 'de' | 'en';

export type ProductionCountry = {
	iso_3166_1: OriginCountry;
	name: string;
};

export type Season = {
	air_date: Date | null;
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

export type Videos = {
	results: Result[];
};

export type Result = {
	iso_639_1: OriginalLanguage;
	iso_3166_1: ISO3166_1;
	name: string;
	key: string;
	site: 'YouTube';
	size: number;
	type: Type;
	official: boolean;
	published_at: Date;
	id: string;
};

export type ISO3166_1 = 'DE' | 'US';

export type Type = 'Trailer' | 'Featurette' | 'Behind the Scenes' | 'Teaser';

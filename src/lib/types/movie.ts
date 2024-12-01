export interface Movie {
	adult: boolean;
	backdrop_path: string;
	belongs_to_collection: BelongsToCollection | null;
	budget: number;
	genres: Genre[];
	homepage: string;
	id: number;
	imdb_id: string;
	origin_country: string[];
	original_language: string;
	original_title: string;
	overview: string;
	popularity: number;
	poster_path: string;
	production_companies: ProductionCompany[];
	production_countries: ProductionCountry[];
	release_date: string;
	revenue: number;
	runtime: number;
	spoken_languages: SpokenLanguage[];
	status: Status;
	tagline: string;
	title: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	credits: Credits;
	external_ids: ExternalIDS;
	images: Images;
	keywords: Keywords;
	release_dates: ReleaseDates;
	reviews: Reviews;
	videos: Videos;
}

export interface BelongsToCollection {
	id: number;
	name: string;
	poster_path: string;
	backdrop_path: string;
}

export interface Credits {
	cast: Cast[];
	crew: Cast[];
}

export interface Cast {
	adult: boolean;
	gender: Gender;
	id: number;
	known_for_department: Department;
	name: string;
	original_name: string;
	popularity: number;
	profile_path: null | string;
	cast_id?: number;
	character?: string;
	credit_id: string;
	order?: number;
	department?: Department;
	job?: string;
}

/**
 * Gender enumeration representing the following values:
 *
 * - `0`: Unknown - Geschlecht ist nicht angegeben oder unbekannt
 * - `1`: Female - Weiblich
 * - `2`: Male - Männlich
 * - `3`: Non-binary - Nicht-binär
 */
export enum Gender {
	Unknown = 0,
	Female = 1,
	Male = 2,
	NonBinary = 3
}

export type Department =
	| 'Acting'
	| 'Art'
	| 'Camera'
	| 'Costume & Make-Up'
	| 'Creator'
	| 'Crew'
	| 'Directing'
	| 'Editing'
	| 'Lighting'
	| 'Production'
	| 'Sound'
	| 'Visual Effects'
	| 'Writing';

export interface ExternalIDS {
	imdb_id: null | string;
	wikidata_id: null | string;
	facebook_id: null | string;
	instagram_id: null | string;
	twitter_id: null | string;
}

export interface Genre {
	id: number;
	name: string;
}

export interface Images {
	backdrops: Backdrop[];
	logos: Backdrop[];
	posters: Backdrop[];
}

export interface Backdrop {
	aspect_ratio: number;
	height: number;
	iso_639_1: ISO639_1;
	file_path: string;
	vote_average: number;
	vote_count: number;
	width: number;
}

export type ISO639_1 = 'de' | '' | 'en' | 'es' | 'fr' | 'it' | 'nl' | 'pt' | 'uk' | 'ur';

export interface Keywords {
	keywords: Genre[];
}

export interface ProductionCompany {
	id: number;
	logo_path: null | string;
	name: string;
	origin_country: string;
}

export interface ProductionCountry {
	iso_3166_1: string;
	name: string;
}

export interface ReleaseDates {
	results: ReleaseDatesResult[];
}

export interface ReleaseDatesResult {
	iso_3166_1: string;
	release_dates: ReleaseDate[];
}

export interface ReleaseDate {
	certification: string;
	descriptors: string[];
	iso_639_1: ISO639_1;
	note: string;
	release_date: string;
	type: number;
}

export interface Reviews {
	page: number;
	results: ReviewsResult[];
	total_pages: number;
	total_results: number;
}

export interface ReviewsResult {
	author: string;
	author_details: AuthorDetails;
	content: string;
	created_at: string;
	id: string;
	updated_at: string;
	url: string;
}

export interface AuthorDetails {
	name: string;
	username: string;
	avatar_path: null;
	rating: number | null;
}

export interface SpokenLanguage {
	english_name: string;
	iso_639_1: string;
	name: string;
}

export type Status = 'Released';

export interface Videos {
	results: VideosResult[];
}

export interface VideosResult {
	iso_639_1: ISO639_1;
	iso_3166_1: ISO3166_1;
	name: string;
	key: string;
	site: Site;
	size: number;
	type: Type;
	official: boolean;
	published_at: string;
	id: string;
}

export type ISO3166_1 = 'DE' | 'ES' | 'FR' | 'US';

export type Site = 'YouTube';

export type Type = 'Featurette' | 'Teaser' | 'Trailer';

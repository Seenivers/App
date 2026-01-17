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

export type Genre = {
	id: number;
	name: string;
};

export type Status = 'Released' | 'Rumored';

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

export type ISO639_1 = 'de' | '' | 'en' | 'es' | 'fr' | 'it' | 'nl' | 'pt' | 'uk' | 'ur';

export type ISO3166_1 = 'DE' | 'ES' | 'FR' | 'US';

export type Site = 'YouTube';

export type Type = 'Trailer' | 'Featurette' | 'Behind the Scenes' | 'Teaser';

export interface TMDBPostResult {
	status_code: number;
	status_message: string;
}

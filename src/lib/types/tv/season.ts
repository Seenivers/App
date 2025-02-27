import type { Videos } from '../media_type';
import type { Cast, Credits, ExternalIDS } from './tv';

export type Season = {
	_id: string;
	air_date: Date;
	episodes: Episode[];
	name: string;
	overview: string;
	id: number;
	poster_path: string;
	season_number: number;
	vote_average: number;
	aggregate_credits: Credits;
	credits: Credits;
	external_ids: ExternalIDS;
	images: Images;
	videos: Videos;
};

type Episode = {
	air_date: Date;
	episode_number: number;
	episode_type: string;
	id: number;
	name: string;
	overview: string;
	production_code: string;
	runtime: number;
	season_number: number;
	show_id: number;
	still_path: string;
	vote_average: number;
	vote_count: number;
	crew: Cast[];
	guest_stars: Cast[];
};

type Images = {
	posters: unknown[];
};

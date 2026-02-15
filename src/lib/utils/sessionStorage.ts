import type { CardscaleNumbers } from '$lib/types/cardscale';

// Typ für die Suchparameter
interface SearchCriteria {
	CARDSCALE: CardscaleNumbers;
	search: string;
	showCollections: boolean;
	showMovies: boolean;
	showSeries: boolean;
	sortOption: SortOption;
	selectedGenres: string[];
	watchedFilter: 'all' | 'watched' | 'unwatched';
}

export type SortOption =
	| 'added'
	| 'rating'
	| 'duration'
	| 'release_date_desc'
	| 'release_date_asc'
	| 'popularity'
	| 'alpha'
	| 'last_watched';

const defaultSearchCriteria: SearchCriteria = {
	CARDSCALE: 2,
	search: '',
	showCollections: false,
	showMovies: true,
	showSeries: true,
	sortOption: 'added',
	selectedGenres: [],
	watchedFilter: 'all'
};

export function getFilter() {
	const filter = sessionStorage.getItem('filter');

	let searchCriteria = defaultSearchCriteria;

	if (filter) {
		searchCriteria = JSON.parse(filter);
	}

	return searchCriteria;
}

export function setFilter(searchCriteria: SearchCriteria) {
	sessionStorage.setItem('filter', JSON.stringify(searchCriteria));
}

export function resetFilter() {
	return defaultSearchCriteria;
}

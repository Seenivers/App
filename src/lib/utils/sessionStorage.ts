import type { CardscaleNumbers } from '$lib/types/cardscale';

// Typ für die Suchparameter
interface SearchCriteria {
	CARDSCALE: CardscaleNumbers;
	search: string;
	showCollections: boolean;
	showMovies: boolean;
	showSeries: boolean;
	sortOption: 'added' | 'rating' | 'duration';
	selectedGenres: string[];
	watchedFilter: 'all' | 'watched' | 'unwatched';
}

export function getFilter() {
	const filter = sessionStorage.getItem('filter');

	let searchCriteria: SearchCriteria = {
		CARDSCALE: 2,
		search: '',
		showCollections: false,
		showMovies: true,
		showSeries: true,
		sortOption: 'added',
		selectedGenres: [],
		watchedFilter: 'all'
	};

	if (filter) {
		searchCriteria = JSON.parse(filter);
	}

	return searchCriteria;
}

export function setFilter(searchCriteria: SearchCriteria) {
	sessionStorage.setItem('filter', JSON.stringify(searchCriteria));
}

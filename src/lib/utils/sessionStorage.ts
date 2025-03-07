// Typ für die Suchparameter
export interface SearchCriteria {
	title: string;
	genre: string | null;
	isWatched: boolean | null;
}

export function getFilter() {
	const filter = sessionStorage.getItem('filter');

	let searchCriteria: SearchCriteria = {
		title: '',
		genre: null,
		isWatched: null
	};

	if (filter) {
		searchCriteria = JSON.parse(filter);
	}

	return searchCriteria;
}

export function setFilter(searchCriteria: SearchCriteria) {
	sessionStorage.setItem('filter', JSON.stringify(searchCriteria));
}

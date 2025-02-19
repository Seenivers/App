import type { MovieSearchStatus } from '$lib/types/add';

export function buttonClass(searchStatus: MovieSearchStatus) {
	switch (searchStatus) {
		case 'waitForSearching':
		case 'waitForDownloading':
			return 'btn-neutral';
		case 'searching':
			return 'btn-primary';
		case 'notFound':
			return 'btn-error';
		case 'foundMultiple':
			return 'btn-warning';
		case 'downloading':
			return 'btn-info';
		case 'downloaded':
			return 'btn-success';
		default:
			return 'btn-neutral';
	}
}

export function getIcon(searchStatus: MovieSearchStatus) {
	switch (searchStatus) {
		case 'waitForSearching':
		case 'waitForDownloading':
			return '⏳'; // loading icon
		case 'searching':
			return '🔍'; // search icon
		case 'notFound':
			return '❌'; // not found icon
		case 'foundMultiple':
			return '⚠️'; // multiple results icon
		case 'downloading':
			return '📥'; // downloading icon
		case 'downloaded':
			return '✅'; // found one icon
		default:
			return '❓'; // default icon
	}
}

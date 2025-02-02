import { NoImage } from '$lib/SVG';

export const placeholderURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(NoImage)}`;
export const imageURL = 'https://image.tmdb.org/t/p/original';
export const seeniversURL = 'https://seenivers.com';
export const plyr = ['mp4', 'webm', 'ogg'];
export const vidstack = ['mp4', 'ogg', 'ogv', 'webm', 'mov', 'm4v', 'm3u8'];
export const extensions = [...new Set([...plyr, ...vidstack])];
export const clearResultsOnLeave = false;
export const WEEKS = 4; // Anzahl der Wochen, nach der die Filme aktualisiert werden sollen
export const DiscordClientID = '1294754778756284477';

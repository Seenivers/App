import { NoImage } from './SVG';

export const placeholderURL = `data:image/svg+xml;charset=utf-8,${encodeURIComponent(NoImage)}`;
export const imageURL = 'https://image.tmdb.org/t/p/original';
export const seeniversURL = import.meta.env.DEV ? 'http://localhost:5173' : 'https://seenivers.com';

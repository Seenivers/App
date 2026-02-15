import Fuse from 'fuse.js';
import type { loadBatch } from './load';

type Batch = Awaited<ReturnType<typeof loadBatch>>;
type Item = Batch extends Array<infer T> ? T : never;

export type SearchItem = {
	ref: number;
	type: 'movie' | 'series' | 'collection';
	title: string;
	genres: string[];
};

export function buildIndex(items: Item[]) {
	const index: SearchItem[] = items.map((item) => {
		switch (item.type) {
			case 'movie':
				return {
					ref: item.id,
					type: item.type,
					title: item.tmdb.title,
					genres: item.tmdb.genres?.map((g) => g.name) ?? []
				};

			case 'series':
				return {
					ref: item.id,
					type: item.type,
					title: item.tmdb.name,
					genres: item.tmdb.genres?.map((g) => g.name) ?? []
				};

			case 'collection':
				return {
					ref: item.id,
					type: item.type,
					title: item.name,
					genres: []
				};
		}
	});

	const fuse = new Fuse(index, {
		keys: [
			{ name: 'title', weight: 0.8 },
			{ name: 'genres', weight: 0.2 }
		],
		threshold: 0.35,
		ignoreLocation: true
	});

	return { index, fuse };
}

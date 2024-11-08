import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

// https://developer.themoviedb.org/reference/person-details
export const actors = sqliteTable('actors', {
	id: int('id').notNull().primaryKey(),
	name: text('name').notNull(),
	profile_path: text('profile_path'),
	biography: text('biography').notNull(),
	adult: int('adult', { mode: 'boolean' }).notNull(),
	known_for_department: text('known_for_department'),
	birthday: int('birthday', { mode: 'timestamp' }),
	deathday: int('deathday', { mode: 'timestamp' }),
	also_known_as: text('also_known_as', { mode: 'json' }).notNull().$type<string[]>().default([]),
	gender: int('gender').$type<0 | 1 | 2 | 3>().notNull().default(0),
	homepage: text('homepage'),
	popularity: int('popularity'),
	imdb_id: text('imdb_id').notNull(),
	place_of_birth: int('place_of_birth', { mode: 'timestamp' })
});

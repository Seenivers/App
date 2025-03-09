import { eq } from 'drizzle-orm';
import { db } from '../db/database';
import { schema } from '../db/schema';
import { movie as movieDB } from '$lib/utils/db/movie';

/**
 * Lädt die gespeicherte Watch-Time und setzt sie, falls vorhanden.
 */
export async function loadWatchTime(id: number, setTime: (time: number) => void) {
	const movie = await movieDB.get(id);
	if (movie?.watchTime && movie.watchTime > 0) {
		setTime(movie.watchTime);
	}
}

/**
 * Speichert die aktuelle Watch-Time und setzt "watched" auf true, wenn der Film zu 85 % gesehen wurde.
 */
export async function saveWatchTime(id: number, currentTime: number, duration: number) {
	const watchTime = Math.max(0, Math.round(currentTime) - 2);

	// Aktualisiere die Watch-Time in der Datenbank
	await db.update(schema.movies).set({ watchTime }).where(eq(schema.movies.id, id));

	// Markiere den Film als "gesehen", wenn zu 85 % angeschaut
	if (Math.round((currentTime / duration) * 100) >= 85) {
		await db.update(schema.movies).set({ watched: true }).where(eq(schema.movies.id, id));
	}
}

/**
 * Setzt den Film auf "gesehen" und die Watch-Time auf 0.
 */
export async function markAsWatched(id: number) {
	await db
		.update(schema.movies)
		.set({ watched: true, watchTime: 0 })
		.where(eq(schema.movies.id, id));
}

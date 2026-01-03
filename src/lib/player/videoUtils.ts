import { eq } from 'drizzle-orm';
import { db } from '../db/database';
import { movie as movieDB } from '$lib/utils/db/movie';
import { episode as episodeDB } from '$lib/utils/db/episode';
import type { MediaType } from '$lib/types/add';
import { episode, movies } from '$lib/db/schema';

/**
 * Lädt die gespeicherte Watch-Time und setzt sie, falls vorhanden.
 */
export async function loadWatchTime(id: number, type: MediaType, setTime: (time: number) => void) {
	const video = type === 'movie' ? await movieDB.get(id) : await episodeDB.get(id);
	if (video?.watchTime && video.watchTime > 0) {
		setTime(video.watchTime);
	}
}

/**
 * Speichert die aktuelle Watch-Time und setzt "watched" auf true, wenn der Film zu 85 % gesehen wurde.
 */
export async function saveWatchTime(
	id: number,
	type: MediaType,
	currentTime: number,
	duration: number
) {
	const watchTime = Math.max(0, Math.round(currentTime) - 2);
	const newSchema = type === 'movie' ? movies : episode;

	// Aktualisiere die Watch-Time in der Datenbank
	await db.update(newSchema).set({ watchTime }).where(eq(newSchema.id, id));

	// Markiere den Film als "gesehen", wenn zu 85 % angeschaut
	if (Math.round((currentTime / duration) * 100) >= 85) {
		await db.update(newSchema).set({ watched: true }).where(eq(newSchema.id, id));
	}
}

/**
 * Setzt den Film auf "gesehen" und die Watch-Time auf 0.
 */
export async function markAsWatched(id: number, type: MediaType) {
	await db
		.update(type === 'movie' ? movies : episode)
		.set({ watched: true, watchTime: 0 })
		.where(eq(movies.id, id));
}

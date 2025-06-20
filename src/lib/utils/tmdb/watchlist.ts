import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';
import { movie } from '../db/movie';
import { serie } from '../db/serie';
import { getWatchlist, postWatchlist } from '../tmdb';
import { eq } from 'drizzle-orm';

export async function syncWatchlist() {
	// 📥 Remote-Watchlist von TMDB abrufen
	const remoteWatchlist = await getWatchlist();
	if (!remoteWatchlist) return;

	// 📦 IDs der Filme und Serien aus der Remote-Watchlist
	const remoteMovieIds = remoteWatchlist.movies.map((m) => m.id);
	const remoteSeriesIds = remoteWatchlist.tv.map((s) => s.id);

	// 📥 Lokale Filme und Serien abrufen, die in der Remote-Watchlist sind
	const [localMovies, localSeries] = await Promise.all([
		movie.getAll(remoteMovieIds),
		serie.getAll(remoteSeriesIds.map((id) => ({ seriesId: id })))
	]);

	// 📑 Alle lokalen Einträge sammeln, die als Watchlist markiert sind
	const [localWatchlistMovies, localWatchlistSeries] = await Promise.all([
		db
			.select({
				media_id: schema.movies.id
			})
			.from(schema.movies)
			.where(eq(schema.movies.wantsToWatch, true)),

		db
			.select({
				media_id: schema.serie.id
			})
			.from(schema.serie)
			.where(eq(schema.serie.wantsToWatch, true))
	]);

	// 🧹 Alle wantsToWatch-Flags lokal zurücksetzen
	await Promise.all([
		db.update(schema.movies).set({ wantsToWatch: false }).run(),
		db.update(schema.serie).set({ wantsToWatch: false }).run()
	]);

	// ✅ wantsToWatch: true für Filme und Serien aus der Remote-Watchlist
	await Promise.all([
		...localMovies.map((entry) => movie.update(entry.id, { wantsToWatch: true })),
		...localSeries.map((entry) => serie.update(entry.id, { wantsToWatch: true }))
	]);

	// 📤 Sync-Payload für TMDB vorbereiten
	const watchlistSyncPayload = [
		...localWatchlistMovies.map((movie) => ({
			media_type: 'movie' as const,
			media_id: movie.media_id,
			watchlist: true
		})),
		...localWatchlistSeries.map((serie) => ({
			media_type: 'tv' as const,
			media_id: serie.media_id,
			watchlist: true
		}))
	];

	// 📤 Watchlist-Payload an TMDB senden
	await Promise.all(watchlistSyncPayload.map((entry) => postWatchlist(entry)));
}

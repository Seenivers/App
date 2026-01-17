import { db } from '$lib/db/database';
import { movies as schemaMovies, serie as schemaSerie } from '$lib/db/schema';
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
		serie.getAll(remoteSeriesIds)
	]);

	// 📑 Alle lokalen Einträge sammeln, die als Watchlist markiert sind
	const [localWatchlistMovies, localWatchlistSeries] = await Promise.all([
		db
			.select({
				media_id: schemaMovies.id,
				tmdb: schemaMovies.tmdb
			})
			.from(schemaMovies)
			.where(eq(schemaMovies.wantsToWatch, true)),

		db
			.select({
				media_id: schemaSerie.id,
				tmdb: schemaSerie.tmdb
			})
			.from(schemaSerie)
			.where(eq(schemaSerie.wantsToWatch, true))
	]);

	// 🧹 Alle wantsToWatch-Flags lokal zurücksetzen
	await Promise.all([
		db.update(schemaMovies).set({ wantsToWatch: false }).run(),
		db.update(schemaSerie).set({ wantsToWatch: false }).run()
	]);

	// ✅ wantsToWatch: true für Filme und Serien aus der Remote-Watchlist
	await Promise.all([
		...localMovies.map((entry) => movie.update(entry.id, { wantsToWatch: true })),
		...localSeries.map((entry) => serie.update(entry.id, { wantsToWatch: true }))
	]);

	// 📤 Sync-Payload für TMDB vorbereiten
	const watchlistSyncPayload = [
		...localWatchlistMovies
			// TMDB liefert bei manchen Filmen nur einen "Rumored"-Eintrag.
			// Diese Filme existieren nicht offiziell, daher würde ein API-Aufruf zur Watchlist einen 404-Fehler erzeugen.
			// Deshalb überspringen wir diese Filme, um Fehler zu vermeiden.
			.filter((m) => m.tmdb.status !== 'Rumored')
			.map((movie) => ({
				media_type: 'movie' as const,
				media_id: movie.media_id,
				watchlist: true
			})),
		...localWatchlistSeries
			// TMDB liefert bei manchen Serien nur einen "Rumored"-Eintrag.
			// Diese Serie existieren nicht offiziell, daher würde ein API-Aufruf zur Watchlist einen 404-Fehler erzeugen.
			// Deshalb überspringen wir diese Serie, um Fehler zu vermeiden.
			.filter((s) => s.tmdb.status !== 'Rumored')
			.map((serie) => ({
				media_type: 'tv' as const,
				media_id: serie.media_id,
				watchlist: true
			}))
	];

	// 📤 Watchlist-Payload an TMDB senden
	await Promise.all(watchlistSyncPayload.map((entry) => postWatchlist(entry)));
}

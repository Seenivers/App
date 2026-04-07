import { db } from '$lib/db/database';
import { movies as schemaMovies, serie as schemaSerie } from '$lib/db/schema';
import { api } from '$lib/trpc';
import { eq } from 'drizzle-orm';
import { clearUserSession, getUserSession } from '../auth/session';

export async function syncWatchlist() {
	if (!getUserSession().loggedIn) return false;

	let remoteWatchlist: null | Awaited<ReturnType<typeof api.sync.getWatchlist.query>>;

	try {
		remoteWatchlist = await api.sync.getWatchlist.query();
	} catch {
		clearUserSession();
		return false;
	}

	if (!remoteWatchlist) return false;

	const remoteMovieIds = remoteWatchlist
		.filter((m) => m.mediaType === 'movie' && Boolean(m.tmdbId))
		.map((m) => m.tmdbId);
	const remoteSeriesIds = remoteWatchlist
		.filter((s) => s.mediaType === 'tv' && Boolean(s.tmdbId))
		.map((s) => s.tmdbId);

	const remoteMovieIdSet = new Set(remoteMovieIds);
	const remoteSeriesIdSet = new Set(remoteSeriesIds);

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

	const localMovieIdSet = new Set(localWatchlistMovies.map((m) => m.media_id));

	const localSeriesIdSet = new Set(localWatchlistSeries.map((s) => s.media_id));

	// MOVIES – symmetrische Differenz

	const remote_Movies = remoteMovieIds.filter((id) => !localMovieIdSet.has(id));

	const locale_Movies = localWatchlistMovies.filter((m) => !remoteMovieIdSet.has(m.media_id));

	// TV – symmetrische Differenz

	const remote_Tv = remoteSeriesIds.filter((id) => !localSeriesIdSet.has(id));

	const locale_Tv = localWatchlistSeries.filter((s) => !remoteSeriesIdSet.has(s.media_id));

	await Promise.all([
		remote_Movies.map(async (id) => {
			await db.update(schemaMovies).set({ wantsToWatch: true }).where(eq(schemaMovies.id, id));
		}),
		remote_Tv.map(async (id) => {
			await db.update(schemaSerie).set({ wantsToWatch: true }).where(eq(schemaSerie.id, id));
		})
	]);

	const watchlistSyncPayload = [
		...locale_Movies
			// TMDB liefert bei manchen Filmen nur einen "Rumored"-Eintrag.
			// Diese Filme existieren nicht offiziell, daher würde ein API-Aufruf zur Watchlist einen 404-Fehler erzeugen.
			// Deshalb überspringen wir diese Filme, um Fehler zu vermeiden.
			.filter((m) => m.tmdb.status !== 'Rumored')
			.map((movie) => ({
				mediaType: 'movie' as const,
				tmdbId: movie.media_id,
				watchlist: true
			})),
		...locale_Tv
			// TMDB liefert bei manchen Serien nur einen "Rumored"-Eintrag.
			// Diese Serie existieren nicht offiziell, daher würde ein API-Aufruf zur Watchlist einen 404-Fehler erzeugen.
			// Deshalb überspringen wir diese Serie, um Fehler zu vermeiden.
			.filter((s) => s.tmdb.status !== 'Rumored')
			.map((serie) => ({
				mediaType: 'tv' as const,
				tmdbId: serie.media_id,
				watchlist: true
			}))
	];

	await Promise.all(watchlistSyncPayload.map((entry) => api.sync.setWatchlist.mutate(entry)));

	return true;
}

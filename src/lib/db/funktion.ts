import { schema } from '$lib/db/schema';
import { newToast } from '$lib/toast/toast';
import { eq } from 'drizzle-orm';
import { db } from './database';

async function handleDatabaseOperation(promise: Promise<any>, action: string) {
	try {
		await promise;
	} catch (error) {
		console.error(error);
		newToast('error', `${action}: `, error);
	}
}

export async function addMovie(data: typeof schema.movies.$inferInsert) {
	await handleDatabaseOperation(db.insert(schema.movies).values(data), 'Add Movie');
}

export async function deleteMovie(id: number) {
	await handleDatabaseOperation(
		db.delete(schema.movies).where(eq(schema.movies.id, id)),
		'Delete Movie'
	);
}

export async function updateMovie(id: number, data: typeof schema.movies.$inferInsert) {
	await handleDatabaseOperation(
		db.update(schema.movies).set(data).where(eq(schema.movies.id, id)),
		'Update Movie'
	);
}

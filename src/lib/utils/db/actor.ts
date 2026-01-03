import { db } from '$lib/db/database';
import { schema } from '$lib/db/schema';

import { eq, inArray } from 'drizzle-orm';
import { getActor } from '../tmdb';
import { online } from 'svelte/reactivity/window';

export const actor = {
	add: async (data: typeof schema.actors.$inferInsert) =>
		(await actor.isIDUnique(data.id))
			? await db.insert(schema.actors).values(data)
			: await actor.update(data.id, data),

	get: async (id: number): Promise<typeof schema.actors.$inferSelect | undefined> => {
		let result = await db.query.actors.findFirst({ where: eq(schema.actors.id, id) });
		if (!result && online.current && id !== undefined) {
			const fetched = await getActor(id);
			if (fetched) {
				await db
					.insert(schema.actors)
					.values({ id: fetched.id, tmdb: fetched, name: fetched.name });
				result = { id: fetched.id, tmdb: fetched, name: fetched.name, updated: new Date() };
			}
		}
		return result;
	},

	getAll: async (ids?: number[]): Promise<(typeof schema.actors.$inferSelect)[]> => {
		if (ids && ids.length > 0) {
			const localResults = await db
				.select()
				.from(schema.actors)
				.where(inArray(schema.actors.id, ids));

			const foundIds = localResults.map((a) => a.id);
			const missingIds = ids.filter((id) => !foundIds.includes(id));

			if (missingIds.length > 0 && online.current) {
				const fetchedActors = await Promise.all(
					missingIds.map(async (id) => {
						if (id === undefined) return null;
						const onlineResult = await getActor(id);
						if (onlineResult) {
							await db
								.insert(schema.actors)
								.values({ id: onlineResult.id, tmdb: onlineResult, name: onlineResult.name });

							return {
								id: onlineResult.id,
								tmdb: onlineResult,
								name: onlineResult.name,
								updated: new Date()
							};
						}
						return null;
					})
				);
				const validFetched = fetchedActors.filter((a) => a !== null);
				return [...localResults, ...validFetched];
			}
			return localResults;
		}

		return await db.select().from(schema.actors);
	},

	delete: async (id: number) => await db.delete(schema.actors).where(eq(schema.actors.id, id)),

	update: async (id: number, data: Partial<typeof schema.actors.$inferInsert>) => {
		if (Object.keys(data).length === 0) return;
		try {
			await db.update(schema.actors).set(data).where(eq(schema.actors.id, id));
		} catch (err) {
			console.error(`Update Actor (ID: ${id}) fehlgeschlagen: ${err}`);
		}
	},

	isIDUnique: async (id: number): Promise<boolean> => {
		const existingActor = await actor.get(id);
		return !existingActor;
	}
};

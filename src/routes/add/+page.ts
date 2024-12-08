import type { PageLoad } from './$types';

export const load = (({ url }) => {
	const paths = url.searchParams.getAll('path');
	return { paths };
}) satisfies PageLoad;

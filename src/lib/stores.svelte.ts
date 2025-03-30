import type { SearchList } from '$lib/types/add';
import { settingsDB } from './utils/db/settings';

export const searchList = $state<SearchList[]>([]);

export const settings = $state(await settingsDB.get());

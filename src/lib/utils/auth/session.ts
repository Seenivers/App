const LOCALSTORAGE_KEY = 'userSession';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000;

export type StoredUserSession = {
	loggedIn: boolean;
	timestamp: number;
};

export type UserSession = {
	loggedIn: boolean;
	expiry: number;
};

const defaultUserSession: UserSession = {
	loggedIn: false,
	expiry: 0
};

/**
 * Liest die Session aus dem LocalStorage und prüft ob sie gültig ist
 */
export function getUserSession(): UserSession {
	if (typeof localStorage === 'undefined') return defaultUserSession;

	const stored = localStorage.getItem(LOCALSTORAGE_KEY);
	if (!stored) return defaultUserSession;

	try {
		const data: StoredUserSession = JSON.parse(stored);

		if (!data.timestamp) return defaultUserSession;

		const expiry = data.timestamp + SESSION_DURATION;

		if (Date.now() > expiry) {
			localStorage.removeItem(LOCALSTORAGE_KEY);
			return defaultUserSession;
		}

		return {
			loggedIn: data.loggedIn,
			expiry
		};
	} catch {
		localStorage.removeItem(LOCALSTORAGE_KEY);
		return defaultUserSession;
	}
}

/**
 * Setzt eine neue Session im LocalStorage
 */
export function setUserSession(): UserSession {
	if (typeof localStorage === 'undefined') {
		return {
			loggedIn: true,
			expiry: Date.now() + SESSION_DURATION
		};
	}

	const timestamp = Date.now();

	const session: StoredUserSession = {
		loggedIn: true,
		timestamp
	};

	localStorage.setItem(LOCALSTORAGE_KEY, JSON.stringify(session));

	return {
		loggedIn: true,
		expiry: timestamp + SESSION_DURATION
	};
}

/**
 * Entfernt die Session
 */
export function clearUserSession(): void {
	if (typeof localStorage === 'undefined') return;
	localStorage.removeItem(LOCALSTORAGE_KEY);
}

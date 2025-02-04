import { DiscordClientID } from '$lib';
import { debug } from '@tauri-apps/plugin-log';
import { online } from 'svelte/reactivity/window';
import { setActivity, start } from 'tauri-plugin-drpc';
import { Activity, ActivityType, Assets, Timestamps } from 'tauri-plugin-drpc/activity';

/**
 * Typ für die übergebene Aktivitätskonfiguration
 */
interface DiscordActivityOptions {
	details?: string;
	state?: string;
	largeImage?: string;
	largeText?: string;
	smallImage?: string;
	smallText?: string;
	type?: ActivityType;
	startTimestamp?: number;
	endTimestamp?: number;
}

/**
 * Erstellt eine Discord-Rich-Presence-Aktivität basierend auf übergebenen Daten.
 * @param activityData - Daten für die Discord-Aktivität.
 */
export async function discord(activityData: DiscordActivityOptions = {}): Promise<void> {
	if (!online.current) return;

	const {
		details = 'Schaut gerade einen Film 🍿',
		state = 'Genießt spannende Momente in Seenivers',
		largeImage = 'icon',
		largeText = 'Seenivers - Dein Film- & Serien-Paradies',
		smallImage,
		smallText,
		type = ActivityType.Playing,
		startTimestamp,
		endTimestamp
	} = activityData;

	// Erstelle die Assets mit den übergebenen Werten
	const assets = new Assets().setLargeImage(largeImage).setLargeText(largeText);

	// Falls smallImage gesetzt ist, füge es den Assets hinzu
	if (smallImage) assets.setSmallImage(smallImage);
	if (smallText) assets.setSmallText(smallText);

	// Erstelle die Aktivität mit den übergebenen Werten
	const activity = new Activity()
		.setDetails(details)
		.setState(state)
		.setAssets(assets)
		.setActivity(type);

	// Stelle sicher, dass die Timestamps gültige Ganzzahlen sind
	const validStart = typeof startTimestamp === 'number' ? Math.floor(startTimestamp) : undefined;
	const validEnd = typeof endTimestamp === 'number' ? Math.floor(endTimestamp) : undefined;

	// Setze den Timestamp (mit optionalem Endzeitpunkt)
	if (validStart) {
		const timestamps = validEnd ? new Timestamps(validStart, validEnd) : new Timestamps(validStart);
		activity.setTimestamps(timestamps);
	}

	// Setze die Aktivität bei Discord
	await setActivity(activity);
}

/**
 * Startet das Discord Rich Presence.
 */
export async function startRPC() {
	if (!online.current) return;

	// Standardaktivität setzen
	await discord();

	debug('Starting Discord RPC');
	await start(DiscordClientID);
}

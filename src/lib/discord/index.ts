import { DiscordClientID } from '$lib';
import { settings } from '$lib/stores.svelte';
import { debug } from '@tauri-apps/plugin-log';
import { online } from 'svelte/reactivity/window';
import { isRunning, setActivity, start, stop } from 'tauri-plugin-drpc';
import { Activity, ActivityType, Assets, Button, Timestamps } from 'tauri-plugin-drpc/activity';

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
	button?: { label: string; url: string }[];
}

const dev: DiscordActivityOptions = {
	details: 'Entwickelt Seenivers weiter 🚀',
	state: 'Tief im Code-Dschungel 🌿',
	largeText: 'Seenivers - Next Level Entertainment',
	smallImage: 'terminal_dev',
	smallText: 'Debugging... 🐛',
	type: ActivityType.Playing, // Alternativ: Coding, wenn vorhanden
	startTimestamp: Date.now(),
	button: [{ label: 'Seenivers', url: 'https://github.com/seenivers/app' }]
};

/**
 * Erstellt eine Discord-Rich-Presence-Aktivität basierend auf übergebenen Daten.
 * @param activityData - Daten für die Discord-Aktivität.
 */
export async function discord(activityData: DiscordActivityOptions = {}): Promise<void> {
	if (!online.current) return;

	if (!settings.discordAktiv) {
		await stop();
	}

	debug('Starting Discord RPC');

	if (!(await isRunning())) {
		await start(DiscordClientID);
	}

	const {
		details = 'Schaut gerade einen Film 🍿',
		state,
		largeImage = 'icon',
		largeText = 'Seenivers - Dein Film- & Serien-Paradies',
		smallImage,
		smallText,
		type = ActivityType.Watching,
		startTimestamp,
		endTimestamp,
		button
	} = import.meta.env.DEV ? dev : activityData;

	// Erstelle die Assets mit den übergebenen Werten
	const assets = new Assets().setLargeImage(largeImage).setLargeText(largeText);

	// Falls smallImage gesetzt ist, füge es den Assets hinzu
	if (smallImage) assets.setSmallImage(smallImage);
	if (smallText) assets.setSmallText(smallText);

	// Erstelle die Aktivität
	const activity = new Activity().setDetails(details).setAssets(assets).setActivity(type);

	// Falls state nicht null ist, füge es hinzu
	if (state) {
		activity.setState(state);
	}

	if (button) {
		activity.setButton(button.map(({ label, url }) => new Button(label, url)));
	}

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

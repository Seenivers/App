import { DiscordClientID } from '$lib';
import { settings } from '$lib/stores.svelte';
import { debug } from '@tauri-apps/plugin-log';
import { online } from 'svelte/reactivity/window';
import { isRunning, setActivity, start } from 'tauri-plugin-drpc';
import { Activity, ActivityType, Assets, Button, Timestamps } from 'tauri-plugin-drpc/activity';
import { _ } from 'svelte-i18n';
import { get } from 'svelte/store';

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
	details: get(_)('discord.dev.details'),
	state: get(_)('discord.dev.state'),
	largeText: get(_)('discord.dev.largeText'),
	smallImage: get(_)('discord.dev.smallImage'),
	smallText: get(_)('discord.dev.smallText'),
	type: ActivityType.Playing, // Alternativ: Coding, wenn vorhanden
	startTimestamp: Date.now(),
	button: [{ label: 'Seenivers', url: 'https://github.com/seenivers/app' }]
};

/**
 * Erstellt eine Discord-Rich-Presence-Aktivität basierend auf übergebenen Daten.
 * @param activityData - Daten für die Discord-Aktivität.
 */
export async function discord(activityData: DiscordActivityOptions = {}): Promise<void> {
	if (!online.current || !settings.discordAktiv || !(await isRunning())) return;

	const {
		details = get(_)('discord.details'),
		state,
		largeImage = 'icon',
		largeText = get(_)('discord.largeText'),
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

/**
 * Startet das Discord Rich Presence.
 */
export async function startRPC() {
	if (!online.current || !settings.discordAktiv || (await isRunning())) return;

	debug('Starting Discord RPC');
	await start(DiscordClientID);

	// Standardaktivität setzen
	await discord();
}

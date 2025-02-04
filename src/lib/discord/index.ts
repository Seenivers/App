import { DiscordClientID } from '$lib';
import { debug } from '@tauri-apps/plugin-log';
import { online } from 'svelte/reactivity/window';
import { setActivity, start } from 'tauri-plugin-drpc';
import { Activity, ActivityType, Assets } from 'tauri-plugin-drpc/activity';

/**
 * Typ für die übergebene Aktivitätskonfiguration
 */
interface DiscordActivityOptions {
	details?: string;
	state?: string;
	largeImage?: string;
	largeText?: string;
	type?: ActivityType;
}

/**
 * Erstellt eine Discord-Rich-Presence-Aktivität basierend auf übergebenen Daten.
 * @param activityData - Daten für die Discord-Aktivität.
 */
export async function discord(activityData: DiscordActivityOptions = {}) {
	if (!online.current) return;

	const {
		details = 'Schaut gerade einen Film 🍿',
		state = 'Genießt spannende Momente in Seenivers',
		largeImage = 'icon',
		largeText = 'Seenivers - Dein Film- & Serien-Paradies',
		type = ActivityType.Watching
	} = activityData;

	// Erstelle die Assets mit den übergebenen Werten
	const assets = new Assets().setLargeImage(largeImage).setLargeText(largeText);

	// Erstelle die Aktivität mit den übergebenen Werten
	const activity = new Activity()
		.setDetails(details)
		.setState(state)
		.setAssets(assets)
		.setActivity(type);

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

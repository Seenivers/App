import { DiscordClientID } from '$lib';
import { debug } from '@tauri-apps/plugin-log';
import { setActivity, start } from 'tauri-plugin-drpc';
import { Activity, Assets, Timestamps } from 'tauri-plugin-drpc/activity';

// Erstelle dynamische Assets
const assets = new Assets()
	.setLargeImage('icon') // Dein Icon
	.setLargeText('Seenivers - Dein Film- & Serien-Paradies'); // Text, der beim Hover auf das Icon erscheint

// Setze eine coole Aktivität
const activity = new Activity()
	.setDetails('Schaut gerade den neuesten Blockbuster! 🍿') // Details anzeigen
	.setState('Genießt spannende Momente in Seenivers') // Statusnachricht
	.setAssets(assets) // Verwende die Assets
	.setTimestamps(new Timestamps(Date.now())); // Zeige den Startzeitpunkt der Aktivität

export async function startRPC() {
	debug('Setting activity');

	// Aktivität setzen
	await setActivity(activity);

	debug('Starting Discord RPC');
	// Starte den Discord RPC mit der Anwendung
	await start(DiscordClientID);
}

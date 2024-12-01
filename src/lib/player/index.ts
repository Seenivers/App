import { error as tauriError } from '@tauri-apps/plugin-log';

export function format(seconds: number) {
	if (isNaN(seconds)) return '...';

	const hours = Math.floor(seconds / 60 / 60);
	const minutes = Math.floor((seconds / 60) % 60);
	seconds = Math.floor(seconds % 60);

	// Format using padStart to add leading zeros
	const formattedMinutes = minutes.toString().padStart(2, '0');
	const formattedSeconds = seconds.toString().padStart(2, '0');

	if (hours > 0) {
		const formattedHours = hours.toString().padStart(2, '0');
		return `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
	} else {
		return `${formattedMinutes}:${formattedSeconds}`;
	}
}

export async function fullscreen(player: HTMLDivElement) {
	if (document.fullscreenElement) {
		document.exitFullscreen().catch(newError);
	} else {
		await player.requestFullscreen();
	}
}

export async function pictureInPicture(videoElement: HTMLVideoElement) {
	if (document.pictureInPictureElement) {
		document.exitPictureInPicture().catch(newError);
	} else if (document.pictureInPictureEnabled) {
		await videoElement.requestPictureInPicture();
	}
}

function newError(err: unknown) {
	if (err instanceof Error) {
		tauriError(err.message); // Verwendet die Nachricht aus dem Error-Objekt
	} else {
		tauriError('An unknown error occurred'); // Fallback für andere Typen
	}
}

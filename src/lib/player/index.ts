import { newToast } from '$lib/toast/toast';

export function format(seconds: number) {
	if (isNaN(seconds)) return '...';

	let hours = Math.floor(seconds / 60 / 60);
	let minutes = Math.floor((seconds / 60) % 60);
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

export function fullscreen(player: HTMLDivElement) {
	if (document.fullscreenElement) {
		document.exitFullscreen().catch((err) => {
			console.error(err);
			newToast('error', 'Fehler beim Vollbildmodus verlassen.' + err);
		});
	} else {
		player.requestFullscreen();
	}
}

export async function pictureInPicture(videoElement: HTMLVideoElement) {
	if (document.pictureInPictureElement) {
		document.exitPictureInPicture().catch((err) => {
			console.error(err);
			newToast('error', 'Fehler beim Bild in Bild verlassen.' + err);
		});
	} else if (document.pictureInPictureEnabled) {
		videoElement.requestPictureInPicture();
	}
}

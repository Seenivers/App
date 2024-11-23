import { error } from '@tauri-apps/plugin-log';

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
		document.exitFullscreen().catch((err) => {
			error(err);
		});
	} else {
		await player.requestFullscreen();
	}
}

export async function pictureInPicture(videoElement: HTMLVideoElement) {
	if (document.pictureInPictureElement) {
		document.exitPictureInPicture().catch((err) => {
			error(err);
		});
	} else if (document.pictureInPictureEnabled) {
		await videoElement.requestPictureInPicture();
	}
}
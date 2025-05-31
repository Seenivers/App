import type { themes } from '$lib';

export interface ToastPosition {
	horizontal: AlertPositionHorizontally;
	vertical: AlertPositionVertically;
}
export type Player = 'Plyr' | 'Vidstack';
export type Theme = (typeof themes)[number];
export type BackupInterval = 'manual' | 'onStartup' | 'daily' | 'weekly' | 'monthly';
export type BackupConfig = {
	maxAgeDays: number;
	maxBackups: number;
	maxSizeMB: number;
};

export type AlertPositionHorizontally =
	| 'start' // align horizontally to the left
	| 'center' // align horizontally to the center
	| 'end'; // align horizontally to the right (default)

export type AlertPositionVertically =
	| 'top' // align vertically to top
	| 'middle' // align vertically to middle
	| 'bottom'; // align vertically to bottom (default)

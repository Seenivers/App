export interface Settings {
	language: string;
	keywords: string[];
	adult: boolean;
	toastPosition: {
		horizontal: AlertPositionHorizontally;
		vertical: AlertPositionVertically;
	};
}

export type AlertPositionHorizontally =
	| 'start' // align horizontally to the left
	| 'center' // align horizontally to the center
	| 'end'; // align horizontally to the right (default)

export type AlertPositionVertically =
	| 'top' // align vertically to top
	| 'middle' // align vertically to middle
	| 'bottom'; // align vertically to bottom (default)

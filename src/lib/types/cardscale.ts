/**
 * Represents the scaling options for a movie card.
 * - `aktiv`: The active scale setting for the card.
 * - `sizes`: An array of size options for the card, each with a `number` and a corresponding `size` label.
 */
export interface Cardscale {
	/** The active scaling option for the card. Can be 1, 2, or 3. */
	aktiv: 1 | 2 | 3;
	/** An array of size options for the card, each with a `number` and a `size` label. */
	sizes: {
		/** The scale number (1, 2, or 3). */
		number: 1 | 2 | 3;
		/** The label for the card size, either 'Small', 'Medium', or 'Large'. */
		size: 'Small' | 'Medium' | 'Large';
	}[];
}

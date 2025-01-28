<script lang="ts">
	import { placeholderURL } from '$lib';
	import { image } from '$lib/image/image';

	// Eigenschaften der Komponente
	interface ImageProps {
		params: Parameters<typeof image>;
		alt: string;
		[propName: string]: any;
	}

	// Props initialisieren
	let { params, alt, ...attributes }: ImageProps = $props();
	let src: string | undefined = $state(placeholderURL);
	let height: number | undefined = $state(450);
	let width: number | undefined = $state(300);

	(async () => {
		({ src, height, width } = await image(...params));
	})();
</script>

<img
	{src}
	{height}
	{width}
	{alt}
	onerror={(e) => {
		if (e.target instanceof HTMLImageElement) {
			e.target.src = placeholderURL;
		}
	}}
	loading="lazy"
	decoding="async"
	draggable="false"
	aria-roledescription="image"
	{...attributes}
/>

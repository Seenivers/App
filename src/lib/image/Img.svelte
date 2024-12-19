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
</script>

{#await image(...params) then { src, height, width }}
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
{/await}

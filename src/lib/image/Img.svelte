<script lang="ts">
	import { onMount } from 'svelte';
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
	let src: string | undefined = $state(placeholderURL); // Standard: Placeholder
	let height: number | undefined = $state(450); // Standardhöhe
	let width: number | undefined = $state(300); // Standardbreite
	let imgRef: HTMLImageElement | null = null; // Referenz für das Bild
	let isVisible = false; // Sichtbarkeitsstatus des Bildes

	// Intersection Observer verwenden
	onMount(() => {
		if (imgRef) {
			const observer = new IntersectionObserver(
				(entries) => {
					entries.forEach(async (entry) => {
						if (entry.isIntersecting) {
							isVisible = true; // Bild wird sichtbar
							observer.unobserve(entry.target); // Beobachtung stoppen

							// Lade die echten Bilddaten
							({ src, height, width } = await image(...params));
						}
					});
				},
				{ threshold: 0.1 } // Bild erscheint, wenn 10% sichtbar sind
			);
			observer.observe(imgRef); // Beobachtung starten
		}
	});
</script>

<img
	bind:this={imgRef}
	{src}
	{height}
	{width}
	{alt}
	onerror={(e) => {
		if (e.target instanceof HTMLImageElement) {
			e.target.src = placeholderURL; // Lade den Placeholder bei Fehler
		}
	}}
	loading="lazy"
	decoding="async"
	draggable="false"
	aria-roledescription="image"
	{...attributes}
/>

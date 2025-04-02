<script lang="ts">
	import { image } from '$lib/image/image';
	import Img from '$lib/image/Img.svelte';
	import type { Cardscale } from '$lib/types/cardscale';

	let {
		CARDSCALE = $bindable(),
		href,
		alt,
		title,
		params
	}: {
		CARDSCALE: Cardscale;
		href: string;
		alt: string;
		title: string;
		params: Parameters<typeof image>;
	} = $props();

	// Skalierungsklassen
	const scaleClasses = {
		1: { width: 'min-w-[8rem] max-w-[12rem]', text: 'text-base' },
		2: { width: 'min-w-[12rem] max-w-[18rem]', text: 'text-lg' },
		3: { width: 'min-w-[16rem] max-w-[24rem]', text: 'text-2xl' }
	}[CARDSCALE.aktiv] ?? { width: 'min-w-[12rem] max-w-[18rem]', text: 'text-lg' };
</script>

<a
	{href}
	draggable="false"
	class="card bg-base-100 hover:bg-base-content/20 h-fit flex-grow select-none shadow-xl transition-all duration-300 hover:scale-105 {scaleClasses.width}"
>
	<figure class="relative px-2 pt-2">
		<Img {params} {alt} class="rounded-xl" />
	</figure>
	<div class="card-body items-center py-2 text-center">
		<p class="card-title {scaleClasses.text}">{title}</p>
	</div>
</a>

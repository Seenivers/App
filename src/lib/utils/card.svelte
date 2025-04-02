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
</script>

<a
	{href}
	draggable="false"
	class="card bg-base-100 hover:bg-base-content/20 h-fit flex-grow select-none shadow-xl transition-all duration-300 hover:scale-105
					{CARDSCALE.aktiv === 1
		? 'min-w-[8rem] max-w-[12rem]'
		: CARDSCALE.aktiv === 2
			? 'min-w-[12rem] max-w-[18rem]'
			: 'min-w-[16rem] max-w-[24rem]'}"
>
	<figure class="relative px-2 pt-2">
		<Img {params} {alt} class="rounded-xl" />
	</figure>
	<div class="card-body items-center py-2 text-center">
		<p
			class="card-title {CARDSCALE.aktiv === 1
				? 'text-base'
				: CARDSCALE.aktiv === 2
					? 'text-lg'
					: 'text-2xl'}"
		>
			{title}
		</p>
	</div>
</a>

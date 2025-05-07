<script lang="ts">
	import { image } from '$lib/image/image';
	import Img from '$lib/image/Img.svelte';
	import type { CardscaleNumbers } from '$lib/types/cardscale';
	import { _ } from 'svelte-i18n';
	import { scaleClasses } from '$lib/utils/cardscale';

	let {
		CARDSCALE = $bindable(),
		href,
		alt,
		title,
		watched = false,
		params
	}: {
		CARDSCALE: CardscaleNumbers;
		href: string;
		alt: string;
		title: string;
		watched?: boolean;
		params: Parameters<typeof image>;
	} = $props();
</script>

<a
	{href}
	draggable="false"
	class="card h-fit flex-grow select-none bg-base-100 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-base-content/20 {scaleClasses[
		CARDSCALE
	].width}"
>
	<figure class="relative px-2 pt-2">
		<Img {params} {alt} class="rounded-xl" />
		{#if watched}
			<div class="badge badge-accent badge-outline absolute left-3 top-3 bg-base-300">
				{$_('badge.watched')}
			</div>
		{/if}
	</figure>
	<div class="card-body items-center py-2 text-center">
		<p class="card-title {scaleClasses[CARDSCALE].text}">{title}</p>
	</div>
</a>

<script lang="ts">
	import { resolve } from '$app/paths';
	import { image } from '$lib/image/image';
	import Img from '$lib/image/Img.svelte';
	import { m } from '$lib/paraglide/messages';
	import { scaleClasses } from '$lib/utils/cardscale';

	let {
		CARDSCALE = $bindable(),
		href,
		alt,
		title,
		watched = false,
		params,
		onClick,
		onContextMenu,
		onPointerDown,
		onPointerUp,
		onPointerMove,
		onPointerCancel
	}: {
		CARDSCALE: 1 | 2 | 3;
		href: string;
		alt: string;
		title: string;
		watched?: boolean;
		params: Parameters<typeof image>;
		onClick?: (event: MouseEvent) => void;
		onContextMenu?: (event: MouseEvent) => void;
		onPointerDown?: (event: PointerEvent) => void;
		onPointerUp?: (event: PointerEvent) => void;
		onPointerMove?: (event: PointerEvent) => void;
		onPointerCancel?: (event: PointerEvent) => void;
	} = $props();
</script>

<a
	// @ts-expect-error Zieh ist nur Filme/Serien und Sammlungen
	href={resolve(href)}
	draggable="false"
	class="card bg-base-100 hover:bg-base-content/20 h-fit grow shadow-xl transition-all duration-300 select-none hover:scale-105 {scaleClasses[
		CARDSCALE
	].width}"
	onclick={onClick}
	oncontextmenu={onContextMenu}
	onpointerdown={onPointerDown}
	onpointerup={onPointerUp}
	onpointermove={onPointerMove}
	onpointercancel={onPointerCancel}
>
	<figure class="relative px-2 pt-2">
		<Img {params} {alt} class="rounded-xl" />
		{#if watched}
			<div class="badge badge-accent badge-outline bg-base-300 absolute top-3 left-3">
				{m['badge.watched']()}
			</div>
		{/if}
	</figure>
	<div class="card-body items-center py-2 text-center">
		<p class="card-title {scaleClasses[CARDSCALE].text}">{title}</p>
	</div>
</a>

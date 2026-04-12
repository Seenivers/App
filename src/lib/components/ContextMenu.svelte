<script lang="ts">
	import { tick, type Component } from 'svelte';

	type ContextMenuItem = {
		id: string;
		label: string;
		icon?: Component;
		disabled?: boolean;
		danger?: boolean;
		separatorBefore?: boolean;
	};

	let {
		open = false,
		x = 0,
		y = 0,
		items = [],
		onClose,
		onSelect
	}: {
		open?: boolean;
		x?: number;
		y?: number;
		items?: ContextMenuItem[];
		onClose?: () => void;
		onSelect?: (id: string) => void | Promise<void>;
	} = $props();

	let menuElement = $state<HTMLDivElement | null>(null);
	let position = $state({ x: 0, y: 0 });

	function closeMenu() {
		onClose?.();
	}

	async function updateMenuPosition() {
		if (!open) return;

		position = { x, y };
		await tick();

		if (!menuElement) return;

		const padding = 8;
		const rect = menuElement.getBoundingClientRect();
		const maxX = window.innerWidth - rect.width - padding;
		const maxY = window.innerHeight - rect.height - padding;

		position = {
			x: Math.max(padding, Math.min(x, maxX)),
			y: Math.max(padding, Math.min(y, maxY))
		};
	}

	$effect(() => {
		if (!open) return;
		void updateMenuPosition();
	});

	function handlePointerDown(event: PointerEvent) {
		if (!open || !menuElement) return;

		const target = event.target as Node | null;
		if (target && menuElement.contains(target)) return;

		closeMenu();
	}

	function handleWindowContextMenu(event: MouseEvent) {
		if (!open || !menuElement) return;

		const target = event.target as Node | null;
		if (target && menuElement.contains(target)) {
			event.preventDefault();
			return;
		}

		closeMenu();
	}

	function handleKeyDown(event: KeyboardEvent) {
		if (!open) return;
		if (event.key !== 'Escape') return;
		closeMenu();
	}

	function handleActionClick(item: ContextMenuItem) {
		if (item.disabled) return;
		void onSelect?.(item.id);
		closeMenu();
	}
</script>

<svelte:window
	onpointerdown={handlePointerDown}
	onkeydown={handleKeyDown}
	oncontextmenu={handleWindowContextMenu}
	onresize={closeMenu}
/>
{#if open}
	<div
		bind:this={menuElement}
		class="bg-base-100 border-base-300 fixed z-1000 min-w-60 rounded-xl border p-1 shadow-2xl"
		style={`left: ${position.x}px; top: ${position.y}px;`}
		role="menu"
		aria-label="Context menu"
	>
		<ul class="menu menu-sm w-full gap-0.5 p-0">
			{#each items as item, index (item.id)}
				{#if item.separatorBefore && index > 0}
					<li class="border-base-300 pointer-events-none my-1 border-t"></li>
				{/if}

				<li>
					<button
						type="button"
						class="flex items-center gap-2 rounded-lg text-left {item.danger
							? 'text-error hover:bg-error/10'
							: ''}"
						onclick={() => handleActionClick(item)}
						disabled={item.disabled}
						role="menuitem"
					>
						{#if item.icon}
							{@const Icon = item.icon}
							<Icon class="h-4 w-4 shrink-0" />
						{/if}
						<span class="truncate">{item.label}</span>
					</button>
				</li>
			{/each}
		</ul>
	</div>
{/if}

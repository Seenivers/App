<script lang="ts">
	let {
		value = $bindable(0),
		update = async () => {}
	}: {
		value: number;
		update: (rating?: number) => Promise<void>;
	} = $props();

	const initialValue = value;

	function handleChange() {
		if (value !== initialValue) {
			update(value);
		}
	}
</script>

<div class="rating rating-lg rating-half">
	<input
		type="radio"
		name="rating"
		class="rating-hidden"
		aria-label="clear"
		value="0"
		bind:group={value}
		onchange={handleChange}
	/>

	{#each Array(20) as _, i}
		<input
			type="radio"
			name="rating"
			value={(i + 1) * 0.5}
			class="mask mask-star-2 {i % 2 === 0 ? 'mask-half-1' : 'mask-half-2'} bg-yellow-400"
			aria-label="{(i + 1) * 0.5} star"
			bind:group={value}
			onchange={handleChange}
		/>
	{/each}
</div>

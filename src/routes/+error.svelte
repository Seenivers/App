<script lang="ts">
	import { page } from '$app/state';
	import { m } from '$lib/paraglide/messages';
	import { resolve } from '$app/paths';
</script>

<main class="flex grow content-center items-center p-4">
	<div class="mx-auto text-center">
		<h1 class="text-error text-8xl font-extrabold opacity-20 select-none lg:text-[10rem]">
			{m.errorTitle()}
		</h1>
		<h2 class="text-error text-6xl font-bold opacity-20 select-none lg:text-8xl">
			{page.status}
		</h2>
		<p class="text-base-content mt-6 mb-8 text-lg lg:text-xl">
			{page.error?.message ?? 'An unexpected error occurred.'}
		</p>

		<a href={resolve('/')} class="btn btn-primary">
			{window.history.length > 1 ? m['nav.back']() : m['nav.backToHome']()}
		</a>
	</div>
</main>

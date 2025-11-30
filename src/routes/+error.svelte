<script lang="ts">
	import * as Sentry from '@sentry/sveltekit';
	import { page } from '$app/state';
	import { _ } from 'svelte-i18n';

	function openFeedback() {
		Sentry.showReportDialog({
			eventId: Sentry.lastEventId()
		});
	}
</script>

<main class="flex grow content-center items-center p-4">
	<div class="mx-auto text-center">
		<h1 class="text-error text-8xl font-extrabold opacity-20 select-none lg:text-[10rem]">
			{$_('errorTitle')}
		</h1>
		<h2 class="text-error text-6xl font-bold opacity-20 select-none lg:text-8xl">
			{page.status}
		</h2>
		<p class="text-base-content mt-6 mb-8 text-lg lg:text-xl">
			{page.error?.message ?? 'An unexpected error occurred.'}
		</p>

		<a href="/" class="btn btn-primary">
			{window.history.length > 1 ? $_('nav.back') : $_('nav.backToHome')}
		</a>

		<div class="mt-8">
			<button onclick={openFeedback} class="btn btn-secondary"> Send Feedback </button>
		</div>
	</div>
</main>

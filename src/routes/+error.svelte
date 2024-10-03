<script lang="ts">
	import { page } from '$app/stores';
</script>

<body class="flex flex-grow flex-col justify-center">
	<div class="hero">
		<div class="hero-content text-center">
			<div class="max-w-md">
				<h1 class="mb-5 text-5xl font-bold opacity-10 lg:text-7xl xl:text-9xl">{$page.status}</h1>
				<p class="mb-5">{$page.error?.message}</p>
				<div class="flex justify-center gap-4">
					<a class="btn btn-outline" href="/">Zurück</a>
				</div>
			</div>
		</div>
	</div>
</body>

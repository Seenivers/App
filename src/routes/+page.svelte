<script>
	import { placeholderURL, imageURL } from '$lib';
	import { data } from '$lib/db';
</script>

<div class="navbar bg-base-100">
	<div class="flex-1">
		<a href="add" class="btn btn-ghost">Hinzufügen</a>
	</div>
</div>

<main class="flex-grow flex-col p-5">
	<div class="flex flex-wrap justify-center gap-5 p-5 pb-36">
		{#if $data.movies.length >= 1}
			{#each $data.movies as item}
				<a
					href={item.id.toString()}
					draggable="false"
					class="card h-fit min-w-[15rem] max-w-[20rem] flex-grow select-none bg-base-100 shadow-xl transition-all duration-300 hover:scale-105 hover:bg-base-content/20"
				>
					<figure class="relative px-2 pt-2">
						<img
							src={item.poster_path ? imageURL + item.poster_path : placeholderURL}
							alt="Poster von {item.title}"
							class="rounded-xl"
							draggable="false"
						/>
						{#if item.watched}
							<div class="badge badge-outline absolute left-3 top-3 bg-base-300">Angesehen</div>
						{/if}
					</figure>
					<div class="card-body items-center py-2 text-center">
						<p class="card-title">{item.title}</p>
					</div>
				</a>
			{/each}
		{:else}
			<p>Du hast noch keine Filme hinzugefügt</p>
		{/if}
	</div>
</main>

<script>
	import '../app.postcss';
	import { load } from '../ts/dir';

	load();
	
	// get(mediaLibrary)
</script>

<div class="min-h-screen w-full bg-base-300 text-base-content h-fit">
	<slot />
</div>

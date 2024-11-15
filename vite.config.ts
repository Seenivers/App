import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [sveltekit()],
	build: {
		target: 'esnext'
	},
	clearScreen: false,
	server: {
		host: host ?? false,
		port: 1420,
		strictPort: true,
		hmr: host
			? {
					protocol: 'ws',
					host,
					port: 1421
				}
			: undefined
	}
});

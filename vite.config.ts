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
		headers: {
			'content-security-policy':
				"default-src 'self' ipc: http://ipc.localhost http://asset.localhost https://image.tmdb.org https://api.themoviedb.org; connect-src 'self' ipc: http://ipc.localhost https://api.themoviedb.org; img-src 'self' http://asset.localhost https://image.tmdb.org data: blob:;",
			'access-control-allow-origin': 'http://localhost:1420'
		},
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

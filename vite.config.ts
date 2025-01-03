import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { vite as vidstack } from 'vidstack/plugins';

const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vidstack(), sveltekit()],
	build: {
		target: 'esnext'
	},

	// Vite options tailored for Tauri development and only applied in `tauri dev` or `tauri build`
	//
	// 1. prevent vite from obscuring rust errors
	clearScreen: false,
	// 2. tauri expects a fixed port, fail if that port is not available
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
			: undefined,
		watch: {
			// 3. tell vite to ignore watching `src-tauri`
			ignored: ['**/src-tauri/**']
		}
	}
});

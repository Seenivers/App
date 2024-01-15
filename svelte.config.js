import { vitePreprocess } from "@sveltejs/kit/vite";
import adapter from '@sveltejs/adapter-static'

/** @type {import('@sveltejs/kit').Config} */
const config = {
    kit: {
        adapter: adapter(),
        prerender: {
            entries: ['/', '/add', '/[ID]', '/settings']
        }
    },

    preprocess: [vitePreprocess({})]
};

export default config;

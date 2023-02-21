import { sveltekit } from '@sveltejs/kit/vite';
import path from 'path'

const config = {
	plugins: [sveltekit()],
	build: {
		outDir: path.resolve(__dirname, 'build')
	}
};

export default config;

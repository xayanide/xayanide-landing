/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			colors: {
				xayadark: '#000000',
				idk: '#A19999'
			}
		},
		plugins: [require('daisyui')]
	}
};

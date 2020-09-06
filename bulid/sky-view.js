import typescript from '@rollup/plugin-typescript';

export default {
	input: './src/sky-view.ts',
	output: {
		file: './dist/sky-view.js',
		format: 'amd',
		amd: {
			id: 'sky-view'
		},
		name:'sky-view',
		globals: { 'sky-core': 'Sky' }
	},
	external: ['sky-core'],
	context:"window",
	plugins:[
		typescript({
			tsconfig:"./tsconfig.json",
			tslib: "./libs/tslib.esm.js"
		})
	]
};
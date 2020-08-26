
import alias from "@rollup/plugin-alias";
import babel from "rollup-plugin-babel";
import extensions from 'rollup-plugin-extensions';
import {utils,helpers} from "sky-core/build/alias-compat";
export default {
	input: './src/sky-view.ts',
	output: {
		file: './dist/sky-view.compat.js',
		format: 'amd',
		name:'sky-view'
	},
	context:"window",
	plugins:[
		alias({
			entries:utils.concat(helpers)
		}),
		extensions({
			// Supporting Typescript files
			// Uses ".mjs, .js" by default
			extensions: ['.tsx', '.ts', '.jsx', '.js'],
			// Resolves index dir files based on supplied extensions
			// This is enable by default
			resolveIndex: false
		}),
		babel({
			"babelrc": false,
			"externalHelpers":true,
			"runtimeHelpers":true,
			"plugins":[
				["@babel/plugin-proposal-decorators", { legacy: true }],
				["@babel/plugin-proposal-class-properties", { "loose": true }],
				"@babel/plugin-transform-instanceof"
			],
			"presets": [
				"@babel/preset-react",
				[
					"@babel/preset-typescript",{
						"isTSX":true,//关键配置
						"allExtensions": true//关键配置
					}
				],
				[
					"@babel/env",
					{
						"modules": false,
						"useBuiltIns": false,
						"loose": true
					}
				]
			],
			"extensions":["tsx","ts","js","jsx"]//超级关键配置
		})
	]
};
const { resolve } = require('path');
const webpackNodeExternals = require('webpack-node-externals');

// Common configurations
const config = {
	mode: 'development',
	module: {
		rules: [
			{
				test: /\.ts?$/,
				exclude: /node_modules/,
				use: {
					loader: 'ts-loader',
				},
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},
};

const frontendConfig = {
	...config,
	...{
		name: 'frontend',
		entry: { editor: './src/frontend/editor.ts', index: './src/frontend/index.ts', login: './src/frontend/login.ts' },
		output: {
			path: resolve(__dirname, 'public'),
			filename: '[name].js',
			environment: {
				arrowFunction: false,
				const: false,
				destructuring: false,
				forOf: false,
				module: false,
				optionalChaining: false,
				dynamicImport: false,
			},
		},
	},
};

const backendConfig = {
	...config,
	...{
		name: 'server',
		entry: { server: './src/server.ts' },
		output: {
			path: resolve(__dirname, 'dist'),
			filename: 'server.js',
		},
		target: 'node',
		externals: [webpackNodeExternals()],
	},
};

module.exports = [frontendConfig, backendConfig];

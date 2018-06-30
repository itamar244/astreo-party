const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = (mode = 'development') => {
	const config = {
		mode,
		entry: path.resolve(__dirname, 'src/index.ts'),

		devtool: mode === 'development' && 'source-map',

		module: {
			rules: [
				{
					test: /\.ts$/,
					use: 'ts-loader',
				},
				{
					test: /\.css$/,
					use: ['style-loader', 'css-loader'],
				},
			],
		},
		resolve: {
			extensions: ['.ts', '.js'],
			alias: {
				shared: path.resolve(__dirname, '../shared/'),
			},
		},

		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(__dirname, 'index.html'),
			}),
		],
	};

	if (mode === 'production') {
		config.plugins.push(new MinifyPlugin());
	}

	return config;
};

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MinifyPlugin = require('babel-minify-webpack-plugin');

module.exports = (mode = 'development') => {
	const config = {
		mode,
		entry: path.resolve(_dirname, 'src/index.ts'),

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
				shared: path.resolve(_dirname, '../shared/'),
			},
		},

		plugins: [
			new HtmlWebpackPlugin({
				template: path.resolve(_dirname, 'index.html'),
			}),
		],
	};

	if (mode === 'production') {
		config.plugins.push(new MinifyPlugin());
	}

	return config;
};

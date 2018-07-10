const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (mode = 'development') => {
	const config = {
		mode,
		entry: path.resolve(__dirname, 'src/index.ts'),

		devtool: mode === 'development' ? 'source-map' : false,

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

	if (process.env.ANALYZER === '1') {
		config.plugins.push(new BundleAnalyzerPlugin());
	}

	return config;
};

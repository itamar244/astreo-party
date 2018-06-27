const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './packages/app/src/index.ts',

	devtool: 'source-map',

	module: {
		rules: [
			{
				test: /\.ts$/,
				use: 'ts-loader',
			},
		],
	},
	resolve: {
		extensions: ['.ts', '.js'],
	},

	plugins: [
		new HtmlWebpackPlugin({
			template: './packages/app/index.html',
		}),
	],
};

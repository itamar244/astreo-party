const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	mode: 'development',
	entry: './packages/app/index.ts',

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
		extensions: ['.tsx', '.ts', '.js'],
	},

	plugins: [
		new HtmlWebpackPlugin({
			title: 'Astreo Party',
		}),
	],
};

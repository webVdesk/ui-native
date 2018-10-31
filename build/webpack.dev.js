const path = require('path');
const merge = require('webpack-merge');
const HtmlWepackPlugin = require('html-webpack-plugin');
const base = require('./webpack.base');

module.exports = merge(base, {
	entry: {
		bundle: [
			path.resolve(__dirname, '../test/index.js')
		]
	},
	mode: 'development',
	devtool: 'inline-source-map',
	devServer: {
		host: '0.0.0.0',
		port: 8080
	},
	output: {
		publicPath: '/'
	},
	plugins: [
		new HtmlWepackPlugin({
			template: path.resolve(__dirname, './assets/index.html')
		})
	]
})
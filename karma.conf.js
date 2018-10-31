module.exports = (config) => {
	config.set({
		// ... normal karma configuration
		files: [
			// all files ending in "_test"
			{
				pattern: 'test/*_test.js',
				watched: false
			},
			{
				pattern: 'test/**/*_test.js',
				watched: false
			}
			// each file acts as entry point for the webpack configuration
		],

		preprocessors: {
			// add webpack as preprocessor
			'test/*_test.js': ['webpack'],
			'test/**/*_test.js': ['webpack']
		},

		webpack: {
			target: 'web',
			resolve: {
				extensions: ['.js']
			},
			module: {
				rules: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						use: {
							loader: 'babel-loader',
						}
					}
				]
			},
			node: false
		},
		
		colors: true,
		autoWatch: true,

		webpackMiddleware: {
			// webpack-dev-middleware configuration
			// i. e.
			stats: 'errors-only'
		}
	});
};
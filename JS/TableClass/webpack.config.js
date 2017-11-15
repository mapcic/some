var webpack = require('webpack');

module.exports = {
	entry: './index.js',
	output: {
		filename: 'bundle.js'
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: ['env']
				}
			}
		}]
	},
    module: {
        loaders: [{ 
        	test: /\.css$/, 
        	loader: "style-loader!css-loader" 
        }]
    }
};
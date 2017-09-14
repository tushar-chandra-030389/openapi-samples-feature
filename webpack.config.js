const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: path.join(__dirname, 'src', 'js', 'routes.jsx'),
  output: {
    path: path.resolve(__dirname, 'src', 'build') ,
    filename: 'index.js'
  },
  module: {
    loaders: [
      { test: /\.json$/, loader: 'json-loader' },
      { test: /\.(js|jsx)$/, exclude: /node_modules/, loader: 'babel-loader',
        query: {
            presets:['es2015','react']
        }
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader'
      },
      {
				test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
				loaders: ['file-loader'],
			},
			{
				test: /\.(woff|woff2)$/,
				loaders: ['url-loader'],
			},
			{
				test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
				loaders: ['url-loader'],
			},
			{
				test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
				loaders: ['url-loader'],
			}
    ]
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin('shared.js')
  ],
  resolve: {
    extensions: ['.js', '.jsx', '.json']
  },
};


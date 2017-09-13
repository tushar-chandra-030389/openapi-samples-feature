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
      }
    ]
  },
  plugins: [
    // new webpack.optimize.CommonsChunkPlugin('shared.js')
  ],
  resolve: {
    extensions: ['.js', '.jsx']
  },
};


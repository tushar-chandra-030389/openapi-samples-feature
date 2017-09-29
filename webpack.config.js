const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

    entry: {
        vendor: [
            'react',
            'react-dom',
            'prop-types',
            'react-bind-handlers',
            'react-router',
            'react-router-dom',
            'react-bootstrap',
            'lodash',
            'redux',
            'redux-thunk',
            'jquery',
        ],
        index: path.join(__dirname, 'src', 'js', 'main')
    },

    stats: {
        colors: true,
        reasons: true,
        chunks: true
    },

    output: {
        path: path.resolve(__dirname, 'src', 'build'),
        filename: '[name][chunkhash].js',
    },

    module: {
        loaders: [{
            test: /\.json$/,
            loader: 'json-loader'
        },
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                query: {
                    presets: ['es2015', 'react'],
                    plugins: ["transform-object-rest-spread"],
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
                test: /\.(png|jpg|gif)$/,
                loaders: ['file-loader'],
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
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            minChunks: 3,
        }),

        new HtmlWebpackPlugin({
            template: __dirname + '/src/index.html',
            title: 'Dynamic Html',
        }),
    ],

    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },

};
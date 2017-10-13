const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

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
        index: path.join(__dirname, '../src', 'js', 'main')
    },

    stats: {
        colors: true,
        reasons: true,
        chunks: true
    },

    output: {
        path: path.resolve(__dirname, '../src', 'build'),
        filename: '[name][chunkhash].js',
    },

    module: {
        loaders: [
            {
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
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                }),
                // loader: 'style-loader!css-loader'
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
            template: path.resolve(__dirname, '../src', 'index.html'),
            title: 'Dynamic Html',
        }),

        //this is for removing './locale' not found error in momentjs.
        new webpack.ContextReplacementPlugin(/\.\/locale$/, 'empty-module', false, /js$/),

        new ExtractTextPlugin({
            filename: "styles.css",
            allChunks: true,
        }),
    ],

    resolve: {
        modules: [
            path.resolve(__dirname, '../'),
            'node_modules',
        ],
        extensions: ['.js', '.jsx', '.json']
    },

};
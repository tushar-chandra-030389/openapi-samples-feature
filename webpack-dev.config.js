let config = require("./webpack.config");

config.devtool = 'source-map';

// config.module.loaders.push(
//     {
//         enforce: 'pre',
//         test: /\.(js|jsx)$/,
//         exclude: [/(node_modules)/,/(sampleApp)/],
//         // options: {
//         //     fix: true,
//         // },
//         loader: 'eslint-loader'
//     }
// )

module.exports = config;
const path = require('path');
const webpack = require('webpack');

module.exports = {
    entry: './main.js',
    output: { path: path.resolve(__dirname, 'static'), filename: 'bundle.js' },
    module: {
        loaders: [
            { test: /.jsx?$/, loader: 'babel-loader', exclude: /node_modules/ }
        ]
    },
};

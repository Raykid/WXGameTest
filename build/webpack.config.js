'use strict';
const path = require('path');
const buildConfig = require('./config');


const webpackConfig = {
    entry: buildConfig.entry,

    output: {
        filename: '[name].js',
        path: path.join(__dirname, '../', buildConfig.distPath),
    },

    resolve: {
        extensions: ['.js', '.ts'],
    },

    externals: {
    },

    module: {
        rules: [{
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
        },],
    },

    // 这个用来关闭webpack警告建议 T_T
    performance: {
        hints: false,
    },
    
    mode: 'production',
    // mode: 'development',
    // devtool: 'cheap',
};

module.exports = webpackConfig;

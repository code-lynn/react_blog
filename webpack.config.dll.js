const path = require('path')
const webpack = require('webpack');
module.exports = {
    entry:'./app/index.js',
    entry: {
        vendor: ['react','react-dom','redux','react-redux','react-router-dom','react-router','whatwg-fetch','moment', 'jquery','immutable','prop-types','echarts','es6-promise'],
    },
    output: {
        filename: 'public/[name].js',
        path: path.resolve(__dirname, './dist'),
        library: '[name]'
    },
    plugins: [
        new webpack.DllPlugin({
            path: path.resolve(__dirname, './dist/public/manifest.json'), // 本Dll文件中各模块的索引，供DllReferencePlugin读取使用
            name: '[name]',
        }),
    ]
};
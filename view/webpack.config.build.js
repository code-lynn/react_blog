let path = require('path');
let htmlWebpackPlugin = require('html-webpack-plugin');
let ExtractTextPlugin = require("extract-text-webpack-plugin");
const webpack = require('webpack');
module.exports = {
    entry:'./app/index.js',
    output: {
        path:path.resolve(__dirname,'./static/oceanus'),
        publicPath: '../',
        filename: 'js/[name]-[hash].js',
        chunkFilename: 'js/[name].chunk.js'
    },
    module:{
        rules:[
            {test:/\.js$/,use:'babel-loader',exclude:/node_modules/},
            {test:/\.less$/,use: ExtractTextPlugin.extract({
                fallback: 'style-loader',
                //resolve-url-loader may be chained before sass-loader if necessary
                use: ['css-loader', 'less-loader']
            })},
            {test:/\.css$/,use:ExtractTextPlugin.extract({
                fallback: "style-loader",
                use: "css-loader"
            })},
            {
                test: /\.(eot|woff|woff2|ttf|svg|png|jpg|gif)$/,
                loader: 'url-loader?limit=30000&name=img/[name]-[hash].[ext]'
            }
        ]
    },
    devtool:'cheap-module-source-map', //开发时可以看到原始代码
    devServer: {
        proxy:{
            '/oceanus/*': {
                target: 'http://fe.intra.xiaojukeji.com',
                changeOrigin:true,////改变源
                secure: false
            },
            '/dp_platform_rest/*': {
                target: 'http://bigdata-test.xiaojukeji.com',
                changeOrigin:true,////改变源
                secure: false
            }
        },
        // hot:false,
        // inline:false
    },
    plugins: [
        new htmlWebpackPlugin({
            template:'./app/index-build.html',
            filename: 'pages/index.html'
        }),
        new ExtractTextPlugin('css/[name]-[hash].css'),
        new webpack.DllReferencePlugin({
            manifest: require('./static/oceanus/public/manifest.json'), // 指定manifest.json
            name: 'vendor',  // 当前Dll的所有内容都会存放在这个参数指定变量名的一个全局变量下，注意与DllPlugin的name参数保持一致
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        })
    ]
};
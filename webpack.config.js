// 设置 entry 和 output 配置，并在其中引入这两个环境公用的全部插件
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin')

module.exports = {
    entry: {
        app: './src/main.js'
    },
    module: {
        rules: [{
            test: /\.css$/,
            use: ['style-loader', 'css-loader']
        }, { // 处理.vue后缀的文件
            test: /\.vue$/,
            use: 'vue-loader'
        }, {
            test: /\.scss$/,
            use: [
                "style-loader",
                "css-loader",
                "sass-loader"
            ]
        }, {
            test: /\.m?js$/,
            exclude: /(node_modules|bower_components)/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env']
                }
            }
        }, {
            test: /\.(woff|woff2|eot|ttf|otf|svg)$/,
            use: [
                'file-loader'
            ]
        }, {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
                'file-loader'
            ]
        }]
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, './src/index.html'), //指定模板页面，将来会根据指定的页面路径，去生成内存中的页面
            filename: 'index.html' // 指定生成的页面的名称
        }),
        new VueLoaderPlugin()
    ],
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist')
    },
    // resolve:{
    //     alias:{ // 设置 vue 被导入的包的路径
    //         "vue$":"vue/dist/vue.js"
    //     }
    // }
}
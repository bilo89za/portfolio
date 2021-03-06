const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Visualizer = require('webpack-visualizer-plugin');
const path = require('path');
const DIST = path.resolve(__dirname, 'docs/');
const SRC = path.resolve(__dirname, 'source/');

const CopyWebpackPlugin = require('copy-webpack-plugin');

var config = {
    entry: {
        main: SRC + '/index.js'
    },
    output: {
        path: path.resolve(__dirname, './docs/'),
        filename: 'demo.js',
        libraryTarget: 'umd'
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                loader: 'babel-loader',
                exclude: /node_modules/
            }, {
                test: /\.(css|scss)$/,
                loaders: ['style-loader', 'css-loader', 'sass-loader']
            }, {
                test: /\.(png|jpe?g|gif|svg|woff|woff2|ttf|eot|ico)$/,
                loader: 'file-loader?name=assets/[name].[ext]'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({ template: './source/index.html', filename: 'index.html', inject: 'body' }),
        new CopyWebpackPlugin([{
            from: SRC + '/img/*',
            to: DIST + '/assets/*'
        }]),
        new StaticSiteGeneratorPlugin({
            paths: [
              '/',
              '/bilo'
            ],
            locals: {
              greet: 'Hello'
            }
          })
    ],
    devServer: {
        historyApiFallback: true,
        stats: 'minimal'
    }
};

module.exports = config;
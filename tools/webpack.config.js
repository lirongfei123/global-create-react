const path = require('path');
const utils = require('./utils');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const fs = require('fs');
const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const workPath = process.cwd();
const serverConfig = require(`${workPath}/config.js`);
const __debug = !process.argv.includes('--release');
const nodeDir = /node_modules/;
const staticAssetName = __debug ? '[path][name].[ext]?[hash:8]' : '[hash:8].[ext]';
const webpackBase = {
    bail: !__debug,
    mode: __debug ? 'development' : 'production',
    entry: {
        main: [path.join(__dirname, '../node_modules/@babel/polyfill'), path.join(workPath, 'src/index.js')],
    },
    output: {
        path: path.join(workPath, 'static'),
        filename: '[name].js',
        publicPath: '/static'
    },
    resolve: {
        alias: {
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                rules: [
                    {
                        loader: utils.resolveLoader("babel-loader"),
                        options: {
                            babelrc: false,
                            presets: [
                                [
                                    utils.resolveLoader("@babel/preset-env"),
                                    {
                                        targets: {
                                            esmodules: true,
                                            browsers: "> 0.25%, not dead"
                                        },
                                        debug: __debug,
                                        modules: false,
                                        forceAllTransforms: !__debug,
                                        useBuiltIns: false
                                    }
                                ],
                                [
                                    utils.resolveLoader("@babel/preset-react"),
                                    {
                                        development: false
                                    }
                                ]
                            ],
                            plugins: [
                                utils.resolveLoader('@babel/plugin-proposal-class-properties'),
                                utils.resolveLoader('@babel/plugin-proposal-object-rest-spread')
                            ]
                        }
                    },
                    // {
                    //     loader: utils.resolveLoader("eslint-loader"),
                    //     options: {
                    //     }
                    // }
                ] 
            },
            {
                test: /\.(css|less|sass|scss)$/,
                rules: [
                    // 将react的css转成作用域内生效
                    {
                        issuer: {
                            not: [/\.(css|sass|less|scss)$/],
                        },
                        exclude: [nodeDir],
                        loader: utils.resolveLoader('style-loader'),
                        options: {
                            sourceMap: true,
                        }
                    },
                    // css-loader 存放在node_modules里面的
                    {
                        include: [nodeDir],
                        loader: utils.resolveLoader('css-loader'),
                        options: {
                            sourceMap: __debug,
                            modules: false,
                            minimize: __debug ? false : true
                        }
                    },
                    {
                        exclude: [nodeDir],
                        loader: utils.resolveLoader('css-loader'),
                        options: {
                            sourceMap: __debug,
                            minimize: __debug ? false : true,
                            modules: true,
                            localIdentName: __debug ? '[name]-[local-]-[hash:base64:5]' : '[hash:base64:5]'
                        }
                    },
                    {
                        exclude: [nodeDir],
                        test: /\.(scss|sass)$/,
                        loader: utils.resolveLoader('sass-loader'),
                    },
                    {
                        exclude: [nodeDir],
                        test: /\.less$/,
                        loader: utils.resolveLoader('less-loader'),
                    }
                ]
            },
            {
                test: /\.(jpg|jepg|png|gif|svg}bmp)$/,
                exclude: [nodeDir],
                oneOf: [
                    {
                        issuer: /\.(css|less|sass|scss)$/,
                        oneOf: [
                            {
                                test: /\.svg/,
                                loader: utils.resolveLoader('svg-url-loader'),
                                options: {
                                    name: staticAssetName,
                                    // limit: 4096,
                                }
                            },
                            {
                                loader: utils.resolveLoader('url-loader'),
                                options: {
                                    name: staticAssetName,
                                    // limit: 4096,
                                }
                            }
                        ]
                    },
                    {
                        loader: utils.resolveLoader('file-loader'),
                        options: {
                            name: staticAssetName
                        }
                    }
                ]
            },
            {
                test: /\.html$/,
                loader: utils.resolveLoader('html-loader'),
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            ENV: __debug,
        }),
        new HtmlWebpackPlugin({
            template: path.join(workPath, 'template.html'),
            filename: 'index.html',
            inject: true,
        }),
    ]
}
let config =  webpackMerge(webpackBase, {})
config = serverConfig.webpack(config, __debug);
module.exports = config;
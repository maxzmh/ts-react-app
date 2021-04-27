const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const path = require('path');

module.exports = {
    entry: {
        main: './src/index.tsx',
    },
    mode: 'production',
    // devtool: 'inline-source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'js/[name].[contenthash:10].js',
    },
    resolve: {
        extensions: ['.js', '.json', '.ts', '.tsx'],
    },
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        open: true,
        port: 8000,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.(png|jpg|jpeg|gif|webp)$/,
                type: 'asset',
            },
            {
                test: /\.css$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                            },
                        },
                    },
                ],
            },
            {
                test: /\.less$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    {
                        loader: 'css-loader',
                        options: {
                            modules: {
                                localIdentName: '[name]__[local]--[hash:base64:5]',
                            },
                        },
                    },
                    {
                        loader: 'less-loader',
                    },
                ],
            },
            {
                test: /\.tsx?/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react'],
                            cacheDirectory: true,
                        },
                    },
                    {
                        loader: 'ts-loader',
                    },
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './public/index.html',
            minify: {
                collapseWhitespace: true,
                removeComments: true,
            },
        }),
        new CleanWebpackPlugin(),
        new ReactRefreshPlugin(),
        new MiniCssExtractPlugin({
            filename: 'css/built.css',
        }),
    ],
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
    },
};

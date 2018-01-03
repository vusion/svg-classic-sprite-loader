const resolve = require("path").resolve;
const fs = require("fs");
const webpack = require("webpack");

module.exports = {
    entry: resolve(__dirname, "./src/index.js"),
    output: {
        path: resolve(__dirname, "./dist"),
        publicPath: "/dist/",
        filename: "build.js"
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [
                    {
                        loader: 'to-string-loader',
                    },
                    {
                        loader: 'css-loader',
                    },
                    {
                        loader: resolve(__dirname, "../index.js"),
                        options: {
                            spriteName: 'sprite',
                            base: resolve(__dirname, "./src"),
                        },
                    },
                ],
            },
            {
                test: /\.svg$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name].[ext]?[hash]'
                        }
                    },
                ],
            },
        ]
    },
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        port: 9000
    }
};
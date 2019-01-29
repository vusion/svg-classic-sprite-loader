const SVGClassicSpritePlugin = require('../../../index').Plugin;

module.exports = {
    entry: {
        bundle: './index.js',
    },
    output: {
        path: __dirname + '/dest',
        filename: '[name].js',
        publicPath: 'dest/',
    },
    module: {
        rules: [
            { test: /\.css$/, use: ['style-loader', 'css-loader', require.resolve('../../../index')] },
            { test: /\.(svg|png)$/, use: ['file-loader'] },
        ],
    },
    plugins: [new SVGClassicSpritePlugin()],
};

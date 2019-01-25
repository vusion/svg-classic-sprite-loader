'use strict';

const fs = require('fs');
const { BasePlugin } = require('base-css-image-loader');
const SVGSpriter = require('svg-sprite');
const postcss = require('postcss');
const getConfig = require('./getConfig');
const computeNewBackground = require('./computeNewBackground');

class CSSSpritePlugin extends BasePlugin {
    constructor(options) {
        options = options || {};
        super();

        this.NAMESPACE = 'SVGClassicSpritePlugin';
        this.MODULE_MARK = 'isSVGClassicSpriteModule';
        this.REPLACE_REG = /SVG_CLASSIC_SPRITE_LOADER_IMAGE\('([^)'"]*?)', '([^)'"]*)'\)/g;
        this.REPLACE_AFTER_OPTIMIZE_TREE = true;

        this.options = Object.assign(this.options, {
            // @inherit: output: './',
            // @inherit: filename: '[fontName].[ext]?[hash]',
            // @inherit: publicPath: undefined,
            padding: 40,
            queryParam: 'sprite',
            defaultName: 'sprite',
            filter: 'query',
            plugins: [],
        }, options);
        // this.spriteSmith =
        this.data = {}; // { [group: string]: { [md5: string]: { id: string, oldBackground: Background } } }
    }
    apply(compiler) {
        this.plugin(compiler, 'thisCompilation', (compilation, params) => {
            this.plugin(compilation, 'optimizeTree', (chunks, modules, callback) => this.optimizeTree(compilation, chunks, modules, callback));
        });
        super.apply(compiler);
    }

    optimizeTree(compilation, chunks, modules, callback) {
        const promises = Object.keys(this.data).map((groupName) => {
            const group = this.data[groupName];
            const keys = Object.keys(group);
            // Make sure same cachebuster in uncertain file loaded order
            !this.watching && keys.sort();
            const files = Array.from(new Set(keys.map((key) => group[key].filePath)));

            const config = getConfig();
            config.mode.css.sprite = groupName;
            config.shape.spacing.padding = this.options.padding;
            const spriter = new SVGSpriter(config);
            files.forEach((file) => spriter.add(file, null, fs.readFileSync(file, 'utf8')));
            return new Promise((resolve, reject) =>
                spriter.compile((err, result) => err ? reject(err) : resolve(result)))
                .then((result) => {
                    const output = this.getOutput({
                        name: groupName,
                        ext: 'png',
                        content: result.image,
                    }, compilation);

                    compilation.assets[output.path] = {
                        source: () => result.image,
                        size: () => result.image.length,
                    };

                    const coordinates = result.coordinates;
                    keys.forEach((key) => {
                        const item = group[key];
                        // Add new background according to result of sprite
                        const background = computeNewBackground(
                            item.oldBackground,
                            output.url,
                            item.blockSize,
                            coordinates[item.filePath],
                            result.properties,
                        );
                        background.valid = true;
                        const content = background.toString();

                        return postcss(this.options.plugins).process(`background: ${content};`).then((result) => {
                            item.content = result.root.nodes[0].value;
                        });
                    });
                });
        });

        Promise.all(promises).then(() => callback());
    }

    /**
     * @override
     * Replace Function
     */
    REPLACE_FUNCTION(groupName, id) {
        return this.data[groupName][id].content;
    }

    /**
     * @override
     * Replace Function to escape
     */
    REPLACE_FUNCTION_ESCAPED(groupName, id) {
        return this.data[groupName][id].content;
    }
}

module.exports = CSSSpritePlugin;

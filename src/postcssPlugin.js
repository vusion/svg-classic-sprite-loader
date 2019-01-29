const postcss = require('postcss');
const { utils } = require('base-css-image-loader');
const meta = require('./meta');
const CSSFruit = require('css-fruit').default;

CSSFruit.config({
    forceParsing: {
        url: true,
        length: true,
        percentage: true,
    },
});

module.exports = postcss.plugin('svg-classic-sprite-parser', ({ loaderContext }) => (styles, result) => {
    const promises = [];
    const plugin = loaderContext[meta.PLUGIN_NAME];
    const options = plugin.options;
    const data = plugin.data;

    styles.walkRules((rule) => {
        const decls = rule.nodes.filter((node) => node.type === 'decl' && node.prop.startsWith('background'));
        if (!decls.length)
            return;

        /**
         * Core variable 0
         */
        const oldBackground = CSSFruit.absorb(decls);
        if (!oldBackground.valid) {
            rule.warn(result, 'Invalid background');
            return;
        }

        if (!oldBackground.image)
            return;

        // For browsers
        if (oldBackground.image._type !== 'url')
            return;
        const oldBackgroundString = oldBackground.toString();

        // Check whether need sprite
        // Keep consistent with css-sprite-loader
        const checkWhetherNeedSprite = (url) => {
            if (!url.path.endsWith('.svg'))
                return false;
            if (options.filter === 'query')
                return !!(url.query && url.query[options.queryParam]);
            else if (options.filter instanceof RegExp)
                return url.path.test(options.filter);
            else if (options.filter === 'all')
                return true;
            else
                throw new TypeError(`Unknow filter value '${options.filter}'`);
        };

        if (!checkWhetherNeedSprite(oldBackground.image))
            return;

        /**
         * Core variable 3
         */
        const blockSize = {
            width: undefined,
            height: undefined,
        };
        // Check width & height
        rule.walkDecls((decl) => {
            if (decl.prop === 'width')
                blockSize.width = decl.value;
            else if (decl.prop === 'height')
                blockSize.height = decl.value;
        });

        promises.push(new Promise((resolve, reject) => {
            loaderContext.resolve(loaderContext.context, oldBackground.image.path, (err, result) => err ? reject(err) : resolve(result));
        }).then((filePath) => {
            // Clean decls in source
            decls.forEach((decl) => decl.remove());

            loaderContext.addDependency(filePath);

            const query = oldBackground.image.query;
            const groupName = query && typeof query[options.queryParam] === 'string' ? query[options.queryParam] : options.defaultName;
            const groupItem = {
                id: 'ID' + utils.genMD5(oldBackgroundString),
                groupName,
                filePath,
                oldBackground,
                blockSize,
                content: undefined, // new background cached
            };

            rule.append({ prop: 'background', value: `${meta.REPLACER_NAME}(${groupName}, ${groupItem.id})` });

            if (!data[groupName])
                data[groupName] = {};
            // background 的各种内容没变，id 一定不会变
            if (!data[groupName][groupItem.id])
                data[groupName][groupItem.id] = groupItem;
        }));
    });

    if (promises.length) {
        plugin.shouldGenerate = true;
        loaderContext._module[meta.MODULE_MARK] = true;
    }

    return Promise.all(promises);
});

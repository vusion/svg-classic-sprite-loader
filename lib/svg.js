const fs = require('fs');

const SVGSpriter = require('svg-sprite');
const Util = require('./util');
const defaultConfig = require('./svgConfig');
const global = require('./global');

    svgs[name] = svgs[name] || {};
    Object.keys(svgPaths).forEach((key) => {
        read(svgPaths[key].path);
    });
    if (isChanged) {
        const config = Object.assign({}, defaultConfig());
        config.mode.css.sprite = name;
        config.shape.spacing.padding = svgConfig.padding;
        const spriter = new SVGSpriter(config);
        Object.keys(svgs[name]).forEach((key) => {
            spriter.add(key, null, svgs[name][key].content);
        });
        spriter.compile((error, result) => {
            global.cacheResult[name] = {
                content: result.css.sprite.contents.toString(),
                css: result.css.css.contents.toString(),
            };
            cb(global.cacheResult[name]);
        });
        return;
    }
    // no change
    return cb(global.cacheResult[name]);
};

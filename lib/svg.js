const fs = require('fs');
const path = require('path');
const util = require('util');
const SVGSpriter = require('svg-sprite');
const Util = require('./util');
const defaultConfig = require('./svgConfig');
const global = require('./global');

const svgs = {};
module.exports = function svgSprite(svgPaths, name, svgConfig, cb) {
    let isChanged = false;
    const read = function (svgPath) {
        if (!fs.existsSync(svgPath)) {
            throw new Error(`ERROR: ${svgPath} is not exist`);
        }
        const stat = fs.statSync(svgPath);
        let oldSVG = svgs[svgPath];
        if (!stat.isFile()) {
            throw new Error(`ERROR: ${svgPath} is not file path`);
        }
        const times = ['atimeMs', 'mtimeMs', 'ctimeMs', 'birthtimeMs'];
        const readFile = function () {
            const content = fs.readFileSync(svgPath, {
                encoding: 'utf-8',
            });
            const md5 = Util.md5(content);
            if (md5 !== oldSVG.md5) {
                Object.assign(oldSVG, {
                    content,
                    md5,
                });
                isChanged = true;
            }
            Object.assign(oldSVG, times.map((timeAttr) => ({
                [timeAttr]: stat[timeAttr],
            })).reduce((a, b) => Object.assign(a, b)));
            svgs[name][svgPath] = oldSVG;
        };
        const isFileChanged = function () {
            return times.every((attr) => oldSVG[attr] === stat[attr]);
        };
        if (!oldSVG || isFileChanged()) {
            oldSVG = oldSVG || {};
            readFile();
        }
    };
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

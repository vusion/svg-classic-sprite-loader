const loaderUtils = require('loader-utils');
const path = require('path');
const Virtual = require('./virtual');
const spriteSVG = require('./svg');
const global = require('./global');
const reg = /background:\s*url\((["']?)(.+?)["']?\)\s*;/g;

let fs;
let content;
let basePATH;
const generateVirtualFile = function generateVirtualFile(fileName, content) {
    Virtual.addFile(fs, fileName, content);
};
const generateSVG = function generateSVG(changed, publicPath, filePath, svgConfig, callback) {
    changed.forEach((name, index) => {
        const svgPaths = global.svgPaths[name];
        const virtualFilePath = path.join(svgPaths.basePATH, name);
        spriteSVG(svgPaths.files, name, svgConfig, (svgInfo) => {
            content = content.replace(reg, (m, quote, url) => {
                if (svgPaths.files[url]) {
                    const basename = path.basename(url, path.extname(url));
                    let out;
                    svgInfo.css.replace(/[\n\r]/g, '').replace(new RegExp(basename + '[\\s ]*{(.*?)}', 'g'), (a, b) => {
                        out = b;
                    });
                    return out.replace(name, path.relative(filePath, virtualFilePath).replace(/\\/g, '/'));
                } else {
                    return m;
                }
            });
            generateVirtualFile(virtualFilePath, svgInfo.content);
            if (index === changed.length - 1) {
                callback(null, content);
            }
        });
    });
    if (!changed.length) {
        callback(null, content);
    }
};

const formatPath = function formatPath(url) {
    const urlArr = url.split('?');
    return {
        path: urlArr[0],
        params: (urlArr[1] || '').split('&').map((item) => ({ [item.split('=')[0]]: item.split('=')[1] })).reduce((a, b) => Object.assign(a, b)),
    };
};
const isSVG = function isSVG(path) {
    return /\.svg$/.test(path);
};
module.exports = function compiler(source) {
    const query = loaderUtils.getOptions(this) || {};
    const callback = this.async();
    const spriteName = query.defaultName || 'sprite';
    basePATH = this.options.output.path;
    const padding = query.padding || 20;
    const queryParam = query.queryParam || 'sprite';
    const filter = query.filter || 'all';
    fs = this.fs;
    content = source;
    const publicPath = typeof query.publicPath === 'string' ? query.publicPath : this._compilation.outputOptions.publicPath;
    const filePath = path.dirname(this.resourcePath);
    const svgPaths = global.svgPaths;
    const changed = [];
    content.replace(reg, (m, quote, url) => {
        const svgPath = path.join(filePath, url);
        const svgPathObj = formatPath(svgPath);
        if (isSVG(svgPathObj.path)) {
            if (filter === 'query' && !(queryParam in svgPathObj.params)) {
                return;
            }
            if (filter !== 'query' && filter !== 'all' && typeof filter === 'string') {
                if (!new RegExp(filter).test(url)) {
                    return;
                }
            }
            const name = (svgPathObj.params[queryParam] || spriteName).replace(/\\/g, '/') + '.svg';
            svgPaths[name] = svgPaths[name] || {
                basePATH,
                files: {},
            };
            svgPaths[name].files[url] = svgPathObj;
            changed.push(name);
            this.addDependency(svgPathObj.path);
        }
    });
    generateSVG([...new Set(changed)], publicPath, filePath, {
        padding,
    }, callback);
};

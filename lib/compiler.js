const loaderUtils = require('loader-utils');
const path = require('path');
const URL = require('url');
const Virtual = require('./virtual');
const spriteSVG = require('./svg');
const global = require('./global');
const reg = /background:\s*url\((["']?)(.+?)["']?\)\s*;/g;

let loader;
let spritePath;
let content;
let basePATH;
const generateVirtualFile = function generateVirtualFile(fileName, content) {
    Virtual.addFile(loader.fs, fileName, content);
};
const generateSVG = function generateSVG(changed, publicPath, filePath, callback) {
    changed.forEach(function (name) {
        const svgPaths = global.svgPaths[name];
        const virtualFilePath = path.join(svgPaths.basePATH, name);
        spriteSVG(svgPaths.files, name, (svgInfo) => {
            content = content.replace(reg, (m, quote, url) => {
                if (svgPaths.files[url]) {
                    const basename = path.basename(url, path.extname(url));
                    let out;
                    svgInfo.css.replace(/[\n\r]/g, '').replace(new RegExp(basename + '[\\s ]*\{(.*?)\}', 'g'), function (a, b) {
                        out = b;
                    });
                    return out.replace(name, path.relative(filePath, virtualFilePath).replace(/\\/g, '/'));
                } else {
                    return m;
                }
            });
            generateVirtualFile(virtualFilePath, svgInfo.content);
        });
    });
    callback(null, content);
};

const formatPath = function formatPath(url) {
    const urlArr = url.split('?');
    return {
        path: urlArr[0],
        params: (urlArr[1] || '').split('&').map((item) => ({[item.split('=')[0]] : item.split('=')[1]})).reduce((a, b) => Object.assign(a, b)),
    };
};

module.exports = function compiler(source) {
    const query = loaderUtils.getOptions(this) || {};
    callback = this.async();
    spriteName = query.spriteName || 'sprite';
    basePATH = query.base || path.join(__filename, '../../');
    loader = this;
    content = source;
    const publicPath = typeof query.publicPath === 'string' ? query.publicPath : this._compilation.outputOptions.publicPath;
    const filePath = path.dirname(this.resourcePath);
    const svgPaths = global.svgPaths;
    const changed = [];
    content.replace(reg, (m, quote, url) => {
        const svgPath = path.join(filePath, url);
        const svgPathObj = formatPath(svgPath);
        const name = (svgPathObj.params.sprite || spriteName).replace(/\\/g, '/') + '.svg';
        svgPaths[name] = svgPaths[name] || {
            basePATH,
            files: {},
        };
        svgPaths[name].files[url] = svgPathObj;
        changed.push(name);
        this.addDependency(svgPathObj.path);
    });
    generateSVG(changed, publicPath, filePath, callback);
};
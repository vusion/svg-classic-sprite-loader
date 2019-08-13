const loaderUtils = require('loader-utils');
const path = require('path');
const Virtual = require('./virtual');
const spriteSVG = require('./svg');
const global = require('./global');
const reg = /background:\s*url\((["']?)(.+?)["']?\)\s*;/g;
const BG_URL_REG = /url\([\s"']*(.+\.svg([^\s"']*))[\s"']*\)/i;
const postcss = require('postcss');

let fs;
let content;
let basePATH;
let ast;
let decls = [];
const generateVirtualFile = function generateVirtualFile(fileName, content) {
    Virtual.addFile(fs, fileName, content);
};
const generateSVG = function generateSVG(changed, publicPath, filePath, svgConfig, callback) {
    let content = '';
    changed.forEach((name, index) => {
        const svgPaths = global.svgPaths[name];
        const virtualFilePath = path.join(svgPaths.basePATH, name);
        spriteSVG(svgPaths.files, name, svgConfig, (svgInfo) => {
            decls.forEach((decl) => {
                const url = decl.url;
                if (svgPaths.files[url]) {
                    const basename = path.basename(url, path.extname(url));
                    let out;
                    const svgInfoAst = postcss.parse(svgInfo.css);
                    svgInfoAst.walkRules('.' + basename, (rule) => {
                        rule.walkDecls('background', (ruleDecl) => {
                            const out = ruleDecl.value;
                            decl.value = out.replace(name, path.relative(filePath, virtualFilePath).replace(/\\/g, '/'));
                        });
                    });
                }
            });
            postcss.stringify(ast, (str) => {
                content += str;
            });
            generateVirtualFile(virtualFilePath, svgInfo.content);
            if (index === changed.length - 1) {
                callback(null, content);
            }
        });
    });
    // if (!changed.length) {
    //     callback(null, content);
    // }
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
    basePATH = this._compilation.options.output.path;
    const padding = query.padding || 20;
    const queryParam = query.queryParam || 'sprite';
    const filter = query.filter || 'all';
    fs = this.fs;
    // content = source;
    const publicPath = typeof query.publicPath === 'string' ? query.publicPath : this._compilation.outputOptions.publicPath;
    const filePath = path.dirname(this.resourcePath);
    const svgPaths = global.svgPaths;
    const changed = [];
    ast = postcss.parse(source);
    decls = [];
    ast.walkDecls('background', (decl) => {
        const reg = BG_URL_REG.exec(decl.value);
        if (!reg)
            return;
        const url = reg[1];
        const svgPath = path.join(filePath, url);
        const svgPathObj = formatPath(svgPath);
        if (isSVG(svgPathObj.path)) {
            if (filter === 'query' && !(queryParam in svgPathObj.params)) {
                return;
            }
            if (filter instanceof RegExp) {
                if (!new RegExp(filter).test(url)) {
                    return;
                }
            }
            const name = (svgPathObj.params.sprite || spriteName).replace(/\\/g, '/') + '.svg';
            decl.url = url;
            decls.push(decl);
            svgPaths[name] = svgPaths[name] || {
                basePATH,
                files: {},
            };
            svgPaths[name].files[url] = svgPathObj;
            changed.push(name);
            this.addDependency(svgPathObj.path);
        }
    });
    if (!changed.length) {
        // no svg in background image,  return content
        callback(null, source);
    } else {
        generateSVG([...new Set(changed)], publicPath, filePath, {
            padding,
        }, callback);
    }
};

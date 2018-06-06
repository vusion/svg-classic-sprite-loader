const loaderUtils = require('loader-utils');
const path = require('path');
const URL = require('url');
const Virtual = require('./virtual');
const spriteSVG = require('./svg');
const global = require('./global');
const reg = /background:\s*url\((["']?)(.+?)["']?\)\s*;/g;
const BG_URL_REG = /url\([\s"']*(.+\.svg([^\s"']*))[\s"']*\)/i;
const postcss = require('postcss');

let loader;
let spritePath;
let content;
let basePATH;
let ast;
let decls = [];
const generateVirtualFile = function generateVirtualFile(fileName, content) {
    Virtual.addFile(loader.fs, fileName, content);
};
const generateSVG = function generateSVG(changed, publicPath, filePath, callback) {
    let content = '';
    changed.forEach(function (name) {
        const svgPaths = global.svgPaths[name];
        const virtualFilePath = path.join(svgPaths.basePATH, name);
        spriteSVG(svgPaths.files, name, (svgInfo) => {
            decls.forEach((decl) => {
                const url = decl.url;
                if (svgPaths.files[url]) {
                    const basename = path.basename(url, path.extname(url));
                    let out;
                    const svgInfoAst = postcss.parse(svgInfo.css);
                    svgInfoAst.walkRules('.' + basename,(rule) => {
                        rule.walkDecls('background', (ruleDecl) => {
                            const out = ruleDecl.value;
                            decl.value = out.replace(name, path.relative(filePath, virtualFilePath).replace(/\\/g, '/'));
                        })
                    });
                }
            })
            postcss.stringify(ast, (str) => {
                content += str;
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
    // content = source;
    const publicPath = typeof query.publicPath === 'string' ? query.publicPath : this._compilation.outputOptions.publicPath;
    const filePath = path.dirname(this.resourcePath);
    const svgPaths = global.svgPaths;
    const changed = [];
    ast = postcss.parse(source);
    decls = [];
    ast.walkDecls('background', (decl) => {
        const reg = BG_URL_REG.exec(decl.value);
        const url = reg[1];
        const svgPath = path.join(filePath, url);
        const svgPathObj = formatPath(svgPath);
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
    });
    generateSVG(changed, publicPath, filePath, callback);
};
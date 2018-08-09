# svg-classic-sprite-loader

将 svg 合并为雪碧图并生成样式的 Webpack loader

[![NPM Version][npm-img]][npm-url]
[![Dependencies][david-img]][david-url]
[![NPM Download][download-img]][download-url]

[circleci-img]: https://img.shields.io/circleci/project/github/vusion/svg-classic-sprite-loader.svg?style=flat-square
[circleci-url]: https://circleci.com/gh/vusion/svg-classic-sprite-loader
[npm-img]: http://img.shields.io/npm/v/svg-classic-sprite-loader.svg?style=flat-square
[npm-url]: http://npmjs.org/package/svg-classic-sprite-loader
[david-img]: http://img.shields.io/david/vusion/svg-classic-sprite-loader.svg?style=flat-square
[david-url]: https://david-dm.org/vusion/svg-classic-sprite-loader
[download-img]: https://img.shields.io/npm/dm/svg-classic-sprite-loader.svg?style=flat-square
[download-url]: https://npmjs.org/package/svg-classic-sprite-loader


## 安装

> npm install --save-dev svg-classic-sprite-loader

** 注意：该 loader 目前还不支持 Webpack@4.x。 **

## 快速开始

在`webpack.config.js`中添加`loader`如下：

``` js
module.exports = {
    ...
    module: {
        rules: [
            { test: /\.css$/, use: [
                'style-loader',
                'css-loader',
                'svg-classic-sprite-loader',
            ] },
            { test: /\.svg$/, use: {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            } },
        ],
    },
};
```

然后在 CSS 文件中引入需要的 svg 图片：

``` css
.foo {
    background: url(./assets/check.svg?sprite);
}
.bar {
    background: url(./assets/accessory.svg?sprite);
}
```

loader 会将引入的 svg 合并为`sprite.svg`，并替换相应的 CSS：

``` css
.foo {
    background: url(sprite.svg) -20px -20px no-repeat;
}
.bar {
    background: url(sprite.svg) -92px -20px no-repeat;
}
```

更多范例请查看[示例](#示例)

## 特点:sparkles:

- 使用简单，仅在 CSS 中设置相关的 svg 路径；
- 按需合成雪碧图，减少手动合成的麻烦；
- 可输出多个雪碧图。

## 配置

### loader参数

#### defaultName

- Type: `string`
- Default: `'sprite'`

默认 svg 雪碧图的文件名

#### padding

- Type: `number`
- Default: `'sprite'`

雪碧图上 svg 之间的间隔

#### filter

- Type: `string`
- Default: `'all'`

可选值：`'all'`、`'query'`、`RegExp`

筛选参与合并雪碧图的 svg 文件：
- `'all'`: 所有被引用的 svg 都要被合并
- `'query'`: 只有在路径中添加了`?sprite`请求参数的 svg 才会被合并
- `RegExp`: 根据正则表达式来匹配路径

#### queryParam

路径中的请求参数的key，当`filter: 'query'`才生效。

- Type: `string`
- Default: `'sprite'`

## 示例

### 使用 query 过滤

``` js
/* webpack.config.js */
loader: 'svg-classic-sprite-loader',
options: {
    filter: 'query',
},
```

``` css
/* css */
.test {
    background: url(./assets/log-check.svg?sprite);
}
.test1 {
    background: url(./assets/check.svg?sprite=sprite);
}
.test2 {
    background: url(./assets/apm-check.svg);
}
```

`log-check.svg`和`check.svg`参与`sprite.svg`的合并，最终输雪碧接图`sprite.svg`，`apm-check.svg`。

### 输出多个雪碧图

``` css
.foo {
    background: url(./assets/check.svg?sprite=sprite1);
}
.bar {
    background: url(./assets/accessory.svg?sprite=sprite2);
}
...
```

`check.svg`参与`sprite1`的合并，`accessory.svg`参与`sprite2`的合并，最终输出雪碧图`sprite1.svg`和`sprite2.svg`。

### 使用正则表达式过滤

```js
/* webpack.config.js */
loader: 'svg-classic-sprite-loader',
options: {
    filter: /log/,
},
```

```css
/* css */
.test{
    background: url(./assets/log-check.svg?sprite=sprite1);
}
.test1{
    background: url(./assets/check.svg?sprite=sprite1);
}
```

仅有`log-check.svg`参与`sprite1`的合并，最终输出雪碧图`sprite1.svg`和`check.svg`。

## 贡献指南

参见[Contributing Guide](https://github.com/vusion/DOCUMENTATION/issues/4)

## 开源协议

[MIT](LICENSE)

# svg-classic-sprite-loader

**将svg拼接为雪碧(sprite)图并生成样式的Webpack loader**

[![CircleCI][circleci-img]][circleci-url]
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


**注意：该loader目前不支持`webpack`4.x**


## 快速开始
在`webpack.config.js`中配置`loader`

```js
module.exports = {
  ...
  module: {
    rules: [
      {test: /\.css$/, use: [
        'style-loader',
        'css-loader',
        'svg-classic-sprite-loader',
      ]},
      {test: /\.svg$/, use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]'
          }
      }}
    ]
  }
}
```

在`css`中引入需要使用的`svg`图片：

```css
.test{
    background: url(./assets/check.svg);
}
.test1{
    background: url(./assets/accessory.svg);
}
```

加载器将引用的svg拼接为`sprite.svg`,并设置相应的`css`：

```css
.test {
    background: url(sprite.svg) calc(-72px - (72px - 32px)/2) calc(0px - (72px - 32px)/2) no-repeat;
}
.test1 {
    background: url(sprite.svg) calc(0px - (72px - 32px)/2) calc(0px - (72px - 32px)/2) no-repeat;
}
```

更多范例请查看[这里](#示例)

## 特点:sparkles:
- 使用简单，仅在css中设置相关svg路径。
- 按需合成拼接图，减少手动合成的麻烦。
- 可输出多个拼接图。


## 配置

### url参数
在css中，一个完整的svg路径格式如下：
> ../path/to/yourSvg.svg?[queryParam]=[spriteName]

- queryParm
键的名称，默认值为`'sprite'`，一般不需要在loader中修改默认值。如果loader中的配置为`filter: query`，则需要填写该值。

- spriteName
  生成拼接图文件名，默认值为loader参数中`defaultName`的值，表示该svg需要放置在哪个拼接图


### loader参数
#### defaultName
默认值 `'sprite'`
默认svg拼接图的文件名

#### padding
默认值 `20`
拼接图上每个svg的间隔

#### queryParam
默认值 `'sprite'`
见[url参数](#url参数)说明

#### filter
默认值 `'all'`
可选值 `'all'`、`'query'`、`RegExp`
筛选参与合成拼接图的svg

 + `'all'`:所有被引用的svg都将被拼接
 + `'query'`: 只有设置 `queryParam` 属性的svg图片参与拼接
 + `RegExp`: 正则表达式，只有通过筛选的svg图片参与拼接

## 示例

### 分组拼接svg：

```css
.test{
    background: url(./assets/check.svg?sprite=sprite1);
}
.test1{
    background: url(./assets/accessory.svg?sprite=sprite2);
}
....
```

示例说明：
`check.svg`参与`sprite1`的拼接，`accessory.svg`参与`sprite2`的拼接，最终输出拼接图`sprite1.svg`和`sprite2.svg`

### 修改queryParam


```js
/*webpack.config.js*/
loader: 'svg-classic-sprite-loader',
options: {
    'queryParam': 'aaa'
},
```

```css
/*css*/
.test{
    background: url(./assets/check.svg?aaa=sprite1);
}
.test1{
    background: url(./assets/log-check.svg?sprite=sprite1);
}
```

示例说明：
`check.svg`参与`sprite1`拼接，`log-check.svg`参与[defaultName](#defaultName)拼接(默认值`sprite`)，最终输出拼接图`sprite1.svg`和`sprite.svg`

### 使用正则表达式过滤


```js
/*webpack.config.js*/
loader: 'svg-classic-sprite-loader',
options: {
    'filter': /log/,
},
```

```css
/*css*/
.test{
    background: url(./assets/log-check.svg?sprite=sprite1);
}
.test1{
    background: url(./assets/check.svg?sprite=sprite1);
}
```

示例说明：
仅有`log-check.svg`参与`sprite1`的拼接，最终输出拼接图`sprite1.svg`和`check.svg`

### 使用query过滤

```js
/*webpack.config.js*/
loader: 'svg-classic-sprite-loader',
options: {
    'filter': 'query',
},
```

```css
/*css*/
.test{
    background: url(./assets/log-check.svg?sprite=sprite);
}
.test1{
    background: url(./assets/check.svg?sprite);
}
.test2{
    background: url(./assets/apm-check.svg);
}
```

示例说明：
`log-check.svg`和`check.svg`参与`sprite`的拼接，最终输出拼接图`sprite.svg`，`apm-check.svg`

## 贡献指南

参见[Contributing Guide](https://github.com/vusion/DOCUMENTATION/issues/4)

## 开源协议

参见[LICENSE](LICENSE)


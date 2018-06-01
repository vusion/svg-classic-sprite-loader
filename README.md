# svg-classic-sprite-loader

**Webpack loader for splice the SVG into Sprite and create CSS Style**

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


## Installation


> npm install --save-dev svg-classic-sprite-loader


**Note: This loader does not support `Webpack 4.x` currently.**


## Quick Start
Setting `loader` in the `webpack.config.js`:

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

Using the `SVG` image in the `CSS`:

```css
.test{
    background: url(./assets/check.svg);
}
.test1{
    background: url(./assets/accessory.svg);
}
```

The loader splices the referenced `svg` to `sprite.svg`, and set the `CSS`:

```css
.test {
    background: url(sprite.svg) calc(-72px - (72px - 32px)/2) calc(0px - (72px - 32px)/2) no-repeat;
}
.test1 {
    background: url(sprite.svg) calc(0px - (72px - 32px)/2) calc(0px - (72px - 32px)/2) no-repeat;
}
```

For more examples, [check here](#example).

## Features:sparkles:
- Easy to use, just set up the associated svg path in CSS only.
- Generating sprite according to need.
- Output multiple sprite.


## Configuration

### URL Parameters
In `CSS`, a complete svg path format is:

```
../path/to/yourSvg.svg?[queryParam]=[spriteName]
```

#### queryParm

the name of the query key, the default value is`'sprite'`，if`filter: 'query'`, qureyParm was required.
> `eg. yourSvg.svg?sprite=sprite`.

#### spriteName

the name of the sprite file, this default value is the value of the `defaultName` in the loader argument, indicating which svg should put in sprite.


### Loader Parameters
#### defaultName
Default value `'sprite'`

The file name of the default sprite file.

#### padding
Default value `20`

The margin of each svg on the sprite.

#### queryParam
Default value `'sprite'`

See The [queryParm](#queryParm) description.

#### filter
Default value `'all'`

Available value `'all'`、`'query'`、`RegExp`

Filter the SVG that is involved in the Sprite.

 + `'all'`: All reference SVG will be spliced.
 + `'query'`: Only Settings the SVG image of the property `queryParam` can join the sprite.
 + `RegExp`: RegExp expression，only the svg image which pass through the filter can join the Sprite.

## Example

### Output Multiple Sprite:

```css
.test{
    background: url(./assets/check.svg?sprite=sprite1);
}
.test1{
    background: url(./assets/accessory.svg?sprite=sprite2);
}
....
```

`check.svg`is a part of`sprite1`,`accessory.svg` is a part of `sprite2`，finally output`sprite1.svg` and `sprite2.svg`.

### Modify `queryParam`


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

`check.svg` get in `sprite1` splice，`log-check.svg` get in [defaultName](#defaultName) splice(default value `'sprite'`)，finally output `sprite1.svg` and `sprite.svg`.

### Using RegExp expression filter


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

Only `log-check.svg` get in `sprite1` splice ，finally output `sprite1.svg` and `check.svg`.

### Using `query` method filter

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

`log-check.svg` and `check.svg` get in `sprite` splice ,finally output `sprite.svg`，`apm-check.svg`.

## Contribution Guide

see [Contributing Guide](https://github.com/vusion/DOCUMENTATION/issues/4).

## LICENSE

see [LICENSE](LICENSE).


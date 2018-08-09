# svg-classic-sprite-loader

Webpack loader for creating classic SVG sprites.

The main reason we make a different loader from [svg-sprite-loader](https://github.com/kisenka/svg-sprite-loader) is that non-classic way (not using `background-position`) to create svg sprite does not work in Safari.

[This article] (https://css-tricks.com/svg-fragment-identifiers-work/#article-header-id-4) shows several ways to create svg sprites. You can take a look in different browers.

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

**Note: This loader does not support Webpack@4.x currently.**

## Quick Start

Add `loader` in `webpack.config.js` like this:

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

Use svgs in a CSS file:

``` css
.foo {
    background: url(./assets/check.svg);
}
.bar {
    background: url(./assets/accessory.svg);
}
```

The loader will merge svgs into a sprite file, and replace CSS codes:

``` css
.foo {
    background: url(sprite.svg) -20px -20px no-repeat;
}
.bar {
    background: url(sprite.svg) -92px -20px no-repeat;
}
```

For more examples, [check here](#example).

## Features:sparkles:

- Easy to use, just set up the associated svg path in CSS only.
- Generating sprite according to need.
- Output multiple sprite.

## Config

### loader options

#### defaultName

- Type: `string`
- Default: `'sprite'`

Default file name of sprite output file.

#### padding

- Type: `number`
- Default: `'sprite'`

The margin between svgs in the sprite.

#### filter

- Type: `string`
- Default: `'all'`

Options: `'all'`、`'query'`、`RegExp`

How to filter svg files for merging:
- `'all'`: All imported svgs will be merged.
- `'query'`: Only svg path with `?sprite` query param will be merged.
- `RegExp`: Only svg path matched by RegExp

#### queryParam

The key of query param in svg path. Only useful when `filter: 'query'`

- Type: `string`
- Default: `'sprite'`

## Example

### Use query

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

`log-check.svg` and `check.svg` are merged into `sprite.svg`. Finally output files are `sprite.svg` and `apm-check.svg`.


### Output multiple sprites

``` css
.foo {
    background: url(./assets/check.svg?sprite=sprite1);
}
.bar {
    background: url(./assets/accessory.svg?sprite=sprite2);
}
...
```

`check.svg` is merged into `sprite1.svg`, and `accessory.svg` is merged into `sprite2`. Finally output files are `sprite1.svg` and `sprite2.svg`.

### Use RegExp

``` js
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

Only `log-check.svg` is merged into `sprite1.svg`. Finally output files are `sprite1.svg` and `check.svg`.

## Contribution Guide

See [Contributing Guide](https://github.com/vusion/DOCUMENTATION/issues/8).

## LICENSE

[MIT](LICENSE)


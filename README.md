# svg-classic-sprite-loader
这篇文章的 [https://css-tricks.com/svg-fragment-identifiers-work/#article-header-id-4](https://css-tricks.com/svg-fragment-identifiers-work/#article-header-id-4) 例子，在 `Safari` 下仅有一个生效。为了浏览器兼容，需要有一个能满足此规则的 `svg sprite loader`。

## 用法
```css
/* in css */
.arrow-1 {
    background: url('./svg/arrow.1.svg?sprite=sprite3');
}
```
``` js
// webpack config
rules: [
    {
        test: /\.css$/,
        use: [
            {
                loader: 'to-string-loader',
            },
            {
                loader: 'css-loader',
            },
            {
                loader: resolve(__dirname, "../index.js"),
                options: {
                    spriteName: 'sprite',
                    base: resolve(__dirname, "./src"),
                    padding: 10,
                },
            },
        ],
    },
    {
        test: /\.svg$/,
        use: [
            {
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]'
                }
            },
        ],
    },
]
```

## options
+ `spriteName` 默认值 `sprite`, 该值用来生成合并后的 `svg` 名字，如果在 `background: url('./svg/arrow.1.svg?sprite=sprite3');` 中使用了 `sprite` 指定了新的合并文件，则 `arrow.1.svg` 不参与默认 `sprite` 的合并。

+ `base` 默认值 `本 loader 的目录，即 node_modules/svg-classic-sprite-loader`, 该值用来生成 `sprite` 的存放路径，并不会真正写入硬盘，但是必须需要一个路径，请注意此路径不会造成覆盖本地文件的问题。

+ `padding` 默认值 `10`,每个图形周围空白的边框
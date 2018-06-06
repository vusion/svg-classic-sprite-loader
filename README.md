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
                    defaultName: 'sprite',
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
+ `defaultName` 默认值 `sprite`, 该值用来生成合并后的 `svg` 名字，如果在 `background: url('./svg/arrow.1.svg?sprite=sprite3');` 中使用了 `sprite` 指定了新的合并文件，则 `arrow.1.svg` 不参与默认 `sprite` 的合并

+ `padding` 默认值 `20`，每个图形周围空白的边框

+ `queryParam` 默认值 `sprite`，eg: `background: url('./svg/arrow.1.svg?sprite=sprite3');`，定义 `queryParam=a`，则可以写成 `background: url('./svg/arrow.1.svg?a=sprite3');`

+ `filter`  默认值 `all`，可选值 `all`、`query`、`RegExp`。
    + `all` 所有的 `svg` 都会参与生成 `sprite`
    + `query` 只有在链接后面添加 `?[queryParam]` 或者 `?[queryParam]=[name]` 的才会参与生成 `sprite`
    + `RegExp` 通过筛选的才会参与生成 `sprite`
module.exports = function () {
    return {
        mode: {
            css: {
                dimensions: false,
                common: '',
                layout: 'packed',
                prefix: '.',
                // render: {
                //     css: true,
                // },
                bust: false,
                sprite: '',
            },
        },
        shape: {
            spacing: {
                box: 'content',
                // box: 'padding',
            },
        },
    };
};

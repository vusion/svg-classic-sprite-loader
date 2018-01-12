const path = require('path');
module.exports = function () {
    return {
        mode: {
            css: {
                dimensions: false,
                common: '',
                layout: 'packed',
                prefix: '.',
                render: {
                    css: {
                        template: path.join(__dirname, './template.html')
                    },
                },
                sprite: '',
                bust: false,
            }
        },
        shape: {
            spacing: {
                box: 'padding',
            },
        },
    };
};
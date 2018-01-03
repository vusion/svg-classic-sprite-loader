const path = require('path');
module.exports = {
	mode: {
		css: {
            dimensions: false,
            common: '',
            layout: 'packed',
            prefix: '.',
			render: {
                css: true,
                template: path.join(__dirname, './template.html')
            },
            sprite: '',
            bust: false,
		}
    },
};
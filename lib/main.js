const compiler = require('./compiler.js');
module.exports = function loader(source) {
    const result = compiler.call(this, source);
    return result;
};

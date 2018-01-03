var compiler = require('./compiler.js');
module.exports = function loader(source) {
    this.cacheable && this.cacheable();
    const result = compiler.call(this, source);
    return result;
};
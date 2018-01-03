var crypto = require('crypto');
exports.md5 = function (str) {
    var md5sum = crypto.createHash('md5');
    md5sum.update(str);
    return md5sum.digest('hex');
};